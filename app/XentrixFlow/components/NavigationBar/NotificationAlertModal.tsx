import React from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

interface NotificationAlertModalProps {
  selectedNotif: any;
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
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm border-2 border-red-600 animate-continuous-shake">
        <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center justify-center space-x-2">
          <FaExclamationCircle className="text-red-600" />
          <span>Inquiry Notification</span>
        </h2>
        <p className="text-md font-bold italic text-gray-700 mb-4">{selectedNotif.message}</p>
        <span className="text-[10px] text-gray-500 block mb-4">
          {formatDate(new Date(selectedNotif.date_created).getTime())}
        </span>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              onMarkAsRead(selectedNotif.id);
              onClose();
            }}
            className="px-4 py-2 text-xs bg-blue-400 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
          >
            <FaCheckCircle className="text-white" />
            <span>Mark as Read</span>
          </button>
        </div>
      </div>
    </div>
  );
}
