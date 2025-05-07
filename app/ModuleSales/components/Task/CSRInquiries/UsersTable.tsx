import React, { useEffect, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiCircleRemove, CiSaveUp1 } from "react-icons/ci";


// ✅ Updated the interface to include targetQuota
interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  fetchAccount: () => void;
  TargetQuota: string;
}

const UsersTable: React.FC<UsersCardProps> = ({ posts, handleEdit, fetchAccount, TargetQuota }) => {
  const [activeTab, setActiveTab] = useState("endorsed");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // ✅ Filter posts based on the active tab
  useEffect(() => {
    if (activeTab === "endorsed") {
      setFilteredPosts(posts.filter((post) => post.status === "Endorsed"));
    } else {
      setFilteredPosts(posts.filter((post) => post.status === "Used"));
    }
  }, [posts, activeTab]);

  // ✅ Format date to Philippine standard
  const formatDate = (timestamp: string) => {
    return new Intl.DateTimeFormat("en-PH", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Manila",
    }).format(new Date(timestamp));
  };

  // ✅ Open modal before posting
  const confirmPost = (post: any) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  // ✅ Handle post submission after confirmation
  const handlePost = async () => {
    if (!selectedPost) return;

    try {
      const postData = {
        ...selectedPost,
        targetquota: TargetQuota, // Add TargetQuota to the post data
      };

      const response = await fetch("/api/ModuleSales/Task/CSRInquiries/CreateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Post submitted successfully!");
        fetchAccount(); // ✅ Refresh data after successful post
      } else {
        toast.error(`Failed to submit post: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("An error occurred while submitting the post.");
    } finally {
      setShowModal(false);
      setSelectedPost(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer autoClose={1000} />

      {/* ✅ Tabs Navigation */}
      <div className="flex space-x-4 mb-4 border-b">
        <button
          className={`px-4 py-2 text-xs font-medium ${activeTab === "endorsed" ? "border-b-2 border-blue-500" : "text-gray-500"
            }`}
          onClick={() => setActiveTab("endorsed")}
        >
          Endorsed
        </button>
        <button
          className={`px-4 py-2 text-xs font-medium ${activeTab === "archived" ? "border-b-2 border-blue-500" : "text-gray-500"
            }`}
          onClick={() => setActiveTab("archived")}
        >
          Archived
        </button>
      </div>

      {/* ✅ Table */}
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700">CSR Ticket Details</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Company Information</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Inquiries</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            {activeTab === "endorsed"}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <tr key={post.id} className="border-b whitespace-nowrap">
                <td className="px-4 py-2 text-xs align-top">
                  <div className="flex flex-col gap-1 border rounded shadow-md p-2">
                    <span className="text-white bg-blue-400 p-2 rounded">Ticket Ref #: {post.ticketreferencenumber}</span>
                    <span className="text-black border p-2 rounded">Wrap Up: {post.wrapup}</span>
                    <span className="text-black border p-2 rounded">Assigned Agents: {post.referenceid}</span>
                    <span className="text-black border p-2 rounded">Sender: {post.csragent}</span>
                    <span className="text-black border p-2 rounded">Date Received: {formatDate(post.date_created)}</span>
                    <span className="text-white rounded">
                      {activeTab === "endorsed" && post.status !== "Used" && (
                        <button
                          onClick={() => confirmPost(post)}
                          className="inline-flex items-center justify-center w-full rounded text-xs text-black font-semibold px-6 py-4 bg-yellow-400 hover:rounded hover:bg-orange-400 hover:text-white px-2 py-1 gap-1 shadow-md"
                        >
                          <CiLocationArrow1 size={20} /> Create Activity
                        </button>
                      )}

                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-xs align-top">
                  <div className="flex flex-col gap-1 border rounded p-2">
                    <span className="text-black border p-2 rounded">Company Name: {post.companyname}</span>
                    <span className="text-black border p-2 rounded">Contact Person: {post.contactperson}</span>
                    <span className="text-black border p-2 rounded">Contact Number: {post.contactnumber}</span>
                    <span className="text-black border p-2 rounded">Email Address: {post.emailaddress}</span>
                    <span className="text-black border p-2 rounded">Address: {post.address}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs capitalize">{post.inquiries}</td>
                <td className="px-6 py-4 text-xs">
                  <span
                    className={`px-2 py-1 text-[10px] font-semibold rounded-full whitespace-nowrap ${post.status === "Endorsed"
                      ? "bg-green-400 text-white"
                      : post.status === "Used"
                        ? "bg-blue-400 text-gray-100"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {post.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={activeTab === "endorsed" ? 12 : 11} className="text-center text-xs py-4 text-gray-500">
                No records available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Modal for confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h3 className="text-lg font-bold mb-4">Confirm Submission</h3>
            <p className="text-xs text-gray-600 mb-6">
              Are you sure you want to proceed with submitting this post? Once submitted, the status
              will be updated, and the record will move to the "Activity" section.
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-xs bg-gray-300 rounded-md hover:bg-gray-400 flex items-center gap-1">
                <CiCircleRemove size={20} /> Cancel
              </button>
              <button onClick={handlePost} className="px-4 py-2 text-xs bg-blue-900 text-white rounded-md hover:bg-blue-700 flex items-center gap-1">
                <CiSaveUp1 size={20} /> Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
