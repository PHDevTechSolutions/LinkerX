import React, { useState, useMemo } from "react";
import Pagination from "./Pagination";
import MainModal from "./MainModal";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  emailaddress: string;
  typeclient: string;
  address: string;
  area: string;
  projectname: string;
  projectcategory: string;
  projecttype: string;
  source: string;
  activitystatus: string;
  targetquota: string;
  typeactivity: string;
  callback: string;
  callstatus: string;
  typecall: string;
  remarks: string;
  quotationnumber: string;
  quotationamount: string;
  sonumber: string;
  soamount: string;
  startdate: string;
  enddate: string;
  date_created: string;
  date_updated: string;
  ticketreferencenumber: string;
  wrapup: string;
  inquiries: string;
  csragent: string;
  activityremarks: string;
  csrremarks: string;
  deliveryaddress: string;
  companygroup: string;
  paymentterm: string;
  actualsales: string;
}

interface UsersTableProps {
  posts: Post[];
}

const Table: React.FC<UsersTableProps> = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompanyPosts, setSelectedCompanyPosts] = useState<Post[] | null>(null);
  const itemsPerPage = 10;

  // Group posts by companyname
  const groupedPosts = useMemo(() => {
    const groups: Record<string, Post[]> = {};
    posts.forEach((post) => {
      if (!groups[post.companyname]) {
        groups[post.companyname] = [];
      }
      groups[post.companyname].push(post);
    });
    return groups;
  }, [posts]);

  // Array of company names to paginate
  const companyNames = Object.keys(groupedPosts);

  const totalPages = Math.ceil(companyNames.length / itemsPerPage);

  // Get paginated company names for current page
  const currentCompanyNames = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return companyNames.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, companyNames]);

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="overflow-x-auto relative">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Actual Sales (Sum)</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentCompanyNames.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-xs">
                  No records available
                </td>
              </tr>
            ) : (
              currentCompanyNames.map((companyName) => {
                const postsForCompany = groupedPosts[companyName];
                // Sum actualsales for this company (assuming actualsales is stringified number)
                const totalSales = postsForCompany.reduce((sum, post) => {
                  const val = Number(post.actualsales);
                  return sum + (isNaN(val) ? 0 : val);
                }, 0);

                return (
                  <tr key={companyName} className="border-b whitespace-nowrap">
                    <td className="px-6 py-4 text-xs uppercase">{companyName}</td>
                    <td className="px-6 py-4 text-xs capitalize">{totalSales}</td>
                    <td className="px-6 py-4 text-xs capitalize">
                      <button
                        onClick={() => setSelectedCompanyPosts(postsForCompany)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />

      {/* Pass the selected company's posts array to MainModal */}
      <MainModal
        selectedPosts={selectedCompanyPosts}
        onClose={() => setSelectedCompanyPosts(null)}
      />
    </div>
  );
};

export default Table;
