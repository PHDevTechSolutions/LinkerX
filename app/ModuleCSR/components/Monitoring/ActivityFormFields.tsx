import React, { useState, useEffect } from 'react';
import Select from 'react-select';

interface FormFieldsProps {
    UserId: string; setUserId: (value: string) => void;
    userName: string; setuserName: (value: string) => void;
    Role: string; setRole: (value: string) => void;
    ReferenceID: string; setReferenceID: (value: string) => void;

    TicketReferenceNumber: string; setTicketReferenceNumber: (value: string) => void;
    CompanyName: string; setCompanyName: (value: string) => void;
    CustomerName: string; setCustomerName: (value: string) => void;
    Gender: string; setGender: (value: string) => void;
    ContactNumber: string; setContactNumber: (value: string) => void;
    Email: string; setEmail: (value: string) => void;
    CustomerSegment: string; setCustomerSegment: (value: string) => void;
    CityAddress: string; setCityAddress: (value: string) => void;
    Channel: string; setChannel: (value: string) => void;
    WrapUp: string; setWrapUp: (value: string) => void;
    Source: string; setSource: (value: string) => void;
    CustomerType: string; setCustomerType: (value: string) => void;
    CustomerStatus: string; setCustomerStatus: (value: string) => void;
    Status: string; setStatus: (value: string) => void;

    Amount: number | string;
    setAmount: (value: number | string) => void;

    QtySold: number | string;
    setQtySold: (value: number | string) => void;

    SalesManager: string; setSalesManager: (value: string) => void;
    SalesAgent: string; setSalesAgent: (value: string) => void;
    TicketReceived: string; setTicketReceived: (value: string) => void;
    TicketEndorsed: string; setTicketEndorsed: (value: string) => void;
    TsmAcknowledgeDate: string; setTsmAcknowledgeDate: (value: string) => void;
    TsaAcknowledgeDate: string; setTsaAcknowledgeDate: (value: string) => void;
    TsmHandlingTime: string; setTsmHandlingTime: (value: string) => void;
    TsaHandlingTime: string; setTsaHandlingTime: (value: string) => void;
    Remarks: string; setRemarks: (value: string) => void;
    // Remarks Hidden Fields
    ItemCode: string; setItemCode: (value: string) => void;
    ItemDescription: string; setItemDescription: (value: string) => void;

    // PO Received Hidden Fields
    SONumber: string; setSONumber: (value: string) => void;
    PONumber: string; setPONumber: (value: string) => void;
    SODate: string; setSODate: (value: string) => void;
    SOAmount: string; setSOAmount: (value: string) => void;
    PaymentTerms: string; setPaymentTerms: (value: string) => void;
    PaymentDate: string; setPaymentDate: (value: string) => void;
    DeliveryDate: string; setDeliveryDate: (value: string) => void;
    POStatus: string; setPOStatus: (value: string) => void;
    POSource: string; setPOSource: (value: string) => void;

    Traffic: string; setTraffic: (value: string) => void;
    Inquiries: string; setInquiries: (value: string) => void;
    Department: string; setDepartment: (value: string) => void;

    createdAt: string; setcreatedAt: (value: string) => void;

    editPost?: any;
}

