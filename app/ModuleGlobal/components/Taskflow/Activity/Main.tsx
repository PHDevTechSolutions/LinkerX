import React, { useEffect, useState, useCallback } from "react";
import SubMain from "./SubMain";

interface MainProps {
    posts: any[];
    handleEdit: (post: any) => void;
}

const Main: React.FC<MainProps> = ({ posts, handleEdit }) => {
    const [updatedUser, setUpdatedUser] = useState<any[]>([]);
    const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
    const [bulkEditMode, setBulkEditMode] = useState(false);
    const [bulkTransferMode, setBulkTransferMode] = useState(false);
    const [bulkTransferTSAMode, setBulkTransferTSAMode] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [tsmList, setTsmList] = useState<any[]>([]);
    const [selectedTsm, setSelectedTsm] = useState("");
    const [tsaList, setTsaList] = useState<any[]>([]);
    const [selectedTsa, setSelectedTsa] = useState("");
    const [newTypeClient, setNewTypeClient] = useState("");
    const [activeTab, setActiveTab] = useState("table");

    useEffect(() => {
        setUpdatedUser(posts);
    }, [posts]);

    useEffect(() => {
        if (bulkTransferMode) {
            fetch("/api/fetchtsm?Role=Territory Sales Manager")
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setTsmList(data);
                    } else {
                        console.error("Invalid TSM list format:", data);
                        setTsmList([]);
                    }
                })
                .catch((err) => console.error("Error fetching TSM list:", err));
        }
    }, [bulkTransferMode]);

    useEffect(() => {
        if (bulkTransferTSAMode) {
            fetch("/api/fetchtsa?Role=Territory Sales Associate")
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setTsaList(data);
                    } else {
                        console.error("Invalid TSM list format:", data);
                        setTsaList([]);
                    }
                })
                .catch((err) => console.error("Error fetching TSM list:", err));
        }
    }, [bulkTransferTSAMode]);

    const toggleBulkDeleteMode = useCallback(() => {
        setBulkDeleteMode((prev) => !prev);
        setSelectedUsers(new Set());
    }, []);

    const toggleBulkEditMode = useCallback(() => {
        setBulkEditMode((prev) => !prev);
        setSelectedUsers(new Set());
        setNewTypeClient("");
    }, []);

    const toggleBulkTransferMode = useCallback(() => {
        setBulkTransferMode((prev) => !prev);
        setSelectedUsers(new Set());
        setSelectedTsm("");
    }, []);

    const toggleBulkTransferTSAMode = useCallback(() => {
        setBulkTransferTSAMode((prev) => !prev);
        setSelectedUsers(new Set());
        setSelectedTsa("");
    }, []);

    const handleSelectUser = useCallback((userId: string) => {
        setSelectedUsers((prev) => {
            const newSelection = new Set(prev);
            newSelection.has(userId) ? newSelection.delete(userId) : newSelection.add(userId);
            return newSelection;
        });
    }, []);

    const handleBulkDelete = useCallback(async () => {
        if (selectedUsers.size === 0) return;
        const confirmDelete = window.confirm("Are you sure you want to delete the selected users?");
        if (!confirmDelete) return;
        try {
            const response = await fetch(`/api/ModuleSales/UserManagement/ActivityLogs/Bulk-Delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIds: Array.from(selectedUsers) }),
            });
            if (response.ok) {
                setUpdatedUser((prev) => prev.filter((user) => !selectedUsers.has(user.id)));
                setSelectedUsers(new Set());
                setBulkDeleteMode(false);
            } else {
                console.error("Failed to delete users");
            }
        } catch (error) {
            console.error("Error deleting users:", error);
        }
    }, [selectedUsers]);

    const handleBulkEdit = useCallback(async () => {
        if (selectedUsers.size === 0 || !newTypeClient) return;
        try {
            const response = await fetch(`/api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIds: Array.from(selectedUsers), typeclient: newTypeClient }),
            });
            if (response.ok) {
                setUpdatedUser((prev) => prev.map((user) =>
                    selectedUsers.has(user.id) ? { ...user, typeclient: newTypeClient } : user
                ));
                setSelectedUsers(new Set());
                setBulkEditMode(false);
            } else {
                console.error("Failed to update users");
            }
        } catch (error) {
            console.error("Error updating users:", error);
        }
    }, [selectedUsers, newTypeClient]);

    const handleSelectAll = useCallback(() => {
        if (selectedUsers.size === updatedUser.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(updatedUser.map((user) => user.id)));
        }
    }, [selectedUsers, updatedUser]);

    const handleBulkTransfer = useCallback(async () => {
        if (selectedUsers.size === 0 || !selectedTsm) return;
        try {
            const response = await fetch(`/api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Transfer`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIds: Array.from(selectedUsers), tsmReferenceID: selectedTsm }),
            });
            if (response.ok) {
                setSelectedUsers(new Set());
                setBulkTransferMode(false);
            } else {
                console.error("Failed to transfer users");
            }
        } catch (error) {
            console.error("Error transferring users:", error);
        }
    }, [selectedUsers, selectedTsm]);

    const handleBulkTSATransfer = useCallback(async () => {
        if (selectedUsers.size === 0 || !selectedTsa) return;
        try {
            const response = await fetch(`/api/ModuleSales/UserManagement/CompanyAccounts/Bulk-Transfer-TSA`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIds: Array.from(selectedUsers), tsaReferenceID: selectedTsa }),
            });
            if (response.ok) {
                setSelectedUsers(new Set());
                setBulkTransferTSAMode(false);
            } else {
                console.error("Failed to transfer users");
            }
        } catch (error) {
            console.error("Error transferring users:", error);
        }
    }, [selectedUsers, selectedTsa]);

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

    const statusColors: Record<string, string> = {
        "On Progress": "bg-yellow-200 text-black",
        Assisted: "bg-blue-400 text-white",
        Paid: "bg-green-500 text-white",
        Delivered: "bg-cyan-400 text-white",
        Collected: "bg-indigo-500 text-white",
        "Quote-Done": "bg-slate-500 text-white",
        "SO-Done": "bg-purple-500 text-white",
        Cancelled: "bg-red-500 text-white",
        Loss: "bg-red-800 text-white",
        "Client Visit": "bg-orange-500 text-white",
        "Site Visit": "bg-yellow-500 text-black",
        "On Field": "bg-teal-500 text-white",
        "Assisting other Agents Client": "bg-blue-300 text-white",
        "Coordination of SO to Warehouse": "bg-green-300 text-white",
        "Coordination of SO to Orders": "bg-green-400 text-white",
        "Updating Reports": "bg-indigo-300 text-white",
        "Email and Viber Checking": "bg-purple-300 text-white",
        "1st Break": "bg-yellow-300 text-black",
        "Client Meeting": "bg-orange-300 text-white",
        "Coffee Break": "bg-amber-300 text-black",
        "Group Meeting": "bg-cyan-300 text-black",
        "Last Break": "bg-yellow-400 text-black",
        "Lunch Break": "bg-red-300 text-black",
        "TSM Coaching": "bg-pink-300 text-white",
    };

    return (
        <SubMain
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            updatedUser={updatedUser}
            selectedUsers={selectedUsers}
            handleSelectUser={handleSelectUser}
            handleEdit={handleEdit}
            formatDate={formatDate}
            statusColors={statusColors}
            bulkDeleteMode={bulkDeleteMode}
            bulkEditMode={bulkEditMode}
            bulkTransferMode={bulkTransferMode}
            bulkTransferTSAMode={bulkTransferTSAMode}
            toggleBulkDeleteMode={toggleBulkDeleteMode}
            toggleBulkEditMode={toggleBulkEditMode}
            toggleBulkTransferMode={toggleBulkTransferMode}
            toggleBulkTransferTSAMode={toggleBulkTransferTSAMode}
            handleBulkDelete={handleBulkDelete}
            handleBulkEdit={handleBulkEdit}
            handleSelectAll={handleSelectAll}
            tsmList={tsmList}
            tsaList={tsaList}
            selectedTsm={selectedTsm}
            selectedTsa={selectedTsa}
            setSelectedTsm={setSelectedTsm}
            setSelectedTsa={setSelectedTsa}
            handleBulkTransfer={handleBulkTransfer}
            handleBulkTSATransfer={handleBulkTSATransfer}
            newTypeClient={newTypeClient}
            setNewTypeClient={setNewTypeClient}
        />
    );
};

export default Main;
