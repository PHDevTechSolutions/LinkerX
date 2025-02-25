import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./UserFormFields";

interface AddUserFormProps {
  onCancel: () => void;
  refreshPosts: () => void;
  userDetails: {
    id: string;
    referenceid: string;
    manager: string;
    tsm: string;
  };
  editUser?: any;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onCancel, refreshPosts, userDetails, editUser,}) => {
  const [referenceid, setReferenceid] = useState(userDetails.referenceid || "");
  const [manager, setManager] = useState(userDetails.manager || "");
  const [tsm, setTsm] = useState(userDetails.tsm || "");
  //
  const [companyname, setcompanyname] = useState("");
  const [contactperson, setcontactperson] = useState("");
  const [contactnumber, setcontactnumber] = useState("");
  const [emailaddress, setemailaddress] = useState("");
  const [typeclient, settypeclient] = useState("");
  const [address, setaddress] = useState("");
  const [area, setarea] = useState("");

  useEffect(() => {
    if (editUser) {
      setReferenceid(editUser.referenceid || "");
      setManager(editUser.manager || "");
      setTsm(editUser.tsm || "");
      setcompanyname(editUser.companyname || "");
      setcontactperson(editUser.contactperson || "");
      setcontactnumber(editUser.contactnumber || "");
      setemailaddress(editUser.emailaddress || "");
      settypeclient(editUser.typeclient || "");
      setaddress(editUser.address || "");
      setarea(editUser.area || "");
    }
  }, [editUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser ? `/api/ModuleSales/UserManagement/CompanyAccounts/EditUser` : `/api/ModuleSales/UserManagement/CompanyAccounts/CreateUser`;
    const method = editUser ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editUser?.id, referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, address, area}),
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
        referenceid={referenceid} setreferenceid={setReferenceid}
        manager={manager} setmanager={setManager}
        tsm={tsm} settsm={setTsm}
        //
        companyname={companyname} setcompanyname={setcompanyname} 
        contactperson={contactperson} setcontactperson={setcontactperson}
        contactnumber={contactnumber} setcontactnumber={setcontactnumber}
        emailaddress={emailaddress} setemailaddress={setemailaddress}
        typeclient={typeclient} settypeclient={settypeclient}
        address={address} setaddress={setaddress}
        area={area} setarea={setarea}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded text-xs">
            {editUser ? "Update" : "Submit"}
          </button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddUserForm;
