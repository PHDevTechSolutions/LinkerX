import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./FormFields";
import { CiSaveUp1, CiEdit, CiTurnL1 } from "react-icons/ci";

interface AddUserFormProps {
  userDetails: { id: string };
  onCancel: () => void;
  refreshPosts: () => void;
  editUser?: any;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ userDetails, onCancel, refreshPosts, editUser, }) => {
  const [referenceid, setreferenceid] = useState("");
  const [manager, setmanager] = useState("");
  const [tsm, settsm] = useState("");
  //
  const [companyname, setcompanyname] = useState("");
  const [contactperson, setcontactperson] = useState("");
  const [contactnumber, setcontactnumber] = useState("");
  const [emailaddress, setemailaddress] = useState("");
  const [typeclient, settypeclient] = useState("");
  const [address, setaddress] = useState("");
  const [area, setarea] = useState("");
  const [status, setstatus] = useState("");

  useEffect(() => {
    if (editUser) {
      setreferenceid(editUser.referenceid || "");
      setmanager(editUser.manager || "");
      settsm(editUser.tsm || "");
      setcompanyname(editUser.companyname || "");
      setcontactperson(editUser.contactperson || "");
      setcontactnumber(editUser.contactnumber || "");
      setemailaddress(editUser.emailaddress || "");
      settypeclient(editUser.typeclient || "");
      setaddress(editUser.address || "");
      setarea(editUser.area || "");
      setstatus(editUser.status || "");
    }
  }, [editUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser 
    ? `/api/Data/Applications/Taskflow/CustomerDatabase/Edit` 
    : `/api/Data/Applications/Taskflow/CustomerDatabase/Create`;
    const method = editUser ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editUser?.id, referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, address, area, status }),
    });

    if (response.ok) {
      toast.success(editUser ? "User updated successfully" : "User added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel();
          refreshPosts();
        },
      });
    } else {
      toast.error(editUser ? "Failed to update user" : "Failed to add user", {
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">
          {editUser ? "Edit Account Information" : "Add New Account"}
        </h2>
        <FormFields
          referenceid={referenceid} setreferenceid={setreferenceid}
          manager={manager} setmanager={setmanager}
          tsm={tsm} settsm={settsm}
          //
          companyname={companyname} setcompanyname={setcompanyname}
          contactperson={contactperson} setcontactperson={setcontactperson}
          contactnumber={contactnumber} setcontactnumber={setcontactnumber}
          emailaddress={emailaddress} setemailaddress={setemailaddress}
          typeclient={typeclient} settypeclient={settypeclient}
          address={address} setaddress={setaddress}
          area={area} setarea={setarea}
          status={status} setstatus={setstatus}
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
