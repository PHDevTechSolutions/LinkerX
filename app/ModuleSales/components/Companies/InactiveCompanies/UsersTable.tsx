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

    return (
        <div className="mb-4">
            {/* Bulk Action Buttons */}
            <div className="flex gap-2 mb-3">
                <button onClick={toggleBulkEditMode} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-900 hover:text-white">
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
                                <button onClick={handleBulkEdit} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs" disabled={!newStatus}>Apply Changes</button>
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
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border"></th>
                            <th className="p-2 border">Company Name</th>
                            <th className="p-2 border">Contact Person</th>
                            <th className="p-2 border">Contact Number</th>
                            <th className="p-2 border">Email Address</th>
                            <th className="p-2 border">Address</th>
                            <th className="p-2 border">Area</th>
                            <th className="p-2 border">Type of Client</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedUser.length > 0 ? (
                            updatedUser.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 capitalize transition-all duration-200 ease-in-out transform hover:scale-[1.02]">
                                    <td className="p-2 border text-center">
                                        {(bulkEditMode) && (
                                            <input type="checkbox" checked={selectedUsers.has(post.id)} onChange={() => handleSelectUser(post.id)} className="w-4 h-4" />
                                        )}
                                    </td>
                                    <td className="p-2 border">{post.companyname}</td>
                                    <td className="p-2 border">{post.contactperson}</td>
                                    <td className="p-2 border">{post.contactnumber}</td>
                                    <td className="p-2 border lowercase">{post.emailaddress}</td>
                                    <td className="p-2 border">{post.address}</td>
                                    <td className="p-2 border">{post.area}</td>
                                    <td className="p-2 border">{post.typeclient}</td>
                                    <td className="p-2 border">{post.status}</td>
                                    <td className="p-2 border">
                                        <Menu as="div" className="relative inline-block align-item-center text-center">
                                            <div>
                                                <Menu.Button>
                                                    <CiMenuKebab />
                                                </Menu.Button>
                                            </div>
                                            <Menu.Items className="absolute right-0 mt-2 min-w-[160px] bg-white shadow-md rounded-md z-10">
                                                <button className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleEdit(post)}>Edit</button>
                                            </Menu.Items>
                                        </Menu>
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
