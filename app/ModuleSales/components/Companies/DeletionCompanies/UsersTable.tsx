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
                <table className="min-w-full bg-white border border-gray-200 text-xs">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">Company Name</th>
                            <th className="p-2 border">Contact Person</th>
                            <th className="p-2 border">Contact Number</th>
                            <th className="p-2 border">Email Address</th>
                            <th className="p-2 border">Address</th>
                            <th className="p-2 border">Area</th>
                            <th className="p-2 border">Type of Client</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Remarks / Reason</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedUser.length > 0 ? (
                            updatedUser.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 capitalize transition-all duration-200 ease-in-out transform hover:scale-[1.02]">
                                    <td className="p-2 border">{post.companyname}</td>
                                    <td className="p-2 border">{post.contactperson}</td>
                                    <td className="p-2 border">{post.contactnumber}</td>
                                    <td className="p-2 border lowercase">{post.emailaddress}</td>
                                    <td className="p-2 border">{post.address}</td>
                                    <td className="p-2 border">{post.area}</td>
                                    <td className="p-2 border">{post.typeclient}</td>
                                    <td className="p-2 border">
                                        <span
                                            className={`px-2 py-1 text-[8px] font-semibold rounded-full ${post.status === "For Deletion"
                                                ? "bg-yellow-400 text-gray-900"
                                                : post.status === "Remove"
                                                    ? "bg-gray-100 text-gray-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="p-2 border capitalize">{post.remarks}</td>
                                    <td className="p-2 border">
                                        {post.status !== "Approve For Deletion" && (
                                            <Menu as="div" className="inline-block align-item-center text-center">
                                                <div>
                                                    <Menu.Button>
                                                        <CiMenuKebab />
                                                    </Menu.Button>
                                                </div>
                                                <Menu.Items className="absolute right-0 mt-2 min-w-[160px] bg-white shadow-md rounded-md z-10">
                                                    <button className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleEdit(post)}>Edit</button>
                                                </Menu.Items>
                                            </Menu>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="p-4 text-center text-gray-500">No accounts available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersCard;
