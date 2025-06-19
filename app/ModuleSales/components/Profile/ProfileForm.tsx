"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Picture from "../../components/Profile/Picture";
import Password from "../../components/Profile/Password";

interface UserDetails {
  id: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Role: string;
  Department: string;
  Status: string;
  Password?: string;
  ContactPassword?: string;
  ContactNumber: string;
  profilePicture: string;
}

const STATUS_OPTIONS = [
  { value: "Active", label: "Active", color: "bg-green-500" },
  { value: "Inactive", label: "Inactive", color: "bg-gray-400" },
  { value: "Busy", label: "Busy", color: "bg-orange-500" },
  { value: "Do not Disturb", label: "Do not Disturb", color: "bg-red-600" },
];

const LOCAL_STORAGE_KEY = "profileFormDraft";

const ProfileForm: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    id: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Password: "",
    ContactPassword: "",
    ContactNumber: "",
    Role: "",
    Department: "",
    Status: "",
    profilePicture: "",
  });

  const [originalDetails, setOriginalDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | "">("");
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Fetch user data and load from localStorage draft if any
  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (userId) {
        try {
          const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data = await response.json();

          const fetchedDetails: UserDetails = {
            id: data._id || "",
            Firstname: data.Firstname || "",
            Lastname: data.Lastname || "",
            Email: data.Email || "",
            Password: "",
            ContactPassword: "",
            ContactNumber: data.ContactNumber || "",
            Role: data.Role || "",
            Department: data.Department || "",
            Status: data.Status || "",
            profilePicture: data.profilePicture || "",
          };

          // Load draft from localStorage if exists and user id matches
          const savedDraftRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedDraftRaw) {
            const savedDraft = JSON.parse(savedDraftRaw);
            if (savedDraft?.id === userId) {
              setUserDetails(savedDraft);
            } else {
              setUserDetails(fetchedDetails);
            }
          } else {
            setUserDetails(fetchedDetails);
          }

          setOriginalDetails(fetchedDetails);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("User ID is missing.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Autosave draft every 5 seconds
  useEffect(() => {
    if (loading) return;

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

    autosaveTimer.current = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userDetails));
      toast.info("Draft auto-saved", { autoClose: 1000, pauseOnHover: false });
    }, 5000);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [userDetails, loading]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Xchire");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dhczsyzcz/image/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.secure_url) {
        setUserDetails((prev) => ({ ...prev, profilePicture: json.secure_url }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const calculatePasswordStrength = (password: string): "weak" | "medium" | "strong" | "" => {
    if (!password) return "";
    if (password.length < 4) return "weak";
    if (password.match(/^(?=.*[a-z])(?=.*\d).{6,}$/)) return "medium";
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)) return "strong";
    return "weak";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userDetails.Password && userDetails.Password.length > 10) {
      toast.error("Password must be at most 10 characters");
      return;
    }
    if (userDetails.Password !== userDetails.ContactPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    setLoading(true);

    const payload: Partial<UserDetails> = { ...userDetails };
    if (!payload.Password) {
      delete payload.Password;
    }
    delete payload.ContactPassword;

    try {
      const response = await fetch("/api/ModuleSales/Profile/UpdateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        setUserDetails((prev) => ({
          ...prev,
          Password: "",
          ContactPassword: "",
        }));
        setPasswordStrength("");
        // Update original details and clear draft on success
        setOriginalDetails((prev) => ({
          ...prev!,
          ...payload,
          Password: "",
          ContactPassword: "",
        }));
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));

    if (name === "Password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const toggleStatusDropdown = () => setStatusDropdownOpen((prev) => !prev);

  const handleStatusSelect = (statusValue: string) => {
    setUserDetails((prev) => ({ ...prev, Status: statusValue }));
    setStatusDropdownOpen(false);
  };

  const handleReset = () => {
    if (originalDetails) {
      setUserDetails(originalDetails);
      setPasswordStrength("");
      toast.info("Form reset to original data");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 flex justify-center md:justify-start">
          <Picture
            profilePicture={userDetails.profilePicture}
            onImageUpload={handleImageUpload}
            uploading={uploading}
          />
        </div>

        <div className="md:col-span-2 bg-white ">
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <label htmlFor="Firstname" className="block text-xs font-medium text-gray-700">First Name</label>
              <input type="text" id="Firstname" name="Firstname" value={userDetails.Firstname} onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border-b text-xs text-black capitalize"
              />
            </div>

            <div>
              <label htmlFor="Lastname" className="block text-xs font-medium text-gray-700">Last Name</label>
              <input type="text" id="Lastname" name="Lastname" value={userDetails.Lastname} onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border-b text-xs text-black capitalize"
              />
            </div>

            {/* Password Component */}
            <Password
              Password={userDetails.Password || ""}
              ContactPassword={userDetails.ContactPassword || ""}
              onChange={handleChange}
              passwordStrength={passwordStrength}
            />

            <div>
              <label htmlFor="Email" className="block text-xs font-medium text-gray-700">Email Address</label>
              <input type="email" id="Email" name="Email" value={userDetails.Email} onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border-b text-xs text-black"
              />
            </div>

            <div>
              <label htmlFor="ContactNumber" className="block text-xs font-medium text-gray-700">Contact Number</label>
              <input type="text" id="ContactNumber" name="ContactNumber" value={userDetails.ContactNumber} onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border-b text-xs text-black"
              />
            </div>

            {/* Custom Status Dropdown */}
            <div className="relative">
              <label htmlFor="Status" className="block text-xs font-medium text-gray-700 mb-1">Change Status</label>
              <button
                type="button"
                onClick={toggleStatusDropdown}
                className="w-full flex items-center justify-between px-4 py-2 border-b rounded-md text-xs text-black capitalize bg-white"
                aria-haspopup="listbox"
                aria-expanded={statusDropdownOpen}
                aria-label="Select status"
              >
                <span className="flex items-center gap-2">
                  {userDetails.Status ? (
                    <>
                      <span
                        className={`inline-block w-3 h-3 rounded-full text-black ${
                          STATUS_OPTIONS.find((opt) => opt.value === userDetails.Status)?.color || "bg-gray-400"
                        }`}
                      />
                      {userDetails.Status}
                    </>
                  ) : (
                    "Select Status"
                  )}
                </span>
                <svg
                  className="w-4 h-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {statusDropdownOpen && (
                <ul
                  role="listbox"
                  tabIndex={-1}
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-auto text-xs text-black"
                >
                  {STATUS_OPTIONS.map(({ value, label, color }) => (
                    <li
                      key={value}
                      role="option"
                      aria-selected={userDetails.Status === value}
                      onClick={() => handleStatusSelect(value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleStatusSelect(value);
                        }
                      }}
                      tabIndex={0}
                      className={`cursor-pointer flex items-center gap-2 px-4 py-2 hover:bg-gray-100 capitalize ${
                        userDetails.Status === value ? "font-semibold bg-gray-100" : ""
                      }`}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded disabled:opacity-50"
                disabled={uploading || loading}
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-400 text-white text-xs px-4 py-2 rounded"
                disabled={uploading || loading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default ProfileForm;
