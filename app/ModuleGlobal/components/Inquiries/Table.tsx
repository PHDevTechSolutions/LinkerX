import React from "react";

interface TableProps {
    currentPosts: any[];
    handleEdit: (post: any) => void;
    confirmDelete: (postId: string) => void;
}

const Table: React.FC<TableProps> = ({ currentPosts, handleEdit, confirmDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                        <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Sender ID</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Sales Agent</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">TSM</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Ticket Reference Number</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Wrap-Up</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Inquiries</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Date Created</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Date Updated</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {currentPosts.map((post) => (
                        <tr key={post._id} className="border-b whitespace-nowrap">
                            <td className="px-6 py-4 text-xs">
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="px-3 py-1 ml-2 text-[10px] text-white bg-blue-500 hover:bg-blue-800 hover:rounded-full rounded-md"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => confirmDelete(post._id)}
                                    className="px-3 py-1 ml-2 text-[10px] text-white bg-red-500 hover:bg-red-800 hover:rounded-full rounded-md"
                                >
                                    Delete
                                </button>
                            </td>
                            <td className="px-6 py-4 text-xs">{post.csragent}</td>
                            <td className="px-6 py-4 text-xs">{post.referenceid} / <span className="capitalize">{post.salesagentname}</span></td>
                            <td className="px-6 py-4 text-xs">{post.tsm}</td>
                            <td className="px-6 py-4 text-xs">{post.ticketreferencenumber}</td>
                            <td className="px-6 py-4 text-xs">{post.companyname}</td>
                            <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                            <td className="px-6 py-4 text-xs">{post.contactnumber}</td>
                            <td className="px-6 py-4 text-xs">{post.emailaddress}</td>
                            <td className="px-6 py-4 text-xs">{post.typeclient}</td>
                            <td className="px-6 py-4 text-xs capitalize">{post.address}</td>
                            <td className="px-6 py-4 text-xs">{post.status}</td>
                            <td className="px-6 py-4 text-xs">{post.wrapup}</td>
                            <td className="px-6 py-4 text-xs capitalize">{post.inquiries}</td>
                            <td className="px-6 py-4 text-xs">{post.date_created}</td>
                            <td className="px-6 py-4 text-xs">{post.date_updated}</td>
                        </tr>
                    ))}
                    {currentPosts.length === 0 && (
                        <tr>
                            <td colSpan={3} className="text-center px-4 py-4">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
