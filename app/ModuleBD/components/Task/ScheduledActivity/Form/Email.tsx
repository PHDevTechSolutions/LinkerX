import React, { useState, useEffect } from "react";

interface EmailProps {
  emailaddress: string;
  setemailaddress: (val: string) => void;
}

const Email: React.FC<EmailProps> = ({ emailaddress, setemailaddress }) => {
  const [error, setError] = useState("");

  // Simple email regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate email on every change
  useEffect(() => {
    if (emailaddress === "") {
      setError("");
    } else if (!emailRegex.test(emailaddress)) {
      setError("Invalid email format");
    } else {
      setError("");
    }
  }, [emailaddress]);

  return (
    <>
      <input
        type="text"
        id="emailaddress"
        value={emailaddress ?? ""}
        onChange={(e) => {
          const input = e.target.value;
          // sanitize input by allowing only these characters
          const allowed = input.replace(/[^a-zA-Z0-9@._-]/g, "");
          setemailaddress(allowed);
        }}
        className={`w-full px-3 py-2 border-b text-xs ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Email Address"
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </>
  );
};

export default Email;
