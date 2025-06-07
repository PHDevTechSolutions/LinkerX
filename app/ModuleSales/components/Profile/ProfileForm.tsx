"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const ProfileForm: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    id: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Role: "",
    Department: "",
    Status: "",
    Password: "",
    ContactNumber: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (userId) {
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
      } else {
        setError("User ID is missing.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Xchire"); // Update with your Cloudinary preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhczsyzcz/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ModuleSales/Profile/UpdateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
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
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {/* Left card: Large Profile Picture */}
        <div className="col-span-1 bg-white rounded-md p-6 shadow-md flex flex-col items-center">
          <h2 className="text-md font-semibold mb-4">Profile Picture</h2>

          {userDetails.profilePicture ? (
            <img
              src={userDetails.profilePicture}
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
              }
            }}
            className="block w-full text-xs"
          />
          {uploading && <p className="text-xs text-gray-500 mt-2">Uploading image...</p>}
        </div>

        {/* Right card: Form Fields */}
        <div className="col-span-3 bg-white rounded-md p-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <label htmlFor="Firstname" className="block text-xs font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="Firstname"
                name="Firstname"
                value={userDetails.Firstname}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
              />
            </div>

            <div>
              <label htmlFor="Lastname" className="block text-xs font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="Lastname"
                name="Lastname"
                value={userDetails.Lastname}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
              />
            </div>

            <div className="relative">
              <label htmlFor="Password" className="block text-xs font-medium text-gray-700">
                Current Password / Change Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                name="Password"
                value={userDetails.Password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-xs"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 top-[20px] flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? <IoIosEyeOff size={18} /> : <IoIosEye size={18} />}
              </div>
            </div>

            <div>
              <label htmlFor="Email" className="block text-xs font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={userDetails.Email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs"
              />
            </div>

            <div>
              <label htmlFor="ContactNumber" className="block text-xs font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                id="ContactNumber"
                name="ContactNumber"
                value={userDetails.ContactNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs"
              />
            </div>

            <div>
              <label htmlFor="Status" className="block text-xs font-medium text-gray-700">
                Change Status
              </label>
              <select
                id="Status"
                name="Status"
                value={userDetails.Status}
                onChange={handleSelectChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Busy">Busy</option>
                <option value="Do not Disturb">Do not Disturb</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white text-xs px-4 py-2 rounded"
              disabled={uploading}
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default ProfileForm;
