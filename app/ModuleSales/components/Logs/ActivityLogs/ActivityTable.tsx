import React, { useEffect, useState, useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiClock2, CiExport } from "react-icons/ci";
import ExcelJS from "exceljs";

interface OutboundTableProps {
    posts: any[];
}

const getTypeOfClientColor = (type: string) => {
    switch (type) {
        case "Successful Call": return "bg-green-100";
        case "Unsuccessful Call": return "bg-red-100";
        default: return "";
    }
};

const calculateTimeConsumed = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInSeconds = (end.getTime() - start.getTime()) / 1000;

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = Math.floor(diffInSeconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
};

const OutboundTable: React.FC<OutboundTableProps> = ({ posts }) => {
    const [agentFilter, setAgentFilter] = useState<string>('');
    const [idNumberFilter, setIdNumberFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    const agentNumbers = useMemo(() => Array.from(new Set(posts.map(post => post.agent_number))), [posts]);
    const idNumbers = useMemo(() => Array.from(new Set(posts.map(post => post.id_number))), [posts]);
    const statuses = useMemo(() => Array.from(new Set(posts.map(post => post.status))), [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            return (
                (agentFilter ? post.agent_number === agentFilter : true) &&
                (idNumberFilter ? post.id_number === idNumberFilter : true) &&
                (statusFilter ? post.status === statusFilter : true)
            );
        });
    }, [posts, agentFilter, idNumberFilter, statusFilter]);

    const sortedPosts = useMemo(() => {
        return [...filteredPosts].sort((a, b) => {
            const dateA = a.start_date ? new Date(a.start_date) : new Date(0);
            const dateB = b.start_date ? new Date(b.start_date) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
    }, [filteredPosts]);

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Outbound Calls");

        worksheet.columns = [
            { header: 'Company Name', key: 'account_name', width: 20 },
            { header: 'Territory Sales Associates', key: 'agent_fullname', width: 20 },
            { header: 'Territory Sales Manager', key: 'tsm_fullname', width: 20 },
            { header: 'Type of Client', key: 'type_of_client', width: 20 },
            { header: 'Type of Call', key: 'type_of_call', width: 20 },
            { header: 'Call Status', key: 'call_status', width: 20 },
            { header: 'Contact Person', key: 'contact_person', width: 20 },
            { header: 'Contact No.', key: 'contact_number', width: 20 },
            { header: 'Email', key: 'email', width: 20 },
            { header: 'Remarks', key: 'remarks', width: 20 },
            { header: 'Call Duration', key: 'start_date_end_date', width: 30 },
            { header: 'Time Consumed', key: 'time_consumed', width: 20 }
        ];

        sortedPosts.forEach((post) => {
            worksheet.addRow({
                account_name: post.account_name,
                agent_fullname: post.agent_fullname,
                tsm_fullname: post.tsm_fullname,
                type_of_client: post.type_of_client,
                type_of_call: post.type_of_call,
                call_status: post.call_status,
                contact_person: post.contact_person,
                contact_number: post.contact_number,
                email: post.email,
                remarks: post.remarks,
                start_date_end_date: `${post.start_date} - ${post.end_date}`,
                time_consumed: post.time_consumed
            });
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "outbound_calls.xlsx";
            link.click();
        });
    };

    return (
        <div className="overflow-x-auto">
            {/* Filters */}
            <div className="flex gap-4 pb-2">
                <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} className="px-3 py-2 border rounded text-xs">
                    <option value="">Filter by Agent Number</option>
                    {agentNumbers.map(agentNumber => <option key={agentNumber} value={agentNumber}>{agentNumber}</option>)}
                </select>

                <select value={idNumberFilter} onChange={(e) => setIdNumberFilter(e.target.value)} className="px-3 py-2 border rounded text-xs">
                    <option value="">Filter by ID Number</option>
                    {idNumbers.map(idNumber => <option key={idNumber} value={idNumber}>{idNumber}</option>)}
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded text-xs">
                    <option value="">Filter by Status</option>
                    {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
            </div>

            {/* Export Button */}
            <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-gray-100 shadow-sm text-dark text-xs flex items-center gap-1 rounded">
                <CiExport size={20} /> Export to Excel
            </button>

            {/* Table */}
            <table className="min-w-full bg-white border border-gray-300 text-xs">
                <thead>
                    <tr className="bg-gray-100 text-left uppercase font-bold border-b">
                        <th className="p-3 border">Agent Number</th>
                        <th className="p-3 border">ID Number</th>
                        <th className="p-3 border">Account Name</th>
                        <th className="p-3 border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPosts.map(post => (
                        <tr key={post._id} className={`border-b hover:bg-gray-50 ${getTypeOfClientColor(post.call_status)}`}>
                            <td className="p-3 border">{post.agent_number}</td>
                            <td className="p-3 border">{post.id_number}</td>
                            <td className="p-3 border">{post.account_name}</td>
                            <td className="p-3 border">{post.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OutboundTable;
