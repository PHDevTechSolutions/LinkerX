import React, { useState, useMemo } from "react";
import { CiEdit } from "react-icons/ci";

interface Post {
    id: string;
    date_created: string;
    companyname: string;
    contactperson: string;
    ticketreferencenumber: string;
    activitystatus: string;
    remarks: string;
}

interface UsersCardProps {
    posts: Post[];
    handleEdit: (post: any) => void;
}

const UsersTable: React.FC<UsersCardProps> = ({ posts, handleEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const parseDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
    };

    const filteredPosts = useMemo(() => {
        const start = parseDate(startDate);
        const end = parseDate(endDate);
        return posts.filter((post) => {
            const postDate = parseDate(post.date_created);
            return (!start || !postDate || postDate >= start) &&
                (!end || !postDate || postDate <= end);
        });
    }, [posts, startDate, endDate]);

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        return filteredPosts.slice(startIdx, startIdx + itemsPerPage);
    }, [filteredPosts, currentPage, itemsPerPage]);

    const isHotAndPending = (status: string, createdDate: string) => {
        if (status.toLowerCase() !== "hot") return false;
        const created = new Date(createdDate);
        const now = new Date();
        const diffInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays > 15;
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true,
            timeZone: 'Asia/Manila',
        };
        return date.toLocaleString('en-US', options);
    };

    const goToPage = (page: number) => {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    };

    return (
        <div>
            {/* Filters */}
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold">Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="border px-3 py-2 rounded text-xs" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold">End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="border px-3 py-2 rounded text-xs" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold">Items per page:</label>
                    <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border px-3 py-2 rounded text-xs">
                        {[10, 25, 50, 100].map((num) => <option key={num} value={num}>{num}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto relative">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                            <th className="px-6 py-4 font-semibold text-gray-700">Date Created</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Ticket Reference Number</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4">No records available</td>
                            </tr>
                        ) : (
                            paginatedData.map((post) => (
                                <tr key={post.id} className="border-b whitespace-nowrap">
                                    <td className="px-6 py-4 text-xs">{formatDate(post.date_created)}</td>
                                    <td className="px-6 py-4 text-xs">
                                        <button
                                            className="block px-4 py-2 text-[10px] font-bold text-black bg-blue-300 rounded-lg hover:bg-orange-300 hover:rounded-full hover:shadow-md w-full text-left flex items-center gap-1"
                                            onClick={() => handleEdit(post)}
                                        >
                                            <CiEdit /> Edit
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-xs uppercase">{post.ticketreferencenumber}</td>
                                    <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                                    <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                                    <td className="px-6 py-4 text-xs">
                                        {isHotAndPending(post.activitystatus, post.date_created) ? (
                                            <span className="inline-block px-2 py-1 text-[10px] font-semibold rounded-full bg-orange-200 text-orange-800">Pending</span>
                                        ) : (
                                            <span className={`inline-block px-2 py-1 text-[10px] font-semibold rounded-full
                                                ${post.activitystatus.toLowerCase() === "cold" ? "bg-blue-200 text-blue-800"
                                                    : post.activitystatus.toLowerCase() === "warm" ? "bg-yellow-200 text-yellow-800"
                                                        : post.activitystatus.toLowerCase() === "hot" ? "bg-red-200 text-red-800"
                                                            : post.activitystatus.toLowerCase() === "done" ? "bg-green-200 text-green-800"
                                                                : "bg-gray-200 text-gray-800"}`}>
                                                {post.activitystatus}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs capitalize">{post.remarks}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-200 text-xs px-4 py-2 rounded">Previous</button>
                <span>Page {currentPage} of {totalPages || 1}</span>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="bg-gray-200 text-xs px-4 py-2 rounded">Next</button>
            </div>
        </div>
    );
};

export default UsersTable;
