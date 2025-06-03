import React, { useEffect, useState, useCallback } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";

import axios from "axios";
import { toast } from 'react-toastify';

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  referenceid?: string;
  Role: string;
  fetchAccount: () => Promise<void>; // Function that returns a Promise<void>
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, referenceid, fetchAccount, Role }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  // Bulk
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkChangeMode, setBulkChangeMode] = useState(false);
  const [bulkEditStatusMode, setBulkEditStatusMode] = useState(false);
  const [bulkRemoveMode, setBulkRemoveMode] = useState(false);
  const [bulkTransferMode, setBulkTransferMode] = useState(false);
  const [bulkTransferTSAMode, setBulkTransferTSAMode] = useState(false);
  // Checkbox
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  // Accounts
  const [tsmList, setTsmList] = useState<any[]>([]);
  const [selectedTsm, setSelectedTsm] = useState("");
  const [tsaList, setTsaList] = useState<any[]>([]);
  const [selectedTsa, setSelectedTsa] = useState("");

  const [newTypeClient, setNewTypeClient] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newRemarks, setNewRemarks] = useState("");

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  useEffect(() => {
    if (bulkTransferMode) {
      fetch("/api/tsm?Role=Territory Sales Manager")
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
      fetch("/api/tsa?Role=Territory Sales Associate")
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

  const toggleBulkEditMode = useCallback(() => {
    setBulkEditMode((prev) => !prev);
    setSelectedUsers(new Set());
    setNewTypeClient("");
  }, []);

  const toggleBulkRemoveMode = useCallback(() => {
    setBulkRemoveMode((prev) => !prev);
    setSelectedUsers(new Set());
    setNewStatus("");
    setNewRemarks("");
  }, []);

  const toggleBulkChangeMode = useCallback(() => {
    setBulkChangeMode((prev) => !prev);
    setSelectedUsers(new Set());
    setNewStatus("");
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

  const handleBulkRemove = useCallback(async () => {
    if (selectedUsers.size === 0 || !newStatus || !newRemarks) return;
    try {
      const response = await fetch(`/api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Remove`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selectedUsers), status: newStatus, remarks: newRemarks }),
      });
      if (response.ok) {
        setUpdatedUser((prev) => prev.map((user) =>
          selectedUsers.has(user.id) ? { ...user, status: newStatus, remarks: newRemarks } : user
        ));
        setSelectedUsers(new Set());
        setBulkRemoveMode(false);
      } else {
        console.error("Failed to update users");
      }
    } catch (error) {
      console.error("Error updating users:", error);
    }
  }, [selectedUsers, newStatus, newRemarks]);

  const handleSelectAll = useCallback(() => {
    if (selectedUsers.size === updatedUser.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(updatedUser.map((user) => user.id)));
    }
  }, [selectedUsers, updatedUser]);

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
        await fetchAccount(); // Reload table after successful update
      } else {
        console.error("Failed to transfer users");
      }
    } catch (error) {
      console.error("Error transferring users:", error);
    }
  }, [selectedUsers, selectedTsa, fetchAccount]);

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

      <div className="flex gap-2 mb-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
        <button onClick={toggleBulkEditMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-400 hover:text-white">
          <CiEdit size={16} />
          {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
        </button>

        <button onClick={toggleBulkRemoveMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-400 hover:text-white">
          <CiTrash size={16} />
          {bulkRemoveMode ? "Cancel Remove Edit" : "Bulk Remove"}
        </button>

        <button onClick={toggleBulkChangeMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-900 hover:text-white">
          <CiEdit size={16} />
          {bulkChangeMode ? "Cancel Bulk Change" : "Bulk Change"}
        </button>
      </div>

      {/* Bulk Action Panel */}
      {(bulkDeleteMode || bulkEditMode || bulkChangeMode || bulkTransferMode || bulkTransferTSAMode || bulkRemoveMode) && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" checked={selectedUsers.size === updatedUser.length && updatedUser.length > 0} onChange={handleSelectAll} className="w-4 h-4" />
              <span className="ml-2">Select All</span>
              <span className="ml-4 font-semibold text-gray-700">Selected: {selectedUsers.size} / {updatedUser.length}</span>
            </div>

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

            {bulkDeleteMode && (
              <button onClick={handleBulkDelete} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs" disabled={selectedUsers.size === 0}>Bulk Delete</button>
            )}

            {bulkEditMode && (
              <div className="flex items-center gap-2">
                <select value={newTypeClient} onChange={(e) => setNewTypeClient(e.target.value)} className="px-2 py-1 border rounded-md">
                  <option value="">Select Type of Client</option>
                  <option value="Top 50">Top 50</option>
                  <option value="Next 30">Next 30</option>
                  <option value="Balance 20">Balance 20</option>
                  <option value="Revive Account - Existing">Revive Account - Existing</option>
                  <option value="Revive Account - Resigned Agent">Revive Account - Resigned Agent</option>
                  <option value="New Account - Client Development">New Account - Client Development</option>
                  <option value="Transfer Account">Transfer Account</option>
                </select>
                <button onClick={handleBulkEdit} className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500 text-xs" disabled={!newTypeClient}>Apply Changes</button>
              </div>
            )}

            {bulkRemoveMode && (
              <div className="flex items-center gap-2">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="px-2 py-1 border rounded-md">
                  <option value="">Select Status</option>
                  <option value="Remove">Remove</option>
                  <option value="For Deletion">For Deletion</option>
                </select>
                <input type="text" value={newRemarks} onChange={(e) => setNewRemarks(e.target.value)} placeholder="Reason/Remarks..." className="px-2 py-1 border rounded-md" />
                <button
                  onClick={handleBulkRemove}
                  className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500 text-xs"
                  disabled={!newStatus} // Prevent click if no status or remarks
                >
                  Apply Changes
                </button>

              </div>
            )}

            {bulkChangeMode && (
              <div className="flex items-center gap-2">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="px-2 py-1 border rounded-md">
                  <option value="">Select Status</option>
                  <option value="Used">Used</option>
                </select>
                <button onClick={handleBulkChange} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs" disabled={!newStatus}>Apply Changes</button>
              </div>
            )}
          </div>

          <p className="text-xs mt-2 text-gray-600">
            This section allows you to perform a <strong>Bulk Status Change</strong> on selected records. You can easily update the status of multiple records from <strong>On Hold</strong> to either <strong>Active</strong> or <strong>Used</strong>.
            To begin, select the appropriate status from the dropdown list. Once the status is chosen, click the <strong>Apply Changes</strong> button to apply the update to all selected records.
            This feature simplifies the process of managing multiple records at once, saving time and ensuring consistency.
          </p>

        </div>
      )}

      {/* Users Table */}
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700"></th>
            {Role !== "Special Access" && (
            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            )}
            <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
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
                    : post.status === "On Hold"
                      ? "border-l-4 border-yellow-400"
                      : "";

              const hoverClass =
                post.status === "Active"
                  ? "hover:bg-green-100 hover:text-green-900"
                  : post.status === "Used"
                    ? "hover:bg-blue-100 hover:text-blue-900"
                    : post.status === "On Hold"
                      ? "hover:bg-yellow-100 hover:text-yellow-900"
                      : "";

              return (
                <tr key={post.id} className={`border-b whitespace-nowrap ${hoverClass}`}>
                  <td className={`px-6 py-4 text-xs ${borderLeftClass}`}>
                    {(bulkDeleteMode || bulkEditMode || bulkChangeMode || bulkEditStatusMode || bulkTransferMode || bulkTransferTSAMode || bulkRemoveMode) && (
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(post.id)}
                        onChange={() => handleSelectUser(post.id)}
                        className="w-4 h-4"
                      />
                    )}
                  </td>
                  {Role !== "Special Access" && (
                  <td className="px-6 py-4 text-xs">
                    <button
                      className="block px-4 py-2 text-xs text-gray-700 hover:bg-orange-300 hover:rounded-full w-full text-left flex items-center gap-1"
                      onClick={() => handleEdit(post)}
                    >
                      <CiEdit /> Edit
                    </button>
                  </td>
                  )}
                  <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.contactnumber}</td>
                  <td className="px-6 py-4 text-xs">{post.emailaddress}</td>
                  <td className="px-6 py-4 text-xs">{post.typeclient}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.address}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.area}</td>
                  <td className="px-4 py-2 text-xs align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-white bg-blue-400 p-2 rounded">Uploaded: {formatDate(new Date(post.date_created).getTime())}</span>
                      <span className="text-white bg-green-500 p-2 rounded">Updated: {formatDate(new Date(post.date_updated).getTime())}</span>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={11} className="text-center text-xs py-4 text-gray-500">
                No record available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersCard;
