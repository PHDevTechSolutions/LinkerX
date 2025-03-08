import React, { useEffect, useState, useCallback, useRef } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiTrash, CiEdit } from "react-icons/ci";
import { BiTransfer, BiRefresh } from "react-icons/bi";
import { Menu } from "@headlessui/react";
import axios from "axios";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, referenceid }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkTransferMode, setBulkTransferMode] = useState(false);
  const [bulkTransferTSAMode, setBulkTransferTSAMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [tsmList, setTsmList] = useState<any[]>([]);
  const [selectedTsm, setSelectedTsm] = useState("");
  const [tsaList, setTsaList] = useState<any[]>([]);
  const [selectedTsa, setSelectedTsa] = useState("");
  const [newTypeClient, setNewTypeClient] = useState("");

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

  const toggleBulkDeleteMode = useCallback(() => {
    setBulkDeleteMode((prev) => !prev);
    setSelectedUsers(new Set());
  }, []);

  const toggleBulkEditMode = useCallback(() => {
    setBulkEditMode((prev) => !prev);
    setSelectedUsers(new Set());
    setNewTypeClient("");
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

  const handleRefresh = async () => {
    try {
      const response = await axios.get(`/api/ModuleSales/Companies/CompanyAccounts/FetchAccount?referenceid=${referenceid}`);

      if (response.data.success) {
        setUpdatedUser(response.data.data); // Update the state with the new data
      } else {
        console.error("Failed to fetch accounts");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="mb-4">
      {/* Bulk Action Buttons */}
      <div className="flex gap-2 mb-3">
        <button onClick={toggleBulkEditMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-900 hover:text-white">
          <CiEdit size={16} />
          {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
        </button>
        <button onClick={toggleBulkTransferTSAMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white">
          <BiTransfer size={16} />
          {bulkTransferTSAMode ? "Cancel Bulk Transfer" : "Bulk Transfer to Another Agent"}
        </button>
        <button onClick={handleRefresh} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-gray-900 hover:text-white">
          <BiRefresh size={16} />
          Refresh
        </button>
      </div>
  
      {/* Bulk Action Panel */}
      {(bulkDeleteMode || bulkEditMode || bulkTransferMode || bulkTransferTSAMode) && (
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
                  <option value="Below 20">Below 20</option>
                  <option value="Revive Account - Existing">Revive Account - Existing</option>
                  <option value="Revive Account - Resigned Agent">Revive Account - Resigned Agent</option>
                  <option value="New Account - CSR">New Account - CSR</option>
                  <option value="New Account - Client Development">New Account - Client Development</option>
                  <option value="Transfer Account">Transfer Account</option>
                </select>
                <button onClick={handleBulkEdit} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs" disabled={!newTypeClient}>Apply Changes</button>
              </div>
            )}
          </div>
        </div>
      )}
  
      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Select</th>
              <th className="p-2 border">Company Name</th>
              <th className="p-2 border">Contact Person</th>
              <th className="p-2 border">Contact Number</th>
              <th className="p-2 border">Email Address</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Area</th>
              <th className="p-2 border">Type of Client</th>
              <th className="p-2 border">TSA</th>
              <th className="p-2 border">TSM</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {updatedUser.length > 0 ? (
              updatedUser.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 capitalize">
                  <td className="p-2 border text-center">
                    {(bulkDeleteMode || bulkEditMode || bulkTransferMode || bulkTransferTSAMode) && (
                      <input type="checkbox" checked={selectedUsers.has(post.id)} onChange={() => handleSelectUser(post.id)} className="w-4 h-4" />
                    )}
                  </td>
                  <td className="p-2 border">{post.companyname}</td>
                  <td className="p-2 border">{post.contactperson}</td>
                  <td className="p-2 border">{post.contactnumber}</td>
                  <td className="p-2 border lowercase">{post.emailaddress}</td>
                  <td className="p-2 border">{post.address}</td>
                  <td className="p-2 border">{post.area}</td>
                  <td className="p-2 border">{post.typeclient}</td>
                  <td className="p-2 border">{post.referenceid}</td>
                  <td className="p-2 border">{post.tsm}</td>
                  <td className="p-2 border">
                    <Menu as="div" className="relative inline-block align-item-center text-center">
                      <div>
                        <Menu.Button>
                          <BsThreeDotsVertical />
                        </Menu.Button>
                      </div>
                      <Menu.Items className="absolute right-0 mt-2 min-w-[160px] bg-white shadow-md rounded-md z-10">
                        <button className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleEdit(post)}>Edit</button>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="p-4 text-center text-gray-500">No accounts available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default UsersCard;
