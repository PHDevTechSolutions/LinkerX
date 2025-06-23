import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";

interface NotifySetting {
  postId: string;
  notifyAt: number;
}

interface NotifyMeProps {
  postId: string;
  notifySettings: NotifySetting[];
  updateNotifySettings: (newSettings: NotifySetting[]) => void;
}

const NotifyMe: React.FC<NotifyMeProps> = ({
  postId,
  notifySettings,
  updateNotifySettings,
}) => {
  const [showNotifyPicker, setShowNotifyPicker] = useState(false);
  const [notificationFired, setNotificationFired] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasNotify = notifySettings.some((s) => s.postId === postId);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio("/alertmessage.mp3");
    audioRef.current = audio;
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  const stopNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const notify = notifySettings.find((s) => s.postId === postId);
      if (notify && Date.now() >= notify.notifyAt) {
        setNotificationFired(true);
        playNotificationSound();
        updateNotifySettings(notifySettings.filter((s) => s.postId !== postId));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [notifySettings, postId, updateNotifySettings]);

  const scheduleNotification = (ms: number) => {
    const notifyAt = Date.now() + ms;
    const filtered = notifySettings.filter((s) => s.postId !== postId);
    updateNotifySettings([...filtered, { postId, notifyAt }]);
    setShowNotifyPicker(false);
    setNotificationFired(false);
  };

  const cancelNotification = () => {
    updateNotifySettings(notifySettings.filter((s) => s.postId !== postId));
    setShowNotifyPicker(false);
    setNotificationFired(false);
  };

  const handleDismiss = () => {
    stopNotificationSound();
    setNotificationFired(false);
  };

  return (
    <div className="relative inline-block text-left z-[9999]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowNotifyPicker((prev) => !prev);
          setNotificationFired(false);
        }}
        className={`text-xs px-2 py-1 rounded ${
          hasNotify ? "bg-yellow-300" : ""
        } hover:bg-yellow-100`}
        type="button"
      >
        {hasNotify ? "Notification Set" : <FaBell className="text-gray-400" size={15} />}
      </button>

      {showNotifyPicker && (
        <div
          className="absolute top-full right-0 mt-1 bg-white border rounded shadow-lg z-[9999] p-2 text-xs text-gray-800 w-40"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-1 font-semibold">Notify me in:</p>
          <button
            className="block w-full text-left hover:bg-gray-100 rounded px-2 py-1"
            type="button"
            onClick={() => scheduleNotification(5000)}
          >
            5 seconds (test)
          </button>
          {[1, 5, 10, 15, 30, 60, 120].map((min) => (
            <button
              key={min}
              className="block w-full text-left hover:bg-gray-100 rounded px-2 py-1"
              type="button"
              onClick={() => scheduleNotification(min * 60000)}
            >
              {min < 60
                ? `${min} minute${min > 1 ? "s" : ""}`
                : `${min / 60} hour${min / 60 > 1 ? "s" : ""}`}
            </button>
          ))}
          <button
            type="button"
            className="mt-1 w-full text-left text-red-600 hover:bg-red-100 rounded px-2 py-1"
            onClick={cancelNotification}
          >
            Cancel Notification
          </button>
        </div>
      )}

      {notificationFired && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-40">
          <div
            className="bg-white rounded-lg p-6 shadow-xl w-[90%] max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">🔔 Notification Alert</h2>
            <p className="text-sm mb-4">Your reminder for this post has fired.</p>

            <div className="space-y-2 mb-4">
              {[5, 10, 15].map((min) => (
                <button
                  key={min}
                  onClick={() => {
                    scheduleNotification(min * 60000);
                    stopNotificationSound();
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-sm px-3 py-2 rounded"
                >
                  Remind me again in {min} minutes
                </button>
              ))}
            </div>

            <button
              onClick={handleDismiss}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifyMe;
