import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GrPowerShutdown } from "react-icons/gr";

interface SidebarUserInfoProps {
  userDetails: {
    Firstname: string;
    Lastname: string;
    Company: string;
    Role: string;
    Status: string;
  };
  selectedAvatar: string;
  collapsed: boolean;
  isDarkMode: boolean;
}

const SidebarUserInfo: React.FC<SidebarUserInfoProps> = ({
  userDetails,
  selectedAvatar,
  collapsed,
  isDarkMode,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Reference to the audio element to control playback
  const audioRef = useRef<HTMLAudioElement>(null);

  if (collapsed) return null;

  const statusColors: Record<string, string> = {
    Active: "bg-green-600",
    Inactive: "bg-red-400",
    Locked: "bg-gray-400",
    Busy: "bg-yellow-400",
    "Do not Disturb": "bg-gray-800",
  };

  const statusColor = statusColors[userDetails.Status] || "bg-blue-500";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Play the logout sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    await new Promise((resolve) => setTimeout(resolve, 2500));
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    sessionStorage.clear();
    router.replace("/Login");
  };

  // Pause the audio if the component unmounts or logout stops
  useEffect(() => {
    if (!isLoggingOut && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isLoggingOut]);

  return (
    <div
      className={`relative p-6 ${
        isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-white"
      } flex items-center justify-between flex-shrink-0 overflow-hidden`}
      style={{ position: "sticky", bottom: 0, zIndex: 10 }}
    >
      {/* Audio element for logout sound */}
      <audio src="/binary-logout-sfx.mp3" ref={audioRef} />

      {/* Futuristic Glassmorphic Overlay */}
      {isLoggingOut && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900 backdrop-blur-xl transition-all duration-500 overflow-hidden">
          {/* Geometric Animation Background */}
          <div className="absolute inset-0 opacity-20 animate-pulse-slow bg-[radial-gradient(circle_at_center,_#00ffff33_1px,_transparent_1px)] bg-[length:20px_20px]" />

          {/* Glowing Ring + Centered Text */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-cyan-400 animate-spin-slow shadow-lg shadow-cyan-500/30" />
            {/* Inner glow layer */}
            <div className="absolute inset-1 rounded-full border-[2px] border-cyan-300 opacity-40 animate-ping" />
            {/* Center text */}
            <span className="text-cyan-300 text-[10px] font-mono z-10">
              Logging out...
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 z-10">
        {/* Avatar */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <img
            src={selectedAvatar}
            alt="Avatar"
            className="w-12 h-12 object-cover border rounded-full"
          />
          <span
            className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${statusColor} animate-pulse`}
            title={userDetails.Status}
          />
        </div>

        {/* User Info */}
        <div className="text-[10px]">
          <p className="font-bold uppercase">
            {userDetails.Firstname}, {userDetails.Lastname}
          </p>
          <p className="italic">{userDetails.Company}</p>
          <p className="italic">( {userDetails.Role} )</p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        title="Logout"
        className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-red-900 transition z-10"
      >
        <GrPowerShutdown size={20} className="text-cyan-400" />
      </button>
    </div>
  );
};

export default SidebarUserInfo;
