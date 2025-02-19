"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./AccountFormFields";

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

    const url = editPost ? `/api/ModuleCSR/Accounts/EditAccounts` : `/api/ModuleCSR/Accounts/CreateAccounts`; // API endpoint changes based on edit or add
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
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Account" : "Add New Account"}</h2>
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
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">{editPost ? "Update" : "Submit"}</button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddAccountForm;

