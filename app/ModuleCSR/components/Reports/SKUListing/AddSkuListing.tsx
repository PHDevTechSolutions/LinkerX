"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SkuFormFields from "./SkuFormFields";
import { FetchUserName } from "./FetchUsername";

interface AddSkuListingProps {
    onCancel: () => void;
    refreshPosts: () => void;  // Add a refreshPosts callback
    userName: string;
    editPost?: any; // Optional prop for the post being edited
}

const AddSkuListing: React.FC<AddSkuListingProps> = ({ onCancel, refreshPosts, editPost }) => {
    const [UserID, setUserID] = useState("")
    const [userName, setuserName] = useState("");
    const [CompanyName, setCompanyName] = useState(editPost ? editPost.CompanyName : "");
    const [Remarks, setRemarks] = useState(editPost ? editPost.Remarks : "");
    const [ItemCode, setItemCode] = useState(editPost ? editPost.ItemCode : "");
    const [ItemDescription, setItemDescription] = useState(editPost ? editPost.ItemDescription : "");
    const [QtySold, setQtySold] = useState(editPost ? editPost.QtySold : "");
    const [SalesAgent, setSalesAgent] = useState(editPost ? editPost.SalesAgent : "");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("id");
        if (userId) {
            FetchUserName(userId, setuserName);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editPost ? `/api/ModuleCSR/SkuListing/EditSku` : `/api/ModuleCSR/SkuListing/CreateSku`; // API endpoint changes based on edit or add
        const method = editPost ? "PUT" : "POST"; // HTTP method changes based on edit or add

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                CompanyName,
                Remarks,
                ItemCode,
                ItemDescription,
                QtySold,
                SalesAgent,
                id: editPost ? editPost._id : undefined, // Send post ID if editing
            }),
        });

        if (response.ok) {
            toast.success(editPost ? "Account updated successfully" : "Account added successfully", {
                autoClose: 1000,
                onClose: () => {
                    onCancel(); // Hide the form after submission
                    refreshPosts(); // Refresh accounts after successful submission
                }
            });
        } else {
            toast.error(editPost ? "Failed to update account" : "Failed to add account", {
                autoClose: 1000
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
                <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Account" : "Add New Account"}</h2>
                <SkuFormFields
                    userName={userName}
                    setuserName={setuserName}
                    UserID={UserID}
                    setUserID={setUserID}
                    CompanyName={CompanyName}
                    setCompanyName={setCompanyName}
                    Remarks={Remarks}
                    setRemarks={setRemarks}
                    ItemCode={ItemCode}
                    setItemCode={setItemCode}
                    ItemDescription={ItemDescription}
                    setItemDescription={setItemDescription}
                    QtySold={QtySold}
                    setQtySold={setQtySold}
                    SalesAgent={SalesAgent}
                    setSalesAgent={setSalesAgent}
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

export default AddSkuListing;

