import React, { useState, useMemo } from "react";

interface Post {
    id: string;
    date_created: string;
    companyname: string;
    contactperson: string;
    sonumber: string;
    soamount: number | string;
    activitystatus: string;
    remarks: string;
}

interface UsersCardProps {
    posts: Post[];
}

const UsersTable: React.FC<UsersCardProps> = ({ posts }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const parseDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
    };

    const isHotAndPending = (status: string, createdDate: string) => {
        if (status.toLowerCase() !== "hot") return false;

        const created = new Date(createdDate);
        const now = new Date();
        const diffInMs = now.getTime() - created.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        return diffInDays > 15;
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

    const sortedPosts = useMemo(() => {
        return [...filteredPosts].sort((a, b) => {
            const aAmount = typeof a.soamount === "string" ? parseFloat(a.soamount) : a.soamount;
            const bAmount = typeof b.soamount === "string" ? parseFloat(b.soamount) : b.soamount;
            return (bAmount || 0) - (aAmount || 0);
        });
    }, [filteredPosts]);

    const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedPosts.slice(start, start + itemsPerPage);
    }, [sortedPosts, currentPage, itemsPerPage]);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        if (page < 1) page = 1;
        else if (page > totalPages) page = totalPages;
        setCurrentPage(page);
    };

    const formatCurrency = (value: number | string) => {
        const number = typeof value === "string" ? parseFloat(value) || 0 : value || 0;
        return number.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
        });
    };

    const totalSOAmount = useMemo(() => {
        return filteredPosts.reduce((sum, post) => {
            const amount = typeof post.soamount === "string" ? parseFloat(post.soamount) : post.soamount;
            return sum + (amount || 0);
        }, 0);
    }, [filteredPosts]);

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const formattedDateStr = date.toLocaleDateString('en-US', {
            timeZone: 'UTC',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
        return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
    };

    return (
        <div>
            {/* Filters */}
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label className="font-semibold text-xs whitespace-nowrap">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border px-3 py-2 rounded text-xs"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold text-xs whitespace-nowrap">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border px-3 py-2 rounded text-xs"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold text-xs whitespace-nowrap">Items per page:</label>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border px-3 py-2 rounded text-xs"
                    >
                        {[10, 25, 50, 100].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto relative">
                <table className="min-w-full table-auto text-xs">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="text-left border-l-4 border-orange-400">
                            <th className="px-6 py-3 font-semibold text-gray-700">Date Created</th>
                            <th className="px-6 py-3 font-semibold text-gray-700">Company Name</th>
                            <th className="px-6 py-3 font-semibold text-gray-700">Contact Person</th>
                            <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4">No records available</td>
                            </tr>
                        ) : (
                            paginatedData.map((post) => (
                                <tr key={post.id} className="bg-white hover:bg-gray-50">
                                    <td className="px-6 py-3">{formatDate(post.date_created)}</td>
                                    <td className="px-6 py-3 uppercase">{post.companyname}</td>
                                    <td className="px-6 py-3 capitalize">{post.contactperson}</td>
                                    <td className="px-6 py-3">
                                        {isHotAndPending(post.activitystatus, post.date_created) ? (
                                            <span className="inline-block px-2 py-1 text-[10px] font-semibold rounded-full bg-orange-200 text-orange-800">
                                                Pending
                                            </span>
                                        ) : (
                                            <span className={`inline-block px-2 py-1 text-[10px] font-semibold rounded-full
                                                ${post.activitystatus.toLowerCase() === "cold"
                                                    ? "bg-blue-200 text-blue-800"
                                                    : post.activitystatus.toLowerCase() === "warm"
                                                        ? "bg-yellow-200 text-yellow-800"
                                                        : post.activitystatus.toLowerCase() === "hot"
                                                            ? "bg-red-200 text-red-800"
                                                            : post.activitystatus.toLowerCase() === "done"
                                                                ? "bg-green-200 text-green-800"
                                                                : "bg-gray-200 text-gray-800"
                                                }`
                                            }>
                                                {post.activitystatus}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UsersTable;
