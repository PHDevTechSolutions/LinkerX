import React, { useEffect, useState, useRef } from "react";
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

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                {/* Company Name */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold" htmlFor="companyname">
                            Company Name
                        </label>
                    </div>
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
