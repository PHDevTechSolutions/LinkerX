import React, { useEffect, useState, useCallback } from "react";
import { CiEdit } from "react-icons/ci";
import ButtonActions from "./ButtonActions";
import TableXchire from "./TableXchire";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  referenceid?: string;
  Role: string;
  fetchAccount: () => Promise<void>; // Function that returns a Promise<void>
}

const Container: React.FC<UsersCardProps> = ({ posts, handleEdit, Role }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  // Bulk
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkChangeMode, setBulkChangeMode] = useState(false);
  const [bulkEditStatusMode, setBulkEditStatusMode] = useState(false);
  const [bulkRemoveMode, setBulkRemoveMode] = useState(false);

  // Checkbox
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Accounts
  const [tsaList, setTsaList] = useState<any[]>([]);
  const [selectedTsa, setSelectedTsa] = useState("");
  const [newTypeClient, setNewTypeClient] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newRemarks, setNewRemarks] = useState("");

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

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

  const handleDeselectAll = () => {
    setSelectedUsers(new Set());
  };

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
        bulkEditMode={bulkEditMode}
        bulkRemoveMode={bulkRemoveMode}
        bulkChangeMode={bulkChangeMode}
        selectedUsers={selectedUsers}
        updatedUserLength={posts.length}
        newTypeClient={newTypeClient}
        newStatus={newStatus}
        newRemarks={newRemarks}
        selectedTsa={selectedTsa}
        tsaList={tsaList}
        toggleBulkEditMode={toggleBulkEditMode}
        toggleBulkRemoveMode={toggleBulkRemoveMode}
        toggleBulkChangeMode={toggleBulkChangeMode}
        handleSelectAll={handleSelectAll}
        handleDeselectAll={handleDeselectAll}
        handleBulkEdit={handleBulkEdit}
        handleBulkRemove={handleBulkRemove}
        handleBulkChange={handleBulkChange}
        setNewTypeClient={setNewTypeClient}
        setNewStatus={setNewStatus}
        setNewRemarks={setNewRemarks}
      />
      {/* Table */}
      <TableXchire
        updatedUser={updatedUser}
        handleSelectUser={handleSelectUser}
        selectedUsers={selectedUsers}
        bulkEditMode={bulkEditMode}
        bulkChangeMode={bulkChangeMode}
        bulkEditStatusMode={bulkEditStatusMode}
        bulkRemoveMode={bulkRemoveMode}
        Role={Role}
        handleEdit={handleEdit}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Container;
