import React, { useEffect, useState, useCallback, useRef } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu } from "@headlessui/react";

const socketURL = "http://localhost:3001";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
  Role: string;
  Department: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, handleDelete }) => {
  const socketRef = useRef(io(socketURL));
  const [updatedUser, setUpdatedUser] = useState(posts);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  const toggleBulkEditMode = useCallback(() => {
    setBulkEditMode((prev) => !prev);
    setSelectedUsers(new Set());
  }, []);

  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(userId) ? newSelection.delete(userId) : newSelection.add(userId);
      return newSelection;
    });
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedUsers.size === 0) return;
    const confirmDelete = window.confirm("Are you sure you want to delete the selected users?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`/api/ModuleSales/UserManagement/ManagerDirectors/Bulk-Delete`, {
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

  useEffect(() => {
    const socket = socketRef.current;
    const newPostListener = (newPost: any) => {
      setUpdatedUser((prev) => {
        if (prev.some((post) => post._id === newPost._id)) return prev;
        return [newPost, ...prev];
      });
    };

    socket.on("newPost", newPostListener);
    return () => {
      socket.off("newPost", newPostListener);
    };
  }, []);

  const statusColors: { [key: string]: string } = {
    Active: 'bg-green-800',
    Inactive: 'bg-red-500',
    Resigned: 'bg-red-700',
    Terminated: 'bg-yellow-600',
    Locked: 'bg-gray-500',
  };

  return (
    <div className="mb-4">
      <button
        onClick={toggleBulkEditMode}
        className="mb-3 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-green-900 hover:text-white"
      >
        {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
      </button>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {updatedUser.length > 0 ? (
          updatedUser.map((post) => (
            <div key={post._id} className="relative border rounded-md shadow-md p-4 flex flex-col bg-white">
              <div className="flex items-center gap-2">
                {bulkEditMode && (
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
                      <button className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleEdit(post)}>Edit</button>
                      <button className="block px-4 py-2 text-xs text-red-700 hover:bg-gray-100 border-t bg-gray-200 w-full text-left" onClick={() => {if (window.confirm("Are you sure you want to delete this user?")) handleDelete(post._id);}}>Delete</button>
                    </Menu.Items>
                  </Menu>
                )}
              </div>

              <div className="mt-auto border-t pt-2 text-xs text-gray-900">
                <p><strong>Department:</strong> {post.Department}</p>
                <p><strong>Location:</strong> {post.Location}</p>
                <p className="mt-2">
                  <span className={`badge text-white text-[8px] px-2 py-1 rounded-xl ${statusColors[post.Status] || 'bg-gray-400'}`}>
                    {post.Status}
                  </span>
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
