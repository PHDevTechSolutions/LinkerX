import React from "react";

interface DataLogsTableProps {
  posts: any[];
}

const DataLogTable: React.FC<DataLogsTableProps> = ({ posts }) => {
  return (
    <div className="overflow-x-auto">
      {posts.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100 text-left uppercase font-bold border-b">
              <th className="p-3 border whitespace-nowrap">Ticket Number</th>
              <th className="p-3 border whitespace-nowrap">User Name</th>
              <th className="p-3 border whitespace-nowrap">Company Name</th>
              <th className="p-3 border whitespace-nowrap">Customer Name</th>
              <th className="p-3 border whitespace-nowrap">Gender</th>
              <th className="p-3 border whitespace-nowrap">Contact Number</th>
              <th className="p-3 border whitespace-nowrap">Email</th>
              <th className="p-3 border whitespace-nowrap">Customer Segment</th>
              <th className="p-3 border whitespace-nowrap">City Address</th>
              <th className="p-3 border whitespace-nowrap">Channel</th>
              <th className="p-3 border whitespace-nowrap">Wrap Up</th>
              <th className="p-3 border whitespace-nowrap">Source</th>
              <th className="p-3 border whitespace-nowrap">Customer Type</th>
              <th className="p-3 border whitespace-nowrap">Customer Status</th>
              <th className="p-3 border whitespace-nowrap">Status</th>
              <th className="p-3 border whitespace-nowrap">Amount</th>
              <th className="p-3 border whitespace-nowrap">Quantity</th>
              <th className="p-3 border whitespace-nowrap">Traffic</th>
              <th className="p-3 border whitespace-nowrap">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr
                key={post._id || `post-${index}`} // Fallback key if _id is missing
                className="border-b hover:bg-gray-50 capitalize"
              >
                <td className="p-3 border whitespace-nowrap">{post.TicketReferenceNumber}</td>
                <td className="p-3 border whitespace-nowrap">{post.userName}</td>
                <td className="p-3 border whitespace-nowrap">{post.CompanyName}</td>
                <td className="p-3 border whitespace-nowrap">{post.CustomerName}</td>
                <td className="p-3 border whitespace-nowrap">{post.Gender}</td>
                <td className="p-3 border whitespace-nowrap">{post.ContactNumber}</td>
                <td className="p-3 border whitespace-nowrap">{post.Email}</td>
                <td className="p-3 border whitespace-nowrap">{post.CustomerSegment}</td>
                <td className="p-3 border whitespace-nowrap">{post.CityAddress}</td>
                <td className="p-3 border whitespace-nowrap">{post.Channel}</td>
                <td className="p-3 border whitespace-nowrap">{post.WrapUp}</td>
                <td className="p-3 border whitespace-nowrap">{post.Source}</td>
                <td className="p-3 border whitespace-nowrap">{post.CustomerType}</td>
                <td className="p-3 border whitespace-nowrap">{post.CustomerStatus}</td>
                <td className="p-3 border whitespace-nowrap">{post.Status}</td>
                <td className="p-3 border whitespace-nowrap">{post.Amount}</td>
                <td className="p-3 border whitespace-nowrap">{post.QtySold}</td>
                <td className="p-3 border whitespace-nowrap">{post.Traffic}</td>
                <td className="p-3 border whitespace-nowrap">{post.createdAt}</td>
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

export default DataLogTable;
