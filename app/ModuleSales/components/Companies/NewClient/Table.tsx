import React, { useState, useMemo } from "react";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  emailaddress: string;
  address: string;
  deliveryaddress: string;
  area: string;
}

interface UsersTableProps {
  posts: Post[];
}

const UsersTable: React.FC<UsersTableProps> = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return posts.slice(start, start + itemsPerPage);
  }, [posts, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Items Per Page Selector */}
      <div className="mb-4 flex justify-end">
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border px-3 py-2 rounded text-xs"
        >
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Delivery Address</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No records available
                </td>
              </tr>
            ) : (
              paginatedData.map((post) => (
                <tr key={post.id} className="border-b whitespace-nowrap">
                  <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                  <td className="px-6 py-4 text-xs">{post.contactnumber}</td>
                  <td className="px-6 py-4 text-xs">{post.emailaddress}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.address}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.deliveryaddress}</td>
                  <td className="px-6 py-4 text-xs">{post.area}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-xs">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 text-xs px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="bg-gray-200 text-xs px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
