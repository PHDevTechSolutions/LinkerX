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

  // Get all unique agent names from the full posts list (not filtered/paginated)
  const agentNames = Array.from(
    new Set(posts.map((user) => `${user.AgentFirstname} ${user.AgentLastname}`))
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    const formattedDateStr = date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
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

      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap">
            <th className="px-4 py-2 font-semibold text-gray-700">Agent</th>
            <th className="px-4 py-2 font-semibold text-gray-700">Company Information</th>
            <th className="px-4 py-2 font-semibold text-gray-700">Activity Information</th>
            <th className="px-4 py-2 font-semibold text-gray-700">Remarks</th>
            <th className="px-4 py-2 font-semibold text-gray-700">File</th>
            <th className="px-4 py-2 font-semibold text-gray-700">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((post) => (
              <tr key={post.id} className="border-b whitespace-nowrap">
                <td className="px-5 py-2 text-xs">
                  {post.AgentFirstname} {post.AgentLastname}
                  <br />
                  <span className="text-gray-900 text-[8px]">({post.referenceid})</span>
                </td>
                <td className="px-4 py-2 text-xs align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-black border p-2 rounded">Company Name: {post.companyname}</span>
                    <span className="text-black border p-2 rounded">Contact Person: {post.contactperson}</span>
                    <span className="text-black border p-2 rounded">Contact Number: {post.contactnumber}</span>
                    <span className="text-black border p-2 rounded">Email Address: {post.emailaddress}</span>
                    <span className="text-black border p-2 rounded">Address: {post.address}</span>
                    <span className="text-black border p-2 rounded">Type of Client: {post.typeclient}</span>
                    <span className={`px-4 py-2 rounded text-white text-xs font-bold 
                    ${post.activitystatus === "Cold" ? "bg-blue-400" : post.activitystatus === "Hot" ? "bg-red-400" :
                        post.activitystatus === "Warm" ? "bg-yellow-400" : post.activitystatus === "Done" ? "bg-green-500" : "bg-gray-500"}`}>Status: {post.activitystatus}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-xs align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-black border p-2 rounded">Type of Activity: {post.typeactivity}</span>
                    <span className="text-black border p-2 rounded">Type of Call: {post.typecall}</span>
                    <span className="text-black border p-2 rounded">Actual Sales: {post.actualsales}</span>
                    <span className="text-black border p-2 rounded">SO Amount: {post.soamount}</span>
                    <span className="text-black border p-2 rounded">Quotation Amount: {post.quotationamount}</span>
                    <span className="text-black border p-2 rounded">SO Number: {post.sonumber}</span>
                    <span className="text-black border p-2 rounded">Quotation Number: {post.quotationnumber}</span>
                    <span className={`px-4 py-2 rounded text-white text-xs font-bold ${post.callstatus === "Successful"
                      ? "bg-green-500"
                      : post.callstatus === "Unsuccessful"
                        ? "bg-red-400"
                        : "bg-gray-400"
                      }`}>Result: {post.callstatus}</span>
                  </div>
                </td>
                <td className="px-5 py-2 text-xs capitalize">
                  {post.remarks ? post.remarks : post.activityremarks}
                </td>
                <td className="px-5 py-2 text-xs"></td>
                <td className="px-4 py-2 text-xs align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-white bg-blue-400 p-2 rounded">Duration: {formatDate(new Date(post.startdate).getTime())} - {formatDate(new Date(post.enddate).getTime())}</span>
                    <span className="text-black bg-orange-400 p-2 rounded">Callback: {formatDate(new Date(post.callback).getTime())}</span>
                    <span className="text-black bg-red-400 p-2 flex items-center gap-1 rounded">
                      <FcClock size={15} /> Time Consumed: {calculateTimeConsumed(post.startdate, post.enddate)}
                    </span>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={14} className="text-center text-xs py-4 border">No record available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersCard;
