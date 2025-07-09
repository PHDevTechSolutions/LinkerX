import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FaFileExcel } from "react-icons/fa6";


interface TableXchireProps {
  data: any[];
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
  Role: string;
  Department: string;
}

const TableXchire: React.FC<TableXchireProps> = ({ data }) => {

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Accounts");

    // Define columns
    worksheet.columns = [
      { header: "Email", key: "email", width: 30 },
      { header: "Department", key: "department", width: 25 },
      { header: "Timestamp", key: "timestamp", width: 30 },
      { header: "Status", key: "status", width: 20 },
    ];

    // Add data rows
    data.forEach((item) => {
      worksheet.addRow({
        email: item.email,
        department: item.department,
        timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString() : "N/A",
        status: item.status || "N/A",
      });
    });

    // Create buffer & trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Session_Logs.xlsx");
  };

  const statusColors: { [key: string]: string } = {
    login: 'bg-green-800',
    logout: 'bg-red-600',
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-2">
        <button
          onClick={exportToExcel}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-xs flex"
        >
          <FaFileExcel size={15} />Export to Excel
        </button>
      </div>

      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Department</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((post) => (
              <tr key={post._id} className="whitespace-nowrap hover:bg-gray-100 cursor-pointer">
                <td className="px-6 py-4 text-xs capitalize">
                  <span className={`badge text-white shadow-md text-[8px] px-2 py-1 mr-2 rounded-xl ${statusColors[post.status] || 'bg-gray-400'}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs">{post.email}</td>
                <td className="px-6 py-4 text-xs">{post.department}</td>
                <td className="px-6 py-4 text-xs">
                  {post.timestamp
                    ? new Date(post.timestamp).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center px-4 py-4 text-gray-500">
                No accounts available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableXchire;
