import React, { useEffect, useState } from "react";
import { CiMenuKebab, CiRepeat } from "react-icons/ci";
import { Menu } from "@headlessui/react";
import axios from "axios";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, referenceid }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [groupedCompanies, setGroupedCompanies] = useState<Map<string, any[]>>(new Map());
  const [modalData, setModalData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  useEffect(() => {
    const grouped = new Map<string, any[]>();
    posts.forEach((post) => {
      if (post.companygroup) {
        grouped.set(post.companygroup, [...(grouped.get(post.companygroup) || []), post]);
      }
    });
    setGroupedCompanies(grouped);
  }, [posts]);

  const handleViewCompanies = (companygroup: string) => {
    setSearchTerm("");
    setCurrentPage(1);
    setModalData(groupedCompanies.get(companygroup) || []);
  };

  const handleCloseModal = () => {
    setModalData([]);
    setSearchTerm("");
  };

  const filteredCompanies = modalData.filter((company) =>
    company.companyname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mb-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from(groupedCompanies.entries()).map(([companygroup, companies]) =>
          companies.length ? (
            <div key={companygroup} className="relative border rounded-md shadow-md p-4 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase">{companygroup}</h3>
                <Menu as="div" className="relative">
                  <Menu.Button>
                    <CiMenuKebab />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 min-w-[160px] bg-white shadow-md rounded-md z-10">
                    <button
                      className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleViewCompanies(companygroup)}
                    >
                      View Companies
                    </button>
                  </Menu.Items>
                </Menu>
              </div>
              <p className="mt-4 text-xs">
                <strong>Number of Companies:</strong> {companies.length}
              </p>
            </div>
          ) : null
        )}
        {!groupedCompanies.size && (
          <div className="col-span-full text-center py-4 text-xs">No accounts available</div>
        )}
      </div>

      {/* Modal */}
      {modalData.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-5xl shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-semibold mb-2 text-center">Companies in Group</h2>
            <p className="text-xs text-gray-600 mb-4 text-center">
              Search and browse all companies under this group.
            </p>

            <input
              type="text"
              placeholder="Search by company name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-xs mb-4"
            />

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border-b">Company Name</th>
                    <th className="px-4 py-2 border-b">Contact Person</th>
                    <th className="px-4 py-2 border-b">Contact Number</th>
                    <th className="px-4 py-2 border-b">Email Address</th>
                    <th className="px-4 py-2 border-b">Type of Client</th>
                    <th className="px-4 py-2 border-b">Address</th>
                    <th className="px-4 py-2 border-b">Area</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{company.companyname}</td>
                      <td className="px-4 py-2 border-b">{company.contactperson}</td>
                      <td className="px-4 py-2 border-b">{company.contactnumber}</td>
                      <td className="px-4 py-2 border-b">{company.emailaddress}</td>
                      <td className="px-4 py-2 border-b">{company.typeclient}</td>
                      <td className="px-4 py-2 border-b">{company.address}</td>
                      <td className="px-4 py-2 border-b">{company.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-xs">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-blue-700 transition text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersCard;
