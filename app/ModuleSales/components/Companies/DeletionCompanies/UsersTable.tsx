import React, { useEffect, useState, useCallback, } from "react";
import { Menu } from "@headlessui/react";
import { CiEdit, CiMenuKebab } from "react-icons/ci";

interface UsersCardProps {
    posts: any[];
    handleEdit: (post: any) => void;
    referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, referenceid }) => {
    const [updatedUser, setUpdatedUser] = useState<any[]>([]);

    useEffect(() => {
        setUpdatedUser(posts);
    }, [posts]);


    return (
        <div className="mb-4">
            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Remarks / Reason</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {updatedUser.length > 0 ? (
                            updatedUser.map((post) => {
                                const borderLeftClass =
                                    post.status === "For Deletion"
                                        ? "border-l-4 border-yellow-400"
                                        : post.status === "Approve For Deletion"
                                            ? "border-l-4 border-green-500"
                                        : post.status === "Remove"
                                            ? "border-l-4 border-gray-400"    
                                            : "";

                                const hoverClass =
                                    post.status === "For Deletion"
                                        ? "hover:bg-yellow-100 hover:text-yellow-900"
                                        : post.status === "Approve For Deletion"
                                            ? "hover:bg-green-100 hover:text-blue-900"
                                        : post.status === "Remove"
                                            ? "hover:bg-gray-100 hover:text-blue-900"    
                                            : "";

                                return (
                                    <tr key={post.id} className={`border-b whitespace-nowrap ${hoverClass}`}>
                                        <td className={`px-6 py-4 text-xs uppercase ${borderLeftClass}`}>
                                            <span
                                                className={`px-2 py-1 text-[8px] font-semibold rounded-full ${post.status === "For Deletion"
                                                    ? "bg-yellow-400 text-gray-900"
                                                    : post.status === "Remove"
                                                        ? "bg-gray-100 text-gray-700"
                                                        : "bg-green-500 text-black"
                                                    }`}
                                            >
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {post.status !== "Approve For Deletion" && (
                                            <button className="block px-4 py-2 text-xs text-gray-700 text-left flex items-center gap-1" onClick={() => handleEdit(post)}><CiEdit /> Edit</button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                                        <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                                        <td className="px-6 py-4 text-xs">{post.contactnumber}</td>
                                        <td className="px-6 py-4 text-xs">{post.emailaddress}</td>
                                        <td className="px-6 py-4 text-xs capitalize">{post.address}</td>
                                        <td className="px-6 py-4 text-xs capitalize">{post.area}</td>
                                        <td className="px-6 py-4 text-xs">{post.typeclient}</td>
                                        <td className="px-6 py-4 text-xs capitalize">{post.remarks}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center text-xs py-4 text-gray-500">No record available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersCard;
