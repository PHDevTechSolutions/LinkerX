"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Developers from "../../components/Information/ViewInformation";
import FuturisticSpinner from "../../components/Spinner/FuturisticSpinner";

const ProfilePage: React.FC = () => {
    const [userDetails, setUserDetails] = useState({
        id: "", // Add an id property to send in the API request
        Firstname: "",
        Lastname: "",
        Email: "",
        Role: "", // Added Role to state
    });
    const [error, setError] = useState<string | null>(null);

    const [postsLoading, setPostsLoading] = useState<boolean>(true);
    const [showSpinner, setShowSpinner] = useState(true);

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
                    setShowSpinner(false);
                }
            } else {
                setError("User ID is missing.");
                setShowSpinner(false);
            }
        };

        fetchUserData();
    }, []);

    if (postsLoading || showSpinner) {
        return (
            <SessionChecker>
                <ParentLayout>
                    <FuturisticSpinner setShowSpinner={setShowSpinner} />
                </ParentLayout>
            </SessionChecker>
        );
    }

    return (
        <SessionChecker>
            <ParentLayout>
                <div className="container mx-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-1">
                        <h1 className="text-lg font-bold mb-4">What is Taskflow?</h1>
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
