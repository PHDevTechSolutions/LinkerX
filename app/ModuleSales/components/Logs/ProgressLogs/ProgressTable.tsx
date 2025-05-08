import React, { useEffect, useState, useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiClock2, CiExport } from "react-icons/ci";
import ExcelJS from "exceljs";

interface OutboundTableProps {
    posts: any[];
}

const OutboundTable: React.FC<OutboundTableProps> = ({ posts }) => {
    const [agentFilter, setAgentFilter] = useState<string>("");
    const [idNumberFilter, setIdNumberFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [startDateFilter, setStartDateFilter] = useState<string>("");  // Added start date filter
    const [endDateFilter, setEndDateFilter] = useState<string>("");      // Added end date filter
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [postsPerPage, setPostsPerPage] = useState<number>(10); // Default to 10 posts per page

    const agentNumbers = useMemo(
        () => Array.from(new Set(posts.map((post) => post.agent_fullname))),
        [posts]
    );
    const idNumbers = useMemo(
        () => Array.from(new Set(posts.map((post) => post.tsm_fullname))),
        [posts]
    );
    const statuses = useMemo(
        () => Array.from(new Set(posts.map((post) => post.status))),
        [posts]
    );

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const dateFinished = new Date(post.start_date);
            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;

            const isDateInRange =
                (!startDate || dateFinished >= startDate) &&
                (!endDate || dateFinished <= endDate);

            return (
                (agentFilter ? post.agent_fullname === agentFilter : true) &&
                (idNumberFilter ? post.tsm_fullname === idNumberFilter : true) &&
                (statusFilter ? post.status === statusFilter : true) &&
                isDateInRange
            );
        });
    }, [posts, agentFilter, idNumberFilter, statusFilter, startDateFilter, endDateFilter]);

    const sortedPosts = useMemo(() => {
        return [...filteredPosts].sort((a, b) => {
            const dateA = a.start_date ? new Date(a.start_date) : new Date(0);
            const dateB = b.start_date ? new Date(b.start_date) : new Date(0);
            return dateB.getTime() - dateA.getTime(); // Sorting in descending order
        });
    }, [filteredPosts]);


    // Pagination logic
    const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
    const currentPosts = useMemo(() => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        return sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
    }, [sortedPosts, currentPage, postsPerPage]);

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Progress");

        worksheet.columns = [
            { header: "Reference Number", key: "activity_id", width: 20 },
            { header: "Agent Name", key: "agent_fullname", width: 20 },
            { header: "TSM Name", key: "tsm_fullname", width: 20 },
            { header: "Company Name", key: "account_name", width: 20 },
            { header: "Contact Person", key: "contact_person", width: 20 },
            { header: "Contact Number", key: "contact_number", width: 20 },
            { header: "Email Address", key: "email", width: 20 },
            { header: "Type Client.", key: "type_of_client", width: 20 },
            { header: "Address", key: "address", width: 20 },
            { header: "Area", key: "area", width: 20 },
            { header: "Project Name", key: "project_name", width: 30 },
            { header: "Project Category", key: "project_category", width: 20 },
            { header: "Project Type", key: "project_type", width: 20 },
            { header: "Source", key: "source", width: 20 },
            { header: "Type Activity", key: "type_of_activity", width: 20 },
            { header: "Callback", key: "callback", width: 20 },
            { header: "Call Status", key: "call_status", width: 20 },
            { header: "Type Call", key: "type_of_call", width: 20 },
            { header: "Remarks", key: "remarks", width: 20 },
            { header: "Quotation Number", key: "quotation_number", width: 20 },
            { header: "Quotation Amount", key: "project_estimate", width: 20 },
            { header: "SO Number", key: "sales_order_number", width: 20 },
            { header: "SO Amount", key: "sales_order_amount", width: 20 },
            { header: "Start Date", key: "start_date", width: 20 },
            { header: "End Date", key: "end_date", width: 20 },
            { header: "Activity Status", key: "status", width: 20 },
            { header: "Actual Sales", key: "actual_sales", width: 20 },
        ];

        sortedPosts.forEach((post) => {
            worksheet.addRow({
                activity_id: post.activity_id,
                agent_fullname: post.agent_fullname,
                tsm_fullname: post.tsm_fullname,
                account_name: post.account_name,
                contact_person: post.contact_person,
                contact_number: post.contact_number,
                email: post.email,
                type_of_client: post.type_of_client,
                address: post.address,
                area: post.area,
                project_name: post.project_name,
                project_category: post.project_category,
                project_type: post.project_type,
                source: post.source,
                type_of_activity: post.type_of_activity,
                callback: post.callback,
                call_status: post.call_status,
                type_of_call: post.type_of_call,
                remarks: post.remarks,
                quotation_number: post.quotation_number,
                project_estimate: post.project_estimate,
                sales_order_number: post.sales_order_number,
                sales_order_amount: post.sales_order_amount,
                start_date: post.start_date,
                end_date: post.end_date,
                status: post.status,
                actual_sales: post.actual_sales,
            });
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Progress.xlsx";
            link.click();
        });
    };

    // Handle page changes
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle posts per page change
    const handlePostsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPostsPerPage(Number(event.target.value));
    };

    return (
        <div className="overflow-x-auto">
            {/* Filters */}
            <div className="flex gap-4 pb-2">
                <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="px-3 py-2 border rounded text-xs"
                >
                    <option value="">Filter by Agent Number</option>
                    {agentNumbers.map((agentNumber) => (
                        <option key={agentNumber} value={agentNumber} className="uppercase">
                            {agentNumber}
                        </option>
                    ))}
                </select>

                <select
                    value={idNumberFilter}
                    onChange={(e) => setIdNumberFilter(e.target.value)}
                    className="px-3 py-2 border rounded text-xs"
                >
                    <option value="">Filter by ID Number</option>
                    {idNumbers.map((idNumber) => (
                        <option key={idNumber} value={idNumber}>
                            {idNumber}
                        </option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded text-xs"
                >
                    <option value="">Filter by Status</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>

                {/* Date Range Filter */}
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="px-3 py-2 border rounded text-xs"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        className="px-3 py-2 border rounded text-xs"
                    />
                </div>

                <div className="text-xs">
                    <select
                        value={postsPerPage}
                        onChange={handlePostsPerPageChange}
                        className="px-3 py-2 border rounded text-xs"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={500}>500</option>
                        <option value={1000}>1000</option>
                        <option value={5000}>5000</option>
                        <option value={10000}>10000</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handlePrevPage}
                        className={`px-3 py-1 text-xs ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100"
                            }`}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <div className="text-sm text-gray-700">
                        {currentPage}
                    </div>

                    <button
                        onClick={handleNextPage}
                        className={`px-3 py-1 text-xs ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100"
                            }`}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Export Button */}
            <button
                onClick={exportToExcel}
                className="mb-4 px-4 py-2 bg-gray-100 shadow-sm text-dark text-xs flex items-center gap-1 rounded"
            >
                <CiExport size={20} /> Export to Excel
            </button>
            <div className="text-xs mb-2 text-gray-700">
                {`Showing ${currentPosts.length} of ${sortedPosts.length} entries`}
            </div>


            {/* Table */}
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                        <th className="px-6 py-4 font-semibold text-gray-700">Reference Number</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Agent Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">TSM Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Type Client</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Project Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Project Category</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Project Type</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Source</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Type Activity</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Callback</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Call Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Type Call</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Quotation Number</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Quotation Amount</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">SO Number</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">SO Amount</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Start Date</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">End Date</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Activity Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Actual Sales</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {currentPosts.map((post, index) => {
                        const borderLeftClass =
                            post.status === "Active"
                                ? "border-l-4 border-green-400"
                                : post.status === "Used"
                                    ? "border-l-4 border-blue-400"
                                    : post.status === "Inactive"
                                        ? "border-l-4 border-red-400"
                                        : post.status === "For Deletion"
                                            ? "border-l-4 border-rose-400"
                                            : post.status === "Remove"
                                                ? "border-l-4 border-rose-900"
                                                : post.status === "Approve For Deletion"
                                                    ? "border-l-4 border-sky-400"
                                                    : "";

                        const hoverClass =
                            post.status === "Active"
                                ? "hover:bg-green-100 hover:text-green-900"
                                : post.status === "Used"
                                    ? "hover:bg-blue-100 hover:text-blue-900"
                                    : post.status === "Inactive"
                                        ? "hover:bg-red-100 hover:text-red-900"
                                        : post.status === "For Deletion"
                                            ? "hover:bg-rose-100 hover:text-rose-900"
                                            : post.status === "Remove"
                                                ? "hover:bg-rose-200 hover:text-rose-900"
                                                : post.status === "Approve For Deletion"
                                                    ? "hover:bg-sky-100 hover:text-sky-900"
                                                    : "";

                        return (

                            <tr key={post._id || index} className={`border-b whitespace-nowrap ${hoverClass}`}>
                                <td className="p-3 border whitespace-nowrap">{post.activity_id}</td>
                                <td className="p-3 border whitespace-nowrap capitalize">{post.agent_fullname}</td>
                                <td className="p-3 border whitespace-nowrap capitalize">{post.tsm_fullname}</td>
                                <td className="p-3 border whitespace-nowrap">{post.account_name}</td>
                                <td className="p-3 border whitespace-nowrap"></td>
                                <td className="p-3 border whitespace-nowrap"></td>
                                <td className="p-3 border whitespace-nowrap"></td>
                                <td className="p-3 border whitespace-nowrap capitalize">{post.type_of_client}</td>
                                <td className="p-3 border whitespace-nowrap"></td>
                                <td className="p-3 border whitespace-nowrap"></td>
                                <td className="p-3 border whitespace-nowrap"></td>
                                <td className="p-3 border whitespace-nowrap"></td>
                                <td className="p-3 border whitespace-nowrap"></td>
                                <td className="p-3 border whitespace-nowrap"></td>
                                <td className="p-3 border whitespace-nowrap">{post.type_of_activity}</td>
                                <td className="p-3 border whitespace-nowrap">{post.callback}</td>
                                <td className="p-3 border whitespace-nowrap">{post.call_status}</td>
                                <td className="p-3 border whitespace-nowrap">{post.type_of_call}</td>
                                <td className="p-3 border whitespace-nowrap capitalize">{post.remarks}</td>
                                <td className="p-3 border whitespace-nowrap">{post.quotation_number}</td>
                                <td className="p-3 border whitespace-nowrap">{post.project_estimate}</td>
                                <td className="p-3 border whitespace-nowrap">{post.sales_order_number}</td>
                                <td className="p-3 border whitespace-nowrap">{post.sales_order_amount}</td>
                                <td className="p-3 border whitespace-nowrap">{post.start_date}</td>
                                <td className="p-3 border whitespace-nowrap">{post.end_date}</td>
                                <td className="p-3 border whitespace-nowrap">{post.status}</td>
                                <td className="p-3 border whitespace-nowrap">{post.actual_sales}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default OutboundTable;
