import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
// Route for Alert Notification
import NotificationAlertModal from "./NotificationAlertModal";

export default function Notification({
    totalNotifCount,
    showSidebar,
    setShowSidebar,
    dropdownRef,
    sidebarRef,
    notifications,
    setNotifications,
    updateEmailStatus,
}: {
    totalNotifCount: number;
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
    notifications: any[];
    setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
    updateEmailStatus: (emailId: string) => Promise<void>;
}) {
    const [activeTab, setActiveTab] = useState<"notifications" | "messages">("notifications");
    const [loadingId, setLoadingId] = useState<string | number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState<any | null>(null);

    const formatDate = (timestamp: number) => new Date(timestamp).toLocaleString();

    const handleMarkAsRead = async (notifId: number) => {
        try {
            setLoadingId(notifId);

            const response = await fetch("/api/ModuleSales/Notification/UpdateNotifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notifId, status: "Read" }),
            });

            if (response.ok) {
                const updatedNotifications = notifications.map((notif) =>
                    notif.id === notifId ? { ...notif, status: "Read" } : notif
                );
                setNotifications(updatedNotifications);

                setTimeout(() => {
                    setNotifications((prev) => prev.filter((notif) => notif.id !== notifId));
                }, 60000);
            } else {
                console.error("Error updating notification status");
            }
        } catch (error) {
            console.error("Error marking as read:", error);
        } finally {
            setLoadingId(null);
        }
    };

    useEffect(() => {
        if (showModal && selectedNotif) {
            const audio = new Audio("/alertmessage.mp3");
            audio.play().catch((err) => console.error("Audio play failed:", err));
        }
    }, [showModal, selectedNotif]);

    return (
        <>
            {showSidebar && (
                <motion.div
                    ref={sidebarRef}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-300 shadow-lg z-[1000] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        <button onClick={() => setShowSidebar(false)}>
                            <IoIosCloseCircleOutline size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b mb-2">
                        <button
                            onClick={() => setActiveTab("notifications")}
                            className={`flex-1 text-center py-2 text-xs font-semibold ${activeTab === "notifications"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600"
                                }`}
                        >
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab("messages")}
                            className={`flex-1 text-center py-2 text-xs font-semibold ${activeTab === "messages"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600"
                                }`}
                        >
                            Messages
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-auto p-2">
                        {activeTab === "notifications" ? (
                            notifications.filter((n) => n.status === "Unread" && !n.sender).length > 0 ? (
                                <ul className="space-y-2">
                                    {notifications
                                        .filter((n) => n.status === "Unread" && !n.sender)
                                        .map((notif) => (
                                            <li
                                                key={notif.id}
                                                className={`p-3 border-b hover:bg-gray-200 text-xs text-gray-900 capitalize text-left rounded-md relative ${notif.type === "Inquiry Notification" ? "bg-yellow-200" : "bg-gray-100"
                                                    }`}
                                            >
                                                <p className="text-[10px] mt-5">{notif.message}</p>
                                                <p className="text-[10px] mt-5">Processed By {notif.fullname}</p>

                                                {notif.callback && notif.type === "Callback Notification" && (
                                                    <span className="text-[8px] mt-1 block">
                                                        {formatDate(new Date(notif.callback).getTime())}
                                                    </span>
                                                )}
                                                {notif.date_created &&
                                                    (notif.type === "Inquiry Notification" || notif.type === "Follow-Up Notification") && (
                                                        <span className="text-[8px] mt-1 block">
                                                            {formatDate(new Date(notif.date_created).getTime())}
                                                        </span>
                                                    )}

                                                <button
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                    disabled={loadingId === notif.id}
                                                    className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${notif.status === "Read"
                                                            ? "text-green-600 font-bold"
                                                            : loadingId === notif.id
                                                                ? "text-gray-500 cursor-not-allowed"
                                                                : "text-blue-600 hover:text-blue-800"
                                                        }`}
                                                >
                                                    {loadingId === notif.id ? "Loading..." : "Mark as Read"}
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p className="text-xs p-4 text-gray-500 text-center">No new notifications</p>
                            )
                        ) : notifications.filter((n) => n.status === "Pending" && n.sender).length > 0 ? (
                            <ul className="space-y-2">
                                {notifications
                                    .filter((email) => email.status === "Pending" && email.sender)
                                    .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
                                    .map((email) => {
                                        const isFromPhDev = email.sender === "phdevtechsolutions@gmail.com";
                                        const emailId = email.id.toString();
                                        return (
                                            <li
                                                key={emailId}
                                                className={`p-3 mb-2 hover:bg-blue-200 hover:text-black text-xs capitalize text-left rounded-md relative ${isFromPhDev ? "bg-black text-green-700" : "bg-blue-900 text-white"
                                                    }`}
                                            >
                                                <p className="text-[10px] mt-5 font-bold uppercase italic">Sender: {email.sender}</p>
                                                <p className="text-[10px] mt-5 font-bold uppercase italic">Subject: {email.subject}</p>
                                                <p className="text-[10px] mt-1 font-semibold">
                                                    Message: {email.message.length > 100 ? `${email.message.substring(0, 100)}...` : email.message}
                                                </p>
                                                <span className="text-[8px] mt-1 block">
                                                    {new Date(email.date_created).toLocaleString()} / Via XendMail
                                                </span>
                                                <button
                                                    onClick={() => updateEmailStatus(emailId)}
                                                    disabled={loadingId === emailId}
                                                    className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${email.status === "Read"
                                                            ? "text-green-600 font-bold"
                                                            : loadingId === emailId
                                                                ? "text-gray-500 cursor-not-allowed"
                                                                : "text-white hover:text-blue-300"
                                                        }`}
                                                >
                                                    {loadingId === emailId ? "Loading..." : "Mark as Read"}
                                                </button>
                                            </li>
                                        );
                                    })}
                            </ul>
                        ) : (
                            <div className="text-xs p-4 text-gray-500 text-center">No pending messages</div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Notification Alert Modal */}
            {showModal && selectedNotif && (
                <NotificationAlertModal
                    selectedNotif={selectedNotif}
                    onClose={() => setShowModal(false)}
                    onMarkAsRead={handleMarkAsRead}
                    formatDate={(timestamp) => new Date(timestamp).toLocaleString()}
                />
            )}
        </>
    );
}
