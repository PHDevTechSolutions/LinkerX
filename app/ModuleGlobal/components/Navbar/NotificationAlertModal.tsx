import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

interface User {
  id: number;
  Firstname: string;
  Lastname: string;
}

interface NotificationAlertModalProps {
  selectedNotif: {
    id: number;
    message: string;
    date_created: string | number;
    type?: string;
    userId: number;
  };
  onClose: () => void;
  onMarkAsRead: (notifId: number) => void;
  formatDate: (timestamp: number) => string;
}

export default function NotificationAlertModal({
  selectedNotif,
  onClose,
  onMarkAsRead,
  formatDate,
}: NotificationAlertModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-title"
    >
      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border-l-8 border-orange-400 p-7 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center text-red-600 mb-5">
          <FaExclamationCircle className="mr-3 text-3xl" />
          <h2
            id="notification-title"
            className="text-2xl font-bold tracking-wide"
          >
            Inquiry Notification
          </h2>
        </div>

        {/* Notification Message */}
        <p className="text-gray-900 font-semibold italic leading-relaxed mb-5 capitalize">
          {selectedNotif.message}
        </p>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mb-7 tracking-wide">
          Received: {formatDate(new Date(selectedNotif.date_created).getTime())}
        </p>

        {/* Action Button */}
        <div className="flex justify-start">
          <button
            onClick={() => {
              onMarkAsRead(selectedNotif.id);
              onClose();
            }}
            className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white rounded-full px-6 py-3 shadow-md transition duration-300 font-semibold"
          >
            <FaCheckCircle size={18} />
            Mark as Read
          </button>
        </div>
      </div>
    </div>
  );
}
