"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./ActivityFormFields";
import { FetchUserName } from "./FetchUsername";
import { CiSaveUp1, CiCircleRemove, CiEdit } from "react-icons/ci";

interface AddAccountFormProps {
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

const AddAccountForm: React.FC<AddAccountFormProps> = ({ userDetails, onCancel, refreshPosts, editPost }) => {
  const [UserId, setUserId] = useState(editPost ? editPost._id : userDetails.id);
  const [Role, setRole] = useState(editPost ? editPost.Role : userDetails.Role);
  const [ReferenceID, setReferenceID] = useState(editPost ? editPost.ReferenceID : userDetails.ReferenceID);

  const [TicketReferenceNumber, setTicketReferenceNumber] = useState("");
  const [userName, setuserName] = useState("");
  const [CompanyName, setCompanyName] = useState(editPost ? editPost.CompanyName : "");
  const [CustomerName, setCustomerName] = useState(editPost ? editPost.CustomerName : "");
  const [Gender, setGender] = useState(editPost ? editPost.Gender : "");
  const [ContactNumber, setContactNumber] = useState(editPost ? editPost.ContactNumber : "");
  const [Email, setEmail] = useState(editPost ? editPost.Email : "");
  const [CustomerSegment, setCustomerSegment] = useState(editPost ? editPost.CustomerSegment : "");
  const [CityAddress, setCityAddress] = useState(editPost ? editPost.CityAddress : "");
  const [Channel, setChannel] = useState(editPost ? editPost.Channel : "");
  const [WrapUp, setWrapUp] = useState(editPost ? editPost.WrapUp : "");
  const [Source, setSource] = useState(editPost ? editPost.Source : "");
  const [CustomerType, setCustomerType] = useState(editPost ? editPost.CustomerType : "");
  const [CustomerStatus, setCustomerStatus] = useState(editPost ? editPost.CustomerStatus : "");
  const [Status, setStatus] = useState(editPost ? editPost.Status : "");

  const [Amount, setAmount] = useState<number | string>(editPost ? Number(editPost.Amount) || "" : "");
  const [QtySold, setQtySold] = useState<number | string>(editPost ? Number(editPost.QtySold) || "" : "");

  const [SalesManager, setSalesManager] = useState(editPost ? editPost.SalesManager : "");
  const [SalesAgent, setSalesAgent] = useState(editPost ? editPost.SalesAgent : "");
  const [TicketReceived, setTicketReceived] = useState(editPost ? editPost.TicketReceived : "");
  const [TicketEndorsed, setTicketEndorsed] = useState(editPost ? editPost.TicketEndorsed : "");
  const [TsmAcknowledgeDate, setTsmAcknowledgeDate] = useState(editPost ? editPost.TsmAcknowledgeDate : "");
  const [TsaAcknowledgeDate, setTsaAcknowledgeDate] = useState(editPost ? editPost.TsaAcknowledgeDate : "");
  const [TsmHandlingTime, setTsmHandlingTime] = useState(editPost ? editPost.TsmHandlingTime : "");
  const [TsaHandlingTime, setTsaHandlingTime] = useState(editPost ? editPost.TsaHandlingTime : "");
  const [Remarks, setRemarks] = useState(editPost ? editPost.Remarks : "");
  const [Traffic, setTraffic] = useState(editPost ? editPost.Traffic : "");
  const [Inquiries, setInquiries] = useState(editPost ? editPost.Inquiries : "");
  const [Department, setDepartment] = useState(editPost ? editPost.Department : "");

  const [ItemCode, setItemCode] = useState(editPost ? editPost.ItemCode : "");
  const [ItemDescription, setItemDescription] = useState(editPost ? editPost.ItemDescription : "");

  const [SONumber, setSONumber] = useState(editPost ? editPost.SONumber : "");
  const [SOAmount, setSOAmount] = useState(editPost ? editPost.SOAmount : "");
  const [PONumber, setPONumber] = useState(editPost ? editPost.PONumber : "");
  const [SODate, setSODate] = useState(editPost ? editPost.SODate : "");
  const [PaymentTerms, setPaymentTerms] = useState(editPost ? editPost.PaymentTerms : "");
  const [PaymentDate, setPaymentDate] = useState(editPost ? editPost.PaymentDate : "");
  const [DeliveryDate, setDeliveryDate] = useState(editPost ? editPost.DeliveryDate : "");
  const [POStatus, setPOStatus] = useState(editPost ? editPost.POStatus : "");
  const [POSource, setPOSource] = useState(editPost ? editPost.POSource : "");

  const [createdAt, setcreatedAt] = useState(editPost ? editPost.createdAt : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editPost
      ? "/api/ModuleCSR/Monitorings/EditActivity"
      : "/api/ModuleCSR/Monitorings/CreateActivity"; // API endpoint changes based on edit or add
    const method = editPost ? "PUT" : "POST"; // HTTP method changes based on edit or add

    try {
      // Submit main request (EditActivity or CreateActivity)
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId,
          TicketReferenceNumber,
          userName,
          Role,
          ReferenceID,
          CompanyName,
          CustomerName,
          Gender,
          ContactNumber,
          Email,
          CustomerSegment,
          CityAddress,
          Channel,
          WrapUp,
          Source,
          CustomerType,
          CustomerStatus,
          Status,
          Amount,
          QtySold,
          SalesManager,
          SalesAgent,
          TicketReceived,
          TicketEndorsed,
          TsmAcknowledgeDate,
          TsaAcknowledgeDate,
          TsmHandlingTime,
          TsaHandlingTime,
          Remarks,
          Traffic,
          Inquiries,
          Department,
          ItemCode,
          ItemDescription,
          SONumber,
          SOAmount,
          PONumber,
          SODate,
          PaymentTerms,
          PaymentDate,
          DeliveryDate,
          POStatus,
          POSource,
          createdAt,
          id: editPost ? editPost._id : undefined, // Send post ID if editing
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.status}`);
      }

      // Forward SalesManager & SalesAgent to data.php
      const dataResponse = await fetch("https://ecoshiftcorp.com.ph/data.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TicketReferenceNumber,
          SalesManager,
          SalesAgent,
          CompanyName,
          CustomerName,
          ContactNumber,
          Email,
          CityAddress,
          Status,
          WrapUp,
          Inquiries,
        }),
      });

      if (!dataResponse.ok) {
        throw new Error(`Failed to forward SalesManager & SalesAgent: ${dataResponse.status}`);
      }

      // Show success message and refresh posts
      toast.success(editPost ? "Account updated successfully" : "Account added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel(); // Hide the form after submission
          refreshPosts(); // Refresh accounts after successful submission
        },
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", {
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");
    if (userId) {
      FetchUserName(userId, setuserName); // Use the function
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs text-gray-900">
        <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Account" : "Add New Account"}</h2>
        <p className="text-xs text-gray-600 mb-4">
          This form is used to create and manage tickets. It allows users to enter
          detailed information such as customer details, ticket reference numbers,
          sales data, handling times, and other relevant fields. Users can also
          update existing tickets to reflect changes in status, endorsements,
          and remarks.
        </p>
        <FormFields
          UserId={UserId} setUserId={setUserId}

          TicketReferenceNumber={TicketReferenceNumber}
          setTicketReferenceNumber={setTicketReferenceNumber}

          userName={userName}
          setuserName={setuserName}
          Role={Role}
          setRole={setRole}
          ReferenceID={ReferenceID}
          setReferenceID={setReferenceID}

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
          CustomerSegment={CustomerSegment}
          setCustomerSegment={setCustomerSegment}
          CityAddress={CityAddress}
          setCityAddress={setCityAddress}
          Channel={Channel}
          setChannel={setChannel}
          WrapUp={WrapUp}
          setWrapUp={setWrapUp}
          Source={Source}
          setSource={setSource}
          CustomerType={CustomerType}
          setCustomerType={setCustomerType}
          CustomerStatus={CustomerStatus}
          setCustomerStatus={setCustomerStatus}
          Status={Status}
          setStatus={setStatus}
          Amount={Amount}
          setAmount={setAmount}
          QtySold={QtySold}
          setQtySold={setQtySold}
          SalesManager={SalesManager}
          setSalesManager={setSalesManager}
          SalesAgent={SalesAgent}
          setSalesAgent={setSalesAgent}
          TicketReceived={TicketReceived}
          setTicketReceived={setTicketReceived}
          TicketEndorsed={TicketEndorsed}
          setTicketEndorsed={setTicketEndorsed}
          TsmAcknowledgeDate={TsmAcknowledgeDate}
          setTsmAcknowledgeDate={setTsmAcknowledgeDate}
          TsaAcknowledgeDate={TsaAcknowledgeDate}
          setTsaAcknowledgeDate={setTsaAcknowledgeDate}
          TsmHandlingTime={TsmHandlingTime}
          setTsmHandlingTime={setTsmHandlingTime}
          TsaHandlingTime={TsaHandlingTime}
          setTsaHandlingTime={setTsaHandlingTime}
          Remarks={Remarks}
          setRemarks={setRemarks}
          Traffic={Traffic}
          setTraffic={setTraffic}
          Inquiries={Inquiries}
          setInquiries={setInquiries}
          Department={Department}
          setDepartment={setDepartment}

          ItemCode={ItemCode}
          setItemCode={setItemCode}
          ItemDescription={ItemDescription}
          setItemDescription={setItemDescription}

          SONumber={SONumber}
          setSONumber={setSONumber}
          SOAmount={SOAmount}
          setSOAmount={setSOAmount}
          PONumber={PONumber}
          setPONumber={setPONumber}
          SODate={SODate}
          setSODate={setSODate}
          PaymentTerms={PaymentTerms}
          setPaymentTerms={setPaymentTerms}
          PaymentDate={PaymentDate}
          setPaymentDate={setPaymentDate}
          DeliveryDate={DeliveryDate}
          setDeliveryDate={setDeliveryDate}
          POStatus={POStatus}
          setPOStatus={setPOStatus}
          POSource={POSource}
          setPOSource={setPOSource}

          createdAt={createdAt}
          setcreatedAt={setcreatedAt}

          editPost={editPost}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded text-xs flex items-center gap-1">
            {editPost ? <CiEdit size={20} /> : <CiSaveUp1 size={20} />}
            {editPost ? "Update" : "Submit"}
          </button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs flex items-center gap-1" onClick={onCancel}><CiCircleRemove size={20} />Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddAccountForm;

