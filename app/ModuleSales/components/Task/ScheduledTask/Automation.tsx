import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FcBusinessman } from "react-icons/fc";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeclient: string;
  activitystatus: string;
  ticketreferencenumber: string;
  date_created: string;
  date_updated: string | null;
  referenceid: string;
}

interface MainCardTableProps {
  posts: any[];
  userDetails: {
    UserId: string;
    Firstname: string;
    Lastname: string;
    Email: string;
    Role: string;
    Department: string;
    Company: string;
    TargetQuota: string;
    ReferenceID: string;
    Manager: string;
    TSM: string;
  };
  fetchAccount: () => void;
}

const MainCardTable: React.FC<MainCardTableProps> = ({ userDetails }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 35;

  const fetchData = async () => {
    try {
      const response = await fetch(
        "/api/ModuleSales/UserManagement/CompanyAccounts/FetchAccount"
      );
      const data = await response.json();
      setPosts(data.data || []);
    } catch (error) {
      toast.error("Error fetching users.");
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter based on ReferenceID and Role
  const filteredAccounts = Array.isArray(posts)
    ? posts.filter((post) => {
        const referenceID = userDetails.ReferenceID;
        const role = userDetails.Role;

        const isAllowed =
          role === "Super Admin" ||
          role === "Special Access" ||
          (["Territory Sales Associate", "Territory Sales Manager"].includes(role) &&
            post.referenceid === referenceID);

        return isAllowed;
      })
    : [];

  // Pagination from filtered results
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 col-span-3">
      {filteredAccounts.length === 0 ? (
        <p className="text-center text-xs text-gray-500">No records found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {currentPosts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
              >
                <h3 className="text-xs font-semibold uppercase text-gray-800">
                  {post.companyname}
                </h3>
                <p className="text-xs mb-4 text-gray-600">{post.typeclient}</p>
                <p className="text-xs text-gray-600 flex gap-1 items-center">
                  <FcBusinessman size={20} /><span className="font-medium capitalize">{post.contactperson}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MainCardTable;
