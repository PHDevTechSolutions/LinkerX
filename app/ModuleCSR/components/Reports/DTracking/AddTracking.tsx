"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddTrackingFields from "./AddTrackingFields";
import { FetchUserName } from "../../FetchUsername";

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
    const [DateRecord, setDateRecord] = useState(editPost ? editPost.DateRecord : "");
    const [CompanyName, setCompanyName] = useState(editPost ? editPost.CompanyName : "");
    const [CustomerName, setCustomerName] = useState(editPost ? editPost.CustomerName : "");
    const [ContactNumber, setContactNumber] = useState(editPost ? editPost.ContactNumber : "");
    const [TicketType, setTicketType] = useState(editPost ? editPost.TicketType : "");
    const [TicketConcern, setTicketConcern] = useState(editPost ? editPost.TicketConcern : "");
    const [TrackingStatus, setTrackingStatus] = useState(editPost ? editPost.TrackingStatus : "");
    const [TrackingRemarks, setTrackingRemarks] = useState(editPost ? editPost.TrackingRemarks : "");

    const [Department, setDepartment] = useState(editPost ? editPost.Department : "");
    const [EndorsedDate, setEndorsedDate] = useState(editPost ? editPost.EndorsedDate : "");
    const [ClosedDate, setClosedDate] = useState(editPost ? editPost.ClosedDate : "");

    const [SalesAgent, setSalesAgent] = useState(editPost ? editPost.SalesAgent : "");
    const [SalesManager, setSalesManager] = useState(editPost ? editPost.SalesManager : "");
    const [SalesAgentName, setSalesAgentName] = useState(editPost ? editPost.SalesAgentName : "");
    const [NatureConcern, setNatureConcern] = useState(editPost ? editPost.NatureConcern : "");
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("id");
        if (userId) {
            FetchUserName(userId, setuserName);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editPost ? `/api/ModuleCSR/DTracking/EditTracking` : `/api/ModuleCSR/DTracking/CreateTracking`; // API endpoint changes based on edit or add
        const method = editPost ? "PUT" : "POST"; // HTTP method changes based on edit or add

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName,
                ReferenceID,
                DateRecord,
                CompanyName,
                CustomerName,
                ContactNumber,
                TicketType,
                TicketConcern,
                TrackingRemarks,
                TrackingStatus,
                Department,
                EndorsedDate,
                ClosedDate,
                SalesAgent,
                SalesManager,
                NatureConcern,
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
                <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Record" : "Add Record"}</h2>
                <AddTrackingFields
                    userName={userName}
                    setuserName={setuserName}
                    ReferenceID={ReferenceID}
                    setReferenceID={setReferenceID}
                    DateRecord={DateRecord}
                    setDateRecord={setDateRecord}
                    CompanyName={CompanyName}
                    setCompanyName={setCompanyName}
                    CustomerName={CustomerName}
                    setCustomerName={setCustomerName}
                    ContactNumber={ContactNumber}
                    setContactNumber={setContactNumber}
                    TicketType={TicketType}
                    setTicketType={setTicketType}
                    TicketConcern={TicketConcern}
                    setTicketConcern={setTicketConcern}
                    TrackingRemarks={TrackingRemarks}
                    setTrackingRemarks={setTrackingRemarks}
                    TrackingStatus={TrackingStatus}
                    setTrackingStatus={setTrackingStatus}

                    Department={Department}
                    setDepartment={setDepartment}
                    EndorsedDate={EndorsedDate}
                    setEndorsedDate={setEndorsedDate}
                    ClosedDate={ClosedDate}
                    setClosedDate={setClosedDate}

                    SalesAgent={SalesAgent}
                    setSalesAgent={setSalesAgent}
                    SalesManager={SalesManager}
                    setSalesManager={setSalesManager}
                    SalesAgentName={SalesAgentName}
                    setSalesAgentName={setSalesAgentName}

                    NatureConcern={NatureConcern}
                    setNatureConcern={setNatureConcern}

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

