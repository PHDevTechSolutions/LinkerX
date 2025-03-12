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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 text-xs">
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
          {updatedUser.length > 0 ? (
            updatedUser.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="py-2 px-4 border capitalize whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {post.AgentFirstname} {post.AgentLastname}
                  <br />
                  <span className="text-gray-900 text-[8px]">({post.referenceid})</span>
                </td>
                <td className="py-2 px-4 border capitalize whitespace-nowrap overflow-hidden overflow-ellipsis">{post.companyname}</td>
                <td className="py-2 px-4 border capitalize whitespace-nowrap overflow-hidden overflow-ellipsis">{post.actualsales}</td>
                <td className="py-2 px-4 border whitespace-nowrap overflow-hidden overflow-ellipsis">{post.soamount}</td>
                <td className="py-2 px-4 border whitespace-nowrap overflow-hidden overflow-ellipsis">{post.sonumber}</td>
                <td className="py-2 px-4 border capitalize whitespace-nowrap overflow-hidden overflow-ellipsis">{post.typeclient}</td>
                <td className="py-2 px-4 border capitalize whitespace-nowrap overflow-hidden overflow-ellipsis">{post.typecall}</td>
                <td className="py-2 px-4 border uppercase whitespace-nowrap overflow-hidden overflow-ellipsis">{post.typeactivity}</td>
                <td className="py-2 px-4 border uppercase whitespace-nowrap overflow-hidden overflow-ellipsis">{post.callstatus}</td>
                <td className="py-2 px-4 border uppercase whitespace-nowrap overflow-hidden overflow-ellipsis">{post.remarks}</td>
                <td className="py-2 px-4 border uppercase whitespace-nowrap overflow-hidden overflow-ellipsis"></td>
                <td className="py-2 px-4 border uppercase whitespace-nowrap overflow-hidden overflow-ellipsis">
                  <span className={`px-2 py-1 rounded-full text-white text-[8px] font-bold 
                    ${post.activitystatus === "Cold" ? "bg-blue-800" : post.activitystatus === "Hot" ? "bg-red-700" :
                      post.activitystatus === "Warm" ? "bg-yellow-500" : post.activitystatus === "Done" ? "bg-green-900" : "bg-gray-500"}`}>
                        {post.activitystatus}
                  </span>
                </td>

                <td className="py-2 px-4 border uppercase whitespace-nowrap overflow-hidden overflow-ellipsis">
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
