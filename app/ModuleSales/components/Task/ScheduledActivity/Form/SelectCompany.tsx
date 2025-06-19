import React, { useEffect, useState } from "react";
import Select from 'react-select';
import Email from "./Email";
import Area from "./Area";
import { BsArrowsCollapseVertical, BsArrowsExpandVertical } from "react-icons/bs";

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
    const [companies, setCompanies] = useState<any[]>([]);
    const [isManual, setIsManual] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // collapsible state

    useEffect(() => {
        if (referenceid) {
            fetch(`/api/ModuleSales/Companies/CompanyAccounts/FetchAccount?referenceid=${referenceid}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const filtered = data.data.filter((c: any) => c.status === 'Active' || c.status === 'Used');
                        setCompanies(filtered.map((c: any) => ({
                            ...c,
                            value: c.companyname,
                            label: c.companyname,
                        })));
                    } else {
                        console.error("Error fetching companies:", data.error);
                    }
                })
                .catch(err => console.error("Error:", err));
        }
    }, [referenceid]);

    const handleCompanySelect = (selected: any) => {
        if (selected?.id) {
            setcompanyname(selected.companyname);
            setcontactperson(selected.contactperson);
            setcontactnumber(selected.contactnumber);
            setemailaddress(selected.emailaddress);
            settypeclient(selected.typeclient);
            setaddress(selected.address);
            setdeliveryaddress(selected.deliveryaddress);
            setcompanygroup(selected.companygroup);
            setarea(selected.area);
        } else {
            setcompanyname(""); setcontactperson(""); setcontactnumber("");
            setemailaddress(""); settypeclient(""); setaddress("");
            setdeliveryaddress(""); setcompanygroup(""); setarea("");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold">Company Details</h2>
                <button
                    type="button"
                    onClick={() => setIsExpanded(prev => !prev)}
                    className="text-[10px] text-black border shadow-sm px-2 py-1 rounded-md flex items-center gap-1"
                >
                    {isExpanded ? (
                        <>
                            <BsArrowsCollapseVertical /> <span>Collapse</span>
                        </>
                    ) : (
                        <>
                            <BsArrowsExpandVertical /> <span>Expand</span>
                        </>
                    )}
                </button>

            </div>

            {isExpanded && (
                <div className="flex flex-wrap -mx-4 transition-all duration-300 ease-in-out">
                    {/* Company Name */}
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Company Name</label>
                        {!isManual ? (
                            <>
                                <Select
                                    options={companies}
                                    onChange={handleCompanySelect}
                                    className="text-xs capitalize"
                                    placeholder="Select Company"
                                    isClearable
                                />
                                <input
                                    type="text"
                                    value={companyname ?? ""}
                                    disabled
                                    className="w-full mt-2 text-xs capitalize p-2 border rounded"
                                />
                            </>
                        ) : (
                            <input
                                type="text"
                                value={companyname ?? ""}
                                onChange={(e) =>
                                    setcompanyname(e.target.value.replace(/[^a-zA-Z,\s]/g, ""))
                                }
                                className="w-full text-xs capitalize p-2 border rounded"
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => setIsManual(prev => !prev)}
                            className="text-[10px] text-blue-500 underline mt-1"
                        >
                            {isManual ? "If Account Exists Switch to Select" : "If Account is New Switch to Manual"}
                        </button>
                    </div>

                    {/* Affiliate Name */}
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Affiliate Name</label>
                        <input
                            type="text"
                            value={companygroup ?? ""}
                            onChange={(e) => setcompanygroup(e.target.value.replace(/[^a-zA-Z,\s]/g, ""))}
                            className="w-full px-3 py-2 border rounded text-xs capitalize"
                        />
                    </div>

                    {/* Contact Person */}
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Contact Person</label>
                        <input
                            type="text"
                            value={contactperson ?? ""}
                            onChange={(e) => setcontactperson(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                            className="w-full px-3 py-2 border rounded text-xs capitalize"
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Contact Number</label>
                        <input
                            type="text"
                            value={contactnumber ?? ""}
                            onChange={(e) => setcontactnumber(e.target.value.replace(/[^0-9]/g, ""))}
                            className="w-full px-3 py-2 border rounded text-xs"
                        />
                    </div>

                    {/* Email Address */}
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Email Address</label>
                        <Email emailaddress={emailaddress} setemailaddress={setemailaddress} />
                    </div>

                    {/* Registered Address */}
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Registered Address</label>
                        <input
                            type="text"
                            value={address ?? ""}
                            onChange={(e) => setaddress(e.target.value.replace(/[^a-zA-Z,\s]/g, ""))}
                            className="w-full px-3 py-2 border rounded text-xs capitalize"
                        />
                    </div>

                    {/* Delivery Address */}
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Delivery Address</label>
                        <input
                            type="text"
                            value={deliveryaddress ?? ""}
                            onChange={(e) => setdeliveryaddress(e.target.value.replace(/[^a-zA-Z,\s]/g, ""))}
                            className="w-full px-3 py-2 border rounded text-xs capitalize"
                        />
                    </div>

                    {/* Area */}
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Region</label>
                        <Area area={area} setarea={setarea} />
                    </div>

                    {/* Type Client */}
                    <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2">Type Client</label>
                        <select
                            value={typeclient ?? ""}
                            onChange={(e) => settypeclient(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-xs capitalize"
                            required
                        >
                            <option value="">Select Client</option>
                            <option value="Top 50">Top 50</option>
                            <option value="Next 30">Next 30</option>
                            <option value="Balance 20">Balance 20</option>
                            <option value="CSR Client">CSR Client</option>
                            <option value="TSA Client">TSA Client</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectCompany;
