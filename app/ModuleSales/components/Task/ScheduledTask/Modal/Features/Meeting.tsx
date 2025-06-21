// ./Features/Meeting.tsx
import React from "react";
import { FaGoogle, FaMicrosoft, FaVideo } from "react-icons/fa";

const Meeting: React.FC = () => {
  return (
    <div className="flex gap-3 items-center text-xs mt-2">
      <span className="font-semibold text-gray-600">Set a meeting link?</span>
      <a
        href="https://zoom.us/start/videomeeting"
        target="_blank"
        rel="noopener noreferrer"
        title="Zoom"
      >
        <FaVideo className="text-blue-500 hover:text-blue-700" />
      </a>
      <a
        href="https://meet.google.com/new"
        target="_blank"
        rel="noopener noreferrer"
        title="Google Meet"
      >
        <FaGoogle className="text-green-500 hover:text-green-700" />
      </a>
      <a
        href="https://teams.microsoft.com/l/meeting/new"
        target="_blank"
        rel="noopener noreferrer"
        title="MS Teams"
      >
        <FaMicrosoft className="text-purple-600 hover:text-purple-800" />
      </a>
    </div>
  );
};

export default Meeting;
