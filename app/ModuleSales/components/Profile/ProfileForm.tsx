"use client";

import React, { useState, useEffect } from "react";
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

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [uploading, setUploading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | "">("");

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
                        Password: "", // do not prefill password
                        ContactPassword: "",
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
        data.append("upload_preset", "Xchire"); // Your Cloudinary preset

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

        // Validation: Password max 10 chars, confirm match
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

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <>
            <div className="grid grid-cols-4 gap-2">
                <div className="col-span-2">
                    <Picture
                        profilePicture={userDetails.profilePicture}
                        onImageUpload={handleImageUpload}
                        uploading={uploading}
                    />
                </div>

                <div className="col-span-2 bg-white rounded-md p-6 shadow-md">
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

                        {/* Password Component */}
                        <Password
                            Password={userDetails.Password || ""}
                            ContactPassword={userDetails.ContactPassword || ""}
                            onChange={handleChange}
                            passwordStrength={passwordStrength}
                        />


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
