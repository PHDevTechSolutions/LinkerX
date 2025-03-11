import React, { useEffect, useState } from "react";
import { CiLocationArrow1} from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  fetchAccount: () => void;
}

const UsersTable: React.FC<UsersCardProps> = ({ posts, handleEdit, fetchAccount }) => {
  const [activeTab, setActiveTab] = useState("endorsed");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "endorsed") {
      setFilteredPosts(posts.filter((post) => post.status === "Endorsed"));
    } else {
      setFilteredPosts(posts.filter((post) => post.status === "Used"));
    }
  }, [posts, activeTab]);

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

  const handlePost = async (post: any) => {
    try {
      const response = await fetch("/api/ModuleSales/Task/CSRInquiries/CreateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Post submitted successfully!");
        fetchAccount(); // Refresh data after successful post
      } else {
        toast.error(`Failed to submit post: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("An error occurred while submitting the post.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer autoClose={1000} />

      {/* Tabs Navigation */}
      <div className="flex space-x-4 mb-4 border-b">
        <button
          className={`px-4 py-2 text-xs font-medium ${activeTab === "endorsed" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("endorsed")}
        >
          Endorsed
        </button>
        <button
          className={`px-4 py-2 text-xs font-medium ${activeTab === "archived" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("archived")}
        >
          Archived
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-200 text-xs">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">Ticket Reference Number</th>
            <th className="px-4 py-2 text-left">Company Name</th>
            <th className="px-4 py-2 text-left">Contact Person</th>
            <th className="px-4 py-2 text-left">Contact Number</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Wrap Up</th>
            <th className="px-4 py-2 text-left">Inquiries</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date Posted</th>
            {/* Only show Actions column if the tab is "endorsed" */}
            {activeTab === "endorsed" && <th className="px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 capitalize">{post.ticketreferencenumber}</td>
                <td className="px-4 py-2 capitalize">{post.companyname}</td>
                <td className="px-4 py-2">{post.contactperson}</td>
                <td className="px-4 py-2">{post.contactnumber}</td>
                <td className="px-4 py-2 lowercase">{post.emailaddress}</td>
                <td className="px-4 py-2 capitalize">{post.address}</td>
                <td className="px-4 py-2 uppercase">{post.wrapup}</td>
                <td className="px-4 py-2 uppercase">{post.inquiries}</td>
                <td className="px-4 py-2 uppercase">{post.status}</td>
                <td className="px-4 py-2 uppercase">{formatDate(post.date_created)}</td>

                {/* Show actions only for "Endorsed" tab */}
                {activeTab === "endorsed" && (
                  <td className="px-4 py-2 flex gap-2">
                    {post.status !== "Used" && (
                      <button
                        onClick={() => handlePost(post)}
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
              <td colSpan={activeTab === "endorsed" ? 11 : 10} className="text-center py-4">
                No records available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
