import React, { useEffect, useState, useCallback, } from "react";
import { Menu } from "@headlessui/react";
import { CiEdit, CiMenuKebab } from "react-icons/ci";

interface UsersCardProps {
    posts: any[];
    handleEdit: (post: any) => void;
    referenceid?: string;
    Role: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, referenceid, Role }) => {
    const [updatedUser, setUpdatedUser] = useState<any[]>([]);
    const [bulkEditMode, setBulkEditMode] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [newStatus, setnewStatus] = useState("");

    useEffect(() => {
        setUpdatedUser(posts);
    }, [posts]);

    const toggleBulkEditMode = useCallback(() => {
        setBulkEditMode((prev) => !prev);
        setSelectedUsers(new Set());
        setnewStatus("");
    }, []);

    const handleBulkEdit = useCallback(async () => {
        if (selectedUsers.size === 0 || !newStatus) return;
        try {
            const response = await fetch(`/api/ModuleSales/Companies/CompanyAccounts/Bulk-Edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIds: Array.from(selectedUsers), status: newStatus }),
            });
            if (response.ok) {
                setUpdatedUser((prev) => prev.map((user) =>
                    selectedUsers.has(user.id) ? { ...user, status: newStatus } : user
                ));
                setSelectedUsers(new Set());
                setBulkEditMode(false);
            } else {
                console.error("Failed to update users");
            }
        } catch (error) {
            console.error("Error updating users:", error);
        }
    }, [selectedUsers, newStatus]);


    const handleSelectAll = useCallback(() => {
        if (selectedUsers.size === updatedUser.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(updatedUser.map((user) => user.id)));
        }
    }, [selectedUsers, updatedUser]);

    const handleSelectUser = useCallback((userId: string) => {
        setSelectedUsers((prev) => {
            const newSelection = new Set(prev);
            newSelection.has(userId) ? newSelection.delete(userId) : newSelection.add(userId);
            return newSelection;
        });
    }, []);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);

        // Use UTC getters instead of local ones to prevent timezone shifting.
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // if hour is 0, display as 12
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        // Use toLocaleDateString with timeZone 'UTC' to format the date portion
        const formattedDateStr = date.toLocaleDateString('en-US', {
            timeZone: 'UTC',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        // Return combined date and time string
        return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
    };

    return (
        <div className="mb-4">
            {/* Bulk Action Buttons */}
            <div className="flex gap-2 mb-3">
                <button onClick={toggleBulkEditMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-400 hover:text-white">
                    <CiEdit size={16} />
                    {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
                </button>
            </div>

            {/* Bulk Action Panel */}
            {(bulkEditMode) && (
                <div className="mb-4 p-3 bg-gray-100 rounded-md text-xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input type="checkbox" checked={selectedUsers.size === updatedUser.length && updatedUser.length > 0} onChange={handleSelectAll} className="w-4 h-4" />
                            <span className="ml-2">Select All</span>
                            <span className="ml-4 font-semibold text-gray-700">Selected: {selectedUsers.size} / {updatedUser.length}</span>
                        </div>

                        {bulkEditMode && (
                            <div className="flex items-center gap-2">
                                <select value={newStatus} onChange={(e) => setnewStatus(e.target.value)} className="px-2 py-1 border rounded-md">
                                    <option value="">Select Status</option>
                                    <option value="Used">Used</option>
                                </select>
                                <button onClick={handleBulkEdit} className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500 text-xs" disabled={!newStatus}>Apply Changes</button>
                            </div>
                        )}
                    </div>
                    <p className="text-xs mt-2 text-gray-600">
                        This section allows you to <strong>update the status</strong> of selected companies from <strong>Inactive</strong> to <strong>Active</strong>.
                        First, select the companies you want to update. Then, choose the new status from the dropdown list (either "Inactive" or "Active").
                        Finally, click the <strong>Apply Changes</strong> button to update the selected records in bulk. This feature makes it easy to manage and update company statuses efficiently.
                    </p>
                </div>
            )}

            {/* Users Table */}
            <div className="mb-4 overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                            <th className="px-6 py-4 font-semibold text-gray-700"></th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            {Role !== "Special Access" && (
                            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                            )}
                            <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {updatedUser.length > 0 ? (
                            updatedUser.map((post) => {
                                const borderLeftClass =
                                    post.status === "Inactive"
                                        ? "border-l-4 border-red-400"
                                        : post.status === "Used"
                                            ? "border-l-4 border-blue-400"
                                            : "";

                                const hoverClass =
                                    post.status === "Active"
                                        ? "hover:bg-green-100 hover:text-green-900"
                                        : post.status === "Used"
                                            ? "hover:bg-blue-100 hover:text-blue-900"
                                            : "";

                                return (
                                    <tr key={post.id} className={`border-b whitespace-nowrap ${hoverClass}`}>
                                        <td className={`px-6 py-4 text-xs ${borderLeftClass}`}>
                                            {(bulkEditMode) && (
                                                <input type="checkbox" checked={selectedUsers.has(post.id)} onChange={() => handleSelectUser(post.id)} className="w-4 h-4" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <span
                                                className={`px-2 py-1 text-[8px] font-semibold rounded-full whitespace-nowrap ${post.status === "Inactive"
                                                    ? "bg-red-400 text-gray-100"
                                                    : post.status === "Used"
                                                        ? "bg-blue-400 text-gray-100"
                                                        : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {post.status}
                                            </span>
                                        </td>
                                        {Role !== "Special Access" && (
                                        <td className="px-6 py-4 text-xs">
                                            <button
                                                className="block px-4 py-2 text-xs text-gray-700 hover:bg-orange-300 hover:rounded-full w-full text-left flex items-center gap-1"
                                                onClick={() => handleEdit(post)}
                                            >
                                                <CiEdit /> Edit
                                            </button>
                                        </td>
                                        )}
                                        <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                                        <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                                        <td className="px-6 py-4 text-xs capitalize">{post.contactnumber}</td>
                                        <td className="px-6 py-4 text-xs">{post.emailaddress}</td>
                                        <td className="px-6 py-4 text-xs capitalize">{post.address}</td>
                                        <td className="px-6 py-4 text-xs capitalize">{post.area}</td>
                                        <td className="px-6 py-4 text-xs">{post.typeclient}</td>
                                        <td className="px-4 py-2 text-xs align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-white bg-blue-400 p-2 rounded">Uploaded: {formatDate(new Date(post.date_created).getTime())}</span>
                                                <span className="text-white bg-green-500 p-2 rounded">Updated: {formatDate(new Date(post.date_updated).getTime())}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={11} className="p-4 text-center text-xs text-gray-500">No record available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersCard;
