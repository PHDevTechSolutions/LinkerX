import React, { useState, useMemo } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Post {
  id: string;
  companyname: string;
  typeclient: string;
  actualsales: number | string;
  date_created: string;
  targetquota: number;
}

interface UsersCardProps {
  posts: Post[];
}

const UsersTable: React.FC<UsersCardProps> = ({ posts }) => {
  const [filterTypeClient, setFilterTypeClient] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Date range filter state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Parse dates helper (returns Date or null)
  const parseDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const groupedData: Record<string, Post[]> = posts.reduce(
    (acc: Record<string, Post[]>, post: Post) => {
      const company = post.companyname || "Unknown Company";
      if (!acc[company]) acc[company] = [];
      acc[company].push(post);
      return acc;
    },
    {}
  );

  const formatSales = (
    value: number | string | null | undefined
  ) => {
    const parsed =
      typeof value === "string"
        ? parseFloat(value)
        : typeof value === "number"
        ? value
        : 0;
    const number = isNaN(parsed) ? 0 : parsed;
    return number.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });
  };

  const uniqueTypeClients = useMemo(() => {
    const allTypes = posts.map((p) => p.typeclient.toUpperCase());
    return ["All", ...Array.from(new Set(allTypes))];
  }, [posts]);

  // Filter and sort by average sales descending
  const filteredAndSortedData = useMemo(() => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    // Filter groups by type client and date range
    const filteredGroups = Object.entries(groupedData).filter(
      ([_, entries]) => {
        // Filter entries by type client & date range
        const filteredEntries = entries.filter((post) => {
          const matchesTypeClient =
            filterTypeClient === "All" ||
            post.typeclient.toUpperCase() === filterTypeClient.toUpperCase();

          const postDate = parseDate(post.date_created);
          const matchesDateRange =
            (!start || !postDate || postDate >= start) &&
            (!end || !postDate || postDate <= end);

          return matchesTypeClient && matchesDateRange;
        });

        return filteredEntries.length > 0;
      }
    );

    // Map each group to aggregate values
    const mapped = filteredGroups.map(([companyName, entries]) => {
      const filteredEntries = entries.filter((post) => {
        const matchesTypeClient =
          filterTypeClient === "All" ||
          post.typeclient.toUpperCase() === filterTypeClient.toUpperCase();

        const postDate = parseDate(post.date_created);
        const matchesDateRange =
          (!start || !postDate || postDate >= start) &&
          (!end || !postDate || postDate <= end);

        return matchesTypeClient && matchesDateRange;
      });

      const totalSales = filteredEntries.reduce((sum, post) => {
        const value =
          typeof post.actualsales === "string"
            ? parseFloat(post.actualsales)
            : post.actualsales;
        return sum + (isNaN(value) ? 0 : value);
      }, 0);

      const averageSales =
        filteredEntries.length > 0 ? totalSales / filteredEntries.length : 0;
      const targetQuota = filteredEntries[0]?.targetquota || 0;
      const typeClients = Array.from(
        new Set(filteredEntries.map((e) => e.typeclient.toUpperCase()))
      ).join(", ");

      return { companyName, totalSales, averageSales, typeClients, targetQuota };
    });

    // Sort by average sales descending
    mapped.sort((a, b) => b.averageSales - a.averageSales);

    return mapped;
  }, [groupedData, filterTypeClient, startDate, endDate]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalAchievement = filteredAndSortedData.reduce((sum, item) => {
    const target = Number(String(item.targetQuota).replace(/,/g, ""));
    if (item.totalSales > 0 && !isNaN(target) && target > 0) {
      const percent = (item.totalSales / target) * 100;
      return sum + percent;
    }
    return sum;
  }, 0);

  const grandTotal = filteredAndSortedData.reduce(
    (sum, item) => sum + item.totalSales,
    0
  );

  const averageAchievement =
    filteredAndSortedData.length > 0
      ? (totalAchievement / filteredAndSortedData.length).toFixed(2)
      : "N/A";

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
      { header: "Company Name", key: "companyName", width: 30 },
      { header: "Type of Client", key: "typeClients", width: 30 },
      { header: "Total Sales (SI)", key: "totalSales", width: 20 },
      { header: "Average Sales", key: "averageSales", width: 20 },
    ];

    filteredAndSortedData.forEach(
      ({ companyName, typeClients, totalSales, averageSales }) => {
        worksheet.addRow({
          companyName,
          typeClients,
          totalSales,
          averageSales,
        });
      }
    );

    worksheet.addRow({
      companyName: "Grand Total",
      typeClients: "",
      totalSales: grandTotal,
      averageSales: "",
    });

    worksheet.getColumn("totalSales").numFmt =
      '"₱"#,##0.00;[Red]\-"₱"#,##0.00';
    worksheet.getColumn("averageSales").numFmt =
      '"₱"#,##0.00;[Red]\-"₱"#,##0.00';
    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "sales_report.xlsx");
  };

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Filters & Export */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        {/* Left side: Filter + ItemsPerPage */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label htmlFor="typeClientFilter" className="font-semibold text-xs whitespace-nowrap">Filter by Type of Client:</label>
            <select id="typeClientFilter" value={filterTypeClient}
              onChange={(e) => {
                setFilterTypeClient(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded text-xs">
              {uniqueTypeClients.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold text-xs whitespace-nowrap">Start Date:</label>
            <input type="date" value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold text-xs whitespace-nowrap">End Date:</label>
            <input type="date" value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded text-xs"
            />
          </div>
        </div>

        {/* Right side: Export Button */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <select id="itemsPerPage" value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border px-3 py-2 rounded text-xs">
            {[10, 25, 50, 100, 500, 1000].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button onClick={handleExportToExcel}
            className="bg-green-600 text-white text-xs px-4 py-2 rounded hover:bg-green-700 whitespace-nowrap">
            Export to Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Actual Sales (SI)</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Achievement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-xs">
                  No records available
                </td>
              </tr>
            ) : (
              paginatedData.map(
                ({ companyName, totalSales, typeClients, averageSales, targetQuota }) => {
                  // Safely calculate achievement % and color
                  const target = Number(
                    String(targetQuota).replace(/,/g, "")
                  );
                  const isValidTarget = !isNaN(target) && target > 0;
                  const achievement = isValidTarget
                    ? (totalSales / target) * 100
                    : 0;
                  const isSuccess = achievement >= 100;

                  return (
                    <tr key={companyName} className="bg-white hover:bg-gray-50">
                      <td className="px-6 py-4 text-xs uppercase">{companyName}</td>
                      <td className="px-6 py-4 text-xs">{typeClients}</td>
                      <td className="px-6 py-4 text-xs">{formatSales(totalSales)}</td>
                      <td className={`px-6 py-4 text-xs font-semibold ${ isSuccess ? "text-green-600" : "text-red-600"}`}>
                        {isValidTarget
                          ? `${achievement.toFixed(2)}%`
                          : "0.00%"}
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>
          <tfoot className="bg-gray-200 sticky bottom-0 z-10">
            <tr className="text-xs font-bold text-gray-700">
              <td className="px-6 py-3 uppercase">Grand Total</td>
              <td></td>
              <td className="px-6 py-3">{formatSales(grandTotal)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`bg-gray-200 text-xs px-4 py-2 rounded`}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`bg-gray-200 text-xs px-4 py-2 rounded`}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
