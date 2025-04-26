import React, { useMemo } from "react";

interface DailyTransactionTableProps {
  posts: any[];
}

const calculateTimeConsumed = (startdate: string, enddate: string) => {
  if (!startdate || !enddate) return "N/A";

  const start = new Date(startdate);
  const end = new Date(enddate);
  const diffInSeconds = (end.getTime() - start.getTime()) / 1000;

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = Math.floor(diffInSeconds % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const DailyTransactionTable: React.FC<DailyTransactionTableProps> = ({ posts }) => {
  // Sort posts by start date (latest first)
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = a.startdate ? new Date(a.startdate).getTime() : 0;
      const dateB = b.startdate ? new Date(b.startdate).getTime() : 0;
      return dateB - dateA;
    });
  }, [posts]);

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
      {sortedPosts.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100 text-left uppercase font-bold border-b">
              <th className="p-3 border">Ticket Number</th>
              <th className="p-3 border">Account Name</th>
              <th className="p-3 border">Contact</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Wrap Up</th>
              <th className="p-3 border">Inquiry / Concern</th>
              <th className="p-3 border">Remarks</th>
              <th className="p-3 border">Agent</th>
              <th className="p-3 border">TSM</th>
              <th className="p-3 border">Time Consumed</th>
              <th className="p-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.map((post, index) => (
              <tr
                key={post._id || `post-${index}`} // Fallback key if _id is missing
                className="border-b hover:bg-gray-50 capitalize"
              >
                <td className="p-3 border">{post.ticketreferencenumber || "-"}</td>
                <td className="p-3 border">{post.companyname || "-"}</td>
                <td className="p-3 border">
                  {post.contact_person || "-"} / {post.contactnumber || "-"}
                </td>
                <td className="p-3 border lowercase">{post.emailaddress || "-"}</td>
                <td className="p-3 border">{post.wrapup || "-"}</td>
                <td className="p-3 border capitalize">{post.inquiries || "-"}</td>
                <td className="p-3 border capitalize">{post.remarks || "-"}</td>
                <td className="p-3 border italic capitalize">
                  {post?.AgentFirstname || ""}, {post?.AgentLastname || ""}
                </td>
                <td className="p-3 border italic capitalize">
                  {post?.ManagerFirstname || ""}, {post?.ManagerLastname || ""}
                </td>
                <td className="p-3 border">
                  {calculateTimeConsumed(post.startdate, post.enddate)}
                </td>
                <td className="p-3 border">{formatDate(post.date_created)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4 text-sm">No CSR inquiries available</div>
      )}
    </div>
  );
};

export default DailyTransactionTable;
