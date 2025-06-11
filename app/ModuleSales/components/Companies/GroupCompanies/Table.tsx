import React, { useEffect, useState } from "react";
import { CiRead } from "react-icons/ci";

interface UsersCardProps {
  posts: any[];
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [groupedCompanies, setGroupedCompanies] = useState<Map<string, any[]>>(new Map());
  const [modalData, setModalData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [groupSortKey, setGroupSortKey] = useState<'name' | 'count'>('name');
  const [modalSortKey, setModalSortKey] = useState<'companyname' | 'contactperson'>('companyname');
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

  const filteredCompanies = modalData
    .filter((company) =>
      company.companygroup.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      a[modalSortKey]?.toLowerCase().localeCompare(b[modalSortKey]?.toLowerCase())
    );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mb-4">
      <div className="flex justify-end mb-2 text-xs">
        <label className="mr-2">Sort Groups by:</label>
        <select
          value={groupSortKey}
          onChange={(e) => setGroupSortKey(e.target.value as 'name' | 'count')}
          className="border px-2 py-1 rounded text-xs"
        >
          <option value="name">Group Name</option>
          <option value="count">Number of Companies</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Group</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Number of Companies</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from(groupedCompanies.entries())
              .sort(([aKey, aVal], [bKey, bVal]) => {
                if (groupSortKey === 'name') return aKey.localeCompare(bKey);
                return bVal.length - aVal.length;
              })
              .map(([companygroup, companies]) =>
                companies.length ? (
                  <tr key={companygroup} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-xs uppercase">{companygroup}</td>
                    <td className="px-6 py-4 text-xs uppercase">{companies.length}</td>
                    <td className="px-6 py-4 text-xs">
                      <button
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-orange-300 hover:rounded-full w-full text-left flex items-center gap-1"
                        onClick={() => handleViewCompanies(companygroup)}
                      >
                        <CiRead /> View Companies
                      </button>
                    </td>
                  </tr>
                ) : null
              )}
            {!groupedCompanies.size && (
              <tr>
                <td colSpan={3} className="text-center text-xs py-4 text-gray-500">
                  No record available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalData.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
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

            <div className="flex justify-end mb-2 text-xs">
              <label className="mr-2">Sort Companies by:</label>
              <select
                value={modalSortKey}
                onChange={(e) => setModalSortKey(e.target.value as 'companyname' | 'contactperson')}
                className="border px-2 py-1 rounded text-xs"
              >
                <option value="companyname">Company Name</option>
                <option value="contactperson">Contact Person</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                    <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedCompanies.map((company) => (
                    <tr key={company.id} className="border-b whitespace-nowrap">
                      <td className="px-6 py-4 text-xs uppercase">{company.companyname}</td>
                      <td className="px-6 py-4 text-xs capitalize">{company.contactperson}</td>
                      <td className="px-6 py-4 text-xs capitalize">{company.contactnumber}</td>
                      <td className="px-6 py-4 text-xs">{company.emailaddress}</td>
                      <td className="px-6 py-4 text-xs">{company.typeclient}</td>
                      <td className="px-6 py-4 text-xs capitalize">{company.address}</td>
                      <td className="px-6 py-4 text-xs capitalize">{company.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
              <button onClick={handleCloseModal} className="px-6 py-2 border rounded-md transition text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersCard;
