import React, { useEffect, useState, useCallback } from "react";
import { CiEdit, CiSliderHorizontal, CiPaperplane } from "react-icons/ci";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  ReferenceID: string;
  Role: string;
  fetchAccount: () => Promise<void>;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, ReferenceID, fetchAccount, Role }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [bulkTransferTSAMode, setBulkTransferTSAMode] = useState(false);
  const [selectedTsa, setSelectedTsa] = useState("");
  const [tsaList, setTsaList] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedAgent, setSelectedAgent] = useState("");

  // Extract unique agents for filtering
  const uniqueAgents = Array.from(
    new Set(updatedUser.map((user) => `${user.AgentFirstname} ${user.AgentLastname}`))
  );

  // Filter users based on selected agent
  const filteredUsers = selectedAgent
    ? updatedUser.filter(
      (post) => `${post.AgentFirstname} ${post.AgentLastname}` === selectedAgent
    )
    : updatedUser;

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
    <div className="overflow-x-auto">
      <div className="flex gap-2 mb-3">
        {Role !== "Special Access" && (
          <button onClick={toggleBulkTransferTSAMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white">
            <CiSliderHorizontal size={16} />
            {bulkTransferTSAMode ? "Cancel Bulk Transfer" : "Bulk Transfer to Another Agent"}
          </button>
        )}
        {/* Filter by Territory Sales Associates */}
        <select
          className="px-2 py-1 border rounded-md text-xs capitalize"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
        >
          <option value="">Filter by Agent</option>
          {uniqueAgents.map((agent, index) => (
            <option key={index} value={agent}>
              {agent}
            </option>
          ))}
        </select>
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
          <p className="text-xs text-gray-600 mt-2">
            This section allows you to perform a <strong>Bulk Transfer</strong> of selected records to a <strong>Territory Sales Associate (TSA)</strong>.
            First, choose the appropriate TSA from the dropdown list, which displays the names of all available TSAs. After selecting the TSA,
            click the <strong>Transfer</strong> button to assign the records to the selected TSA.
            This is useful for batch handling of records to specific sales associates efficiently.
          </p>
        </div>
      )}

      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700"></th>
            {Role !== "Special Access" && (
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            )}
            <th className="px-6 py-4 font-semibold text-gray-700">Agent</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Company Information</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((post) => (
              <tr key={post.id} className="border-b whitespace-nowrap">
                <td className="px-6 py-4 text-xs">
                  {bulkTransferTSAMode && (
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(post.id)}
                      onChange={() => handleSelectUser(post.id)}
                      className="w-4 h-4 text-purple-600"
                    />
                  )}
                </td>
                {Role !== "Special Access" && (
                  <td className="px-6 py-4 text-xs">
                    <button
                      className="px-4 py-2 text-gray-700 bg-blue-500 text-white rounded-full w-full text-left"
                      onClick={() => handleEdit(post)}
                    >
                      <CiEdit size={16} />
                    </button>
                  </td>
                )}
                <td className="px-6 py-4 text-xs capitalize">
                  {post.AgentFirstname} {post.AgentLastname}
                  <br />
                  <span className="text-gray-900 text-[8px]">({post.referenceid})</span>
                </td>
                <td className="px-4 py-2 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="border p-2 rounded">Company Name: {post.companyname}</span>
                    <span className="border p-2 rounded">Contact Person: {post.contactperson}</span>
                    <span className="border p-2 rounded">Contact Number: {post.contactnumber}</span>
                    <span className="border p-2 rounded">Email Address: {post.emailaddress}</span>
                    <span className="border p-2 rounded">Address: {post.address}</span>
                    <span className="border p-2 rounded">Area: {post.area}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">{post.typeclient}</td>
                <td className="px-6 py-4 text-xs">
                  <span
                    className={`px-2 py-1 text-[8px] font-semibold rounded-full whitespace-nowrap ${post.status === "Active"
                      ? "bg-green-400 text-gray-100"
                      : post.status === "Used"
                        ? "bg-blue-400 text-gray-100"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-white bg-blue-400 p-2 rounded">Uploaded: {formatDate(new Date(post.date_created).getTime())}</span>
                    <span className="text-white bg-green-500 p-2 rounded">Updated: {formatDate(new Date(post.date_updated).getTime())}</span>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-4 border">
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
