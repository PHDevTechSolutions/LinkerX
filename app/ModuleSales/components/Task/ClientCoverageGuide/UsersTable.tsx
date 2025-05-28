import React, { useEffect, useState, useMemo } from "react";
import { format, parseISO, differenceInDays, startOfMonth, getMonth, getYear, isWithinInterval, } from "date-fns";

interface Post {
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeactivity: string;
  date_created: string;
  remarks: string;
}

interface UsersCardProps {
  posts: Post[];
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
  // States
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Post | "date_created"; direction: "asc" | "desc" }>({
    key: "date_created",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Helpers
  const getWeekOfMonth = (postDate: Date) => {
    const startOfMonthDate = startOfMonth(postDate);
    const daysIntoMonth = differenceInDays(postDate, startOfMonthDate) + 1;
    if (daysIntoMonth <= 7) return `Week 1`;
    if (daysIntoMonth <= 14) return `Week 2`;
    if (daysIntoMonth <= 21) return `Week 3`;
    if (daysIntoMonth <= 28) return `Week 4`;
    return `Week 5`;
  };

  const groupByCompanyAndWeek = (posts: Post[]) => {
    const grouped: { [key: string]: { [key: string]: Post[] } } = {};

    posts.forEach((post) => {
      const postDate = parseISO(post.date_created);
      const week = getWeekOfMonth(postDate);

      if (!grouped[post.companyname]) {
        grouped[post.companyname] = {};
      }

      if (!grouped[post.companyname][week]) {
        grouped[post.companyname][week] = [];
      }

      grouped[post.companyname][week].push(post);
    });

    return grouped;
  };

  // Sorting function
  const sortedPosts = useMemo(() => {
  const sortablePosts = [...filteredPosts];
  sortablePosts.sort((a, b) => {
    const key = sortConfig.key;
    const aRaw = a[key] ?? "";
    const bRaw = b[key] ?? "";

    let aVal: number | string;
    let bVal: number | string;

    if (key === "date_created") {
      aVal = new Date(aRaw as string).getTime();
      bVal = new Date(bRaw as string).getTime();
    } else {
      aVal = (aRaw as string).toLowerCase();
      bVal = (bRaw as string).toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  return sortablePosts;
}, [filteredPosts, sortConfig]);

  // Pagination slice
  const pagedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedPosts.slice(start, start + itemsPerPage);
  }, [sortedPosts, currentPage]);

  // Grouped posts memoized
  const groupedPosts = useMemo(() => groupByCompanyAndWeek(pagedPosts), [pagedPosts]);

  // Filtering posts by date range with loading state
  useEffect(() => {
    setLoading(true);
    let filtered = posts;

    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter((post) => {
        const postDate = parseISO(post.date_created);
        return isWithinInterval(postDate, { start: startDate, end: endDate });
      });
    }

    if (selectedWeek) {
      filtered = filtered.filter((post) => {
        const postDate = parseISO(post.date_created);
        return getWeekOfMonth(postDate) === selectedWeek;
      });
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
    setLoading(false);
  }, [posts, dateRange, selectedWeek]);

  // Export to CSV function
  const exportToCSV = () => {
    const headers = ["Company", "Contact Person", "Contact Number", "Type of Activity", "Date Created", "Remarks"];
    const rows = filteredPosts.map((post) => [
      post.companyname,
      post.contactperson,
      post.contactnumber,
      post.typeactivity,
      post.date_created,
      post.remarks,
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `posts_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle sorting clicks
  const handleSort = (key: keyof Post | "date_created") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="mb-4">
      {/* Filters */}
      <div className="flex gap-4 mb-4 items-center">
        {/* Date Range Filter */}
        <label className="text-xs font-semibold" htmlFor="startDate">
          Start Date:
        </label>
        <input
          id="startDate"
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          className="border p-2 text-xs rounded"
          aria-label="Start Date"
        />
        <label className="text-xs font-semibold" htmlFor="endDate">
          End Date:
        </label>
        <input
          id="endDate"
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          className="border p-2 text-xs rounded"
          aria-label="End Date"
        />
        <button
          onClick={() => setDateRange({ start: "", end: "" })}
          className="px-3 py-1 text-xs bg-gray-300 rounded"
          aria-label="Clear Date Filters"
        >
          Clear
        </button>

        {/* Week Filter */}
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="border p-2 text-xs rounded"
          aria-label="Filter by Week"
        >
          <option value="">Filter by Week</option>
          {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map((week) => (
            <option key={week} value={week}>
              {week}
            </option>
          ))}
        </select>

        {/* Export Button */}
        <button
          onClick={exportToCSV}
          className="ml-auto px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          aria-label="Export posts to CSV"
        >
          Export CSV
        </button>
      </div>

      {/* Loading and Empty States */}
      {loading && <div className="text-xs italic text-gray-600">Loading data...</div>}
      {!loading && filteredPosts.length === 0 && (
        <div className="text-xs italic text-gray-600">No posts match your filter criteria.</div>
      )}

      {/* Grouped Company Data */}
      {!loading && filteredPosts.length > 0 && (
        <div className="overflow-x-auto">
          {Object.keys(groupedPosts).map((company, index) => {
            const companyData = groupedPosts[company];

            return (
              <div key={index} className="mb-6">
                <div className="text-xs uppercase font-semibold">{company}</div>
                <table
                  className="min-w-full table-auto border border-gray-200"
                  role="table"
                  aria-label={`Posts for ${company}`}
                >
                  <thead className="bg-gray-100">
                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                      <th
                        className="px-6 py-4 font-semibold text-gray-700 cursor-pointer"
                        onClick={() => handleSort("date_created")}
                        scope="col"
                        aria-sort={
                          sortConfig.key === "date_created"
                            ? sortConfig.direction === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                      >
                        Week / Date Created
                      </th>
                      <th
                        className="px-6 py-4 font-semibold text-gray-700 cursor-pointer"
                        onClick={() => handleSort("contactperson")}
                        scope="col"
                        aria-sort={
                          sortConfig.key === "contactperson"
                            ? sortConfig.direction === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                      >
                        Contact Person
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-700" scope="col">
                        Contact Number
                      </th>
                      <th
                        className="px-6 py-4 font-semibold text-gray-700 cursor-pointer"
                        onClick={() => handleSort("typeactivity")}
                        scope="col"
                        aria-sort={
                          sortConfig.key === "typeactivity"
                            ? sortConfig.direction === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                      >
                        Type of Activity
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-700" scope="col">
                        Activity Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map((week, weekIndex) => {
                      const weekPosts = companyData[week] || [];
                      return (
                        <React.Fragment key={weekIndex}>
                          {weekPosts.length > 0 && (
                            <tr className="border-b whitespace-nowrap bg-gray-50">
                              <td colSpan={5} className="px-6 py-2 text-xs font-bold">
                                {week}
                              </td>
                            </tr>
                          )}
                          {weekPosts.map((post, postIndex) => {
                            const postDate = parseISO(post.date_created);
                            return (
                              <tr key={postIndex} className="border-b whitespace-nowrap">
                                <td className="px-6 py-4 text-xs">
                                  {format(postDate, "yyyy-MM-dd HH:mm:ss a")}
                                </td>
                                <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                                <td className="px-6 py-4 text-xs capitalize">{post.contactnumber}</td>
                                <td className="px-6 py-4 text-xs">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                      post.typeactivity.toLowerCase().includes("call")
                                        ? "bg-blue-200 text-blue-800"
                                        : post.typeactivity.toLowerCase().includes("meeting")
                                        ? "bg-green-200 text-green-800"
                                        : "bg-gray-200 text-gray-800"
                                    }`}
                                    aria-label={`Type of activity: ${post.typeactivity}`}
                                  >
                                    {post.typeactivity}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-xs capitalize">{post.remarks}</td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded text-xs"
          aria-label="Previous page"
        >
          Previous
        </button>
        <div className="text-xs">
          Page {currentPage} of {Math.ceil(filteredPosts.length / itemsPerPage)}
        </div>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredPosts.length / itemsPerPage)))}
          disabled={currentPage === Math.ceil(filteredPosts.length / itemsPerPage)}
          className="px-3 py-1 bg-gray-200 rounded text-xs"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersCard;
