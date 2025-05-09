import React, { useEffect, useState, useCallback } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiEdit, CiRepeat, CiSliderHorizontal } from "react-icons/ci";
import { Menu } from "@headlessui/react";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
  Role: string;
  Department: string;
  TSM: string;
  fetchUsers: () => void;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, handleDelete, fetchUsers, }) => {
  const [updatedUser, setUpdatedUser] = useState(posts);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [tsmList, setTsmList] = useState<any[]>([]);
  const [bulkTransferMode, setBulkTransferMode] = useState(false);
  const [selectedTsm, setSelectedTsm] = useState("");

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  // Toggle Bulk Edit Mode
  const toggleBulkEditMode = useCallback(() => {
    setBulkEditMode((prev) => !prev);
    setSelectedUsers(new Set());
  }, []);

  // Handle user selection for bulk actions
  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(userId) ? newSelection.delete(userId) : newSelection.add(userId);
      return newSelection;
    });
  }, []);

  // Fetch TSM list when bulk transfer mode is enabled
  useEffect(() => {
    if (bulkTransferMode) {
      fetch("/api/fetchtsm?Role=Territory Sales Manager")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setTsmList(data);
          } else {
            console.error("Invalid TSM list format:", data);
            setTsmList([]);
          }
        })
        .catch((err) => console.error("Error fetching TSM list:", err));
    }
  }, [bulkTransferMode]);

  // Toggle Bulk Transfer Mode
  const toggleBulkTransferMode = useCallback(() => {
    setBulkTransferMode((prev) => !prev);
    setSelectedUsers(new Set());
    setSelectedTsm("");
  }, []);

  // Handle Bulk Delete
  const handleBulkDelete = useCallback(async () => {
    if (selectedUsers.size === 0) return;
    const confirmDelete = window.confirm("Are you sure you want to delete the selected users?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`/api/ModuleSales/UserManagement/TerritorySalesAssociates/Bulk-Delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selectedUsers) }),
      });
      if (response.ok) {
        setUpdatedUser((prev) => prev.filter((user) => !selectedUsers.has(user._id)));
        setSelectedUsers(new Set());
        setBulkEditMode(false);
      } else {
        console.error("Failed to delete users");
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  }, [selectedUsers]);

  // Handle Bulk Transfer
  const handleBulkTransfer = useCallback(async () => {
    if (selectedUsers.size === 0 || !selectedTsm) return;
    try {
      const response = await fetch(`/api/ModuleSales/UserManagement/TerritorySalesAssociates/Bulk-Transfer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedUsers),
          tsmReferenceID: selectedTsm
        }),
      });

      if (response.ok) {
        // Reset state after successful transfer
        setSelectedUsers(new Set());
        setBulkTransferMode(false);
        // Fetch the updated users after a successful transfer
        fetchUsers();
      } else {
        console.error("Failed to transfer users");
      }
    } catch (error) {
      console.error("Error transferring users:", error);
    }
  }, [selectedUsers, selectedTsm]);

  const statusColors: { [key: string]: string } = {
    Active: 'bg-green-800',
    Inactive: 'bg-red-500',
    Resigned: 'bg-red-700',
    Terminated: 'bg-yellow-600',
    Locked: 'bg-gray-500',
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-3">
        <button
          onClick={toggleBulkEditMode}
          className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white"
        ><CiEdit size={16} />
          {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
        </button>
        <button
          onClick={toggleBulkTransferMode}
          className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white"
        >
          <CiSliderHorizontal size={16} />
          {bulkTransferMode ? "Cancel Bulk Transfer" : "Bulk Transfer to Another Manager"}
        </button>
      </div>

      {bulkEditMode && (
        <div className="mb-4 p-2 bg-gray-100 rounded-md text-xs flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedUsers.size === updatedUser.length && updatedUser.length > 0}
              onChange={() => {
                if (selectedUsers.size === updatedUser.length) {
                  setSelectedUsers(new Set());
                } else {
                  setSelectedUsers(new Set(updatedUser.map(user => user._id)));
                }
              }}
              className="w-4 h-4"
            />
            <span className="ml-2">Select All</span>
            <span className="ml-4 font-semibold text-gray-700">
              Selected: {selectedUsers.size} / {updatedUser.length}
            </span>
          </div>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
            disabled={selectedUsers.size === 0}
          >
            Bulk Delete
          </button>
        </div>
      )}

      {bulkTransferMode && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedUsers.size === updatedUser.length && updatedUser.length > 0}
                onChange={() => {
                  if (selectedUsers.size === updatedUser.length) {
                    setSelectedUsers(new Set());
                  } else {
                    setSelectedUsers(new Set(updatedUser.map(user => user._id)));
                  }
                }}
                className="w-4 h-4"
              />
              <span className="ml-2">Select All</span>
              <span className="ml-4 font-semibold text-gray-700">
                Selected: {selectedUsers.size} / {updatedUser.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Territory Sales Manager:</label>
              <select
                value={selectedTsm}
                onChange={(e) => setSelectedTsm(e.target.value)}
                className="px-2 py-1 border rounded-md capitalize"
              >
                <option value="">Select Territory Sales Manager</option>
                {tsmList.map((tsa) => (
                  <option key={tsa._id || tsa.ReferenceID} value={tsa.ReferenceID}>
                    {tsa.Firstname} {tsa.Lastname}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBulkTransfer}
                className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs"
                disabled={!selectedTsm}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {updatedUser.length > 0 ? (
          updatedUser.map((post) => (
            <div key={post._id} className="relative border rounded-md shadow-md p-4 flex flex-col bg-white">
              <div className="flex items-center gap-2">
                {bulkEditMode || bulkTransferMode && (
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(post._id)}
                    onChange={() => handleSelectUser(post._id)}
                    className="w-4 h-4"
                  />
                )}
                <h3 className="text-xs font-semibold capitalize">
                  {post.ReferenceID} | {post.Lastname}, {post.Firstname}
                </h3>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="mt-4 mb-4 text-xs">
                  <p><strong>Email:</strong> {post.Email}</p>
                  <p className="capitalize"><strong>Role:</strong> {post.Role}</p>
                </div>
                {!bulkEditMode && (
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button><BsThreeDotsVertical /></Menu.Button>
                    </div>
                    <Menu.Items className="absolute right-0 mt-2 w-29 bg-white shadow-md rounded-md z-10">
                      <button
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="block px-4 py-2 text-xs text-red-700 hover:bg-gray-100 border-t bg-gray-200 w-full text-left"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this user?")) {
                            handleDelete(post._id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </Menu.Items>
                  </Menu>
                )}
              </div>

              <div className="mt-auto border-t pt-2 text-xs text-gray-900">
                <p><strong>Department:</strong> {post.Department}</p>
                <p><strong>Location:</strong> {post.Location}</p>
                <p className="mt-2">
                  <span className={`badge text-white text-[8px] px-2 py-1 mr-2 rounded-xl ${statusColors[post.Status] || 'bg-gray-400'}`}>
                    {post.Status}
                  </span>
                  {post.TSM}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-4 text-xs">No accounts available</div>
        )}
      </div>
    </div>
  );
};

export default UsersCard;
