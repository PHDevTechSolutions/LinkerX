import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

type OptionType = {
    value: string;
    label: string;
};

interface FormFieldsProps {
    UserId: string; setUserId: (value: string) => void;
    userName: string; setuserName: (value: string) => void;
    Role: string; setRole: (value: string) => void;
    ReferenceID: string; setReferenceID: (value: string) => void;
    SalesAgentName: string; setSalesAgentName: (value: string) => void;

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

    SalesManager: any; setSalesManager: (value: any) => void;
    SalesAgent: any; setSalesAgent: (value: any) => void;

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
    QuotationNumber: string; setQuotationNumber: (value: string) => void;
    QuotationAmount: string; setQuotationAmount: (value: string) => void;
    SODate: string; setSODate: (value: string) => void;
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
    SalesAgentName, setSalesAgentName,
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

    SONumber, setSONumber, PONumber, setPONumber, SODate, setSODate, PaymentTerms, setPaymentTerms,
    QuotationNumber, setQuotationNumber, QuotationAmount, setQuotationAmount,
    PaymentDate, setPaymentDate, DeliveryDate, setDeliveryDate, POStatus, setPOStatus, POSource, setPOSource,

    createdAt, setcreatedAt,
    editPost
}) => {

    const [isInput, setIsInput] = useState(false); // toggle state
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

    const [salesManagers, setSalesManagers] = useState<OptionType[]>([]);
    const [salesAgents, setSalesAgents] = useState<OptionType[]>([]);

    useEffect(() => {
        const fetchTSM = async () => {
            try {
                const response = await fetch("/api/tsm?Roles=Territory Sales Manager,Ecommerce Manager, HR Manager, Manager");
                if (!response.ok) throw new Error("Failed to fetch managers");

                const data = await response.json();

                const options: OptionType[] = data.map((user: any) => ({
                    value: user.ReferenceID,
                    label: `${user.Firstname} ${user.Lastname}`,
                }));
                setSalesManagers(options);
            } catch (error) {
                console.error("Error fetching managers:", error);
            }
        };

        const fetchTSA = async () => {
            try {
                const response = await fetch("/api/tsa?Roles=Territory Sales Associate,E-Commerce Staff");
                if (!response.ok) throw new Error("Failed to fetch agents");

                const data = await response.json();

                const options: OptionType[] = data.map((user: any) => ({
                    value: user.ReferenceID,
                    label: `${user.Firstname} ${user.Lastname}`,
                }));
                setSalesAgents(options);
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };

        fetchTSM();
        fetchTSA();
    }, []);

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/1 md:w-1/6 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ticketReferenceNumber">Ticket Reference Number</label>
                    <input type="text" id="ticketReferenceNumber" value={TicketReferenceNumber} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                </div>
                <div className="w-full sm:w-1/1 md:w-1/6 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ticketReferenceNumber">Date Created</label>
                    <input type="datetime-local" id="createdAt" value={createdAt} onChange={(e) => setcreatedAt(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
                </div>
            </div>
            <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                <h1 className="text-lg font-bold mb-2">Account Information</h1>
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full sm:w-1/2 md:w-1/2 px-4">
                        <input type="hidden" id="SalesAgentName" value={SalesAgentName || ""} onChange={(e) => setSalesAgentName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                        <input type="hidden" id="Role" value={Role || ""} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                        <input type="hidden" id="UserId" value={UserId || ""} onChange={(e) => setUserId(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                        <input type="hidden" id="Username" value={userName || ""} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                        <input type="hidden" id="ReferenceID" value={ReferenceID || ""} onChange={(e) => setReferenceID(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled />
                        <label className="block text-xs font-bold mb-2" htmlFor="CompanyName">Company Name</label>
                        <div className='flex items-center gap-1'>
                            <button type="button" onClick={() => setIsInput(!isInput)}
                            className="text-xs px-3 py-2 border rounded hover:bg-blue-500 hover:text-white transition">
                            <HiOutlineSwitchHorizontal size={15}/>
                        </button>
                        {isInput ? (
                            <input
                                type="text"
                                id="CompanyName"
                                value={CompanyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full px-3 py-2 border rounded text-xs"
                                placeholder="Enter Company Name"
                            />
                        ) : (
                            <Select
                                id="CompanyName"
                                options={CompanyOptions}
                                onChange={handleCompanyChange}
                                className="w-full text-xs"
                                placeholder="Select Company"
                                isClearable
                            />
                        )}
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="CustomerName">Customer Name</label>
                        <input type="text" id="CustomerName" value={CustomerName || ""} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="Gender">Gender</label>
                        <select id="Gender" value={Gender || ""} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
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
                        <select id="CustomerSegment" value={CustomerSegment} onChange={(e) => setCustomerSegment(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" required>
                            <option value="">Select Segment</option>
                            <option value="Agriculture, Hunting and Forestry">Agriculture, Hunting and Forestry</option>
                            <option value="Fishing">Fishing</option>
                            <option value="Mining">Mining</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Electricity, Gas and Water">Electricity, Gas and Water</option>
                            <option value="Construction">Construction</option>
                            <option value="Wholesale and Retail">Wholesale and Retail</option>
                            <option value="Hotels and Restaurants">Hotels and Restaurants</option>
                            <option value="Transport, Storage and Communication">Transport, Storage and Communication</option>
                            <option value="Finance and Insurance">Finance and Insurance</option>
                            <option value="Real State and Rentings">Real State and Rentings</option>
                            <option value="Education">Education</option>
                            <option value="Health and Social Work">Health and Social Work</option>
                            <option value="Personal Services">Personal Services</option>
                            <option value="Government Offices">Government Offices</option>
                            <option value="Data Center">Data Center</option>
                        </select>
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
                        <option value="Job Applicants">Job Applicants</option>
                        <option value="Supplier/Vendor Product Offer">Supplier/Vendor Product Offer</option>
                        <option value="Follow Up Non-Sales">Follow Up Non-Sales</option>
                        <option value="Internal Whistle Blower">Internal Whistle Blower</option>
                        <option value="Threats/Extortion/Intimidation">Threats/Extortion/Intimidation</option>
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
                        <option value="Site Visit">Site Visit</option>
                        <option value="Agent Call">Agent Call</option>
                        <option value="Catalogue">Catalogue</option>
                        <option value="Shopee">Shopee</option>
                        <option value="Lazada">Lazada</option>
                        <option value="Tiktok">Tiktok</option>
                        <option value="WorldBex">Worldbex</option>
                        <option value="PhilConstruct">PhilConstruct</option>
                        <option value="Conex">Conex</option>
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

            {editPost ? (
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
            ) : (
                // You can add alternative UI here if needed when not in edit mode
                <></>
            )}

            {Remarks === "PO Received" && (
                <>
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="PONumber">PO Number</label>
                            <input type="text" id="PONumber" value={PONumber || ""} onChange={(e) => setPONumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="SODate">SO Date</label>
                            <input type="datetime-local" id="SODate" value={SODate || ""} onChange={(e) => setSODate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
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
                            <label className="block text-xs font-bold mb-2" htmlFor="POStatus">Remarks</label>
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
                        <option value="Procurement">Procurement</option>
                        <option value="Sales Department">Sales Department</option>
                        <option value="Warehouse">Warehouse</option>
                    </select>
                </div>
                {/* Sales Manager Dropdown */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2 bg-white-300 px-2 py-1">
                        Manager
                    </label>
                    <Select
                        options={salesManagers}
                        value={salesManagers.find((option) => option.value === SalesManager) || null}
                        onChange={(selected: OptionType | null) => setSalesManager(selected?.value || "")}
                        placeholder="Select Manager"
                        isSearchable
                        className="text-xs capitalize"
                    />
                </div>

                {WrapUp !== "Job Applicants" && (
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2 bg-white-300 px-2 py-1">
                            Sales Agent
                        </label>
                        <Select
                            options={salesAgents}
                            value={salesAgents.find((option) => option.value === SalesAgent) || null}
                            onChange={(selected: OptionType | null) => {
                                setSalesAgent(selected?.value || ""); // Set the selected agent's ReferenceID
                                // Find the full name of the selected agent and update the SalesAgentName field
                                const selectedAgent = salesAgents.find((agent) => agent.value === selected?.value);
                                setSalesAgentName(selectedAgent ? `${selectedAgent.label}` : ""); // Update SalesAgentName
                            }}
                            placeholder="Select Agent"
                            isSearchable
                            className="text-xs capitalize"
                        />
                    </div>
                )}

                {WrapUp !== "Job Applicants" && (
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
                )}
            </div>

            {Remarks === "Quotation For Approval" && (
                <>
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="QuotationNumber">Quotation Reference Number</label>
                            <input type="text" id="QuotationNumber" value={QuotationNumber || ""} onChange={(e) => setQuotationNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="QuotationAmount">Quotation Amount</label>
                            <input type="number" id="QuotationAmount" value={QuotationAmount || ""} onChange={(e) => setQuotationAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                    </div>
                </>
            )}

            {editPost ? (
                <>
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="QuotationNumber">Quotation Reference Number</label>
                            <input type="text" id="QuotationNumber" value={QuotationNumber || ""} onChange={(e) => setQuotationNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="QuotationAmount">Quotation Amount</label>
                            <input type="number" id="QuotationAmount" value={QuotationAmount || ""} onChange={(e) => setQuotationAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}

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

            {(Remarks !== "PO Received" && WrapUp !== "Job Applicants") && (
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full sm:w-1/1 md:w-1/1 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="Inquiries">Inquiry / Concern</label>
                        <textarea id="Inquiries" value={Inquiries || ""} onChange={(e) => setInquiries(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={5}></textarea>
                    </div>
                </div>
            )}

            {WrapUp !== "Job Applicants" && (
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
            )}
        </>
    );
};

export default ActivityFormFields;
