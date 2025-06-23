import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
// Route for Alert Modal
import NotificationAlertModal from "./NotificationAlertModal";

function Spinner() {
    return (
        <svg
            className="animate-spin h-5 w-5 text-orange-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
            role="img"
        >
            <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
    );
}

const groupByDate = (items: any[]) => {
    const groups: Record<string, any[]> = {};
    items.forEach((item) => {
        const date = new Date(item.date_created);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        let label = date.toDateString();

        if (date >= today) label = "Today";
        else if (date >= yesterday && date < today) label = "Yesterday";
        else label = "Earlier";

        if (!groups[label]) groups[label] = [];
        groups[label].push(item);
    });
    return groups;
};

export default function Notification({
    totalNotifCount,
    showSidebar,
    setShowSidebar,
    dropdownRef,
    sidebarRef,
    notifications,
    setNotifications,
    userEmail,
}: {
    totalNotifCount: number;
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
    notifications: any[];
    setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
    userEmail: string;
}) {
    const [activeTab, setActiveTab] = useState<"notifications" | "messages">(
        "notifications"
    );
    const [loadingId, setLoadingId] = useState<string | number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState<any | null>(null);

    const formatDate = useCallback(
        (timestamp: number) =>
            new Date(timestamp).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
            }),
        []
    );

    const handleMarkAsRead = useCallback(
        async (notifId: number) => {
            try {
                setLoadingId(notifId);

                const response = await fetch(
                    "/api/ModuleSales/Notification/UpdateNotifications",
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ notifId, status: "Read" }),
                    }
                );

                if (response.ok) {
                    const updatedNotifications = notifications.map((notif) =>
                        notif.id === notifId ? { ...notif, status: "Read" } : notif
                    );
                    setNotifications(updatedNotifications);

                    setTimeout(() => {
                        setNotifications((prev) =>
                            prev.filter((notif) => notif.id !== notifId)
                        );
                    }, 60000);
                } else {
                    console.error("Error updating notification status");
                }
            } catch (error) {
                console.error("Error marking as read:", error);
            } finally {
                setLoadingId(null);
            }
        },
        [notifications, setNotifications]
    );

    const handleMarkAllAsRead = useCallback(async () => {
        try {
            setLoadingId("all");

            // Filter unread notifications na walang sender
            const unreadIds = notifications
                .filter((n) => n.status === "Unread" && !n.sender)
                .map((n) => n.id);

            if (unreadIds.length === 0) {
                setLoadingId(null);
                return;
            }

            const response = await fetch("/api/ModuleSales/Notification/MarkAllRead", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notifIds: unreadIds }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Failed to mark all as read", {
                    status: response.status,
                    statusText: response.statusText,
                    errorData,
                });
                setLoadingId(null);
                return;
            }
            
            setNotifications((prev) =>
                prev.map((n) =>
                    unreadIds.includes(n.id) ? { ...n, status: "Read" } : n
                )
            );

        } catch (error) {
            console.error("Error marking all as read:", error);
        } finally {
            setLoadingId(null);
        }
    }, [notifications, setNotifications, setLoadingId]);

    useEffect(() => {
        if (showModal && selectedNotif) {
            const audio = new Audio("/alertmessage.mp3");
            audio.play().catch(() => { });
        }
    }, [showModal, selectedNotif]);

    useEffect(() => {
        if (!notifications || notifications.length === 0) return;

        const newInquiry = notifications.find(
            (notif) => notif.type === "Inquiry Notification" && notif.status === "Unread"
        );

        if (newInquiry) {
            setSelectedNotif(newInquiry);
            setShowModal(true);
        }
    }, [notifications]);

    return (
        <>
            {showSidebar && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.45 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-gradient-to-br from-orange-900 to-blue-900 z-[999]"
                        onClick={() => setShowSidebar(false)}
                        aria-hidden="true"
                    />

                    <motion.aside
                        ref={sidebarRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-[1000] flex flex-col"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Notifications sidebar"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between p-4 border-b-4 shadow-lg border-orange-500">
                            <h3 className="text-[10px] text-black tracking-wide font-bold uppercase">
                                Notifications
                            </h3>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleMarkAllAsRead}
                                    disabled={loadingId === "all"}
                                    aria-label="Mark all notifications as read"
                                    className={`text-[10px] font-semibold tracking-wide ${loadingId === "all"
                                        ? "cursor-not-allowed opacity-70 text-white"
                                        : "text-black hover:text-black underline"
                                        } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded`}
                                >
                                    {loadingId === "all" ? (
                                        <>
                                            <Spinner /> Processing...
                                        </>
                                    ) : (
                                        "Mark all as Read"
                                    )}
                                </button>

                                <button
                                    onClick={() => setShowSidebar(false)}
                                    aria-label="Close notifications sidebar"
                                    className="text-black hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-cyan-orange rounded"
                                >
                                    <IoIosCloseCircleOutline size={26} />
                                </button>
                            </div>
                        </header>

                        {/* Notification List */}
                        <section
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                            aria-live="polite"
                            aria-relevant="additions removals"
                            tabIndex={-1}
                        >
                            {activeTab === "notifications" ? (
                                <>
                                    {notifications.filter((n) => n.status === "Unread" && !n.sender)
                                        .length > 0 ? (
                                        Object.entries(
                                            groupByDate(
                                                notifications.filter(
                                                    (n) => n.status === "Unread" && !n.sender
                                                )
                                            )
                                        ).map(([groupLabel, notifs]) => (
                                            <div key={groupLabel}>
                                                <h4 className="text-black font-semibold text-[10px] text-left tracking-wide uppercase mb-2">
                                                    {groupLabel}
                                                </h4>
                                                <ul className="space-y-2">
                                                    <AnimatePresence initial={false}>
                                                        {notifs.map((notif) => (
                                                            <motion.li
                                                                key={notif.id}
                                                                initial={{ opacity: 0, y: 8 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -8 }}
                                                                layout
                                                                className="relative p-3 rounded-md shadow-md bg-white hover:from-cyan-800 hover:to-blue-800 cursor-pointer select-text transition-shadow duration-300 focus-within:ring-2 focus-within:ring-cyan-400"
                                                                onClick={() => {
                                                                    setSelectedNotif(notif);
                                                                    setShowModal(true);
                                                                }}
                                                                role="button"
                                                                tabIndex={0}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter" || e.key === " ") {
                                                                        setSelectedNotif(notif);
                                                                        setShowModal(true);
                                                                    }
                                                                }}
                                                                aria-label={`Notification: ${notif.message}`}
                                                            >
                                                                <p className="text-[10px] text-left text-black capitalize tracking-wide leading-snug">
                                                                    {notif.message}
                                                                </p>

                                                                {notif.callback && notif.callback !== "0000-00-00 00:00:00" && (
                                                                    <p className="mt-1 text-left text-[10px] text-red-500 font-semibold italic">
                                                                        Callback: {new Date(notif.callback).toLocaleString()}
                                                                    </p>
                                                                )}


                                                                <p className="mt-2 text-left text-[10px] text-black italic tracking-wide">
                                                                    {formatDate(notif.date_created)}
                                                                </p>

                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleMarkAsRead(notif.id);
                                                                    }}
                                                                    disabled={loadingId === notif.id}
                                                                    aria-label="Mark notification as read"
                                                                    className="absolute top-2 right-2 text-orange-400 hover:text-orange-500 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
                                                                >
                                                                    {loadingId === notif.id ? (
                                                                        <Spinner />
                                                                    ) : (
                                                                        <FaCheckCircle size={18} />
                                                                    )}
                                                                </button>
                                                            </motion.li>
                                                        ))}
                                                    </AnimatePresence>
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-cyan-600 italic mt-12 select-none">
                                            No new notifications
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    
                                </>
                            )}
                        </section>

                        {/* Modal */}
                        <AnimatePresence>
                            {showModal && selectedNotif && (
                                <NotificationAlertModal
                                    selectedNotif={selectedNotif}
                                    onClose={() => setShowModal(false)}
                                    onMarkAsRead={handleMarkAsRead}
                                    formatDate={(timestamp) => new Date(timestamp).toLocaleString()}
                                />
                            )}
                        </AnimatePresence>
                    </motion.aside>
                </>
            )}
        </>
    );
}
