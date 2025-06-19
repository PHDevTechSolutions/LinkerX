import React, { useEffect, useState } from "react";
import Select from "react-select";

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
  paymentterm: string; setpaymentterm: (value: string) => void;
  deliverydate: string; setdeliverydate: (value: string) => void;
  setShowFields: (value: boolean) => void;
  setShowOutboundFields: (value: boolean) => void;
  setShowInboundFields: (value: boolean) => void;
  setShowQuotationField: (value: boolean) => void;
  setShowSOField: (value: boolean) => void;
  setShowDeliverField: (value: boolean) => void;
}

const activityOptions = [
  "Customer Order",
  "Customer Inquiry Sales",
  "Follow Up",
  "After Sales-Refund",
  "After Sales-Repair/Replacement",
  "Quotation Preparation",
  "Sales Order Preparation",
  "Delivery Concern",
  "Accounting Concern",
  "Admin- Supplier Accreditation",
  "Admin- Credit Terms Application",
  "Outbound calls",
  "Inbound Call",
  "Site Visit",
  "Check/Read emails",
  "Bidding Preperation",
  "Viber Replies",
  "Technical Concern",
  "Sample Request"
].map(activity => ({ value: activity, label: activity }));

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
  paymentterm, setpaymentterm,
  deliverydate, setdeliverydate,
  setShowFields,
  setShowOutboundFields,
  setShowInboundFields,
  setShowQuotationField,
  setShowSOField,
  setShowDeliverField
}) => {
  const [currentRecords, setcurrentRecords] = useState<any[]>([]);

  useEffect(() => {
    if (emailaddress) {
      console.log("Email address changed:", emailaddress);
    }
  }, [emailaddress]);

  const handleActivitySelection = (selectedOption: { value: string; label: string } | null) => {
    const activity = selectedOption?.value || "";
    settypeactivity(activity);

    setShowFields(false);
    setShowOutboundFields(false);
    setShowInboundFields(false);
    setShowQuotationField(false);
    setShowSOField(false);
    setShowDeliverField(false);

    if (activity === "Outbound calls") {
      setShowFields(true);
      setShowOutboundFields(true);
    } else if (activity === "Inbound Call") {
      setShowFields(true);
      setShowInboundFields(true);
    } else if (activity === "Quotation Preparation") {
      setShowFields(true);
      setShowQuotationField(true);
    } else if (activity === "Sales Order Preparation") {
      setShowFields(true);
      setShowSOField(true);
    } else if (activity === "Delivery Concern") {
      setShowFields(true);
      setShowDeliverField(true);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap -mx-4 rounded">
        <div className="w-full sm:w-1/2 md:w-1/4 px-4">
          <label className="block text-xs font-bold mb-2">Type of Activity</label>
          <Select
            options={activityOptions}
            onChange={handleActivitySelection}
            value={activityOptions.find(opt => opt.value === typeactivity)}
            placeholder="Select an activity"
            isClearable
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                border: "none",
                borderBottom: state.isFocused ? "2px solid #3B82F6" : "1px solid #D1D5DB", // blue on focus, gray otherwise
                boxShadow: "none",
                borderRadius: "0px",
                minHeight: "36px",
                fontSize: "12px",
                backgroundColor: "white",
              }),
              menu: (provided) => ({
                ...provided,
                fontSize: "12px",
                zIndex: 5,
              }),
              singleValue: (provided) => ({
                ...provided,
                textTransform: "capitalize",
              }),
            }}
          />
        </div>

        {typeactivity === "Outbound calls" && (
          <OutboundFields {...{ callback, setcallback, callstatus, setcallstatus, typecall, settypecall }} />
        )}

        {typeactivity === "Inbound Call" && (
          <InboundFields {...{ callback, setcallback, callstatus, setcallstatus, typecall, settypecall }} />
        )}

        {typeactivity === "Quotation Preparation" && (
          <QuotationFields {...{ quotationnumber, setquotationnumber, quotationamount, setquotationamount, typecall, settypecall }} />
        )}

        {typeactivity === "Sales Order Preparation" && (
          <SoFields {...{ sonumber, setsonumber, soamount, setsoamount, typecall, settypecall }} />
        )}
      </div>

      <div className="flex flex-wrap -mx-4 mt-4">
        <Remarks remarks={remarks} setremarks={setremarks} />
        <ActivityStatus
          currentRecords={currentRecords}
          quotationnumber={quotationnumber}
          quotationamount={quotationamount}
          sonumber={sonumber}
          soamount={soamount}
          actualsales={actualsales}
          activitystatus={activitystatus}
          setactivitystatus={setactivitystatus}
          paymentterm={paymentterm}
          setpaymentterm={setpaymentterm}
        />
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      <div className="flex flex-wrap -mx-4 mt-4">
        {activitystatus === "Delivered" && (
          <DeliveryFields {...{ paymentterm, setpaymentterm, activitystatus, setactivitystatus, actualsales, setactualsales, emailaddress, setemailaddress, deliverydate, setdeliverydate }} />
        )}
      </div>
    </div>
  );
};

export default Submenu;
