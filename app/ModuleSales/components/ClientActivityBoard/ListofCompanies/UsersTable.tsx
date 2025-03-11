import React, { useEffect, useState, useCallback } from "react";
import { CiEdit, CiSliderHorizontal, CiPaperplane } from "react-icons/ci";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  ReferenceID: string;
  fetchAccount: () => Promise<void>; 
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, ReferenceID, fetchAccount }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [bulkTransferTSAMode, setBulkTransferTSAMode] = useState(false);
  const [selectedTsa, setSelectedTsa] = useState("");
  const [tsaList, setTsaList] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  useEffect(() => {
    if (bulkTransferTSAMode && ReferenceID) {
      setLoading(true);
      fetch(`/api/getTsa?Role=Territory Sales Associate&TSM=${encodeURIComponent(ReferenceID)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setTsaList(data);
          } else {
            console.error("Invalid TSA list format:", data);
            setError("Invalid response format from server.");
            setTsaList([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching TSA list:", err);
          setError("Failed to fetch TSA list. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [bulkTransferTSAMode, ReferenceID]);


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

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 mb-3">
        <button onClick={toggleBulkTransferTSAMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white">
          <CiSliderHorizontal size={16} />
          {bulkTransferTSAMode ? "Cancel Bulk Transfer" : "Bulk Transfer to Another Agent"}
        </button>
      </div>
      {(bulkTransferTSAMode) && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md text-xs">
          {/* Select All Checkbox */}
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
                <button onClick={handleBulkTSATransfer} className="px-3 py-1 bg-blue-900 text-white rounded-md hover:bg-purple-700 text-xs flex items-center gap-1" disabled={!selectedTsa}><CiPaperplane />Transfer</button>
              </div>
            )}
          </div>
        </div>
      )}
      <table className="min-w-full bg-white border border-gray-200 text-xs">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th></th>
            <th className="py-2 px-4 border">Agent</th>
            <th className="py-2 px-4 border">Company Name</th>
            <th className="py-2 px-4 border">Contact Person</th>
            <th className="py-2 px-4 border">Contact Number</th>
            <th className="py-2 px-4 border">Email Address</th>
            <th className="py-2 px-4 border">Address</th>
            <th className="py-2 px-4 border">Area</th>
            <th className="py-2 px-4 border">Type of Client</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {updatedUser.length > 0 ? (
            updatedUser.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="py-2 px-2 border">{bulkTransferTSAMode && (
                  <input type="checkbox" checked={selectedUsers.has(post.id)} onChange={() => handleSelectUser(post.id)} className="w-4 h-4 text-purple-600"/>
                )}</td>
                <td className="py-2 px-4 border capitalize">
                  {post.AgentFirstname} {post.AgentLastname}
                  <br />
                  <span className="text-gray-900 text-[8px]">({post.referenceid})</span>
                </td>
                <td className="py-2 px-4 border capitalize">{post.companyname}</td>
                <td className="py-2 px-4 border capitalize">{post.contactperson}</td>
                <td className="py-2 px-4 border">{post.contactnumber}</td>
                <td className="py-2 px-4 border">{post.emailaddress}</td>
                <td className="py-2 px-4 border capitalize">{post.address}</td>
                <td className="py-2 px-4 border capitalize">{post.area}</td>
                <td className="py-2 px-4 border uppercase">{post.typeclient}</td>
                <td className="py-2 px-4 border text-center">
                  <button className=" px-4 py-2 text-gray-700 w-full text-left"
                    onClick={() => handleEdit(post)}>
                    <CiEdit size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-4 border">No accounts available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  );
};

export default UsersCard;
