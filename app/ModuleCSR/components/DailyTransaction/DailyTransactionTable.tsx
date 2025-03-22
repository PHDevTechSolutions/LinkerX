import React, { useMemo } from "react";

interface DailyTransactionTableProps {
  posts: any[];
}

const calculateTimeConsumed = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return "N/A";

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInSeconds = (end.getTime() - start.getTime()) / 1000;

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = Math.floor(diffInSeconds % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const DailyTransactionTable: React.FC<DailyTransactionTableProps> = ({ posts }) => {
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date) : new Date(0);
      const dateB = b.start_date ? new Date(b.start_date) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [posts]);

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
            </tr>
          </thead>
          <tbody>
            {sortedPosts.map((post) => (
              <tr key={post._id} className="border-b hover:bg-gray-50 capitalize transition-all duration-200 ease-in-out transform hover:scale-[1.02]">
                <td className="p-3 border">{post.ticket_reference_number}</td>
                <td className="p-3 border">{post.account_name}</td>
                <td className="p-3 border">
                  {post.contact_person} / {post.contact_number}
                </td>
                <td className="p-3 border lowercase">{post.email}</td>
                <td className="p-3 border">{post.wrapup}</td>
                <td className="p-3 border">{post.inquiries}</td>
                <td className="p-3 border">{post.remarks}</td>
                <td className="p-3 border italic capitalize">{post.agent_fullname}</td>
                <td className="p-3 border italic capitalize">{post.tsm_fullname}</td>
                <td className="p-3 border">{calculateTimeConsumed(post.start_date, post.end_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4 text-sm">No transactions available</div>
      )}
    </div>
  );
};

export default DailyTransactionTable;
