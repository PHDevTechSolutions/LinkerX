import React, { useEffect, useState, useRef } from "react";

// Routes
import TimeSpent from "./Form/TimeSpent";
import HiddenFields from "./Form/HiddenFields";
import SelectCompany, { CompanyOption } from "./Form/SelectCompany";
import Accordion from "./Form/Accordion";
import Submenu from "./Form/Submenu";

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
    companygroup: string; setcompanygroup: (value: string) => void;
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
    status: string; setstatus: (value: string) => void;

    ticketreferencenumber: string; setticketreferencenumber: (value: string) => void;
    wrapup: string; setwrapup: (value: string) => void;
    inquiries: string; setinquiries: (value: string) => void;
    csragent: string; setcsragent: (value: string) => void;
    paymentterm: string; setpaymentterm: (value: string) => void;
    deliverydate: string; setdeliverydate: (value: string) => void;

    currentRecords: Activity[];
    editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
    referenceid, setreferenceid,
    manager, setmanager,
    tsm, settsm,
    targetquota, settargetquota,
    companyname, setcompanyname,
    companygroup, setcompanygroup,
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
    status, setstatus,

    ticketreferencenumber, setticketreferencenumber,
    wrapup, setwrapup,
    inquiries, setinquiries,
    csragent, setcsragent,

    paymentterm, setpaymentterm,
    deliverydate, setdeliverydate,
    editPost,
}) => {
    const [showFields, setShowFields] = useState(false);
    const [showOutboundFields, setShowOutboundFields] = useState(false);
    const [showInboundFields, setShowInboundFields] = useState(false);
    const [showQuotationField, setShowQuotationField] = useState(false);
    const [showSOField, setShowSOField] = useState(false);
    const [showDeliverField, setShowDeliverField] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

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

    return (
        <>
            <TimeSpent startdate={startdate} enddate={enddate} />
            <HiddenFields activitynumber={activitynumber} setactivitynumber={setactivitynumber} companyname={companyname} referenceid={referenceid} setreferenceid={setreferenceid} manager={manager} setmanager={setmanager}
                tsm={tsm} settsm={settsm} targetquota={targetquota} settargetquota={settargetquota} startdate={startdate} setstartdate={setstartdate} enddate={enddate} setenddate={setenddate} ticketreferencenumber={ticketreferencenumber} setticketreferencenumber={setticketreferencenumber}
                wrapup={wrapup} setwrapup={setwrapup} inquiries={inquiries} setinquiries={setinquiries} csragent={csragent} setcsragent={setcsragent} editPost={editPost} />
         
           <div className="border-t border-gray-200 my-4"></div>
            <SelectCompany
                referenceid={referenceid}
                setcompanyname={setcompanyname} companyname={companyname}
                setcompanygroup={setcompanygroup} companygroup={companygroup}
                setcontactperson={setcontactperson} contactperson={contactperson}
                setcontactnumber={setcontactnumber} contactnumber={contactnumber}
                setemailaddress={setemailaddress} emailaddress={emailaddress}
                settypeclient={settypeclient} typeclient={typeclient}
                setaddress={setaddress} address={address}
                setdeliveryaddress={setdeliveryaddress} deliveryaddress={deliveryaddress}
                setarea={setarea} area={area}
                setstatus={setstatus} status={status} 
            />
            
            <div className="border-t border-gray-400 border-dashed my-4"></div>
            <Accordion
                typeactivity={typeactivity} settypeactivity={settypeactivity}
                projectname={projectname} setprojectname={setprojectname}
                projectcategory={projectcategory} setprojectcategory={setprojectcategory}
                projecttype={projecttype} setprojecttype={setprojecttype}
                source={source} setsource={setsource}
            />

            <div className="border-t border-gray-400 border-dashed my-4"></div>
            <Submenu
                typeactivity={typeactivity} settypeactivity={settypeactivity}
                setemailaddress={setemailaddress} emailaddress={emailaddress}
                remarks={remarks} setremarks={setremarks}
                paymentterm={paymentterm} setpaymentterm={setpaymentterm}
                deliverydate={deliverydate} setdeliverydate={setdeliverydate}
                callback={callback} setcallback={setcallback}
                typecall={typecall} settypecall={settypecall}
                quotationnumber={quotationnumber} setquotationnumber={setquotationnumber}
                quotationamount={quotationamount} setquotationamount={setquotationamount}
                sonumber={sonumber} setsonumber={setsonumber}
                soamount={soamount} setsoamount={setsoamount}
                actualsales={actualsales} setactualsales={setactualsales}
                callstatus={callstatus} setcallstatus={setcallstatus}
                activitynumber={activitynumber} setactivitynumber={setactivitynumber}
                activitystatus={activitystatus} setactivitystatus={setactivitystatus}
                setShowFields={setShowFields}
                setShowOutboundFields={setShowOutboundFields}
                setShowInboundFields={setShowInboundFields}
                setShowQuotationField={setShowQuotationField}
                setShowSOField={setShowSOField}
                setShowDeliverField={setShowDeliverField}
            />
        </>
    );
};

export default UserFormFields;
