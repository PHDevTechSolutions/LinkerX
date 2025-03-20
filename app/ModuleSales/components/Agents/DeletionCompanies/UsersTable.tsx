import React, { useEffect, useState } from "react";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, referenceid }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  // Show confirmation modal before updating
  const confirmUpdate = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Handle update to Approve For Deletion
  const handleUpdate = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(
        `/api/ModuleSales/Companies/CompanyAccounts/UpdateApproveStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedId, status: "Approve For Deletion" }),
        }
      );

      if (response.ok) {
        // Update status locally
        setUpdatedUser((prev) =>
          prev.map((post) =>
            post.id === selectedId ? { ...post, status: "Approve For Deletion" } : post
          )
        );
        setShowModal(false);
      } else {
        console.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="mb-4">
      {/* Modal Confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm text-center">
            <h3 className="text-lg font-bold text-yellow-600">Confirm Action</h3>
            <p className="text-sm text-gray-700 mt-2">
              Are you sure you want to approve this account for deletion?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Proceed
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Company Name</th>
              <th className="p-2 border">Contact Person</th>
              <th className="p-2 border">Contact Number</th>
              <th className="p-2 border">Email Address</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Area</th>
              <th className="p-2 border">Type of Client</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Remarks / Reason</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {updatedUser.length > 0 ? (
              updatedUser.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 capitalize">
                  <td className="p-2 border">{post.companyname}</td>
                  <td className="p-2 border">{post.contactperson}</td>
                  <td className="p-2 border">{post.contactnumber}</td>
                  <td className="p-2 border lowercase">{post.emailaddress}</td>
                  <td className="p-2 border">{post.address}</td>
                  <td className="p-2 border">{post.area}</td>
                  <td className="p-2 border">{post.typeclient}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 text-[8px] font-semibold rounded-full ${
                        post.status === "For Deletion"
                          ? "bg-yellow-400 text-gray-900"
                          : post.status === "Remove"
                          ? "bg-gray-100 text-gray-700"
                          : post.status === "Approve For Deletion"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-2 border">{post.remarks}</td>
                  <td className="p-2 border text-center">
                    {post.status !== "Approve For Deletion" && (
                      <button
                        onClick={() => confirmUpdate(post.id)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-500">
                  No accounts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersCard;
