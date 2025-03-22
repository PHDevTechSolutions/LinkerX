import React, { useEffect, useState } from "react";
import { PiRecycle } from "react-icons/pi";
import { CiMapPin, CiRepeat, CiPen } from "react-icons/ci";

interface UsersCardProps {
    posts: any[];
    handleDelete: (postId: string) => void;
    referenceid?: string;
    updatePostStatus: (postId: string, newStatus: string) => void;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, updatePostStatus }) => {
    const [updatedUser, setUpdatedUser] = useState<any[]>([]);
    const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
    const [bulkStatus, setBulkStatus] = useState<string>("");
    const [isBulkEditVisible, setIsBulkEditVisible] = useState<boolean>(false);
    const [pinnedUsers, setPinnedUsers] = useState<Set<string>>(new Set());
    const [menuState, setMenuState] = useState<{ [key: string]: boolean }>({}); // State to track menu visibility for each user
    const [dateState, setDateState] = useState<{ [key: string]: string | null }>({}); // State to track date selections
    const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>({}); // New state to control modal visibility for each user

    useEffect(() => {
        setUpdatedUser(posts);
    }, [posts]);

    useEffect(() => {
        const savedPinnedUsers = JSON.parse(localStorage.getItem("pinnedUsers") || "[]");
        setPinnedUsers(new Set(savedPinnedUsers));
    }, []);

    const handlePin = (userId: string) => {
        setPinnedUsers((prev) => {
            const newPinned = new Set([...prev]);
            if (newPinned.has(userId)) {
                newPinned.delete(userId);
            } else {
                newPinned.add(userId);
            }
            localStorage.setItem("pinnedUsers", JSON.stringify(Array.from(newPinned)));
            return newPinned;
        });
    };

    const handleCheckboxChange = (postId: string, isChecked: boolean) => {
        setSelectedPosts((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (isChecked) {
                newSelected.add(postId);
            } else {
                newSelected.delete(postId);
            }
            return newSelected;
        });
    };

    const handleBulkUpdate = () => {
        if (!bulkStatus || selectedPosts.size === 0) {
            return;
        }

        selectedPosts.forEach((postId) => {
            updatePostStatus(postId, bulkStatus);
        });

        setSelectedPosts(new Set());
        setIsBulkEditVisible(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Backlogs":
                return "bg-yellow-200";
            case "Priority":
                return "bg-red-200";
            case "Important":
                return "bg-blue-200";
            case "Finished":
                return "bg-green-200";
            default:
                return "bg-white";
        }
    };

    const sortedPosts = (status: string) => {
        return updatedUser
            .filter((post) => post.status === status)
            .sort((a, b) => (pinnedUsers.has(b.id) ? 1 : 0) - (pinnedUsers.has(a.id) ? 1 : 0));
    };

    // Open Modal to select date
    const openModal = (userId: string) => {
        setModalVisible((prevState) => ({
            ...prevState,
            [userId]: true,
        }));
    };

    // Close Modal
    const closeModal = (userId: string) => {
        setModalVisible((prevState) => ({
            ...prevState,
            [userId]: false,
        }));
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    className="bg-gray-200 text-dark text-xs px-4 py-2 rounded flex items-center space-x-1"
                    onClick={() => setIsBulkEditVisible(!isBulkEditVisible)}
                >
                    <CiRepeat size={15} />
                    <span>Change</span>
                </button>
            </div>

            {isBulkEditVisible && (
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <label htmlFor="bulk-status" className="text-xs">Select Status for Bulk Update:</label>
                        <select
                            id="bulk-status"
                            value={bulkStatus}
                            onChange={(e) => setBulkStatus(e.target.value)}
                            className="ml-2 p-1 border rounded text-xs"
                        >
                            <option value="">Select Status</option>
                            <option value="Backlogs">Backlogs</option>
                            <option value="Priority">Priority</option>
                            <option value="Important">Important</option>
                            <option value="Finished">Finished</option>
                        </select>
                    </div>
                    <button className="bg-blue-500 text-white text-xs px-4 py-2 rounded flex items-center gap-1" onClick={handleBulkUpdate}><CiPen size={18} /> Bulk Edit</button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {["Backlogs", "Priority", "Important", "Finished"].map((status) => (
                    <div key={status} className="border rounded p-2 bg-white shadow-md relative">
                        <h4 className="text-center font-semibold text-xs mb-2 text-gray-700">{status}</h4>
                        <div>
                            {sortedPosts(status).map((user) => (
                                <div
                                    key={user.id}
                                    className={`rounded-lg shadow p-4 mb-2 border hover:bg-gray-50 capitalize transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${getStatusColor(user.status)}`}
                                >
                                    <div className="flex items-center justify-between space-x-2">
                                        {isBulkEditVisible && (
                                            <input
                                                type="checkbox"
                                                checked={selectedPosts.has(user.id)}
                                                onChange={(e) => handleCheckboxChange(user.id, e.target.checked)}
                                                className="text-xs"
                                            />
                                        )}
                                        <h3 className="font-semibold text-left text-gray-700 text-xs capitalize">{user.title}</h3>
                                        <div className="flex items-center space-x-2 ml-auto">
                                            <CiMapPin
                                                size={18}
                                                className={`cursor-pointer ${pinnedUsers.has(user.id) ? 'text-yellow-500' : 'text-gray-900'}`}
                                                onClick={() => handlePin(user.id)}
                                            />
                                        </div>
                                    </div>

                                    <p className="text-xs capitalize mt-2 text-gray-500">{user.description}</p>

                                    {pinnedUsers.has(user.id) && (
                                        <div className="text-xs text-green-500 mt-2">Pinned</div>
                                    )}

                                    {/* Bell menu */}
                                    {menuState[user.id] && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded border p-2">
                                            <button className="block w-full text-left text-xs py-1 px-2 hover:bg-gray-200">Tomorrow</button>
                                            <button
                                                className="block w-full text-left text-xs py-1 px-2 hover:bg-gray-200"
                                                onClick={() => openModal(user.id)} // Open modal when "Pick a Date" is clicked
                                            >
                                                Pick a Date
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {updatedUser.filter((post) => post.status === status).length === 0 && (
                                <div className="text-center py-2 text-xs text-gray-500">No {status}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersCard;
