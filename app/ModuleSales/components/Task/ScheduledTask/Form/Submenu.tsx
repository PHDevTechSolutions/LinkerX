import React, { useEffect, useRef, useState } from "react";
import OutboundFields from "../HiddenFields/OutboundFields";
import InboundFields from "../HiddenFields/InboundFields";
import QuotationFields from "../HiddenFields/QuotationFields";
import SoFields from "../HiddenFields/SoFields";
import DeliveryFields from "../HiddenFields/DeliveryFields";
import Remarks from "./Remarks";
import ActivityStatus from "./ActivityStatus";

interface SubmenuProps {
    typeactivity: string; settypeactivity: (value: string) => void;
    emailaddress: string; setemailaddress: (value: string) => void;
    callback: string; setcallback: (value: string) => void;
    typecall: string; settypecall: (value: string) => void;
    quotationnumber: string; setquotationnumber: (value: string) => void;
    quotationamount: string; setquotationamount: (value: string) => void;
    sonumber: string; setsonumber: (value: string) => void;
    soamount: string; setsoamount: (value: string) => void;
    actualsales: string; setactualsales: (value: string) => void;
    callstatus: string; setcallstatus: (value: string) => void;
    activitynumber: string; setactivitynumber: (value: string) => void;
    activitystatus: string; setactivitystatus: (value: string) => void;
    remarks: string; setremarks: (value: string) => void;
    setShowFields: (value: boolean) => void;
    setShowOutboundFields: (value: boolean) => void;
    setShowInboundFields: (value: boolean) => void;
    setShowQuotationField: (value: boolean) => void;
    setShowSOField: (value: boolean) => void;
    setShowDeliverField: (value: boolean) => void;
}

const groupedActivities = {
    Accounting: [
        "Accounts Receivable and Payment",
        "Billing Concern",
        "Refund Request",
        "Sales Order Concern",
        "TPC Request",
    ],
    Admin: ["Coordination of Payment Terms Request"],
    "CSR / Client Support": [
        "CSR Inquiries",
        "Coordination of Pick-Up / Delivery to Client",
        "Coordination With CS (Email Acknowledgement)",
        "Inbound Call",
        "Outbound Call",
        "Walk-In Client",
    ],
    Communication: [
        "Email and Viber Checking",
        "Email Blast",
        "Email, SMS & Viber Replies",
    ],
    Marketing: ["Marketing Concern"],
    Sales: ["Account Development", "Payment Follow-Up", "Quotation Follow-Up"],
    Logistics: ["Shipping Cost Estimation"],
    Preparation: [
        "Bidding Preparation",
        "Preparation of Report",
        "Preparation of SPF",
        "Preparation of Quote: New Client",
        "Preparation of Quote: Existing Client",
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
    Others: ["Delivered"],
};

const Submenu: React.FC<SubmenuProps> = ({
    typeactivity, settypeactivity,
    emailaddress, setemailaddress,
    callback, setcallback,
    typecall, settypecall,
    quotationnumber, setquotationnumber,
    quotationamount, setquotationamount,
    sonumber, setsonumber,
    soamount, setsoamount,
    actualsales, setactualsales,
    callstatus, setcallstatus,
    activitynumber, setactivitynumber,
    activitystatus, setactivitystatus,
    remarks, setremarks,
    setShowFields,
    setShowOutboundFields,
    setShowInboundFields,
    setShowQuotationField,
    setShowSOField,
    setShowDeliverField,
}) => {
    const [subOpen, setSubOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [currentRecords, setcurrentRecords] = useState<any[]>([]);
    
    const accountingActivities = groupedActivities.Accounting;

    useEffect(() => {
        if (emailaddress) {
            console.log("Email address changed:", emailaddress);
        }
    }, [emailaddress]);

    const handleActivitySelection = (activity: string) => {
        settypeactivity(activity);
        setShowFields(false);
        setShowOutboundFields(false);
        setShowInboundFields(false);
        setShowQuotationField(false);
        setShowSOField(false);
        setShowDeliverField(false);

        if (accountingActivities.includes(activity)) setShowFields(true);
        else if (activity === "Outbound Call") {
            setShowFields(true);
            setShowOutboundFields(true);
        } else if (activity === "Inbound Call") {
            setShowFields(true);
            setShowInboundFields(true);
        } else if (
            activity === "Preparation of Quote: New Client" ||
            activity === "Preparation of Quote: Existing Client"
        ) {
            setShowFields(true);
            setShowQuotationField(true);
        } else if (activity === "Sales Order Preparation") {
            setShowFields(true);
            setShowSOField(true);
        } else if (activity === "Delivered") {
            setShowFields(true);
            setShowDeliverField(true);
        }
    };

    const handleClick = (_category: string, item: string) => {
        handleActivitySelection(item);
        setSubOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setSubOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="mb-4">
            <div className="flex flex-wrap -mx-4 rounded" ref={menuRef}>
                <div className="w-full sm:w-1/2 md:w-1/4 px-4">
                    <label className="block text-xs font-bold mb-2">Type of Activity</label>
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setSubOpen((prev) => !prev)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSubOpen((prev) => !prev)}
                        className="w-full px-3 py-2 border rounded text-xs bg-white shadow-sm text-left cursor-pointer"
                    >
                        {typeactivity || "Select an activity"}
                    </div>

                    {subOpen && (
                        <div className="z-20 mt-1 bg-white shadow-lg border rounded-tl-xl rounded-bl-xl w-full">
                            {Object.entries(groupedActivities).map(([category, items]) => (
                                <div key={category} className="group relative">
                                    <div className="px-3 py-2 text-xs font-semibold hover:bg-orange-400 hover:text-white cursor-pointer">
                                        {category}
                                    </div>
                                    <div className="absolute left-full top-0 hidden group-hover:block bg-white border rounded-tr-xl rounded-br-xl shadow-md min-w-max z-30">
                                        {items.map((item) => (
                                            <div
                                                key={item}
                                                onClick={() => handleClick(category, item)}
                                                className="px-4 py-2 text-xs hover:bg-orange-400 hover:text-white cursor-pointer whitespace-nowrap"
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {typeactivity === "Outbound Call" && (
                    <OutboundFields {...{ callback, setcallback, callstatus, setcallstatus, typecall, settypecall }} />
                )}

                {typeactivity === "Inbound Call" && (
                    <InboundFields {...{ callback, setcallback, callstatus, setcallstatus, typecall, settypecall }} />
                )}

                {(typeactivity === "Preparation of Quote: New Client" ||
                    typeactivity === "Preparation of Quote: Existing Client") && (
                        <QuotationFields {...{ quotationnumber, setquotationnumber, quotationamount, setquotationamount, typecall, settypecall }} />
                    )}

                {typeactivity === "Sales Order Preparation" && (
                    <SoFields {...{ sonumber, setsonumber, soamount, setsoamount, typecall, settypecall }} />
                )}

                {typeactivity === "Delivered" && (
                    <DeliveryFields {...{ actualsales, setactualsales, emailaddress, setemailaddress }} />
                )}
            </div>

            <div className="flex flex-wrap -mx-4 mt-4">
                <Remarks remarks={remarks} setremarks={setremarks} />
                <ActivityStatus currentRecords={currentRecords} quotationnumber={quotationnumber} quotationamount={quotationamount}
                    sonumber={sonumber} soamount={soamount} actualsales={actualsales} activitystatus={activitystatus}
                    setactivitystatus={setactivitystatus}
                />
            </div>
        </div>
    );
};

export default Submenu;
