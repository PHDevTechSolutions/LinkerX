import React, { useEffect, useState, useCallback } from "react";
import { CiEdit } from "react-icons/ci";
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
  const [newTypeClient, setNewTypeClient] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newRemarks, setNewRemarks] = useState("");

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(userId) ? newSelection.delete(userId) : newSelection.add(userId);
      return newSelection;
    });
  }, []);

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
