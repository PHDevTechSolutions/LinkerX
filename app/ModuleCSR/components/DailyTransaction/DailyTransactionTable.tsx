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
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Ticket Number</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Account Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Contact</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Wrap Up</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Inquiry / Concern</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Agent</th>
              <th className="px-6 py-4 font-semibold text-gray-700">TSM</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Time Consumed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedPosts.map((post) => (
              <tr key={post._id} className="border-b whitespace-nowrap">
                <td className="px-6 py-4 text-xs">{post.ticket_reference_number}</td>
                <td className="px-6 py-4 text-xs">{post.account_name}</td>
                <td className="px-6 py-4 text-xs">
                  {post.contact_person} / {post.contact_number}
                </td>
                <td className="px-6 py-4 text-xs">{post.email}</td>
                <td className="px-6 py-4 text-xs">{post.wrapup}</td>
                <td className="px-6 py-4 text-xs">{post.inquiries}</td>
                <td className="px-6 py-4 text-xs">{post.remarks}</td>
                <td className="px-6 py-4 text-xs">{post.agent_fullname}</td>
                <td className="px-6 py-4 text-xs">{post.tsm_fullname}</td>
                <td className="px-6 py-4 text-xs">{calculateTimeConsumed(post.start_date, post.end_date)}</td>
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
