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
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [newTypeClient, setNewTypeClient] = useState("");
    const [activeTab, setActiveTab] = useState("table");

    useEffect(() => {
        setUpdatedUser(posts);
    }, [posts]);

    const toggleBulkDeleteMode = useCallback(() => {
        setBulkDeleteMode((prev) => !prev);
        setSelectedUsers(new Set());
    }, []);

    const toggleBulkEditMode = useCallback(() => {
        setBulkEditMode((prev) => !prev);
        setSelectedUsers(new Set());
        setNewTypeClient("");
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
            const response = await fetch(`/api/Data/Applications/Taskflow/Progress/BulkDelete`, {
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
            const response = await fetch(`/api/Data/Applications/Taskflow/Progress/BulkEdit`, {
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

    const totalQuotation = updatedUser.reduce(
        (sum, user) => sum + (parseFloat(user.quotationamount) || 0),
        0
    );

    const totalSOAmount = updatedUser.reduce(
        (sum, user) => sum + (parseFloat(user.soamount) || 0),
        0
    );

    const totalActualSales = updatedUser.reduce(
        (sum, user) => sum + (parseFloat(user.actualsales) || 0),
        0
    );

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
            updatedUser={updatedUser}
            bulkDeleteMode={bulkDeleteMode}
            bulkEditMode={bulkEditMode}
            selectedUsers={selectedUsers}
            handleSelectUser={handleSelectUser}
            handleEdit={handleEdit}
            formatDate={formatDate}
            statusColors={statusColors}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            toggleBulkDeleteMode={toggleBulkDeleteMode}
            toggleBulkEditMode={toggleBulkEditMode}
            handleBulkDelete={handleBulkDelete}
            handleBulkEdit={handleBulkEdit}
            handleSelectAll={handleSelectAll}
            newTypeClient={newTypeClient}
            setNewTypeClient={setNewTypeClient}
            totalQuotation={totalQuotation}
            totalSOAmount={totalSOAmount}
            totalActualSales={totalActualSales}
        />
    );
};

export default Main;
