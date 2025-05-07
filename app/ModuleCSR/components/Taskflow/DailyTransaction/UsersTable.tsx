import React, { useState, useMemo } from "react";

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
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

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

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="overflow-x-auto">
      {sortedPosts.length > 0 ? (
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Ticket Number</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedPosts.map((post, index) => (
              <tr key={post._id || `post-${index}`} className="border-b whitespace-nowrap">
                <td className="px-6 py-4 text-xs underline cursor-pointer" onClick={() => handleTicketClick(post)}>{post.ticketreferencenumber || "-"}</td>
                <td className="px-6 py-4 text-xs">{formatDate(post.date_created)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4 text-sm">No CSR inquiries available</div>
      )}

      {/* Modal for ticket details */}
      {selectedTicket && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Ticket Details</h3>
            <div className="space-y-2 text-xs">
              <p><strong>Ticket Number:</strong> {selectedTicket.ticketreferencenumber}</p>
              <p><strong>Account Name:</strong> {selectedTicket.companyname || "-"}</p>
              <p><strong>Contact:</strong> {selectedTicket.contact_person || "-"} / {selectedTicket.contactnumber || "-"}</p>
              <p><strong>Email:</strong> {selectedTicket.emailaddress || "-"}</p>
              <p><strong>Wrap Up:</strong> {selectedTicket.wrapup || "-"}</p>
              <p className="capitalize"><strong>Inquiry / Concern:</strong> {selectedTicket.inquiries || "-"}</p>
              <p className="capitalize"><strong>Remarks:</strong> {selectedTicket.remarks || "-"}</p>
              <p className="capitalize"><strong>Agent:</strong> {selectedTicket?.AgentFirstname || ""}, {selectedTicket?.AgentLastname || ""}</p>
              <p className="capitalize"><strong>TSM:</strong> {selectedTicket?.ManagerFirstname || ""}, {selectedTicket?.ManagerLastname || ""}</p>
              <p><strong>Time Consumed:</strong> {calculateTimeConsumed(selectedTicket.startdate, selectedTicket.enddate)}</p>
              <p><strong>Date Created:</strong> {formatDate(selectedTicket.date_created)}</p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-gray-400 text-white text-xs rounded-md"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTransactionTable;
