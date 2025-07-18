import React, { useEffect } from "react";

interface FormFieldsProps {
  csragent: string; setCsragent: (val: string) => void;
  referenceid: string; setReferenceid: (val: string) => void;
  tsm: string; setTsm: (val: string) => void;
  ticketreferencenumber: string; setTicketreferencenumber: (val: string) => void;
  companyname: string; setCompanyname: (val: string) => void;
  contactperson: string; setContactperson: (val: string) => void;
  contactnumber: string; setContactnumber: (val: string) => void;
  emailaddress: string; setEmailaddress: (val: string) => void;
  typeclient: string; setTypeclient: (val: string) => void;
  address: string; setAddress: (val: string) => void;
  status: string; setStatus: (val: string) => void;
  wrapup: string; setWrapup: (val: string) => void;
  inquiries: string; setInquiries: (val: string) => void;
  editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
  csragent, setCsragent,
  referenceid, setReferenceid,
  tsm, setTsm,
  ticketreferencenumber, setTicketreferencenumber,
  companyname, setCompanyname,
  contactperson, setContactperson,
  contactnumber, setContactnumber,
  emailaddress, setEmailaddress,
  typeclient, setTypeclient,
  address, setAddress,
  status, setStatus,
  wrapup, setWrapup,
  inquiries, setInquiries,
  editPost
}) => {
  useEffect(() => {
    if (editPost) {
      setCsragent(editPost.csragent || "");
      setReferenceid(editPost.referenceid || "");
      setTsm(editPost.tsm || "");
      setTicketreferencenumber(editPost.ticketreferencenumber || "");
      setCompanyname(editPost.companyname || "");
      setContactperson(editPost.contactperson || "");
      setContactnumber(editPost.contactnumber || "");
      setEmailaddress(editPost.emailaddress || "");
      setTypeclient(editPost.typeclient || "");
      setAddress(editPost.address || "");
      setStatus(editPost.status || "");
      setWrapup(editPost.wrapup || "");
      setInquiries(editPost.inquiries || "");
    }
  }, [editPost]);

  return (
    <div className="flex flex-wrap -mx-4">
      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">CSR Agent</label>
        <input type="text" value={csragent} onChange={(e) => setCsragent(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Reference ID</label>
        <input type="text" value={referenceid} onChange={(e) => setReferenceid(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">TSM</label>
        <input type="text" value={tsm} onChange={(e) => setTsm(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Ticket Reference Number</label>
        <input type="text" value={ticketreferencenumber} onChange={(e) => setTicketreferencenumber(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Company Name</label>
        <input type="text" value={companyname} onChange={(e) => setCompanyname(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Contact Person</label>
        <input type="text" value={contactperson} onChange={(e) => setContactperson(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Contact Number</label>
        <input type="text" value={contactnumber} onChange={(e) => setContactnumber(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Email Address</label>
        <input type="text" value={emailaddress} onChange={(e) => setEmailaddress(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Type of Client</label>
        <input type="text" value={typeclient} onChange={(e) => setTypeclient(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Status</label>
        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Wrap-Up</label>
        <input type="text" value={wrapup} onChange={(e) => setWrapup(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Inquiries</label>
        <input type="text" value={inquiries} onChange={(e) => setInquiries(e.target.value)}
          className="w-full px-3 py-2 border-b rounded text-xs capitalize" />
      </div>
    </div>
  );
};

export default UserFormFields;
