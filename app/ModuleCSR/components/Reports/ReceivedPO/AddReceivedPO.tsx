"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReceivedPOFields from "./ReceivedPOFields";
import { FetchUserName } from "../../FetchUsername";

interface AddSkuListingProps {
    onCancel: () => void;
    refreshPosts: () => void;  // Add a refreshPosts callback
    userName: string;
    userDetails: {
        id: string;
        Role: string;
        ReferenceID: string;
      };
    editPost?: any; // Optional prop for the post being edited
}

const AddReceivedPO: React.FC<AddSkuListingProps> = ({ userDetails, onCancel, refreshPosts, editPost }) => {
    const [UserID, setUserID] = useState("")
    const [userName, setuserName] = useState("");
    const [ReferenceID, setReferenceID] = useState(editPost ? editPost.ReferenceID : userDetails.ReferenceID);
    const [DateTime, setDateTime] = useState(editPost ? editPost.DateTime : "");
    const [CompanyName, setCompanyName] = useState(editPost ? editPost.CompanyName : "");
    const [ContactNumber, setContactNumber] = useState(editPost ? editPost.ContactNumber : "");
    const [PONumber, setPONumber] = useState(editPost ? editPost.PONumber : "");
    const [POAmount, setPOAmount] = useState(editPost ? editPost.POAmount : "");
    const [SONumber, setSONumber] = useState(editPost ? editPost.SONumber : "");
    const [SODate, setSODate] = useState(editPost ? editPost.SODate : "");
    const [SalesAgent, setSalesAgent] = useState(editPost ? editPost.SalesAgent : "");
    const [PaymentTerms, setPaymentTerms] = useState(editPost ? editPost.PaymentTerms : "");
    const [PaymentDate, setPaymentDate] = useState(editPost ? editPost.PaymentDate : "");
    const [DeliveryPickupDate, setDeliveryPickupDate] = useState(editPost ? editPost.DeliveryPickupDate : "");
    const [POStatus, setPOStatus] = useState(editPost ? editPost.POStatus : "");
    const [POSource, setPOSource] = useState(editPost ? editPost.POSource : "");
    const [Remarks, setRemarks] = useState(editPost ? editPost.Remarks : "");

    const [SalesAgentName, setSalesAgentName] = useState(editPost ? editPost.SalesAgentName : "");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("id");
        if (userId) {
            FetchUserName(userId, setuserName);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editPost ? `/api/ModuleCSR/ReceivedPO/EditReceivedPO` : `/api/ModuleCSR/ReceivedPO/CreateReceivedPO`; // API endpoint changes based on edit or add
        const method = editPost ? "PUT" : "POST"; // HTTP method changes based on edit or add

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                ReferenceID,
                DateTime,
                CompanyName,
                ContactNumber,
                PONumber,
                POAmount,
                SONumber,
                SODate,
                SalesAgent,
                PaymentTerms,
                PaymentDate,
                DeliveryPickupDate,
                POStatus,
                POSource,
                Remarks,
                id: editPost ? editPost._id : undefined, // Send post ID if editing
            }),
        });

        if (response.ok) {
            toast.success(editPost ? "Received PO updated successfully" : "Received PO added successfully", {
                autoClose: 1000,
                onClose: () => {
                    onCancel(); // Hide the form after submission
                    refreshPosts(); // Refresh accounts after successful submission
                }
            });
        } else {
            toast.error(editPost ? "Failed to update Received PO" : "Failed to add Received PO", {
                autoClose: 1000
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs text-gray-900">
                <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Received PO" : "Add Received PO"}</h2>
                <ReceivedPOFields
                    userName={userName}
                    setuserName={setuserName}

                    ReferenceID={ReferenceID}
                    setReferenceID={setReferenceID}

                    DateTime={DateTime}
                    setDateTime={setDateTime}
                    CompanyName={CompanyName}
                    setCompanyName={setCompanyName}
                    ContactNumber={ContactNumber}
                    setContactNumber={setContactNumber}
                    PONumber={PONumber}
                    setPONumber={setPONumber}
                    POAmount={POAmount}
                    setPOAmount={setPOAmount}
                    SONumber={SONumber}
                    setSONumber={setSONumber}
                    SODate={SODate}
                    setSODate={setSODate}
                    SalesAgent={SalesAgent}
                    setSalesAgent={setSalesAgent}
                    PaymentTerms={PaymentTerms}
                    setPaymentTerms={setPaymentTerms}
                    PaymentDate={PaymentDate}
                    setPaymentDate={setPaymentDate}
                    DeliveryPickupDate={DeliveryPickupDate}
                    setDeliveryPickupDate={setDeliveryPickupDate}
                    POStatus={POStatus}
                    setPOStatus={setPOStatus}
                    POSource={POSource}
                    setPOSource={setPOSource}

                    Remarks={Remarks}
                    setRemarks={setRemarks}
                    SalesAgentName={SalesAgentName}
                    setSalesAgentName={setSalesAgentName}
                    
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

export default AddReceivedPO;

