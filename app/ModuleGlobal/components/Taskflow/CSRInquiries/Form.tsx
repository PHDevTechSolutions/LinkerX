import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiSaveUp1, CiEdit, CiTurnL1 } from "react-icons/ci";
import FormFields from "./FormFields";

interface AddPostFormProps {
  userDetails: { id: string };
  onCancel: () => void;
  refreshPosts: () => void;
  userName: any;
  editUser?: any;
}

const AddUserForm: React.FC<AddPostFormProps> = ({ userDetails, onCancel, refreshPosts, editUser }) => {
  const [csragent, setCsragent] = useState(editUser?.csragent || "");
  const [referenceid, setReferenceid] = useState(editUser?.referenceid || "");
  const [tsm, setTsm] = useState(editUser?.tsm || "");
  const [ticketreferencenumber, setTicketreferencenumber] = useState(editUser?.ticketreferencenumber || "");
  const [companyname, setCompanyname] = useState(editUser?.companyname || "");
  const [contactperson, setContactperson] = useState(editUser?.contactperson || "");
  const [contactnumber, setContactnumber] = useState(editUser?.contactnumber || "");
  const [emailaddress, setEmailaddress] = useState(editUser?.emailaddress || "");
  const [typeclient, setTypeclient] = useState(editUser?.typeclient || "");
  const [address, setAddress] = useState(editUser?.address || "");
  const [status, setStatus] = useState(editUser?.status || "");
  const [wrapup, setWrapup] = useState(editUser?.wrapup || "");
  const [inquiries, setInquiries] = useState(editUser?.inquiries || "");

  const [UserId, setUserId] = useState(editUser ? editUser.id : userDetails.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser 
      ? `/api/Data/Applications/Taskflow/Inquiries/Edit`
      : `/api/Data/Applications/Taskflow/Inquiries/Create`;

    const method = editUser ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        csragent,
        referenceid,
        tsm,
        ticketreferencenumber,
        companyname,
        contactperson,
        contactnumber,
        emailaddress,
        typeclient,
        address,
        status,
        wrapup,
        inquiries,
        UserId,
        id: editUser ? editUser.id : undefined,
      }),
    });

    if (response.ok) {
      toast.success(editUser ? "Post updated successfully" : "Post added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel();
          refreshPosts();
        }
      });
    } else {
      toast.error(editUser ? "Failed to update post" : "Failed to add post", {
        autoClose: 1000
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white border shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editUser ? "Edit Inquiry" : "Add New Inquiry"}</h2>
        <FormFields
          csragent={csragent} setCsragent={setCsragent}
          referenceid={referenceid} setReferenceid={setReferenceid}
          tsm={tsm} setTsm={setTsm}
          ticketreferencenumber={ticketreferencenumber} setTicketreferencenumber={setTicketreferencenumber}
          companyname={companyname} setCompanyname={setCompanyname}
          contactperson={contactperson} setContactperson={setContactperson}
          contactnumber={contactnumber} setContactnumber={setContactnumber}
          emailaddress={emailaddress} setEmailaddress={setEmailaddress}
          typeclient={typeclient} setTypeclient={setTypeclient}
          address={address} setAddress={setAddress}
          status={status} setStatus={setStatus}
          wrapup={wrapup} setWrapup={setWrapup}
          inquiries={inquiries} setInquiries={setInquiries}
          editPost={editUser}
        />

        <div className="flex justify-end mb-4 gap-1 text-[10px]">
          <button type="submit" className="bg-blue-400 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center">
            {editUser ? <CiEdit size={15} /> : <CiSaveUp1 size={15} />}
            {editUser ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            className="hover:bg-gray-100 px-4 py-2 border rounded flex items-center gap-1"
            onClick={onCancel}
          >
            <CiTurnL1 size={15} /> Back
          </button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddUserForm;
