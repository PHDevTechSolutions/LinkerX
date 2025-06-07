"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchUserData = async () => {
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
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (
      userDetails &&
      userDetails.id &&
      userDetails.Firstname &&
      userDetails.Lastname
    ) {
      const code = `${userDetails.id}-${userDetails.Firstname.substring(
        0,
        2
      )}${userDetails.Lastname.substring(0, 2)}-000`;
      setGeneratedCode(code);
    }
  }, [userDetails]);

  useEffect(() => {
    if (generatedCode && userDetails) {
      generateQRCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedCode]);

  const generateQRCode = async () => {
    if (!userDetails) return;

    try {
      const qrData = `Taskflow System | ERP Module - Ecoshift Corporation,\nAgentName: ${userDetails.Firstname} ${userDetails.Lastname}\nPosition: ${userDetails.Role}\nContactNumber: ${userDetails.ContactNumber}\nEmail: ${userDetails.Email}\nLink: https://ecoshiftcorp.com`;
      const qr = await QRCode.toDataURL(qrData);
      setQrCode(qr);
    } catch (err) {
      console.error("Error generating QR code", err);
      setError("Failed to generate QR code");
    }
  };

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center mt-6">
      {generatedCode && (
        <p className="text-sm font-semibold">Generated Code: {generatedCode}</p>
      )}
      {qrCode && (
        <img
          src={qrCode}
          alt="Generated QR Code"
          className="mt-4"
          style={{ width: "300px", height: "300px" }}
        />
      )}
    </div>
  );
};

export default GenerateCode;
