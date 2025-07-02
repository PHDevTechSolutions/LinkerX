"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/UserFetcher/UserFetcher";
// Components
import AddPostForm from "../../../components/Task/HistoricalRecords/Form";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);

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
        ReferenceID: "", // Added ReferenceID here
        userName: "",    // Added userName here
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [showAccessModal, setShowAccessModal] = useState(false);

    // Fetch user data based on query parameters (user ID)
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
                        Password: data.Password || "",
                        ContactNumber: data.ContactNumber || "",
                        Role: data.Role || "",
                        Department: data.Department || "",
                        Status: data.Status || "",
                        ReferenceID: data.ReferenceID || "",  // Make sure ReferenceID is fetched
                        userName: data.userName || "",        // Make sure userName is fetched
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

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => {
                        return (
                            <div className="container mx-auto p-4 text-gray-900">
                                <div className="grid grid-cols-1 md:grid-cols-1">
                                    {/* Always Show Form with userDetails passed */}
                                    <AddPostForm
                                        onCancel={() => {
                                            setShowForm(false);
                                        }}
                                        userDetails={userDetails} // Pass userDetails directly here
                                    />

                                    {/* Access Restriction Modal */}
                                    {showAccessModal && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 h-screen w-full">
                                            <div className="bg-white p-6 rounded shadow-lg w-96 max-h-full overflow-y-auto">
                                                <h2 className="text-lg font-bold text-red-600 mb-4">🚧 Under Maintenance</h2>
                                                <p className="text-sm text-gray-700 mb-4">
                                                    This section is temporarily unavailable for your access level. Please contact your system administrator or try again later.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <ToastContainer className="text-xs" autoClose={1000} />
                                </div>
                            </div>
                        );
                    }}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
