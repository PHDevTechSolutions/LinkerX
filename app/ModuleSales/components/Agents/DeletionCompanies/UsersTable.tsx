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
  const [usersList, setUsersList] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUsers"); // API endpoint mo
        const data = await response.json();
        setUsersList(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const getFullname = (referenceId: string) => {
    const user = usersList.find((user: any) => user.ReferenceID === referenceId);
    return user ? `${user.Firstname} ${user.Lastname}` : "Unknown User";
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
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Agent </th>
              <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Remarks / Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {updatedUser.length > 0 ? (
              updatedUser.map((post) => (
                <tr key={post.id} className="border-b whitespace-nowrap">
                  <td className="px-6 py-4 text-xs">
                    {post.status !== "Approve For Deletion" && (
                      <button
                        onClick={() => confirmUpdate(post.id)}
                        className="block px-4 py-2 text-xs text-gray-700 text-white bg-green-500 rounded-full hover:bg-orange-400 hover:rounded-full w-full text-left flex items-center gap-1"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs">{getFullname(post.referenceid)}</td>
                  <td className="px-6 py-4 text-xs">{post.companyname}</td>
                  <td className="px-6 py-4 text-xs">{post.contactperson}</td>
                  <td className="px-6 py-4 text-xs">{post.contactnumber}</td>
                  <td className="px-6 py-4 text-xs">{post.emailaddress}</td>
                  <td className="px-6 py-4 text-xs">{post.address}</td>
                  <td className="px-6 py-4 text-xs">{post.area}</td>
                  <td className="px-6 py-4 text-xs">{post.typeclient}</td>
                  <td className="px-6 py-4 text-xs">
                    <span
                      className={`px-2 py-1 text-[8px] font-semibold rounded-full ${post.status === "For Deletion"
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
                  <td className="px-6 py-4 text-xs">{post.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="p-4 text-xs text-center text-gray-500">
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
