"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./FormFields";
import { CiSaveUp1, CiTurnL1, CiEdit } from "react-icons/ci";

interface AddAccountFormProps {
    onCancel: () => void;
    refreshPosts: () => void;  // Add a refreshPosts callback
    userName: any;
    editPost?: any; // Optional prop for the post being edited
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({ onCancel, refreshPosts, userName, editPost }) => {
    const [CompanyName, setCompanyName] = useState(editPost ? editPost.CompanyName : "");
    const [CustomerName, setCustomerName] = useState(editPost ? editPost.CustomerName : "");
    const [Gender, setGender] = useState(editPost ? editPost.Gender : "");
    const [ContactNumber, setContactNumber] = useState(editPost ? editPost.ContactNumber : "");
    const [Email, setEmail] = useState(editPost ? editPost.Email : "");
    const [CityAddress, setCityAddress] = useState(editPost ? editPost.CityAddress : "");
    const [CustomerSegment, setCustomerSegment] = useState(editPost ? editPost.CustomerSegment : "");
    const [CustomerType, setCustomerType] = useState(editPost ? editPost.CustomerType : "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editPost 
        ? `/api/Data/Applications/Ecodesk/Accounts/Edit` 
        : `/api/Data/Applications/Ecodesk/Accounts/Create`; 
        const method = editPost ? "PUT" : "POST"; // HTTP method changes based on edit or add

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                CompanyName,
                CustomerName,
                Gender,
                ContactNumber,
                Email,
                CityAddress,
                CustomerSegment,
                CustomerType,
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
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs text-gray-900">
                <h2 className="text-xs font-bold mb-4">{editPost ? "Modify Account Details" : "Register New"}</h2>
                <p className="mb-2">This section allows users to either add a new client account or edit an existing one. The form captures essential details such as the company name, customer name, gender, contact number, email, city address, customer segment, and customer type. When editing an account, the fields are pre-filled with existing data for easy modification.</p>
                <FormFields
                    CompanyName={CompanyName}
                    setCompanyName={setCompanyName}
                    CustomerName={CustomerName}
                    setCustomerName={setCustomerName}
                    Gender={Gender}
                    setGender={setGender}
                    ContactNumber={ContactNumber}
                    setContactNumber={setContactNumber}
                    Email={Email}
                    setEmail={setEmail}
                    CityAddress={CityAddress}
                    setCityAddress={setCityAddress}
                    CustomerSegment={CustomerSegment}
                    setCustomerSegment={setCustomerSegment}
                    CustomerType={CustomerType}
                    setCustomerType={setCustomerType}
                    editPost={editPost}
                />
                <div className="flex justify-end mb-4 gap-1 text-[10px]">
                    <button type="submit" className="bg-blue-400 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center">
                        {editPost ? <CiEdit size={15} /> : <CiSaveUp1 size={15} />}
                        {editPost ? "Update" : "Submit"}
                    </button>
                    <button
                        type="button"
                        className="hover:bg-gray-100 px-4 py-2 border rounded flex items-center gap-1"
                        onClick={onCancel}
                    >
                        <CiTurnL1 size={15} /> Back
                    </button>
                </div>
            </form>
            <ToastContainer className="text-xs" autoClose={1000} />
        </>
    );
};

export default AddAccountForm;

