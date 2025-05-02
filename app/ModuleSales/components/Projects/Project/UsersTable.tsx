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
      <table className="min-w-full bg-white border border-gray-200 text-xs overflow-x">
        <thead>
          <tr className="bg-gray-100 border-b whitespace-nowrap">
            <th className="px-4 py-2 text-left">Ticket Reference Number</th>
            <th className="px-4 py-2 text-left">Assigned Agents</th>
            <th className="px-4 py-2 text-left">Company Name</th>
            <th className="px-4 py-2 text-left">Contact Person</th>
            <th className="px-4 py-2 text-left">Contact Number</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Wrap Up</th>
            <th className="px-4 py-2 text-left">Inquiries</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date Posted</th>
            {activeTab === "endorsed" && <th className="px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 capitalize transition-all duration-200 ease-in-out transform hover:scale-[1.02] whitespace-nowrap">
                <td className="px-4 py-2 capitalize">{post.ticketreferencenumber}</td>
                <td className="px-4 py-2 capitalize">{post.referenceid}</td>
                <td className="px-4 py-2 capitalize">{post.companyname}</td>
                <td className="px-4 py-2">{post.contactperson}</td>
                <td className="px-4 py-2">{post.contactnumber}</td>
                <td className="px-4 py-2 lowercase">{post.emailaddress}</td>
                <td className="px-4 py-2 capitalize">{post.address}</td>
                <td className="px-4 py-2 uppercase">{post.wrapup}</td>
                <td className="px-4 py-2 uppercase">{post.inquiries}</td>
                <td className="px-4 py-2 uppercase">{post.status}</td>
                <td className="px-4 py-2 uppercase">{formatDate(post.date_created)}</td>

                {/* ✅ Show actions only for "Endorsed" tab */}
                {activeTab === "endorsed" && (
                  <td className="px-4 py-2 flex gap-2">
                    {post.status !== "Used" && (
                      <button
                        onClick={() => confirmPost(post)}
                        className="bg-gray-200 text-dark px-3 py-1 rounded-md hover:bg-gray-600 hover:text-white flex items-center gap-2"
                      >
                        <CiLocationArrow1 className="text-sm" /> Post
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={activeTab === "endorsed" ? 12 : 11} className="text-center py-4">
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
