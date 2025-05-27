"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./FormFields";

interface AddTrackingProps {
    onCancel: () => void;
    refreshPosts: () => void;
    userName: string;
    userDetails: {
        id: string;
        Role: string;
        ReferenceID: string;
    };
    editPost?: any;
}

const AddTracking: React.FC<AddTrackingProps> = ({ userDetails, onCancel, refreshPosts, editPost }) => {
    const [userName, setuserName] = useState("");
    const [ReferenceID, setReferenceID] = useState(editPost ? editPost.ReferenceID : userDetails.ReferenceID);
    const [Title, setTitle] = useState(editPost ? editPost.Title : "");
    const [Description, setDescription] = useState(editPost ? editPost.Description : "");
    const [DateCreated, setDateCreated] = useState(editPost ? editPost.DateCreated : "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editPost ? `/api/ModuleCSR/Faqs/Edit` : `/api/ModuleCSR/Faqs/Create`; // API endpoint changes based on edit or add
        const method = editPost ? "PUT" : "POST"; // HTTP method changes based on edit or add

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                ReferenceID,
                Title,
                Description,
                DateCreated,
                id: editPost ? editPost._id : undefined, // Send post ID if editing
            }),
        });

        if (response.ok) {
            toast.success(editPost ? "updated successfully" : "added successfully", {
                autoClose: 1000,
                onClose: () => {
                    onCancel(); // Hide the form after submission
                    refreshPosts(); // Refresh accounts after successful submission
                }
            });
        } else {
            toast.error(editPost ? "Failed to update" : "Failed to add", {
                autoClose: 1000
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs text-gray-900">
                <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Record" : "Add Record"}</h2>
                <FormFields
                    userName={userName} setuserName={setuserName}
                    ReferenceID={ReferenceID} setReferenceID={setReferenceID}
                    Title={Title} setTitle={setTitle}
                    Description={Description} setDescription={setDescription}
                    DateCreated={DateCreated} setDateCreated={setDateCreated}
                    editPost={editPost}
                />
                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">{editPost ? "Update" : "Submit"}</button>
                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Back</button>
                </div>
            </form>
            <ToastContainer className="text-xs" autoClose={1000} />
        </>
    );
};

export default AddTracking;