const ActivityFormFields: React.FC<FormFieldsProps> = ({
    UserId, setUserId,

    TicketReferenceNumber, setTicketReferenceNumber,
    userName, setuserName, Role, setRole, ReferenceID, setReferenceID,

    CompanyName, setCompanyName, CustomerName, setCustomerName,
    Gender, setGender, ContactNumber, setContactNumber, Email, setEmail, CustomerSegment, setCustomerSegment,
    CityAddress, setCityAddress, Channel, setChannel,
    WrapUp, setWrapUp, Source, setSource,
    CustomerType, setCustomerType, CustomerStatus, setCustomerStatus,
    Status, setStatus,
    Amount, setAmount,
    QtySold, setQtySold,
    SalesManager, setSalesManager, SalesAgent, setSalesAgent,
    TicketReceived, setTicketReceived, TicketEndorsed, setTicketEndorsed,
    TsmAcknowledgeDate, setTsmAcknowledgeDate, TsaAcknowledgeDate, setTsaAcknowledgeDate,
    TsmHandlingTime, setTsmHandlingTime, TsaHandlingTime, setTsaHandlingTime, Remarks, setRemarks,
    ItemCode, setItemCode, ItemDescription, setItemDescription,
    Traffic, setTraffic, Inquiries, setInquiries, Department, setDepartment,
    SOAmount, setSOAmount,

    SONumber, setSONumber, PONumber, setPONumber, SODate, setSODate, PaymentTerms, setPaymentTerms,
    PaymentDate, setPaymentDate, DeliveryDate, setDeliveryDate, POStatus, setPOStatus, POSource, setPOSource,

    createdAt, setcreatedAt,
    editPost
}) => {
    const [companies, setCompanies] = useState<any[]>([]);
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Convert to number if possible, else keep it as string
        const parsedValue = value ? parseFloat(value) : "";
        setAmount(parsedValue); // Update Amount with parsed value (could be number or empty string)
    };
    const handleQtySoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Convert to number if possible, else keep it as string
        const parsedValue = value ? parseFloat(value) : "";
        setQtySold(parsedValue); // Update Amount with parsed value (could be number or empty string)
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('/api/ModuleCSR/companies');
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompanies();
    }, []);

    const CompanyOptions = companies.map((company) => ({
        value: company.CompanyName,
        label: company.CompanyName,
    }));

    const handleCompanyChange = async (selectedOption: any) => {
        const selectedCompany = selectedOption ? selectedOption.value : '';
        setCompanyName(selectedCompany);

        if (selectedCompany) {
            try {
                const response = await fetch(`/api/ModuleCSR/companies?CompanyName=${encodeURIComponent(selectedCompany)}`);
                if (response.ok) {
                    const companyDetails = await response.json();
                    setCustomerName(companyDetails.CustomerName || '');
                    setGender(companyDetails.Gender || '');
                    setContactNumber(companyDetails.ContactNumber || '');
                    setEmail(companyDetails.Email || '');
                    setCustomerSegment(companyDetails.CustomerSegment || '');
                    setCityAddress(companyDetails.CityAddress || '');
                    setCustomerType(companyDetails.CustomerType || '');
                } else {
                    console.error(`Company not found: ${selectedCompany}`);
                    resetFields();
                }
            } catch (error) {
                console.error('Error fetching company details:', error);
                resetFields();
            }
        } else {
            resetFields();
        }
    };

    const resetFields = () => {
        setCustomerName('');
        setGender('');
        setContactNumber('');
        setEmail('');
        setCustomerSegment('');
        setCityAddress('');
    };

    const [isEditing, setIsEditing] = useState(false);

    const generateTicketReferenceNumber = () => {
        const randomNumber = Math.floor(100000000 + Math.random() * 1000000000); // Ensures a 9-digit number
        return `CSR-TICKET-${randomNumber}`;
    };

    useEffect(() => {
        if (editPost) {
            setIsEditing(true);
            setTicketReferenceNumber(editPost.TicketReferenceNumber); // Set the existing value in edit mode
        } else {
            setIsEditing(false);
            setTicketReferenceNumber(generateTicketReferenceNumber()); // Generate only in create mode
        }
    }, [editPost, setTicketReferenceNumber]);

    useEffect(() => {
        console.log("ReferenceID on render:", ReferenceID);
    }, [ReferenceID]);

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/1 md:w-1/6 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ticketReferenceNumber">Ticket Reference Number</label>
                    <input type="text" id="ticketReferenceNumber" value={TicketReferenceNumber} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                    <p className="mt-1 text-green-900 text-[10px]">Auto Generate Ticket</p>
                </div>
                <div className="w-full sm:w-1/1 md:w-1/6 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ticketReferenceNumber">Date Today</label>
                    <input type="datetime-local" id="createdAt" value={createdAt} onChange={(e) => setcreatedAt(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                </div>
            </div>
            <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                <h1 className="text-lg font-bold mb-2">Account Information</h1>
                <p className="mb-4">
                    This section manages account details, including company name, customer information, and contact details.
                    Certain fields like Role, User ID, and Reference ID are hidden and non-editable. When adding a new account,
                    users can select a company from a dropdown, while in edit mode, the company name is read-only. Other fields
                    allow input for customer details to ensure accurate record-keeping.
                </p>

                <div className="flex flex-wrap -mx-4">
                    <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
                        <input type="hidden" id="Role" value={Role || ""} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                        <input type="hidden" id="UserId" value={UserId || ""} onChange={(e) => setUserId(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                        <input type="hidden" id="Username" value={userName || ""} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                        <input type="hidden" id="ReferenceID" value={ReferenceID || ""} onChange={(e) => setReferenceID(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled />
                        <label className="block text-xs font-bold mb-2" htmlFor="CompanyName">Company Name</label>
                        {editPost ? (
                            <input type="text" id="CompanyName" value={CompanyName} readOnly className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" />
                        ) : (
                            <Select id="CompanyName" options={CompanyOptions} onChange={handleCompanyChange} className="w-full text-xs capitalize" placeholder="Select Company" isClearable />
                        )}
                        <p className="text-[10px]">Click Select to Choose a Company</p>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="CustomerName">Customer Name</label>
                        <input type="text" id="CustomerName" value={CustomerName || ""} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="Gender">Gender</label>
                        <input type="text" id="Gender" value={Gender || ""} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-2">
                        <label className="block text-xs font-bold mb-2" htmlFor="ContactNumber">Contact Number</label>
                        <input type="text" id="ContactNumber" value={ContactNumber || ""} onChange={(e) => setContactNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="Email">Email</label>
                        <input type="text" id="Email" value={Email || ""} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="ClientSegment">Client Segment</label>
                        <input type="text" id="CustomerSegment" value={CustomerSegment || ""} onChange={(e) => setCustomerSegment(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="CityAddress">City Address</label>
                        <input type="text" id="CityAddress" value={CityAddress || ""} onChange={(e) => setCityAddress(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-yellow-300 px-2 py-1 rounded w-40" htmlFor="Traffic"><span>Traffic</span></label>
                    <select id="Traffic" value={Traffic || ""} onChange={(e) => setTraffic(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Traffic</option>
                        <option value="Sales">Sales</option>
                        <option value="Non-Sales">Non-Sales</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-yellow-300 px-2 py-1 rounded w-40" htmlFor="TicketReceived">Ticket Received</label>
                    <input
                        type="datetime-local"
                        id="TicketReceived"
                        value={TicketReceived || ""}
                        onChange={(e) => setTicketReceived(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                        required
                    />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-yellow-300 px-2 py-1 rounded w-40" htmlFor="TicketEndorsed">Ticket Endorsed</label>
                    <input
                        type="datetime-local"
                        id="TicketEndorsed"
                        value={TicketEndorsed || ""}
                        onChange={(e) => setTicketEndorsed(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                        required
                    />
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-yellow-300 px-2 py-1 rounded w-40" htmlFor="Channel">Channel</label>
                    <select id="Channel" value={Channel || ""} onChange={(e) => setChannel(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" required>
                        <option value="">Select Channel</option>
                        <option value="Google Maps">Google Maps</option>
                        <option value="Website">Website</option>
                        <option value="FB Main">FB Main</option>
                        <option value="FB ES Home">FB ES Home</option>
                        <option value="Viber">Viber</option>
                        <option value="Text Message">Text Message</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Voice Call">Voice Call</option>
                        <option value="Email">Email</option>
                        <option value="Whatsapp">Whatsapp</option>
                        <option value="Shopify">Shopify</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-yellow-300 px-2 py-1 rounded w-40" htmlFor="WrapUp">Wrap-Up</label>
                    <select id="WrapUp" value={WrapUp || ""} onChange={(e) => setWrapUp(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" required>
                        <option value="">Select Wrap Up</option>
                        <option value="Customer Order">Customer Order</option>
                        <option value="Customer Inquiry Sales">Customer Inquiry Sales</option>
                        <option value="Customer Inquiry Non-Sales">Customer Inquiry Non-Sales</option>
                        <option value="Follow Up Sales">Follow Up Sales</option>
                        <option value="After Sales">After Sales</option>
                        <option value="Customer Complaint">Customer Complaint</option>
                        <option value="Customer Feedback/Recommendation">Customer Feedback/Recommendation</option>
                        <option value="Job Inquiry">Job Inquiry</option>
                        <option value="Job Applicants">Job Applicants</option>
                        <option value="Supplier/Vendor Product Offer">Supplier/Vendor Product Offer</option>
                        <option value="Follow Up Non-Sales">Follow Up Non-Sales</option>
                        <option value="Internal Whistle Blower">Internal Whistle Blower</option>
                        <option value="Threats/Extortion/Intimidation">Threats/Extortion/Intimidation</option>
                        <option value="Prank Call">Prank Call</option>
                        <option value="Supplier Accreditation Request">Supplier Accreditation Request</option>
                        <option value="Internal Concern">Internal Concern</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Source">Source</label>
                    <select id="Source" value={Source || ""} onChange={(e) => setSource(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Source</option>
                        <option value="FB Ads">FB Ads</option>
                        <option value="Viber Community / Viber">Viber Community / Viber</option>
                        <option value="Whatsapp Community / Whatsapp">Whatsapp Community / Whatsapp</option>
                        <option value="SMS">SMS</option>
                        <option value="Website">Website</option>
                        <option value="Word of Mouth">Word of Mouth</option>
                        <option value="Quotation Docs">Quotation Docs</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Email Blast">Email Blast</option>
                        <option value="Agent Call">Agent Call</option>
                        <option value="Catalogue">Catalogue</option>
                        <option value="Shopee">Shopee</option>
                        <option value="Lazada">Lazada</option>
                        <option value="Tiktok">Tiktok</option>
                        <option value="WorldBex">Worldbex</option>
                        <option value="PhilConstruct">PhilConstruct</option>
                        <option value="Calendar">Calendar</option>
                        <option value="Product Demo">Product Demo</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-yellow-300 px-2 py-1 rounded w-40" htmlFor="CustomerType">Customer Type</label>
                    <select id="CustomerType" value={CustomerType || ""} onChange={(e) => setCustomerType(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Type</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C">B2C</option>
                        <option value="B2G">B2G</option>
                        <option value="Gentrade">Gentrade</option>
                        <option value="Modern Trade">Modern Trade</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-yellow-300 px-2 py-1 rounded w-40" htmlFor="CustomerStatus">Customer Status</label>
                    <select id="CustomerStatus" value={CustomerStatus || ""} onChange={(e) => setCustomerStatus(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Customer Status</option>
                        <option value="New Client">New Client</option>
                        <option value="New Non-Buying">New Non-Buying</option>
                        <option value="Existing Active">Existing Active</option>
                        <option value="Existing Inactive">Existing Inactive</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-yellow-300 px-2 py-1 rounded w-40" htmlFor="Status">Status</label>
                    <select id="Status" value={Status || ""} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" required>
                        <option value="">Select Status</option>
                        <option value="Closed">Closed</option>
                        <option value="Endorsed">Endorsed</option>
                        <option value="Converted Into Sales">Converted Into Sales</option>
                    </select>
                </div>
            </div>
            {Status === "Converted Into Sales" && (
                <>
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="SONumber">SO Number</label>
                            <input type="text" id="SONumber" value={SONumber || ""} onChange={(e) => setSONumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="Amount">Amount</label>
                            <input type="number" id="Amount" value={Amount || ""} onChange={handleAmountChange} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="QtySold">QTY Sold</label>
                            <input type="number" id="QtySold" value={QtySold || ""} onChange={handleQtySoldChange} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                    </div>
                </>
            )}

            {Remarks === "PO Received" && (
                <>
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="PONumber">PO Number / Signed Quotation Number</label>
                            <input type="text" id="PONumber" value={PONumber || ""} onChange={(e) => setPONumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="SODate">SO Date</label>
                            <input type="datetime-local" id="SODate" value={SODate || ""} onChange={(e) => setSODate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="SONumber">SO Number</label>
                            <input type="text" id="SONumber" value={SONumber || ""} onChange={(e) => setSONumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="SODate">SO Amount</label>
                            <input type="text" id="SOAmount" value={SOAmount || ""} onChange={(e) => setSOAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="PaymentTerms">Payment Terms</label>
                            <select id="PaymentTerms" value={PaymentTerms || ""} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                                <option value="">Select Payment Terms</option>
                                <option value="Cash">Cash</option>
                                <option value="30 Days Terms">30 Days Terms</option>
                                <option value="Bank Deposit">Bank Deposit</option>
                                <option value="Dated Check">Dated Check</option>
                            </select>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="POSource">PO Source</label>
                            <select id="POSource" value={POSource || ""} onChange={(e) => setPOSource(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                                <option value="">Select Source</option>
                                <option value="CS Email">CS Email</option>
                                <option value="Sales Email">Sales Email</option>
                                <option value="Sales Agent">Sales Agent</option>
                            </select>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="PaymentDate">Payment Date</label>
                            <input type="datetime-local" id="PaymentDate" value={PaymentDate || ""} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="DeliveryDate">Delivery Date</label>
                            <input type="datetime-local" id="DeliveryDate" value={DeliveryDate || ""} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/1 md:w-1/1 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="POStatus">PO Status</label>
                            <textarea id="POStatus" value={POStatus || ""} onChange={(e) => setPOStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" rows={5} />
                        </div>
                    </div>
                </>
            )}

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-yellow-300 px-2 py-1 rounded w-40" htmlFor="QtySold">Department</label>
                    <select id="Department" value={Department || ""} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Department</option>
                        <option value="Accounting">Accounting</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Purchasing">Purchasing</option>
                        <option value="Sales Department">Sales Department</option>
                        <option value="Warehouse">Warehouse</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-white-300 px-2 py-1" htmlFor="SalesManager">Sales Manager</label>
                    <select id="SalesManager" value={SalesManager || ""} onChange={(e) => setSalesManager(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Manager</option>
                        <option value="AB-NCR-000">AB-NCR-000 - Angie Baldugo</option>
                        <option value="JA-NCR-000">JA-NCR-000 - Jerry Abaluyan</option>
                        <option value="RT-NCR-000">RT-NCR-000 - Roy Tayuman</option>
                        <option value="RR-SLN-000">RR-SLN-000 - Rudolf Rosales</option>
                        <option value="NTL-DVO-000">NTL-DVO-000 - Nathan Legazpi</option>
                        <option value="AD-NCR-000">AD-NCR-000 - Anjello Divinagracia</option>
                        <option value="SH-DA-000">SH-DA-000 - Sette Hosena</option>
                        <option value="RDC-R1-000">RDC-R1-000 - Ronald Dela Cueva</option>
                        <option value="JD-PBS-000">JD-PBS-000 - James Danganan</option>
                        <option value="Elizabeth Mabalay">Elizabeth Mabalay</option>
                        <option value="RG-CBU-000">RG-CBU-000 - Robert Gonzales</option>
                        <option value="Chi Mercado">Chi Mercado</option>
                        <option value="RME-CDO-000">RME-CDO-000 - Ray Michael Estimo</option>
                        <option value="LR-NCR-000">(TEST ACCOUNT)</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-white-300 px-2 py-1" htmlFor="SalesAgent">Sales Agent</label>
                    <select id="SalesAgent" value={SalesAgent || ""} onChange={(e) => setSalesAgent(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Agent</option>
                        <option value="Airish, Echanes">Airish, Echanes</option>
                        <option value="RME-CDO-006">RME-CDO-006 - Abelou, Sanchez</option>
                        <option value="RT-NCR-016">RT-NCR-016 - Agnes Angeli, Panopio</option>
                        <option value="RME-CDO-001">RME-CDO-001 - Andrew, Banaglorosio</option>
                        <option value="AB-NCR-006">AB-NCR-006 - Ansley, Patelo</option>
                        <option value="NTL-DVO-004">NTL-DVO-004 - Arteo Angelo, Beseril</option>
                        <option value="RT-NCR-001">RT-NCR-001 - Banjo, Lising</option>
                        <option value="RT-NCR-018">RT-NCR-018 - Brian, Zantua</option>
                        <option value="AB-NCR-011">AB-NCR-011 - Candy, Notob</option>
                        <option value="RT-NCR-013">RT-NCR-013 - Cesar, Paredes</option>
                        <option value="RDC-R1-001">RDC-R1-001 - Cris, Acierto</option>
                        <option value="AB-NCR-002">AB-NCR-002 - Cristy, Bobis</option>
                        <option value="RT-NCR-006">RT-NCR-006 - Dionisio, Doyugan</option>
                        <option value="NTL-DVO-003">NTL-DVO-003 - Duke, Menil</option>
                        <option value="RT-NCR-014">RT-NCR-014 - Erish Tomas, Cajipe</option>
                        <option value="AB-NCR-008">AB-NCR-008 - Erwin, Laude</option>
                        <option value="RT-NCR-009">RT-NCR-009 - Eryll Joyce, Encina</option>
                        <option value="JP-CBU-003">JP-CBU-003 - Ferdinand, Canete</option>
                        <option value="Florencio, Jacinto Jr">Florencio, Jacinto Jr</option>
                        <option value="RT-NCR-024">RT-NCR-024 - Fortunato, Mabingnay</option>
                        <option value="RT-NCR-005">RT-NCR-005 - Gene Mark, Roxas</option>
                        <option value="RT-NCR-004">RT-NCR-004 - Gretchell, Aquino</option>
                        <option value="JD-001">JD-001 - Jayvee, Atienza</option>
                        <option value="RT-016">RT-016 - Jean, Dela Cerna</option>
                        <option value="AB-NCR-007">AB-NCR-007 - Jeff, Puying</option>
                        <option value="RT-NCR-002">RT-NCR-002 - Jeffrey, Lacson</option>
                        <option value="Jessie, De Guzman">Jessie, De Guzman</option>
                        <option value="JS-NCR-001">JS-NCR-001 - Jonna, Clarin</option>
                        <option value="JS-NCR-005">JS-NCR-005 - Julius, Abuel</option>
                        <option value="AB-NCR-003">AB-NCR-003 - Joseph, Candazo</option>
                        <option value="RT-NCR-023">RT-NCR-023 - Joy Merel, Soriente</option>
                        <option value="NTL-DVO-001">NTL-DVO-001 - Khay, Yango</option>
                        <option value="SH-DA-001">SH-DA-001 - Krista, Ilaya</option>
                        <option value="RT-NCR-011">RT-NCR-011 - Krizelle, Payno</option>
                        <option value="RME-CDO-002">RME-CDO-002 - Kurt, Guanco</option>
                        <option value="RT-NCR-003">RT-NCR-003 - Lotty, Deguzman</option>
                        <option value="JP-CBU-002">JP-CBU-002 - Mark, Villagonzalo</option>
                        <option value="JS-NCR-003">JS-NCR-003 - Michael, Quijano</option>
                        <option value="Merie, Tumbado">Merie, Tumbado</option>
                        <option value="RT-NCR-021">RT-NCR-021 - Niko, Gertes</option>
                        <option value="RR-SLN-002">RR-SLN-002 - Patrick, Managuelod</option>
                        <option value="Paula, Cauguiran">Paula, Cauguiran</option>
                        <option value="AB-NCR-009">AB-NCR-009 - Princess Joy, Ambre</option>
                        <option value="RT-NCR-019">RT-NCR-019 - Richard, Esteban</option>
                        <option value="JP-CBU-004">JP-CBU-004 - Reynaldo, Piedad</option>
                        <option value="RT-NCR-015">RT-NCR-015 - Randy, Bacor</option>
                        <option value="RT-NCR-008">RT-NCR-008 - Rodelio, Ico</option>
                        <option value="RT-NCR-007">RT-NCR-007 - Rodolfo, Delizo</option>
                        <option value="RT-018">RT-018 - Rosemarie, Nollora</option>
                        <option value="RT-017">RT-017 - Roselyn, Barnes</option>
                        <option value="JS-NCR-002">JS-NCR-002 - Sherilyn, Rapote</option>
                        <option value="AB-NCR-005">AB-NCR-005 - Vincent, Ortiz</option>
                        <option value="AB-NCR-001">AB-NCR-001 - Wilnie, Ardelozo</option>
                        <option value="NTL-DVO-000">NTL-DVO-000 - Mamolo, Juverson</option>
                        <option value="LX-NCR-001">(TEST ACCOUNT)</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-white-300 px-2 py-1" htmlFor="Remarks">Remarks</label>
                    <select id="Remarks" value={Remarks || ""} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" >
                        <option value="">Select Remarks</option>
                        <option value="No Stocks / Insufficient Stocks">No Stocks / Insufficient Stocks</option>
                        <option value="Item Not Carried">Item Not Carried</option>
                        <option value="Quotation For Approval">Quotation For Approval</option>
                        <option value="Customer Requested Cancellation">Customer Requested Cancellation</option>
                        <option value="Accreditation / Partnership">Accreditation / Partnership</option>
                        <option value="For Spf">For Spf</option>
                        <option value="No Response From Client">No Response From Client</option>
                        <option value="Assisted">Assisted</option>
                        <option value="Disapproved Quotation">Disapproved Quotation</option>
                        <option value="For Site Visit">For Site Visit</option>
                        <option value="Non Standard Item">Non Standard Item</option>
                        <option value="PO Received">PO Received</option>
                        <option value="Not Converted to Sales">Not Converted to Sales</option>
                        <option value="For Occular Inspection">For Occular Inspection</option>
                        <option value="Sold">Sold</option>
                    </select>
                </div>
            </div>

            {Remarks === "No Stocks / Insufficient Stocks" || Remarks === "Item Not Carried" || Remarks === "Non Standard Item" ? (
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full sm:w-1/1 md:w-1/2 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="ItemCode">Item Code</label>
                        <input
                            type="text"
                            id="ItemCode"
                            value={ItemCode || ""}
                            onChange={(e) => setItemCode(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-xs"
                        />
                    </div>
                    <div className="w-full sm:w-1/1 md:w-1/2 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="ItemDescription">Item Description</label>
                        <textarea id="ItemDescription" value={ItemDescription || ""} onChange={(e) => setItemDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" rows={3} />
                    </div>
                </div>
            ) : null}

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/1 md:w-1/1 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Inquiries">
                        Inquiry / Concern
                    </label>
                    <textarea
                        id="Inquiries"
                        value={Inquiries || ""}
                        onChange={(e) => setInquiries(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                        rows={5}
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">
                        {Inquiries.length} / 5000 characters
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TsmAcknowledgeDate">TSM Acknowledge Date</label>
                    <input
                        type="datetime-local"
                        id="TsmAcknowledgeDate"
                        value={TsmAcknowledgeDate || ""}
                        onChange={(e) => setTsmAcknowledgeDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                    />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TsaAcknowledgeDate">TSA Acknowledge Date</label>
                    <input
                        type="datetime-local"
                        id="TsaAcknowledgeDate"
                        value={TsaAcknowledgeDate || ""}
                        onChange={(e) => setTsaAcknowledgeDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                    />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TsmHandlingTime">TSM Handling Time</label>
                    <input
                        type="datetime-local"
                        id="TsmHandlingTime"
                        value={TsmHandlingTime || ""}
                        onChange={(e) => setTsmHandlingTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                    />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TsaHandlingTime">TSA Handling Time</label>
                    <input
                        type="datetime-local"
                        id="TsaHandlingTime"
                        value={TsaHandlingTime || ""}
                        onChange={(e) => setTsaHandlingTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                    />
                </div>
            </div>
        </>
    );
};

export default ActivityFormFields;
