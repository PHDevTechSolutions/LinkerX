import React from "react";

interface FormFieldsProps {
  // Users Credentials
  referenceid: string; setreferenceid: (value: string) => void;
  manager: string; setmanager: (value: string) => void;
  tsm: string; settsm: (value: string) => void;
  //
  companyname: string; setcompanyname: (value: string) => void;
  typeclient: string; settypeclient: (value: string) => void;
  activitynumber: string; setactivitynumber: (value: string) => void;
  typeactivity: string; settypeactivity: (value: string) => void;
  callback: string; setcallback: (value: string) => void;
  callstatus: string; setcallstatus: (value: string) => void;
  typecall: string; settypecall: (value: string) => void;
  quotationnumber: string; setquotationnumber: (value: string) => void;
  quotationamount: string; setquotationamount: (value: string) => void;
  sonumber: string; setsonumber: (value: string) => void;
  soamount: string; setsoamount: (value: string) => void;
  actualsales: string; setactualsales: (value: string) => void;
  remarks: string; setremarks: (value: string) => void;
  activitystatus: string; setactivitystatus: (value: string) => void;

  editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
  // Users Credentials
  referenceid, setreferenceid,
  manager, setmanager,
  tsm, settsm,
  //
  companyname, setcompanyname,
  typeclient, settypeclient,
  activitynumber, setactivitynumber,
  typeactivity, settypeactivity,
  callback, setcallback,
  callstatus, setcallstatus,
  typecall, settypecall,
  quotationnumber, setquotationnumber,
  quotationamount, setquotationamount,
  sonumber, setsonumber,
  soamount, setsoamount,
  actualsales, setactualsales,
  remarks, setremarks,
  activitystatus, setactivitystatus,
  editPost,
}) => {
 
  return (
    <>
    <div className="flex flex-wrap -mx-4">
      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Manager">Manager</label>
          <input type="text" id="manager" value={manager} onChange={(e) => setmanager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"/>
        </div>
      <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="TSM">Territory Sales Manager</label>
          <input type="text" id="tsm" value={tsm} onChange={(e) => settsm(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"/>
      </div>
      <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="referenceid">Territory Sales Associate</label>
          <input type="text" id="referenceid" value={referenceid} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"/>
        </div>
    </div>
    <div className="flex flex-wrap -mx-4">
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
      <input type="text" id="companyname" value={companyname} onChange={(e) => setcompanyname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"/>
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="typeclient">Type of Client</label>
      <select id="typeclient" value={typeclient} onChange={(e) => settypeclient(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize">
        <option value="">Select Client</option>
        <option value="Top 50">Top 50</option>
        <option value="Next 30">Next 30</option>
        <option value="Balance 20">Balance 20</option>
        <option value="Revived Account - Existing">Revived Account - Existing</option>
        <option value="Revived Account - Resigned Agent">Revived Account - Resigned Agent</option>
        <option value="New Account - Client Development">New Account - Client Development</option>
        <option value="Transferred Account">Transferred Account</option>
      </select>
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="address">Activity Number</label>
      <input type="text" id="activitynumber" value={activitynumber} onChange={(e) => setactivitynumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="typeactivity">Type of Activity</label>
      <input type="text" id="typeactivity" value={typeactivity} onChange={(e) => settypeactivity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="callback">Callback</label>
      <input type="datetime-local" id="callback" value={callback} onChange={(e) => setcallback(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="callstatus">Call Status</label>
      <input type="text" id="callstatus" value={callstatus} onChange={(e) => setcallstatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="typecall">Type of Call</label>
      <input type="text" id="typecall" value={typecall} onChange={(e) => settypecall(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="quotationnumber">Quotation Number</label>
      <input type="text" id="quotationnumber" value={quotationnumber} onChange={(e) => setquotationnumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="quotationamount">Quotation Amount</label>
      <input type="text" id="quotationamount" value={quotationamount} onChange={(e) => setquotationamount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="sonumber">SO Number</label>
      <input type="text" id="sonumber" value={sonumber} onChange={(e) => setsonumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="soamount">SO Amount</label>
      <input type="text" id="soamount" value={soamount} onChange={(e) => setsoamount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="area">Actual Sales</label>
      <input type="text" id="actualsales" value={actualsales} onChange={(e) => setactualsales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="area">Remarks</label>
      <textarea id="remarks" rows={5} value={remarks} onChange={(e) => setremarks(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"></textarea>
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="area">Status</label>
      <input type="text" id="activitystatus" value={activitystatus} onChange={(e) => setactivitystatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
  </div>
    </>
  );
};

export default UserFormFields;
