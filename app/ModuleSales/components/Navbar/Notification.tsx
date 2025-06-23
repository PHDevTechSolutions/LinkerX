import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import NotificationAlertModal from "./NotificationAlertModal";

function Spinner() {
    return (
        <svg className="animate-spin h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label="Loading" role="img">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
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
    const [activeTab, setActiveTab] = useState<"Unread" | "Read">("Unread");
    const [loadingId, setLoadingId] = useState<string | number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState<any | null>(null);

    const formatDate = useCallback((timestamp: number) => new Date(timestamp).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }), []);

    const handleMarkAsRead = useCallback(async (notifId: number) => {
        try {
            setLoadingId(notifId);
            const response = await fetch("/api/ModuleSales/Notification/UpdateNotifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notifId, status: "Read" }),
            });

            if (response.ok) {
                const updatedNotifications = notifications.map((notif) => notif.id === notifId ? { ...notif, status: "Read" } : notif);
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
    }, [notifications, setNotifications]);

    const handleMarkAllAsRead = useCallback(async () => {
        try {
            setLoadingId("all");
            const unreadIds = notifications.filter((n) => n.status === "Unread" && !n.sender).map((n) => n.id);
            if (unreadIds.length === 0) return setLoadingId(null);
            const response = await fetch("/api/ModuleSales/Notification/MarkAllRead", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notifIds: unreadIds }),
            });
            if (response.ok) {
                setNotifications((prev) => prev.map((n) => unreadIds.includes(n.id) ? { ...n, status: "Read" } : n));
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
        } finally {
            setLoadingId(null);
        }
    }, [notifications, setNotifications]);

    useEffect(() => {
        if (showModal && selectedNotif) new Audio("/alertmessage.mp3").play().catch(() => {});
    }, [showModal, selectedNotif]);

    useEffect(() => {
        if (!notifications || notifications.length === 0) return;
        const newInquiry = notifications.find((notif) => notif.type === "Inquiry Notification" && notif.status === "Unread");
        if (newInquiry) {
            setSelectedNotif(newInquiry);
            setShowModal(true);
        }
    }, [notifications]);

    return (
        <>
            {showSidebar && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-gradient-to-br from-orange-900 to-blue-900 z-[999]" onClick={() => setShowSidebar(false)} aria-hidden="true" />
                    <motion.aside ref={sidebarRef} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-[1000] flex flex-col">
                        <header className="flex items-center justify-between p-4 border-b-4 shadow-lg border-orange-500">
                            <h3 className="text-[10px] text-black tracking-wide font-bold uppercase">Notifications</h3>
                            <div className="flex items-center gap-3">
                                <button onClick={handleMarkAllAsRead} disabled={loadingId === "all"} aria-label="Mark all notifications as read" className={`text-[10px] font-semibold tracking-wide ${loadingId === "all" ? "cursor-not-allowed opacity-70 text-white" : "text-black hover:text-black underline"}`}>
                                    {loadingId === "all" ? <><Spinner /> Processing...</> : "Mark all as Read"}
                                </button>
                                <button onClick={() => setShowSidebar(false)} aria-label="Close notifications sidebar" className="text-black hover:text-orange-400">
                                    <IoIosCloseCircleOutline size={26} />
                                </button>
                            </div>
                        </header>
                        <div className="flex justify-between px-4 pt-3 border-b text-[10px] uppercase font-bold">
                            <button onClick={() => setActiveTab("Unread")} className={`w-full py-2 ${activeTab === "Unread" ? "border-b-2 border-orange-500 text-orange-600" : "text-gray-500"}`}>Unread</button>
                            <button onClick={() => setActiveTab("Read")} className={`w-full py-2 ${activeTab === "Read" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"}`}>Read</button>
                        </div>
                        <section className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
                            {Object.entries(groupByDate(notifications.filter(n => n.status === activeTab))).map(([groupLabel, notifs]) => (
                                <div key={groupLabel}>
                                    <h4 className="text-black font-semibold text-[10px] tracking-wide uppercase mb-2">{groupLabel}</h4>
                                    <ul className="space-y-2">
                                        <AnimatePresence initial={false}>
                                            {notifs.map((notif) => (
                                                <motion.li key={notif.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} layout className="relative p-3 rounded-md shadow-md bg-white hover:bg-gray-100 cursor-pointer" onClick={() => { setSelectedNotif(notif); setShowModal(true); }}>
                                                    <p className="text-[10px] text-black capitalize tracking-wide leading-snug">{notif.message}</p>
                                                    {notif.callback && notif.callback !== "0000-00-00 00:00:00" && (
                                                        <p className="mt-1 text-[10px] text-red-500 italic">Callback: {new Date(notif.callback).toLocaleString()}</p>
                                                    )}
                                                    <p className="mt-2 text-[10px] text-black italic">{formatDate(notif.date_created)}</p>
                                                    {activeTab === "Unread" && (
                                                        <button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notif.id); }} disabled={loadingId === notif.id} className="absolute top-2 right-2 text-orange-400 hover:text-orange-500">
                                                            {loadingId === notif.id ? <Spinner /> : <FaCheckCircle size={18} />}
                                                        </button>
                                                    )}
                                                </motion.li>
                                            ))}
                                        </AnimatePresence>
                                    </ul>
                                </div>
                            ))}
                        </section>
                        <AnimatePresence>
                            {showModal && selectedNotif && (
                                <NotificationAlertModal selectedNotif={selectedNotif} onClose={() => setShowModal(false)} onMarkAsRead={handleMarkAsRead} formatDate={(timestamp) => new Date(timestamp).toLocaleString()} />
                            )}
                        </AnimatePresence>
                    </motion.aside>
                </>
            )}
        </>
    );
}