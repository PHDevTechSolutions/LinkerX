import React, { useEffect, useState, useCallback, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiTrash, CiEdit } from "react-icons/ci";
import { BiTransfer, BiRefresh } from "react-icons/bi";
import { Menu } from "@headlessui/react";
import axios from "axios";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkChangeMode, setBulkChangeMode] = useState(false);
  const [bulkTransferMode, setBulkTransferMode] = useState(false);
  const [bulkTransferTSAMode, setBulkTransferTSAMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [tsmList, setTsmList] = useState<any[]>([]);
  const [selectedTsm, setSelectedTsm] = useState("");
  const [tsaList, setTsaList] = useState<any[]>([]);
  const [selectedTsa, setSelectedTsa] = useState("");
  const [newTypeClient, setNewTypeClient] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

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

  useEffect(() => {
    if (bulkTransferTSAMode) {
      fetch("/api/fetchtsa?Role=Territory Sales Associate")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setTsaList(data);
          } else {
            console.error("Invalid TSM list format:", data);
            setTsaList([]);
          }
        })
        .catch((err) => console.error("Error fetching TSM list:", err));
    }
  }, [bulkTransferTSAMode]);

  const toggleBulkDeleteMode = useCallback(() => {
    setBulkDeleteMode((prev) => !prev);
    setSelectedUsers(new Set());
  }, []);

  const toggleBulkEditMode = useCallback(() => {
    setBulkEditMode((prev) => !prev);
    setSelectedUsers(new Set());
    setNewTypeClient("");
  }, []);

  const toggleBulkChangeMode = useCallback(() => {
    setBulkChangeMode((prev) => !prev);
    setSelectedUsers(new Set());
    setNewStatus("");
  }, []);

  const toggleBulkTransferMode = useCallback(() => {
    setBulkTransferMode((prev) => !prev);
    setSelectedUsers(new Set());
    setSelectedTsm("");
  }, []);

  const toggleBulkTransferTSAMode = useCallback(() => {
    setBulkTransferTSAMode((prev) => !prev);
    setSelectedUsers(new Set());
    setSelectedTsa("");
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
      const response = await fetch(`/api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selectedUsers) }),
      });
      if (response.ok) {
        setUpdatedUser((prev) => prev.filter((user) => !selectedUsers.has(user.id)));
        setSelectedUsers(new Set());
        setBulkDeleteMode(false);
      } else {
        console.error("Failed to delete users");
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  }, [selectedUsers]);

  const handleBulkEdit = useCallback(async () => {
    if (selectedUsers.size === 0 || !newTypeClient) return;
    try {
      const response = await fetch(`/api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selectedUsers), typeclient: newTypeClient }),
      });
      if (response.ok) {
        setUpdatedUser((prev) => prev.map((user) =>
          selectedUsers.has(user.id) ? { ...user, typeclient: newTypeClient } : user
        ));
        setSelectedUsers(new Set());
        setBulkEditMode(false);
      } else {
        console.error("Failed to update users");
      }
    } catch (error) {
      console.error("Error updating users:", error);
    }
  }, [selectedUsers, newTypeClient]);

  const handleBulkChange = useCallback(async () => {
    if (selectedUsers.size === 0 || !newStatus) return;
    try {
      const response = await fetch(`/api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Change`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selectedUsers), status: newStatus }),
      });
      if (response.ok) {
        setUpdatedUser((prev) => prev.map((user) =>
          selectedUsers.has(user.id) ? { ...user, status: newStatus } : user
        ));
        setSelectedUsers(new Set());
        setBulkChangeMode(false);
      } else {
        console.error("Failed to update users");
      }
    } catch (error) {
      console.error("Error updating users:", error);
    }
  }, [selectedUsers, newStatus]);

  const handleSelectAll = useCallback(() => {
    if (selectedUsers.size === updatedUser.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(updatedUser.map((user) => user.id)));
    }
  }, [selectedUsers, updatedUser]);

  const handleBulkTransfer = useCallback(async () => {
    if (selectedUsers.size === 0 || !selectedTsm) return;
    try {
      const response = await fetch(`/api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Transfer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selectedUsers), tsmReferenceID: selectedTsm }),
      });
      if (response.ok) {
        setSelectedUsers(new Set());
        setBulkTransferMode(false);
      } else {
        console.error("Failed to transfer users");
      }
    } catch (error) {
      console.error("Error transferring users:", error);
    }
  }, [selectedUsers, selectedTsm]);

  const handleBulkTSATransfer = useCallback(async () => {
    if (selectedUsers.size === 0 || !selectedTsa) return;
    try {
      const response = await fetch(`/api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Transfer-TSA`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selectedUsers), tsaReferenceID: selectedTsa }),
      });
      if (response.ok) {
        setSelectedUsers(new Set());
        setBulkTransferTSAMode(false);
      } else {
        console.error("Failed to transfer users");
      }
    } catch (error) {
      console.error("Error transferring users:", error);
    }
  }, [selectedUsers, selectedTsa]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    // Use UTC getters instead of local ones to prevent timezone shifting.
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // if hour is 0, display as 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    // Use toLocaleDateString with timeZone 'UTC' to format the date portion
    const formattedDateStr = date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // Return combined date and time string
    return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <div className="mb-4 overflow-x-auto">
      {/* Bulk Action Buttons */}
      <div className="flex grid grid-cols-2 md:grid-cols-1 lg:grid-cols-5 gap-2 mb-3">
        <button onClick={toggleBulkDeleteMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-red-700 hover:text-white">
          <CiTrash size={16} />
          {bulkDeleteMode ? "Cancel Bulk Delete" : "Bulk Delete"}
        </button>
        <button onClick={toggleBulkEditMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-900 hover:text-white">
          <CiEdit size={16} />
          {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
        </button>
        <button onClick={toggleBulkChangeMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-900 hover:text-white">
          <CiEdit size={16} />
          {bulkChangeMode ? "Cancel Bulk Change" : "Bulk Change"}
        </button>
        <button onClick={toggleBulkTransferMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white">
          <BiTransfer size={16} />
          {bulkTransferMode ? "Cancel Bulk Transfer" : "Bulk Transfer to TSM"}
        </button>
        <button onClick={toggleBulkTransferTSAMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white">
          <BiTransfer size={16} />
          {bulkTransferTSAMode ? "Cancel Bulk Transfer" : "Bulk Transfer to TSA"}
        </button>
      </div>

      {/* Bulk Action Panel */}
      {(bulkDeleteMode || bulkEditMode || bulkChangeMode || bulkTransferMode || bulkTransferTSAMode) && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md text-xs">
          {/* Select All Checkbox */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" checked={selectedUsers.size === updatedUser.length && updatedUser.length > 0} onChange={handleSelectAll} className="w-4 h-4" />
              <span className="ml-2">Select All</span>
              <span className="ml-4 font-semibold text-gray-700">Selected: {selectedUsers.size} / {updatedUser.length}</span>
            </div>

            {/* Bulk Transfer */}
            {bulkTransferMode && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium">Territory Sales Manager:</label>
                <select value={selectedTsm} onChange={(e) => setSelectedTsm(e.target.value)} className="px-2 py-1 border rounded-md capitalize">
                  <option value="">Select Territory Sales Manager</option>
                  {tsmList.map((tsm) => (
                    <option key={tsm._id || tsm.ReferenceID} value={tsm.ReferenceID}>
                      {tsm.Firstname} {tsm.Lastname}
                    </option>
                  ))}
                </select>
                <button onClick={handleBulkTransfer} className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs" disabled={!selectedTsm}>Transfer</button>
              </div>
            )}

            {/* Bulk Transfer to TSA */}
            {bulkTransferTSAMode && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium">Territory Sales Associates:</label>
                <select value={selectedTsa} onChange={(e) => setSelectedTsa(e.target.value)} className="px-2 py-1 border rounded-md capitalize">
                  <option value="">Select Territory Sales Associates</option>
                  {tsaList.map((tsa) => (
                    <option key={tsa._id || tsa.ReferenceID} value={tsa.ReferenceID}>
                      {tsa.Firstname} {tsa.Lastname}
                    </option>
                  ))}
                </select>
                <button onClick={handleBulkTSATransfer} className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs" disabled={!selectedTsa}>Transfer</button>
              </div>
            )}

            {/* Bulk Delete */}
            {bulkDeleteMode && (
              <button onClick={handleBulkDelete} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs" disabled={selectedUsers.size === 0}>Bulk Delete</button>
            )}

            {/* Bulk Edit */}
            {bulkEditMode && (
              <div className="flex items-center gap-2">
                <select value={newTypeClient} onChange={(e) => setNewTypeClient(e.target.value)} className="px-2 py-1 border rounded-md">
                  <option value="">Select Type of Client</option>
                  <option value="Top 50">Top 50</option>
                  <option value="Next 30">Next 30</option>
                  <option value="Balance 20">Balance 20</option>
                  <option value="Revive Account - Existing">Revive Account - Existing</option>
                  <option value="Revive Account - Resigned Agent">Revive Account - Resigned Agent</option>
                  <option value="New Account - CSR">New Account - CSR</option>
                  <option value="New Account - Client Development">New Account - Client Development</option>
                  <option value="Transfer Account">Transfer Account</option>
                  <option value="CSR Inquiries">CSR Inquiries</option>
                </select>
                <button onClick={handleBulkEdit} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs" disabled={!newTypeClient}>Apply Changes</button>
              </div>
            )}

            {bulkChangeMode && (
              <div className="flex items-center gap-2">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="px-2 py-1 border rounded-md">
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Used">Used</option>
                </select>
                <button onClick={handleBulkChange} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs" disabled={!newStatus}>Apply Changes</button>
              </div>
            )}
          </div>
        </div>
      )}

      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            {(bulkDeleteMode || bulkEditMode || bulkChangeMode || bulkTransferMode || bulkTransferTSAMode) && (
              <th className="px-6 py-4 font-semibold text-gray-700">Select</th>
            )}
            <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
            <th className="px-6 py-4 font-semibold text-gray-700">TSA | TSM</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
<th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {updatedUser.length > 0 ? (
            updatedUser.map((post) => {
              const borderLeftClass =
                post.status === "Active"
                  ? "border-l-4 border-green-400"
                  : post.status === "Used"
                    ? "border-l-4 border-blue-400"
                    : post.status === "Inactive"
                      ? "border-l-4 border-red-400"
                      : post.status === "For Deletion"
                        ? "border-l-4 border-rose-400"
                        : post.status === "Remove"
                          ? "border-l-4 border-rose-900"
                          : post.status === "Approve For Deletion"
                            ? "border-l-4 border-sky-400"
                            : "";

              const hoverClass =
                post.status === "Active"
                  ? "hover:bg-green-100 hover:text-green-900"
                  : post.status === "Used"
                    ? "hover:bg-blue-100 hover:text-blue-900"
                    : post.status === "Inactive"
                      ? "hover:bg-red-100 hover:text-red-900"
                      : post.status === "For Deletion"
                        ? "hover:bg-rose-100 hover:text-rose-900"
                        : post.status === "Remove"
                          ? "hover:bg-rose-200 hover:text-rose-900"
                          : post.status === "Approve For Deletion"
                            ? "hover:bg-sky-100 hover:text-sky-900"
                            : "";

              return (
                <tr key={post.id} className={`border-b whitespace-nowrap ${hoverClass}`}>
                  {(bulkDeleteMode || bulkEditMode || bulkChangeMode || bulkTransferMode || bulkTransferTSAMode) && (
                    <td className={`px-6 py-4 text-xs ${borderLeftClass}`}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(post.id)}
                        onChange={() => handleSelectUser(post.id)}
                        className={`w-4 h-4 ${bulkDeleteMode ? 'text-red-600' :
                          bulkEditMode || bulkChangeMode ? 'text-blue-600' :
                            'text-purple-600'
                          }`}
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                  <td className="px-6 py-4 text-xs">{post.contactnumber}</td>
                  <td className="px-6 py-4 text-xs">{post.emailaddress}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.address}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.area}</td>
                  <td className="px-6 py-4 text-xs">{post.typeclient}</td>
                  <td className="px-6 py-4 text-xs">
                    <strong>{post.referenceid}</strong> | {post.tsm}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span
                      className={`px-2 py-1 text-[8px] font-semibold rounded-full whitespace-nowrap ${post.status === "Active"
                        ? "bg-green-400 text-white"
                        : post.status === "Used"
                          ? "bg-blue-400 text-white"
                          : post.status === "Inactive"
                            ? "bg-red-400 text-white"
                            : post.status === "For Deletion"
                              ? "bg-rose-400 text-white"
                              : post.status === "Remove"
                                ? "bg-rose-800 text-white"
                                : post.status === "Approve For Deletion"
                                  ? "bg-sky-400 text-white"
                                  : "bg-green-100 text-green-700"
                        }`}
                    >
                      {post.status}
                    </span>
                  </td>
<td className="px-6 py-4 text-xs">{post.remarks}</td>
                  <td className="px-4 py-2 text-xs align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-white bg-blue-400 p-2 rounded">Uploaded: {formatDate(new Date(post.date_created).getTime())}</span>
                      <span className="text-white bg-green-500 p-2 rounded">Updated: {formatDate(new Date(post.date_updated).getTime())}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button>
                          <BsThreeDotsVertical />
                        </Menu.Button>
                      </div>
                      <Menu.Items className="absolute right-0 mt-2 w-29 bg-white shadow-md rounded-md z-10">
                        <button
                          className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleEdit(post)}
                        >
                          Edit
                        </button>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={11} className="text-center py-4 text-xs">
                No accounts available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersCard;
