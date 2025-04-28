import React, { useEffect, useState } from "react";
import { FcClock } from "react-icons/fc";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  ReferenceID: string;
  fetchAccount: () => Promise<void>;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, ReferenceID, fetchAccount }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  const calculateTimeConsumed = (startdate: string, enddate: string) => {
    if (!startdate || !enddate) return "N/A";

    const start = new Date(startdate).getTime();
    const end = new Date(enddate).getTime();
    const diff = end - start;

    if (diff <= 0) return "Invalid Time";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds}s`;
  };

  // Filter users by the selected agent
  const filteredUsers = selectedAgent
    ? updatedUser.filter((user) => `${user.AgentFirstname} ${user.AgentLastname}` === selectedAgent)
    : updatedUser;

  // Get unique agent names for the dropdown
  const agentNames = Array.from(
    new Set(updatedUser.map((user) => `${user.AgentFirstname} ${user.AgentLastname}`))
  );

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        {/* Dropdown to filter by agent */}
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full max-w-xs p-2 border rounded text-xs"
        >
          <option value="">Filter by Agent</option>
          {agentNames.map((agent) => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </div>

      <table className="bg-white border border-gray-200 text-xs">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border whitespace-nowrap">Agent</th>
            <th className="py-2 px-4 border whitespace-nowrap">Company Name</th>
            <th className="py-2 px-4 border whitespace-nowrap">SO to DR</th>
            <th className="py-2 px-4 border whitespace-nowrap">SO Amount</th>
            <th className="py-2 px-4 border whitespace-nowrap">SO Number</th>
            <th className="py-2 px-4 border whitespace-nowrap">Type of Client</th>
            <th className="py-2 px-4 border whitespace-nowrap">Type of Call</th>
            <th className="py-2 px-4 border whitespace-nowrap">Type of Activity</th>
            <th className="py-2 px-4 border whitespace-nowrap">Call Type</th>
            <th className="py-2 px-4 border whitespace-nowrap">Remarks</th>
            <th className="py-2 px-4 border whitespace-nowrap">File</th>
            <th className="py-2 px-4 border whitespace-nowrap">Status</th>
            <th className="py-2 px-4 border whitespace-nowrap">Duration</th>
            <th className="py-2 px-4 border whitespace-nowrap">Time Consumed</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="py-2 px-4 border capitalize whitespace-nowrap ">
                  {post.AgentFirstname} {post.AgentLastname}
                  <br />
                  <span className="text-gray-900 text-[8px]">({post.referenceid})</span>
                </td>
                <td className="py-2 px-4 border capitalize whitespace-nowrap ">{post.companyname}</td>
                <td className="py-2 px-4 border capitalize whitespace-nowrap">{post.actualsales}</td>
                <td className="py-2 px-4 border whitespace-nowrap">{post.soamount}</td>
                <td className="py-2 px-4 border whitespace-nowrap ">{post.sonumber}</td>
                <td className="py-2 px-4 border capitalize whitespace-nowrap ">{post.typeclient}</td>
                <td className="py-2 px-4 border capitalize whitespace-nowrap ">{post.typecall}</td>
                <td className="py-2 px-4 border uppercase whitespace-nowrap ">{post.typeactivity}</td>
                <td className="py-2 px-4 border uppercase whitespace-nowrap ">{post.callstatus}</td>
                <td className="py-2 px-4 border uppercase whitespace-nowrap">
                  {post.remarks ? post.remarks : post.activityremarks}
                </td>

                <td className="py-2 px-4 border uppercase whitespace-nowrap "></td>
                <td className="py-2 px-4 border uppercase whitespace-nowrap ">
                  <span className={`px-2 py-1 rounded-full text-white text-[8px] font-bold 
                    ${post.activitystatus === "Cold" ? "bg-blue-800" : post.activitystatus === "Hot" ? "bg-red-700" :
                      post.activitystatus === "Warm" ? "bg-yellow-500" : post.activitystatus === "Done" ? "bg-green-900" : "bg-gray-500"}`}>
                    {post.activitystatus}
                  </span>
                </td>

                <td className="py-2 px-4 border uppercase whitespace-nowrap ">
                  {post.startdate ? new Date(post.startdate).toLocaleString() : "N/A"} -
                  {post.enddate ? new Date(post.enddate).toLocaleString() : "N/A"}
                </td>
                <td className="py-2 px-4 uppercase whitespace-nowrap mt-2 truncate flex items-center gap-1">
                  <FcClock className="text-lg shrink-0" />
                  {calculateTimeConsumed(post.startdate, post.enddate)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={14} className="text-center py-4 border">No accounts available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersCard;
