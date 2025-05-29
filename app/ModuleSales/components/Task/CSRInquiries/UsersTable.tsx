import React, { useEffect, useState, useRef } from "react";
import { CiLocationArrow1, CiCircleRemove, CiSaveUp1 } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import "react-toastify/dist/ReactToastify.css";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  fetchAccount: () => void;
  TargetQuota: string;
}

const UsersTable: React.FC<UsersCardProps> = ({
  posts,
  handleEdit,
  fetchAccount,
  TargetQuota,
}) => {
  const [activeTab, setActiveTab] = useState("endorsed");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const lastRenderedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const filtered = posts.filter((post) =>
      activeTab === "endorsed" ? post.status === "Endorsed" : post.status === "Used"
    );

    const currentIds = new Set(filtered.map((p) => p.id));
    const newIds = new Set(
      [...currentIds].filter((id) => !lastRenderedIdsRef.current.has(id))
    );

    lastRenderedIdsRef.current = currentIds;
    setHighlightedIds(newIds);

    setFilteredPosts(filtered);
  }, [posts, activeTab]);

  const confirmPost = (post: any) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handlePost = async () => {
    if (!selectedPost) return;
    try {
      const postData = { ...selectedPost, targetquota: TargetQuota };
      const response = await fetch("/api/ModuleSales/Task/CSRInquiries/CreateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Post submitted successfully!");
        fetchAccount();
      } else {
        toast.error(`Failed to submit post: ${result.error}`);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the post.");
    } finally {
      setShowModal(false);
      setSelectedPost(null);
    }
  };

  return (
    <div className="p-4">
      <ToastContainer autoClose={1000} />

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 text-xs font-medium ${activeTab === "endorsed"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500"
            }`}
          onClick={() => setActiveTab("endorsed")}
        >
          Endorsed
        </button>
        <button
          className={`px-4 py-2 text-xs font-medium ${activeTab === "archived"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500"
            }`}
          onClick={() => setActiveTab("archived")}
        >
          Archived
        </button>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => {
            const isNew = highlightedIds.has(post.id);

            return (
              <div
                key={post.id}
                className={`p-4 shadow-md rounded-xl bg-white transition-all duration-500 relative ${isNew ? "animate-flash border-2 border-yellow-500" : ""
                  }`}
              >
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      Ticket: {post.ticketreferencenumber}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold ${post.status === "Endorsed"
                        ? "bg-green-500 text-white"
                        : "bg-blue-400 text-white"
                        }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <div className="text-gray-500 italic text-[11px]">
                    Received {formatDistanceToNow(new Date(post.date_created), { addSuffix: true })}
                  </div>

                  <div>Wrap Up: {post.wrapup}</div>
                  <div>Assigned Agent ID: {post.referenceid}</div>
                  <div>Sender ID: {post.csragent}</div>
                  <div className="pt-2 space-y-1">
                    <div className="font-semibold text-sm">Company Information</div>
                    <div>Company: {post.companyname}</div>
                    <div>Contact Person: {post.contactperson}</div>
                    <div>Contact #: {post.contactnumber}</div>
                    <div>Email: {post.emailaddress}</div>
                    <div>Address: {post.address}</div>
                  </div>

                  {activeTab === "endorsed" && post.status !== "Used" && (
                    <button
                      onClick={() => confirmPost(post)}
                      className="mt-4 inline-flex items-center p-2 justify-center text-xs bg-yellow-400 hover:bg-orange-400 hover:text-white text-black font-bold py-2 rounded shadow"
                    >
                      <CiLocationArrow1 size={16} className="mr-1" />
                      Create Activity
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-sm text-gray-500 py-8">
          No records available
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Submission</h3>
            <p className="text-xs text-gray-600 mb-6">
              Are you sure you want to proceed with submitting this post? Once
              submitted, the status will be updated, and the record will move to
              the "Activity" section.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs bg-gray-300 rounded-md hover:bg-gray-400 flex items-center gap-1"
              >
                <CiCircleRemove size={20} /> Cancel
              </button>
              <button
                onClick={handlePost}
                className="px-4 py-2 text-xs bg-blue-900 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
              >
                <CiSaveUp1 size={20} /> Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes flash {
          0% {
            background-color: #fef08a;
          }
          100% {
            background-color: white;
          }
        }
        .animate-flash {
          animation: flash 2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default UsersTable;
