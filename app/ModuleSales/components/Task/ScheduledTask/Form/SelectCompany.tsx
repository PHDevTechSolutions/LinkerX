import React, { useEffect, useState, useRef } from "react";
import Select from 'react-select';
import Email from "./Email";
import Area from "./Area";

export interface CompanyOption {
    id: string | number;
    companyname: string;
    companygroup: string;
    value: string;
    label: string;
    contactperson: string;
    contactnumber: string;
    emailaddress: string;
    typeclient: string;
    address: string;
    deliveryaddress: string;
    area: string;
}

interface SelectCompanyProps {
    referenceid: string;
    companyname: string; setcompanyname: (val: string) => void;
    companygroup: string; setcompanygroup: (value: string) => void;
    contactperson: string; setcontactperson: (val: string) => void;
    contactnumber: string; setcontactnumber: (val: string) => void;
    emailaddress: string; setemailaddress: (val: string) => void;
    typeclient: string; settypeclient: (val: string) => void;
    address: string; setaddress: (val: string) => void;
    deliveryaddress: string; setdeliveryaddress: (val: string) => void;
    area: string; setarea: (val: string) => void;

    editPost?: {
        companyname?: string;
        companygroup: string;
        contactperson: string;
        contactnumber: string;
        emailaddress: string;
        typeclient: string;
        address: string;
        deliveryaddress: string;
        area: string;
    };
}

const SelectCompany: React.FC<SelectCompanyProps> = ({
    referenceid,
    companyname, setcompanyname,
    companygroup, setcompanygroup,
    contactperson, setcontactperson,
    contactnumber, setcontactnumber,
    emailaddress, setemailaddress,
    typeclient, settypeclient,
    address, setaddress,
    deliveryaddress, setdeliveryaddress,
    area, setarea,
    editPost,
}) => {
    const [previousCompany, setPreviousCompany] = useState<any>(null);
    const [companies, setCompanies] = useState<any[]>([]);
    const [contactPersons, setContactPersons] = useState<string[]>([]);
    const [contactNumbers, setContactNumbers] = useState<string[]>([]);
    const [emailAddresses, setEmailAddresses] = useState<string[]>([]);

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
                            deliveryaddress: company.deliveryaddress,
                            companygroup: company.companygroup,
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
        try {
            // If a company is selected
            if (selectedOption && selectedOption.id) {
                console.log("Selected Company Data:", selectedOption);

                setPreviousCompany(selectedOption);
                setcompanyname(selectedOption.companyname);
                setcontactperson(selectedOption.contactperson);
                setcontactnumber(selectedOption.contactnumber);
                setemailaddress(selectedOption.emailaddress);
                settypeclient(selectedOption.typeclient);
                setaddress(selectedOption.address);
                setarea(selectedOption.area);
                setdeliveryaddress(selectedOption.deliveryaddress);
                setcompanygroup(selectedOption.companygroup);
            } else {
                // No company selected, reset all fields
                console.log("No selected company, resetting form fields.");
                setPreviousCompany(null);
                setcompanyname("");
                setcontactperson("");
                setcontactnumber("");
                setemailaddress("");
                settypeclient("");
                setaddress("");
                setarea("");
                setdeliveryaddress("");
                setcompanygroup("");
            }
        } catch (error) {
            console.error("Unexpected error while selecting company:", error);
        }
    };

    const [isManual, setIsManual] = useState(false); // toggle state

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                {/* Company Name */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold" htmlFor="companyname">Company Name</label>
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
                    <button
                        type="button"
                        onClick={() => setIsManual(prev => !prev)}
                        className="text-blue-500 text-[10px] underline"
                    >
                        {isManual ? "If Account Exists Switch to Select" : "If Account is New Switch to Manual"}
                    </button>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold" htmlFor="companygroup">
                            Affiliate Name
                        </label>
                    </div>
                    <input
                        type="text"
                        id="companygroup"
                        value={companygroup ?? ""}
                        onChange={(e) => {
                            const input = e.target.value;
                            const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
                            setcompanygroup(sanitized);
                        }}
                        className="w-full px-3 py-2 border rounded text-xs capitalize"
                    />
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
                            const lettersOnly = input.replace(/[^a-zA-Z\s]/g, "");
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
                            const numbersOnly = input.replace(/[^0-9]/g, "");
                            setcontactnumber(numbersOnly);
                        }}
                        className="w-full px-3 py-2 border rounded text-xs"
                    />
                </div>

                {/* Email Address */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Email Address</label>
                    <Email emailaddress={emailaddress} setemailaddress={setemailaddress} />
                </div>

                {/* Address */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Registered Address</label>
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

                {/* Region */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Region</label>
                    <Area area={area} setarea={setarea} />
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
            </div>
        </>
    );
};

export default SelectCompany;
