import React, { useEffect, useState, useRef } from "react";
import Select from 'react-select';
import { CiCircleMinus, CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import { CiPaperplane } from "react-icons/ci";

const activityGroups = {
    "Account Development": ["Account Development"],
    Accounting: [
        "Accounts Receivable and Payment",
        "Billing Concern",
        "Refund Request",
        "Sales Order Concern",
        "TPC Request",
    ],
    "Admin Concern": ["Coordination of Payment Terms Request"],
    CSR: ["CSR Inquiries"],
    Coordination: [
        "Pick-Up / Delivery to Client",
        "With CS (Email Acknowledgement)",
    ],
    Marketing: ["Marketing Concern"],
    Communication: ["Email and Viber Checking", "Email Blast", "Email, SMS & Viber Replies"],
    "Calls and Follow-Ups": ["Inbound Call", "Outbound Call", "Payment Follow-Up", "Quotation Follow-Up"],
    Logistics: ["Shipping Cost Estimation"],
    Preparation: [
        "Bidding Preparation",
        "Preparation of Report",
        "Preparation of SPF",
        "Quote: New Client",
        "Quote: Existing Client",
        "Sales Order Preparation",
    ],
    Technical: [
        "Dialux Simulation Request",
        "Drawing Request",
        "Inquiry",
        "Site Visit Request",
        "TDS Request",
    ],
    Warehouse: [
        "Coordination to Billing",
        "Coordination to Dispatch",
        "Coordination to Inventory",
        "Delivery / Helper Concern",
        "Replacement Request / Concern",
        "Sample Request / Concern",
        "SO Status Follow Up",
    ],
    Other: ["Walk-In Client", "Delivered"],
};

interface Activity {
    id: number;
    typeactivity: string;
    callback: string;
    callstatus: string;
    typecall: string;
    remarks: string;
    quotationnumber: string;
    quotationamount: string;
    sonumber: string;
    soamount: string;
    activitystatus: string;
    date_created: string;
}

interface FormFieldsProps {
    referenceid: string; setreferenceid: (value: string) => void;
    manager: string; setmanager: (value: string) => void;
    tsm: string; settsm: (value: string) => void;
    targetquota: string; settargetquota: (value: string) => void;

    companyname: string; setcompanyname: (value: string) => void;
    contactperson: string; setcontactperson: (value: string) => void;
    contactnumber: string; setcontactnumber: (value: string) => void;
    emailaddress: string; setemailaddress: (value: string) => void;
    typeclient: string; settypeclient: (value: string) => void;
    address: string; setaddress: (value: string) => void;
    deliveryaddress: string; setdeliveryaddress: (value: string) => void;
    area: string; setarea: (value: string) => void;
    projectname: string; setprojectname: (value: string) => void;
    projectcategory: string; setprojectcategory: (value: string) => void;
    projecttype: string; setprojecttype: (value: string) => void;
    source: string; setsource: (value: string) => void;
    typeactivity: string; settypeactivity: (value: string) => void;
    remarks: string; setremarks: (value: string) => void;
    callback: string; setcallback: (value: string) => void;
    typecall: string; settypecall: (value: string) => void;
    quotationnumber: string; setquotationnumber: (value: string) => void;
    quotationamount: string; setquotationamount: (value: string) => void;
    sonumber: string; setsonumber: (value: string) => void;
    soamount: string; setsoamount: (value: string) => void;
    actualsales: string; setactualsales: (value: string) => void;
    callstatus: string; setcallstatus: (value: string) => void;

    startdate: string; setstartdate: (value: string) => void;
    enddate: string; setenddate: (value: string) => void;
    activitynumber: string; setactivitynumber: (value: string) => void;
    activitystatus: string; setactivitystatus: (value: string) => void;

    ticketreferencenumber: string; setticketreferencenumber: (value: string) => void;
    wrapup: string; setwrapup: (value: string) => void;
    inquiries: string; setinquiries: (value: string) => void;
    csragent: string; setcsragent: (value: string) => void;


    currentRecords: Activity[];
    editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
    referenceid, setreferenceid,
    manager, setmanager,
    tsm, settsm,
    targetquota, settargetquota,

    companyname, setcompanyname,
    contactperson, setcontactperson,
    contactnumber, setcontactnumber,
    emailaddress, setemailaddress,
    typeclient, settypeclient,
    address, setaddress,
    deliveryaddress, setdeliveryaddress,
    area, setarea,
    projectname, setprojectname,
    projectcategory, setprojectcategory,
    projecttype, setprojecttype,
    source, setsource,
    typeactivity, settypeactivity,
    remarks, setremarks,
    callback, setcallback,
    typecall, settypecall,
    quotationnumber, setquotationnumber,
    quotationamount, setquotationamount,
    sonumber, setsonumber,
    soamount, setsoamount,
    actualsales, setactualsales,
    callstatus, setcallstatus,

    startdate, setstartdate,
    enddate, setenddate,
    activitynumber, setactivitynumber,
    activitystatus, setactivitystatus,

    ticketreferencenumber, setticketreferencenumber,
    wrapup, setwrapup,
    inquiries, setinquiries,
    csragent, setcsragent,

    currentRecords, // Destructure the `currentRecords` prop
    editPost,
}) => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [contactPersons, setContactPersons] = useState<string[]>([]);
    const [contactNumbers, setContactNumbers] = useState<string[]>([]);
    const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const [showFields, setShowFields] = useState(false);
    const [showOutboundFields, setShowOutboundFields] = useState(false);
    const [showInboundFields, setShowInboundFields] = useState(false);
    const [showQuotationField, setShowQuotationField] = useState(false);
    const [showSOField, setShowSOField] = useState(false);
    const [showDeliverField, setShowDeliverField] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

    const [openGroup, setOpenGroup] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const isQuotationEmpty = !quotationnumber || !quotationamount;

    const [showInput, setShowInput] = useState(false);
    const [previousCompany, setPreviousCompany] = useState<any>(null);

    useEffect(() => {
        if (!tsm && referenceid) {
            settsm(referenceid);  // Set `tsm` from `referenceid` if `tsm` is empty
        }
    }, [referenceid, tsm]);

    // Handle the email selection and send request to the API
    const handleEmailSubmit = async () => {
        if (!emailaddress) {  // Check if emailaddress is empty or not
            alert("Please select an email.");
            return;
        }

        const response = await fetch("/api/sendEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailaddress,  // Use the selected email address directly here
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert("Email sent successfully!");
        } else {
            alert("Error sending email: " + data.message);
        }

        // Ensure the form stays visible and doesn't reload or navigate away
    };

    useEffect(() => {
        // Sort currentRecords by date_created in descending order
        const sortedRecords = [...currentRecords].sort((a, b) => {
            const dateA = new Date(a.date_created); // Assuming `date_created` is in string format or timestamp
            const dateB = new Date(b.date_created);
            return dateB.getTime() - dateA.getTime(); // Sort descending (most recent first)
        });

        // Get the last record's status from the sorted array (the most recent record)
        const lastRecord = sortedRecords[0]; // This will be the most recent record

        if (lastRecord) {
            setactivitystatus(lastRecord.activitystatus); // Set the activity status to the last record's activity status
        }

        // Automatically update the activity status based on input fields
        if (quotationnumber && quotationamount) {
            setactivitystatus("Warm"); // Set to Warm if Quotation number and amount are filled
        } else if (sonumber && soamount) {
            setactivitystatus("Hot"); // Set to Hot if SO number and amount are filled
        }

        // If actualsales has a value, set the status to Done
        if (actualsales) {
            setactivitystatus("Done"); // Set to Done if there's a value in actualsales
        }
    }, [currentRecords, quotationnumber, quotationamount, sonumber, soamount, actualsales]); // Added actualsales dependency    

    const generateActivityNumber = () => {
        if (editPost?.activitynumber) return; // Keep existing number in Edit Mode
        if (!companyname || !referenceid) return;

        const firstLetter = companyname.charAt(0).toUpperCase();
        const firstTwoRef = referenceid.substring(0, 2).toUpperCase();

        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
        }).replace("/", "");

        const randomNumber = String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6);

        const generatedNumber = `${firstLetter}-${firstTwoRef}-${formattedDate}-${randomNumber}`;
        setactivitynumber(generatedNumber);
    };

    useEffect(() => {
        if (!editPost) {
            generateActivityNumber();
        } else {
            setactivitynumber(editPost.activitynumber);
        }
    }, [editPost, companyname, referenceid]);

    useEffect(() => {
        if (referenceid) {
            // API call to fetch company data
            fetch(`/api/ModuleSales/Companies/CompanyAccounts/FetchAccount?referenceid=${referenceid}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        // Filter companies with status 'Active' or 'Used'
                        const filteredCompanies = data.data.filter((company: any) =>
                            company.status === 'Active' || company.status === 'Used'
                        );

                        setCompanies(filteredCompanies.map((company: any) => ({
                            id: company.id,  // Ensure `id` is included in the mapped object
                            companyname: company.companyname,
                            value: company.companyname,
                            label: company.companyname,
                            contactperson: company.contactperson,
                            contactnumber: company.contactnumber,
                            emailaddress: company.emailaddress,
                            typeclient: company.typeclient,
                            address: company.address,
                            area: company.area,
                        })));
                    } else {
                        console.error("Error fetching companies:", data.error);
                    }
                })
                .catch((error) => console.error("Error fetching companies:", error));
        }
    }, [referenceid]);

    useEffect(() => {
        setContactPersons(contactperson ? contactperson.split(", ") : [""]);
        setContactNumbers(contactnumber ? contactnumber.split(", ") : [""]);
        setEmailAddresses(emailaddress ? emailaddress.split(", ") : [""]);
    }, [contactperson, contactnumber, emailaddress]);

    const handleCompanySelect = async (selectedOption: any) => {
        const newStatus = selectedOption ? 'Active' : 'Used';

        try {
            // Check if previousCompany has a valid id
            if (previousCompany && previousCompany.id && previousCompany.id !== selectedOption?.id) {
                console.log("Updating previous company to Active:", previousCompany.id);
                const res = await fetch(`/api/ModuleSales/Task/DailyActivity/UpdateCompanyStatus`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: previousCompany.id, // Correct `id` being passed
                        status: 'Used',
                    }),
                });
                const data = await res.json();
                if (!data.success) {
                    console.error("Failed to update previous company:", data.error);
                }
            }

            // Check if selectedOption has valid data
            if (selectedOption && selectedOption.id) {
                console.log("Selected Company Data:", selectedOption);

                setPreviousCompany(selectedOption);
                setcompanyname(selectedOption.companyname);  // Ensure correct key name here
                setcontactperson(selectedOption.contactperson);
                setcontactnumber(selectedOption.contactnumber);
                setemailaddress(selectedOption.emailaddress);
                settypeclient(selectedOption.typeclient);
                setaddress(selectedOption.address);
                setarea(selectedOption.area);

                // Update the selected company to 'Used'
                console.log("Updating selected company status to:", newStatus);
                const res = await fetch(`/api/ModuleSales/Task/DailyActivity/UpdateCompanyStatus`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: selectedOption.id,  // Ensure `id` is passed correctly
                        status: newStatus,
                    }),
                });
                const data = await res.json();
                if (!data.success) {
                    console.error("Failed to update selected company:", data.error);
                }
            } else {
                console.log("No selected company, resetting form fields.");
                setPreviousCompany(null);
                setcompanyname("");
                setcontactperson("");
                setcontactnumber("");
                setemailaddress("");
                settypeclient("");
                setaddress("");
                setarea("");
            }
        } catch (error) {
            console.error("Unexpected error while updating company status:", error);
        }
    };

    const handleContactPersonChange = (index: number, value: string) => {
        const newContactPersons = [...contactPersons];
        newContactPersons[index] = value;
        setContactPersons(newContactPersons);
    };

    const handleContactNumberChange = (index: number, value: string) => {
        const newContactNumbers = [...contactNumbers];
        newContactNumbers[index] = value;
        setContactNumbers(newContactNumbers);
    };

    const handleEmailAddressChange = (index: number, value: string) => {
        const newEmailAddresses = [...emailAddresses];
        newEmailAddresses[index] = value;
        setEmailAddresses(newEmailAddresses);
    };

    const handleActivitySelection = (activity: string) => {
        console.log("Selected:", activity); // Debugging

        settypeactivity(activity);

        // Reset all fields
        setShowFields(false);
        setShowOutboundFields(false);
        setShowInboundFields(false);
        setShowQuotationField(false);
        setShowSOField(false);
        setShowDeliverField(false); // Reset the delivered field before checking

        const accountingActivities = [
            "Account Development",
            "Accounting: Accounts Receivable and Payment",
            "Accounting: Billing Concern",
            "Accounting: Refund Request",
            "Accounting: Sales Order Concern",
            "Accounting: TPC Request",
            "Admin Concern: Coordination of Payment Terms Request",
            "CSR Inquiries",
            "Coordination of Pick-Up / Delivery to Client",
            "Coordination With CS (Email Acknowledgement)",
            "Marketing Concern",
            "Email and Viber Checking",
            "Email Blast",
            "Email, SMS & Viber Replies",
            "Payment Follow-Up",
            "Quotation Follow-Up",
            "Logistic Concern: Shipping Cost Estimation",
            "Preparation: Bidding Preparation",
            "Preparation: Preparation of Report",
            "Preparation: Preparation of SPF",
            "Technical: Dialux Simulation Request",
            "Technical: Drawing Request",
            "Technical: Inquiry",
            "Technical: Site Visit Request",
            "Technical: TDS Request",
            "Walk-In Client",
            "Warehouse: Coordination to Billing",
            "Warehouse: Coordination to Dispatch",
            "Warehouse: Coordination to Inventory",
            "Warehouse: Delivery / Helper Concern",
            "Warehouse: Replacement Request / Concern",
            "Warehouse: Sample Request / Concern",
            "Warehouse: SO Status Follow Up",
        ];

        if (accountingActivities.includes(activity)) {
            setShowFields(true);
        } else if (activity === "Outbound Call") {
            setShowFields(true);
            setShowOutboundFields(true);
        } else if (activity === "Inbound Call") {
            setShowFields(true);
            setShowInboundFields(true);
        } else if (activity.includes("Preparation: Preparation of Quote")) {
            setShowFields(true);
            setShowQuotationField(true);
        } else if (activity.includes("Preparation: Sales Order Preparation")) {
            setShowFields(true);
            setShowSOField(true);
        } else if (activity.includes("Delivered")) {
            setShowFields(true);
            setShowDeliverField(true); // Trigger showing the delivered field when "Delivered" is selected
        }
    };

    useEffect(() => {
        if (dropdownRef.current) {
            dropdownRef.current.focus();
        }
    }, []);

    const getFormattedTimestamp = () => {
        const now = new Date();

        // Convert to YYYY-MM-DD HH:mm:ss format (MySQL TIMESTAMP)
        const formattedTimestamp = now
            .toLocaleString("en-US", { timeZone: "Asia/Manila" })
            .replace(",", ""); // Remove comma from formatted string

        return formattedTimestamp;
    };

    // Capture start date & time only once when the component mounts
    useEffect(() => {
        setstartdate(getFormattedTimestamp());
    }, []);

    // Continuously update end date & time in real-time
    useEffect(() => {
        const interval = setInterval(() => {
            setenddate(getFormattedTimestamp());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleCallbackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = e.target.value;

        if (selectedOption === "Select Callback") {
            setcallback("");
            setShowInput(false); // Hide input field
            return;
        }

        if (selectedOption === "Pick a DateTime") {
            setcallback(""); // Allow manual input
            setShowInput(true); // Show input field
            return;
        }

        setShowInput(false); // Hide input for predefined dates

        const today = new Date();
        let futureDate = new Date(today);

        switch (selectedOption) {
            case "Callback Tomorrow":
                futureDate.setDate(today.getDate() + 1);
                break;
            case "Callback After 3 Days":
                futureDate.setDate(today.getDate() + 3);
                break;
            case "Callback After a Week":
                futureDate.setDate(today.getDate() + 7);
                break;
            case "Callback After a Month":
                futureDate.setMonth(today.getMonth() + 1);
                break;
            case "Callback After a Year":
                futureDate.setFullYear(today.getFullYear() + 1);
                break;
            default:
                setcallback("");
                return;
        }

        // Set time to 08:00 AM
        futureDate.setHours(8, 0, 0, 0);

        // Convert to datetime-local format (YYYY-MM-DDTHH:MM)
        const formattedDate = futureDate.toISOString().slice(0, 16);

        setcallback(formattedDate);
    };

    const [isManual, setIsManual] = useState(false); // toggle state
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <input type="text" id="activitynumber" value={activitynumber ?? ""} onChange={() => { }} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly={!!editPost} />
                    <input type="hidden" id="referenceid" value={referenceid ?? ""} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    <input type="hidden" id="manager" value={manager ?? ""} onChange={(e) => setmanager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    <input type="hidden" id="tsm" value={tsm ?? ""} onChange={(e) => settsm(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    <input type="hidden" id="targetquota" value={targetquota ?? ""} onChange={(e) => settargetquota(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    <input type="hidden" value={startdate ?? ""} onChange={(e) => setstartdate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                    <input type="hidden" value={enddate ?? ""} onChange={(e) => setenddate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />

                    <input type="hidden" value={ticketreferencenumber ?? ""} onChange={(e) => setticketreferencenumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                    <input type="hidden" value={wrapup ?? ""} onChange={(e) => setwrapup(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                    <input type="hidden" value={inquiries ?? ""} onChange={(e) => setinquiries(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                    <input type="hidden" value={csragent ?? ""} onChange={(e) => setcsragent(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                {/* Company Name with Switch */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold" htmlFor="companyname">Company Name</label>
                        <button
                            type="button"
                            onClick={() => setIsManual(prev => !prev)}
                            className="text-blue-500 text-[10px] underline"
                        >
                            {isManual ? "If Account Exists Switch to Select" : "If Account is New Switch to Manual"}
                        </button>
                    </div>
                    {!isManual ? (
                        <>
                            <Select
                                id="CompanyName"
                                options={companies}
                                onChange={handleCompanySelect}
                                className="w-full text-xs capitalize"
                                placeholder="Select Company"
                                isClearable
                            />
                            {editPost ? (
                                <input
                                    type="text"
                                    id="companyname"
                                    value={editPost.companyname || ""}
                                    disabled
                                    className="text-xs capitalize w-full p-2 border border-gray-300 rounded-md mt-2"
                                />
                            ) : (
                                <input
                                    type="text"
                                    id="companyname"
                                    value={companyname ?? ""}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
                                        setcompanyname(sanitized);
                                    }}
                                    className="w-full px-3 py-2 border rounded text-xs capitalize mt-2"
                                    disabled
                                />
                            )}
                        </>
                    ) : (
                        <input
                            type="text"
                            id="companyname"
                            value={companyname ?? ""}
                            onChange={(e) => {
                                const input = e.target.value;
                                const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
                                setcompanyname(sanitized);
                            }}
                            className="w-full px-3 py-2 border rounded text-xs capitalize"
                        />
                    )}
                </div>

                {/* Contact Person */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Contact Person</label>
                    <input
                        type="text"
                        id="contactperson"
                        value={contactperson ?? ""}
                        onChange={(e) => {
                            const input = e.target.value;
                            const lettersOnly = input.replace(/[^a-zA-Z\s]/g, ""); // Allows only letters and spaces
                            setcontactperson(lettersOnly);
                        }}
                        className="w-full px-3 py-2 border rounded text-xs capitalize"
                    />
                </div>

                {/* Contact Number */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Contact Number</label>
                    <input
                        type="text"
                        id="contactnumber"
                        value={contactnumber ?? ""}
                        onChange={(e) => {
                            const input = e.target.value;
                            const numbersOnly = input.replace(/[^0-9]/g, ""); // Allows only digits
                            setcontactnumber(numbersOnly);
                        }}
                        className="w-full px-3 py-2 border rounded text-xs"
                    />
                </div>

                {/* Email Address */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Email Address</label>
                    <input
                        type="text"
                        id="emailaddress"
                        value={emailaddress ?? ""}
                        onChange={(e) => {
                            const input = e.target.value;
                            const allowed = input.replace(/[^a-zA-Z0-9@._-]/g, ""); // Allows typical email characters
                            setemailaddress(allowed);
                        }}
                        className="w-full px-3 py-2 border rounded text-xs"
                    />
                </div>

                {/* Type Client */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Type Client</label>
                    <select id="typeclient" value={typeclient ?? ""} onChange={(e) => settypeclient(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                        <option value="">Select Client</option>
                        <option value="Top 50">Top 50</option>
                        <option value="Next 30">Next 30</option>
                        <option value="Balance 20">Balance 20</option>
                        <option value="CSR Client">CSR Client</option>
                        <option value="TSA Client">TSA Client</option>
                    </select>
                </div>

                {/* Address */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Complete Address</label>
                    <input
                        type="text"
                        id="address"
                        value={address ?? ""}
                        onChange={(e) => {
                            const input = e.target.value;
                            const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
                            setaddress(sanitized);
                        }}
                        className="w-full px-3 py-2 border rounded text-xs capitalize"
                    />
                </div>

                {/* Delivery Address */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Delivery Address</label>
                    <input
                        type="text"
                        id="deliveryaddress"
                        value={deliveryaddress ?? ""}
                        onChange={(e) => {
                            const input = e.target.value;
                            const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
                            setdeliveryaddress(sanitized);
                        }}
                        className="w-full px-3 py-2 border rounded text-xs capitalize"
                    />
                </div>

                {/* Area */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Region</label>
                    <select id="typeclient" value={area ?? ""} onChange={(e) => setarea(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                        <option value="">Select Region</option>
                        <option value="Ilocos Region">Region I - Ilocos Region</option>
                        <option value="Cagayan Valley">Region II - Cagayan Valley</option>
                        <option value="Central Luzon">Region III - Central Luzon</option>
                        <option value="Calabarzon">Region IV - CALABARZON</option>
                        <option value="Bicol Region">Region V - Bicol Region</option>
                        <option value="Western Visayas">Region VI - Western Visayas</option>
                        <option value="Central Visayas">Region VII - Cental Visayas</option>
                        <option value="Easter Visayas">Region VIII - Easter Visayas</option>
                        <option value="Zamboanga Peninsula">Region VIX - Zamboanga Peninsula</option>
                        <option value="Northern Mindanao">Region X - Nothern Mindanao</option>
                        <option value="Davao Region">Region XI - Davao Region</option>
                        <option value="Soccsksargen">Region XII - SOCCSKSARGEN</option>
                        <option value="National Capital Region">NCR</option>
                        <option value="Cordillera Administrative Region">CAR</option>
                        <option value="Bangsamoro Autonomous Region in Muslim Mindanao">BARMM</option>
                        <option value="Caraga">Region XIII</option>
                        <option value="Mimaropa Region">MIMAROPA Region</option>
                    </select>
                </div>
            </div>

            <div>
                <div className="mb-4">
                    <div className="border rounded-lg shadow-sm">
                        {/* Accordion Header */}
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer transition"
                        >
                            <span className="text-xs text-dark">Project Information</span>
                            {isOpen ? <CiSquareMinus className="text-xl text-white" /> : <CiSquarePlus className="text-xl text-white" />}
                        </div>

                        {/* Accordion Content */}
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "p-4" : "max-h-0 p-0"}`}>
                            <div className="flex flex-wrap -mx-4 rounded">

                                {/* Project Name */}
                                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                    <label className="block text-xs font-bold mb-2">Project Name ( Optional )</label>
                                    <input
                                        type="text"
                                        id="projectname"
                                        value={projectname ?? ""}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
                                            setprojectname(sanitized);
                                        }}
                                        className="w-full px-3 py-2 border rounded text-xs capitalize"
                                        required />
                                </div>

                                {/* Project Category */}
                                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                    <label className="block text-xs font-bold mb-2">Item Category</label>
                                    <select value={projectcategory ?? ""} onChange={(e) => setprojectcategory(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                        <option value="">Select Category</option>
                                        <option value="Bollard Light">Bollard Light</option>
                                        <option value="Bulb Light">Bulb Light</option>
                                        <option value="Canopy Light">Canopy Light</option>
                                        <option value="Downlight">Downlight</option>
                                        <option value="Emergency Ligh">Emergency Light</option>
                                        <option value="Exit Light">Exit Light</option>
                                        <option value="Flood Light">Flood Light</option>
                                        <option value="Garden Light">Garden Light</option>
                                        <option value="High Bay Light">High Bay Light</option>
                                        <option value="Lamp Post">Lamp Post</option>
                                        <option value="Light Fixtures and Housing">Light Fixtures and Housing</option>
                                        <option value="Linear Light">Linear Light</option>
                                        <option value="Louver Light">Louver Light</option>
                                        <option value="Neon Light">Neon Light</option>
                                        <option value="Panel Light">Panel Light</option>
                                        <option value="Pendant Light">Pendant Light</option>
                                        <option value="Power Supply">Power Supply</option>
                                        <option value="Rope Light">Rope Light</option>
                                        <option value="Solar Flood Light">Solar Flood Light</option>
                                        <option value="Solar Light">Solar Light</option>
                                        <option value="Solar Road Light">Solar Road Light</option>
                                        <option value="Solar Street Light">Solar Street Light</option>
                                        <option value="Spotlight">Spotlight</option>
                                        <option value="Street Light">Street Light</option>
                                        <option value="Strip Light">Strip Light</option>
                                        <option value="Swimming Pool Light">Swimming Pool Light</option>
                                        <option value="Track Light">Track Light</option>
                                        <option value="Tube Light">Tube Light</option>
                                        <option value="UV Disinfection Light">UV Disinfection Light</option>
                                        <option value="Wall Light">Wall Light</option>
                                        <option value="Weatherproof Fixture">Weatherproof Fixture</option>
                                        <option value="SPF ( Special Items )">SPF ( Special Items )</option>
                                        <option value="Various Lighting">Various Lighting</option>
                                        <option value="Item Not Carried">Item Not Carried</option>
                                    </select>
                                </div>

                                {/* Type */}
                                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                    <label className="block text-xs font-bold mb-2">Customer Type</label>
                                    <select value={projecttype ?? ""} onChange={(e) => setprojecttype(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                        <option value="">Select Category</option>
                                        <option value="B2B">B2B</option>
                                        <option value="B2C">B2C</option>
                                        <option value="B2G">B2G</option>
                                        <option value="General Trade">General Trade</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Building Maintenance">Building Maintenance</option>
                                    </select>
                                </div>
                                {/* Source */}
                                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                    <label className="block text-xs font-bold mb-2">Source</label>
                                    <select value={source ?? ""} onChange={(e) => setsource(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                        <option value="">Select Category</option>
                                        <option value="Direct Client">Direct Client</option>
                                        <option value="CSR Inquiries">CSR Inquiries</option>
                                        <option value="Outbound">Outbound</option>
                                        <option value="Philgeps">Philgeps</option>
                                        <option value="Distributor">Distributor</option>
                                        <option value="Modern Trade">Modern Trade</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-4 border rounded-lg shadow-sm p-4">
                <div className="flex flex-wrap -mx-4 rounded">
                    {/* Activity Dropdown */}
                    {/* Type Activity */}
<div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4 relative">
      <label className="block text-xs font-bold mb-2">Type of Activity</label>

      {/* Trigger Button */}
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="w-full px-3 py-2 border rounded text-xs capitalize bg-white shadow-sm text-left"
      >
        {typeactivity || "Select an activity"}
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-72 overflow-y-auto text-xs">
          {Object.entries(activityGroups).map(([group, items]) => (
            <div key={group} className="border-b last:border-b-0">
              <button
                onClick={() => setOpenGroup(openGroup === group ? null : group)}
                className="w-full text-left px-3 py-2 font-semibold bg-gray-100 hover:bg-gray-200"
              >
                {group}
              </button>

              {openGroup === group && (
                <div className="bg-white">
                  {items.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setTypeActivity(`${group}: ${item}`);
                        setDropdownOpen(false);
                        setOpenGroup(null);
                      }}
                      className="cursor-pointer px-6 py-2 hover:bg-blue-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

                    {/* Conditional Fields */}
                    {showInboundFields && (
                        <>
                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">Callback</label>
                                <select className="w-full px-3 py-2 border rounded text-xs" onChange={handleCallbackChange}>
                                    <option>Select Callback</option>
                                    <option>Callback Tomorrow</option>
                                    <option>Callback After 3 Days</option>
                                    <option>Callback After a Week</option>
                                    <option>Callback After a Month</option>
                                    <option>Callback After a Year</option>
                                    <option>Pick a DateTime</option>
                                </select>

                                {/* Show input field ONLY when "Pick a DateTime" is selected */}
                                {showInput && (
                                    <input
                                        type="datetime-local"
                                        value={callback}
                                        onChange={(e) => setcallback(e.target.value)}
                                        className="w-full px-3 py-2 border rounded text-xs mt-2"
                                    />
                                )}
                            </div>
                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">Type of Call</label>
                                <select value={typecall ?? ""} onChange={(e) => settypecall(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                    <option value="">Select Status</option>
                                    <option value="Cannot Be Reached">Cannot Be Reached</option>
                                    <option value="Follow Up Pending">Follow Up Pending</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="No Requirements">No Requirements</option>
                                    <option value="Not Connected with the Company">Not Connected with the Company</option>
                                    <option value="Request for Quotation">Request for Quotation</option>
                                    <option value="Ringing Only">Ringing Only</option>
                                    <option value="Sent Quotation - Standard">Sent Quotation - Standard</option>
                                    <option value="Sent Quotation - With Special Price">Sent Quotation - With Special Price</option>
                                    <option value="Sent Quotation - With SPF">Sent Quotation - With SPF</option>
                                    <option value="Touch Base">Touch Base</option>
                                    <option value="Waiting for Future Projects">Waiting for Future Projects</option>
                                    <option value="With SPFS">With SPFS</option>
                                </select>
                            </div>
                        </>
                    )}

                    {showQuotationField && (
                        <>
                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">Quotation Number</label>
                                <input
                                    type="text"
                                    value={quotationnumber ?? ""}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
                                        setquotationnumber(sanitized);
                                    }}
                                    className="w-full px-3 py-2 border rounded text-xs uppercase"
                                    required />
                            </div>

                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">Quotation Amount</label>
                                <input
                                    type="text"
                                    value={quotationamount ?? ""}
                                    onInput={(e) => {
                                        const inputValue = (e.target as HTMLInputElement).value;
                                        const formattedValue = inputValue
                                            .replace(/,/g, '')
                                            .replace(/(\..*)\./g, '$1');

                                        setquotationamount(formattedValue);
                                    }}
                                    className="w-full px-3 py-2 border rounded text-xs"
                                    required
                                />
                            </div>

                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">Type of Call</label>
                                <select value={typecall ?? ""} onChange={(e) => settypecall(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                    <option value="">Select Status</option>
                                    <option value="Cannot Be Reached">Cannot Be Reached</option>
                                    <option value="Follow Up Pending">Follow Up Pending</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Requirements">No Requirements</option>
                                    <option value="Not Connected with the Company">Not Connected with the Company</option>
                                    <option value="Request for Quotation">Request for Quotation</option>
                                    <option value="Ringing Only">Ringing Only</option>
                                    <option value="Sent Quotation - Standard">Sent Quotation - Standard</option>
                                    <option value="Sent Quotation - With Special Price">Sent Quotation - With Special Price</option>
                                    <option value="Sent Quotation - With SPF">Sent Quotation - With SPF</option>
                                    <option value="Touch Base">Touch Base</option>
                                    <option value="Waiting for Future Projects">Waiting for Future Projects</option>
                                    <option value="With SPFS">With SPFS</option>
                                </select>
                            </div>
                        </>
                    )}

                    {showSOField && (
                        <>
                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">SO Number</label>
                                <input
                                    type="text"
                                    value={sonumber ?? ""}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
                                        setsonumber(sanitized);
                                    }}
                                    className="w-full px-3 py-2 border rounded text-xs uppercase"
                                    required />
                            </div>

                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">SO Amount</label>
                                <input
                                    type="text"
                                    value={soamount ?? ""}
                                    onInput={(e) => {
                                        const inputValue = (e.target as HTMLInputElement).value;
                                        const formattedValue = inputValue
                                            .replace(/,/g, '')
                                            .replace(/(\..*)\./g, '$1');

                                        setsoamount(formattedValue);
                                    }}
                                    className="w-full px-3 py-2 border rounded text-xs"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {showDeliverField && (
                        <>
                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">SI (Actual Sales)</label>
                                <input
                                    type="text"
                                    value={actualsales ?? ""}
                                    onInput={(e) => {
                                        const inputValue = (e.target as HTMLInputElement).value;
                                        const formattedValue = inputValue
                                            .replace(/,/g, '')
                                            .replace(/(\..*)\./g, '$1');

                                        setactualsales(formattedValue);
                                    }}
                                    className="w-full px-3 py-2 border rounded text-xs"
                                    required
                                />
                            </div>

                            <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4 flex items-center space-x-2">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold mb-2">Send Email Survey</label>
                                    <select
                                        value={emailaddress} // Bind to selected email
                                        onChange={(e) => setemailaddress(e.target.value)} // Update the selected email
                                        className="w-full px-3 py-2 border rounded text-xs" required
                                    >
                                        <option value="">Select Email</option>
                                        {emailAddresses.map((email, index) => (
                                            <option key={index} value={email}>
                                                {email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleEmailSubmit}
                                    className="bg-green-800 text-white p-2 rounded mt-6 flex items-center space-x-2"
                                >
                                    <CiPaperplane size={15} /> <span>Send</span>
                                </button>

                            </div>

                        </>
                    )}

                    {showOutboundFields && (
                        <>
                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">Callback</label>
                                <select className="w-full px-3 py-2 border rounded text-xs" onChange={handleCallbackChange}>
                                    <option>Select Callback</option>
                                    <option>Callback Tomorrow</option>
                                    <option>Callback After 3 Days</option>
                                    <option>Callback After a Week</option>
                                    <option>Pick a DateTime</option>
                                </select>

                                {/* Show input field ONLY when "Pick a DateTime" is selected */}
                                {showInput && (
                                    <input
                                        type="datetime-local"
                                        value={callback}
                                        onChange={(e) => setcallback(e.target.value)}
                                        className="w-full px-3 py-2 border rounded text-xs mt-2"
                                    />
                                )}
                            </div>

                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">Call Status</label>
                                <select value={callstatus ?? ""} onChange={(e) => setcallstatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                    <option value="">Select Status</option>
                                    <option value="Successful">Successful</option>
                                    <option value="Unsuccessful">Unsuccessful</option>
                                </select>
                            </div>

                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                <label className="block text-xs font-bold mb-2">Type of Call</label>
                                <select value={typecall ?? ""} onChange={(e) => settypecall(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                    <option value="">Select Status</option>
                                    <option value="Cannot Be Reached">Cannot Be Reached</option>
                                    <option value="Follow Up Pending">Follow Up Pending</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="No Requirements">No Requirements</option>
                                    <option value="Not Connected with the Company">Not Connected with the Company</option>
                                    <option value="Request for Quotation">Request for Quotation</option>
                                    <option value="Ringing Only">Ringing Only</option>
                                    <option value="Sent Quotation - Standard">Sent Quotation - Standard</option>
                                    <option value="Sent Quotation - With Special Price">Sent Quotation - With Special Price</option>
                                    <option value="Sent Quotation - With SPF">Sent Quotation - With SPF</option>
                                    <option value="Touch Base">Touch Base</option>
                                    <option value="Waiting for Future Projects">Waiting for Future Projects</option>
                                    <option value="With SPFS">With SPFS</option>
                                </select>
                            </div>
                        </>
                    )}

                </div>
                <div className="flex flex-wrap -mx-4">
                    {/* Remarks */}
                    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Remarks</label>
                        <textarea
                            value={remarks ?? ""}
                            onChange={(e) => {
                                const input = e.target.value;
                                const lettersOnly = input.replace(/[^a-zA-Z\s]/g, ""); // Only letters and spaces
                                setremarks(lettersOnly);
                            }}
                            className="w-full px-3 py-2 border rounded text-xs capitalize"
                            rows={5}
                            required
                        ></textarea>
                        <p className="text-[10px] text-gray-500 mt-1">
                            Character Count: {remarks ? remarks.length : 0}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Status</label>
                        <select value={activitystatus || ""} onChange={(e) => setactivitystatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize bg-gray-100" required>
                            <option value="">Select Status</option>
                            <option value="Cold" disabled={activitystatus === "Warm" || activitystatus === "Hot" || activitystatus === "Done"}>Cold (Progress 20% to 30%) Touchbase</option>
                            <option value="Warm"
                                disabled={
                                    !(quotationnumber && quotationamount) ||
                                    activitystatus === "Hot" ||
                                    activitystatus === "Done" ||
                                    activitystatus === "Cancelled"
                                }>
                                Warm (Progress 50% to 60%) With Quotation
                            </option>
                            <option value="Hot"
                                disabled={
                                    !(sonumber && soamount) ||
                                    activitystatus === "Done" ||
                                    activitystatus === "Warm" ||
                                    activitystatus === "Cancelled"
                                }>
                                Hot (Progress 80% to 90%) Quotation with Confirmation W/PO
                            </option>
                            <option value="Done"
                                disabled={activitystatus === "Done" || activitystatus === "Cancelled" || activitystatus === "Warm"}>
                                Done (Progress 100%) Delivered
                            </option>
                            <option value="Loss" disabled={activitystatus === "Done" || activitystatus === "Cancelled"}>
                                Loss
                            </option>
                            <option value="Cancelled" disabled={activitystatus === "Done"}>
                                Cancelled
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserFormFields;
