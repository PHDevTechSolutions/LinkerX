"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./ActivityFormFields";
import { FetchUserName } from "./FetchUsername";

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
    
    const [SalesAgentName, setSalesAgentName] = useState("");
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
    const [PONumber, setPONumber] = useState(editPost ? editPost.PONumber : "");
    const [QuotationNumber, setQuotationNumber] = useState(editPost ? editPost.QuotationNumber: "");
    const [QuotationAmount, setQuotationAmount] = useState(editPost ? editPost.QuotationAmount : "");
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
            : "/api/ModuleCSR/Monitorings/CreateActivity";
        const method = editPost ? "PUT" : "POST";

        try {
            // Submit main request (EditActivity or CreateActivity) to MongoDB
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
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
                    PONumber,
                    QuotationNumber,
                    QuotationAmount,
                    SODate,
                    PaymentTerms,
                    PaymentDate,
                    DeliveryDate,
                    POStatus,
                    POSource,
                    createdAt,
                    id: editPost ? editPost._id : undefined,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to submit: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("MongoDB Response:", responseData);

            // ✅ Show success toast for MongoDB submission
            toast.success(editPost ? "Account updated successfully" : "Account added successfully", {
                autoClose: 1000,
                onClose: () => {
                    onCancel();
                    refreshPosts();
                },
            });


            if (Status !== "Endorsed") {
                console.warn("Submission not forwarded to PostgreSQL due to status:", Status);
                toast.info("Submission saved, but not forwarded as status is not 'Endorsed'.", {
                    autoClose: 2000,
                });
                return;
            }

            // ✅ Proceed with PostgreSQL request only if status is "Endorsed"
            const postgresResponse = await fetch("/api/ModuleCSR/AutomatedTickets/CreateUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    csragent: ReferenceID,
                    referenceid: SalesAgent,
                    salesagentname: SalesAgentName,
                    tsm: SalesManager,
                    ticketreferencenumber: TicketReferenceNumber,
                    companyname: CompanyName,
                    contactperson: CustomerName,
                    contactnumber: ContactNumber,
                    emailaddress: Email,
                    address: CityAddress,
                    status: Status,
                    wrapup: WrapUp,
                    inquiries: Inquiries,
                    typeclient: "CSR Inquiries",
                }),
            });

            if (!postgresResponse.ok) {
                const errorText = await postgresResponse.text();
                throw new Error(`Failed to forward data to PostgreSQL: ${postgresResponse.status} - ${errorText}`);
            }

            const postgresData = await postgresResponse.json();
            console.log("PostgreSQL Response:", postgresData);

        } catch (error: any) {
            console.error("Error:", error);
            toast.error(error.message || "An error occurred. Please try again.", {
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
                <FormFields
                    UserId={UserId} setUserId={setUserId}

                    TicketReferenceNumber={TicketReferenceNumber}
                    setTicketReferenceNumber={setTicketReferenceNumber}

                    SalesAgentName={SalesAgentName}
                    setSalesAgentName={setSalesAgentName}

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
                    PONumber={PONumber}
                    setPONumber={setPONumber}
                    QuotationNumber={QuotationNumber}
                    setQuotationNumber={setQuotationNumber}
                    QuotationAmount={QuotationAmount}
                    setQuotationAmount={setQuotationAmount}
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
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">{editPost ? "Update" : "Submit"}</button>
                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Back</button>
                </div>
            </form>
            <ToastContainer className="text-xs" autoClose={1000} />
        </>
    );
};

export default AddAccountForm;

