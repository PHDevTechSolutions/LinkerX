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

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const formattedDateStr = date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
};

const DailyTransactionTable: React.FC<DailyTransactionTableProps> = ({ posts }) => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = a.startdate ? new Date(a.startdate).getTime() : 0;
      const dateB = b.startdate ? new Date(b.startdate).getTime() : 0;
      return dateB - dateA;
    });
  }, [posts]);

  const groupedByCompany = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    sortedPosts.forEach((post) => {
      const company = post.companyname || "Unknown";
      if (!grouped[company]) {
        grouped[company] = [];
      }
      grouped[company].push(post);
    });
    return grouped;
  }, [sortedPosts]);

  const handleRowClick = (company: string) => {
    setSelectedCompany(company);
  };

  const closeModal = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="overflow-x-auto">
      {sortedPosts.length > 0 ? (
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Ticket Number</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Account Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Object.entries(groupedByCompany).map(([company, records]) => (
              <tr key={company} className="border-b whitespace-nowrap cursor-pointer hover:bg-gray-50" onClick={() => handleRowClick(company)}>
                <td className="px-6 py-4 text-xs underline">{records[0].ticketreferencenumber || "-"}</td>
                <td className="px-6 py-4 text-xs uppercase">{company}</td>
                <td className="px-6 py-4 text-xs">{formatDate(records[0].date_created)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4 text-sm">No CSR inquiries available</div>
      )}

      {selectedCompany && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white p-6 rounded-md max-w-2xl w-full overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4">Ticket Details for <span className="uppercase">{selectedCompany}</span></h3>
            <div className="space-y-4 text-xs">
              {groupedByCompany[selectedCompany].map((ticket, idx) => (
                <div key={idx} className="border-b pb-2 mb-2">
                  <p><strong>Ticket Number:</strong> {ticket.ticketreferencenumber}</p>
                  <p><strong>Contact:</strong> {ticket.contact_person || "-"} / {ticket.contactnumber || "-"}</p>
                  <p><strong>Email:</strong> {ticket.emailaddress || "-"}</p>
                  <p><strong>Wrap Up:</strong> {ticket.wrapup || "-"}</p>
                  <p className="capitalize"><strong>Inquiry / Concern:</strong> {ticket.inquiries || "-"}</p>
                  <p className="capitalize"><strong>Remarks:</strong> {ticket.remarks || "-"}</p>
                  <p className="capitalize"><strong>Agent:</strong> {ticket.AgentFirstname || ""}, {ticket.AgentLastname || ""}</p>
                  <p className="capitalize"><strong>TSM:</strong> {ticket.ManagerFirstname || ""}, {ticket.ManagerLastname || ""}</p>
                  <p><strong>Time Consumed:</strong> {calculateTimeConsumed(ticket.startdate, ticket.enddate)}</p>
                  <p><strong>Date Created:</strong> {formatDate(ticket.date_created)}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 bg-gray-400 text-white text-xs rounded-md" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTransactionTable;
