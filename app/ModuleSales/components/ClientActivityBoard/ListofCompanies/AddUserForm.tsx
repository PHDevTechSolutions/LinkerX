import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./UserFormFields";
import { CiEdit, CiSaveUp1, CiCircleRemove } from "react-icons/ci";

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

    const url = editUser ? `/api/ModuleSales/UserManagement/CompanyAccounts/EditUser` : `/api/ModuleSales/UserManagement/CompanyAccounts/CreateUser`;
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
        <p className="text-xs text-gray-600 mb-4">
          The process of <strong>creating</strong> or <strong>editing an account</strong> involves updating key information associated with a company, including its regional manager, territory sales manager, and territory sales associate (TSA). When adding or editing an account, fields like company name, contact details, client type, and status are essential for ensuring accurate and up-to-date records. This ensures smooth management and tracking of company accounts within the system.
        </p>

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
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded text-xs flex items-center gap-1">
            {editUser ? <CiEdit size={20} /> : <CiSaveUp1 size={20} />}
            {editUser ? "Update" : "Submit"}
          </button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs flex items-center gap-1" onClick={onCancel}><CiCircleRemove size={20} /> Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddUserForm;
