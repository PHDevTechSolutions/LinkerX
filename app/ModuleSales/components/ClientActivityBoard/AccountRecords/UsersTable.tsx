import React, { useEffect, useState } from "react";
import { CiRead, CiCircleRemove } from "react-icons/ci";
import { AiOutlineCheckCircle, AiOutlineFire, AiOutlineSun, AiOutlineQuestionCircle } from "react-icons/ai";
import { FaRegSnowflake } from "react-icons/fa";

interface UsersCardProps {
    posts: any[];
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
    const [groupedUsers, setGroupedUsers] = useState<{ [key: string]: any[] }>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [sortedUsers, setSortedUsers] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10; // Number of items per page

    useEffect(() => {
        const grouped = posts.reduce((acc, post) => {
            (acc[post.companyname] = acc[post.companyname] || []).push(post);
            return acc;
        }, {} as { [key: string]: any[] });
        setGroupedUsers(grouped);
    }, [posts]);

    const openModal = (companyName: string) => {
        setSelectedCompany(companyName);

        // Sort users by date_created in descending order
        const sortedData = [...groupedUsers[companyName]].sort(
            (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        );

        setSortedUsers(sortedData);
        setModalOpen(true);
    };

    // Pagination Logic for Table
    const totalPages = Math.ceil(Object.keys(groupedUsers).length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentUsers = Object.keys(groupedUsers)
        .slice(indexOfFirstPost, indexOfLastPost)
        .map((key) => groupedUsers[key]);

    // Pagination Logic for Modal (sortedUsers)
    const totalModalPages = Math.ceil(sortedUsers.length / postsPerPage);
    const indexOfLastModalPost = currentPage * postsPerPage;
    const indexOfFirstModalPost = indexOfLastModalPost - postsPerPage;
    const currentModalUsers = sortedUsers.slice(indexOfFirstModalPost, indexOfLastModalPost);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "done":
                return <AiOutlineCheckCircle className="text-green-500 animate-pulse" size={20} />;
            case "cold":
                return <FaRegSnowflake className="text-blue-500 animate-spin" size={20} />;
            case "hot":
                return <AiOutlineFire className="text-red-500 animate-bounce" size={20} />;
            case "warm":
                return <AiOutlineSun className="text-orange-500 animate-ping" size={20} />;
            default:
                return <AiOutlineQuestionCircle className="text-gray-500" size={20} />;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                        <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Agent Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Number of Records</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Object.keys(groupedUsers).length > 0 ? (
                        currentUsers.map((users, index) => (
                            <tr key={index} className="border-b whitespace-nowrap">
                                <td className="px-6 py-4 text-xs">{users[0]?.companyname}</td>
                                <td className="px-6 py-4 text-xs">
                                    {users[0]?.AgentFirstname} {users[0]?.AgentLastname}
                                    <br />
                                    <span className="text-gray-900 text-[8px]">
                                        ({users[0]?.referenceid})
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs">{users[0]?.typeclient}</td>
                                <td className="px-6 py-4 text-xs">{users.length}</td>
                                <td className="px-6 py-4 text-xs">
                                    <button onClick={() => openModal(users[0]?.companyname)}
                                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-orange-300 hover:rounded-full w-full text-left flex items-center gap-1">
                                        <CiRead size={16} /> View Record
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-4 border">
                                No accounts available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination for Table */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 text-xs">
                    <button
                        className="bg-gray-200 px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    <button
                        className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-4">
                        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>
                    <button
                        className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </button>
                    <button
                        className="bg-gray-200 px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                </div>
            )}

            {/* Modal Content */}
            {modalOpen && selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999]">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="text-md font-bold">{selectedCompany} - Timeline</h2>
                            <span className="text-xs text-gray-600">{sortedUsers.length} Events</span>
                        </div>
                        {/* Modal Body: Interactive Timeline */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="relative border-l-4 border-gray-300 pl-4">
                                {currentModalUsers.map((user, index) => (
                                    <div
                                        key={index}
                                        className={`relative mb-6 cursor-pointer group transition-all duration-300 ${selectedEvent === index ? "bg-blue-100 p-3 rounded-lg" : ""}`}
                                        onClick={() => setSelectedEvent(index)}
                                    >
                                        <div className="absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md">
                                            {getStatusIcon(user.activitystatus)}
                                        </div>
                                        <div className="text-xs">
                                            <p className="text-gray-600 font-semibold">
                                                {user.startdate ? new Date(user.startdate).toLocaleString() : "N/A"} -
                                                {user.enddate ? new Date(user.enddate).toLocaleString() : "N/A"}
                                            </p>
                                            <p className="capitalize"><strong>Agent:</strong> {user.AgentFirstname} {user.AgentLastname} ({user.referenceid})</p>
                                            <p><strong>Type of Call:</strong> {user.typecall}</p>
                                            <p><strong>Status:</strong> {user.activitystatus}</p>
                                            {/* Details (Visible on Click) */}
                                            {selectedEvent === index && (
                                                <div className="mt-2 text-xs">
                                                    <p className="capitalize"><strong>Contact Person:</strong> {user.contactperson}</p>
                                                    <p><strong>Email:</strong> {user.emailaddress}</p>
                                                    <p className="capitalize"><strong>Address:</strong> {user.address}</p>
                                                    <p className="capitalize"><strong>Area:</strong> {user.area}</p>
                                                    <p><strong>Actual Sales:</strong> {user.actualsales}</p>
                                                    <p><strong>SO Amount:</strong> {user.soamount}</p>
                                                    <p><strong>Type of Activity:</strong> {user.typeactivity}</p>
                                                    <p><strong>SO Number:</strong> {user.sonumber}</p>
                                                    <p className="capitalize"><strong>Remarks:</strong> {user.remarks}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-100 border-t flex justify-end">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 border text-xs rounded flex items-center gap-1"
                            >
                                <CiCircleRemove size={20} /> Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersCard;
