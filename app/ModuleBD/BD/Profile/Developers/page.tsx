"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Developers from "../../../components/Profile/Developers"; // Import the form component

const ProfilePage: React.FC = () => {
    const [userDetails, setUserDetails] = useState({
        id: "", // Add an id property to send in the API request
        Firstname: "",
        Lastname: "",
        Email: "",
        Role: "", // Added Role to state
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                        id: data._id, // Set the user's id here
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                    });
                } catch (err: unknown) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/Setting/UpdateProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userDetails), // Send the whole userDetails object with id
            });

            if (response.ok) {
                toast.success("Profile updated successfully");
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (err: unknown) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <SessionChecker>
            <ParentLayout>
                <div className="container mx-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-1">
                        <h1 className="text-lg font-bold mb-4">Developers Team</h1>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        {/* Use ProfileForm component here */}
                        <Developers />
                    </div>
                </div>
                <ToastContainer />
            </ParentLayout>
        </SessionChecker>
    );
};

export default ProfilePage;
