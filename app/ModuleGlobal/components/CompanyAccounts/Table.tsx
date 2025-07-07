import React, { useEffect, useState, useCallback } from "react";
// Route
import ButtonActions from "./ButtonActions";
import TableXchire from "./TableXchire";

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
      <ButtonActions
        bulkDeleteMode={bulkDeleteMode}
        bulkEditMode={bulkEditMode}
        bulkChangeMode={bulkChangeMode}
        bulkTransferMode={bulkTransferMode}
        bulkTransferTSAMode={bulkTransferTSAMode}
        toggleBulkDeleteMode={toggleBulkDeleteMode}
        toggleBulkEditMode={toggleBulkEditMode}
        toggleBulkChangeMode={toggleBulkChangeMode}
        toggleBulkTransferMode={toggleBulkTransferMode}
        toggleBulkTransferTSAMode={toggleBulkTransferTSAMode}
        selectedUsers={selectedUsers}
        updatedUser={updatedUser}
        handleSelectAll={handleSelectAll}
        tsmList={tsmList}
        tsaList={tsaList}
        selectedTsm={selectedTsm}
        selectedTsa={selectedTsa}
        setSelectedTsm={setSelectedTsm}
        setSelectedTsa={setSelectedTsa}
        handleBulkTransfer={handleBulkTransfer}
        handleBulkTSATransfer={handleBulkTSATransfer}
        handleBulkDelete={handleBulkDelete}
        newTypeClient={newTypeClient}
        setNewTypeClient={setNewTypeClient}
        handleBulkEdit={handleBulkEdit}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        handleBulkChange={handleBulkChange}
      />

      <TableXchire
        updatedUser={updatedUser}
        bulkDeleteMode={bulkDeleteMode}
        bulkEditMode={bulkEditMode}
        bulkChangeMode={bulkChangeMode}
        bulkTransferMode={bulkTransferMode}
        bulkTransferTSAMode={bulkTransferTSAMode}
        selectedUsers={selectedUsers}
        handleSelectUser={handleSelectUser}
        handleEdit={handleEdit}
        formatDate={formatDate}
      />
    </div>
  );
};

export default UsersCard;
