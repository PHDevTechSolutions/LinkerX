"use client";

import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";

type UserDetailsType = {
  id: string;
  Firstname: string;
  Lastname: string;
  Role: string;
  ContactNumber: string;
  Email: string;
  Department?: string;
  Status?: string;
  Password?: string;
  profilePicture?: string;
};

const GenerateCode: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suffixCounter, setSuffixCounter] = useState(0);

  // Fetch user data from API based on ID from URL
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (!userId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();

      setUserDetails({
        id: data._id || "",
        Firstname: data.Firstname || "",
        Lastname: data.Lastname || "",
        Email: data.Email || "",
        Password: data.Password || "",
        ContactNumber: data.ContactNumber || "",
        Role: data.Role || "",
        Department: data.Department || "",
        Status: data.Status || "",
        profilePicture: data.profilePicture || "",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Generate custom user code based on user details + suffix
  useEffect(() => {
    if (userDetails && userDetails.id && userDetails.Firstname && userDetails.Lastname) {
      const suffix = suffixCounter.toString().padStart(3, "0");
      const code = `${userDetails.id}-${userDetails.Firstname.substring(0, 2).toUpperCase()}${userDetails.Lastname.substring(0, 2).toUpperCase()}-${suffix}`;
      setGeneratedCode(code);
    }
  }, [userDetails, suffixCounter]);

  // Generate QR code from user info and generated code
  useEffect(() => {
    if (generatedCode && userDetails) {
      generateQRCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedCode]);

  const generateQRCode = async () => {
    if (!userDetails) return;

    try {
      const qrData = `Taskflow System | ERP Module - Ecoshift Corporation
AgentName: ${userDetails.Firstname} ${userDetails.Lastname}
Position: ${userDetails.Role || "N/A"}
ContactNumber: ${userDetails.ContactNumber || "N/A"}
Email: ${userDetails.Email || "N/A"}
GeneratedCode: ${generatedCode}
Link: https://ecoshiftcorp.com`;
      const qr = await QRCode.toDataURL(qrData);
      setQrCode(qr);
    } catch (err) {
      console.error("Error generating QR code", err);
      setError("Failed to generate QR code");
    }
  };

  // Download QR code as PNG file
  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${generatedCode}_QRCode.png`;
    link.click();
  };

  // Regenerate code with incremented suffix
  const handleRegenerate = () => {
    setSuffixCounter((prev) => (prev + 1) % 1000); // wrap after 999
  };

  if (loading)
    return (
      <div role="status" aria-live="polite" className="flex justify-center mt-6">
        <svg
          aria-hidden="true"
          className="w-10 h-10 text-gray-200 animate-spin fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0
            78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50
            0.59082C77.6142 0.59082 100 22.9766 100
            50.5908ZM9.08197 50.5908C9.08197 73.1895 27.4013 91.5089
            50 91.5089C72.5987 91.5089 90.918 73.1895 90.918
            50.5908C90.918 27.9921 72.5987 9.67273 50 9.67273C27.4013
            9.67273 9.08197 27.9921 9.08197 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116
            97.0079 33.5535C95.2932 28.8227 92.871 24.3692
            89.8167 20.348C85.8452 15.1192 80.8826 10.7238
            75.2124 7.41289C69.5422 4.10194 63.2754 1.94025
            56.7698 1.05142C51.7666 0.367273 46.6976 0.446843
            41.7345 1.27873C39.2613 1.69328 37.813 4.19778
            38.4501 6.62326C39.0873 9.04874 41.5694 10.4717
            44.0505 10.1071C47.8511 9.54855 51.7191 9.52689
            55.5402 10.0491C60.8644 10.7766 65.9928 12.5457
            70.6331 15.2552C75.2735 17.9647 79.2919 21.5619
            82.5145 25.841C84.9167 28.9121 86.7993 32.2913
            88.0855 35.8758C88.6203 37.5558 91.5421 39.6781
            93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading user data...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-6" role="alert" aria-live="assertive">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchUserData}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          aria-label="Retry loading user data"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center mt-6" role="main">
      {/* Generated code */}
      {generatedCode && (
        <p className="text-sm font-semibold text-black" aria-live="polite">
          Generated Code:{" "}
          <span className="text-blue-600 font-mono">{generatedCode}</span>
        </p>
      )}

      {/* QR Code Image */}
      {qrCode && (
        <img
          src={qrCode}
          alt={`QR code for user ${userDetails?.Firstname} ${userDetails?.Lastname}`}
          className="mt-4 rounded-md border border-gray-300"
          style={{ width: "300px", height: "300px" }}
        />
      )}

      {/* Buttons */}
      <div className="mt-4 flex gap-4 text-xs">
        {generatedCode && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(generatedCode);
              alert("Generated code copied to clipboard!");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            aria-label="Copy generated code to clipboard"
          >
            Copy Code
          </button>
        )}

        {qrCode && (
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            aria-label="Download QR code as PNG image"
          >
            Download QR Code
          </button>
        )}

        <button
          onClick={handleRegenerate}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
          aria-label="Regenerate code with a new suffix"
        >
          Regenerate Code
        </button>
      </div>
    </div>
  );
};

export default GenerateCode;
