import React, { useState } from "react";

interface Email {
  Status: string;
  Contact: string;
  Subject: string;
  Date: string;
}

interface TableProps {
  emails: Email[];
  loading: boolean;
  error: string | null;
}

const Table: React.FC<TableProps> = ({ emails, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Filter emails based on date range
  const filteredEmails = emails.filter((email) => {
    const emailDate = new Date(email.Date).getTime();
    const from = startDate ? new Date(startDate).getTime() : null;
    const to = endDate ? new Date(endDate).getTime() : null;

    if (from && emailDate < from) return false;
    if (to && emailDate > to) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredEmails.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredEmails.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const statusColors: { [key: string]: string } = {
    sent: "bg-green-800",
    blocked: "bg-red-600",
    opened: "bg-blue-400",
    clicked: "bg-purple-500",
  };

  return (
    <div className="overflow-x-auto">
      {/* Filters */}
      <div className="flex gap-4 mb-4 items-center">
          <label className="text-xs">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border-b bg-white text-xs"
          />
          <label className="text-xs">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border-b bg-white text-xs"
          />
        <label className="text-xs">
          Show{" "}
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="px-3 py-2 border rounded bg-white text-xs"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>{" "}
          entries
        </label>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10 text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
          <tr>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Contact</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Subject</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((email, idx) => (
            <tr
              key={idx}
              className="border-b whitespace-nowrap hover:bg-gray-100 cursor-pointer"
            >
              <td className="px-6 py-4 text-xs capitalize">
                <span
                  className={`badge text-white shadow-md text-[8px] px-2 py-1 mr-2 rounded-xl ${
                    statusColors[email.Status.toLowerCase()] || "bg-gray-400"
                  }`}
                >
                  {email.Status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs capitalize">{email.Contact}</td>
              <td className="px-6 py-4 text-xs capitalize">{email.Subject}</td>
              <td className="px-6 py-4 text-xs capitalize">
                {new Date(email.Date).toLocaleString()}
              </td>
            </tr>
          ))}

          {currentData.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-sm text-gray-500">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 text-xs px-4 py-2 rounded"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-2 py-1 text-xs ${
              currentPage === i + 1 ? "" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-xs px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
