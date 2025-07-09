import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiSaveUp1, CiEdit, CiTurnL1 } from "react-icons/ci";

import FormFields from "./FormFields";

interface AddPostFormProps {
  userDetails: { id: string; };
  onCancel: () => void;
  refreshPosts: () => void;  // Add a refreshPosts callback
  userName: any;
  editUser?: any; // Optional prop for the post being edited
}

const AddUserForm: React.FC<AddPostFormProps> = ({ userDetails, onCancel, refreshPosts, editUser }) => {
  const [ReferenceID, setReferenceID] = useState("");
  const [Firstname, setFirstname] = useState(editUser ? editUser.Firstname : "");
  const [Lastname, setLastname] = useState(editUser ? editUser.Lastname : "");
  const [Email, setEmail] = useState(editUser ? editUser.Email : "");
  const [ContactNumber, setContactNumber] = useState(editUser ? editUser.ContactNumber : "");
  const [userName, setuserName] = useState(editUser ? editUser.userName : "");
  const [Password, setPassword] = useState(editUser ? editUser.Password : "");
  const [Role, setRole] = useState(editUser ? editUser.Role : "");
  const [TargetQuota, setTargetQuota] = useState(editUser ? editUser.TargetQuota : "");
  const [Department, setDepartment] = useState(editUser ? editUser.Department : "");
  const [Location, setLocation] = useState(editUser ? editUser.Location : "");
  const [Company, setCompany] = useState(editUser ? editUser.Company : "");
  const [Manager, setManager] = useState(editUser ? editUser.Manager : "");
  const [TSM, setTSM] = useState(editUser ? editUser.TSM : "");

  const [Status, setStatus] = useState(editUser ? editUser.Status : "");
  const [LoginAttempts, setLoginAttempts] = useState(editUser ? editUser.LoginAttempts : "");
  const [LockUntil, setLockUntil] = useState(editUser ? editUser.LockUntil : "");

  // Ensure the correct ID is set depending on edit or create mode
  const [UserId, setUserId] = useState(editUser ? editUser._id : userDetails.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser ? `/api/ModuleSales/UserManagement/TerritorySalesAssociates/EditUser` : `/api/ModuleSales/UserManagement/TerritorySalesAssociates/CreateUser`; // API endpoint changes based on edit or add
    const method = editUser ? "PUT" : "POST"; // HTTP method changes based on edit or add

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceID, Firstname, Lastname, Email, userName, Password, Role, ContactNumber, TargetQuota, Department, Location, Company, Manager, TSM, UserId, Status, LoginAttempts, LockUntil,
        id: editUser ? editUser._id : undefined, // Send post ID if editing
      }),
    });

    if (response.ok) {
      toast.success(editUser ? "Post updated successfully" : "Post added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel(); // Hide the form after submission
          refreshPosts(); // Refresh posts after successful submission
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
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editUser ? "Edit User Information" : "Add New User"}</h2>
        <FormFields
          ReferenceID={ReferenceID} setReferenceID={setReferenceID}
          UserId={UserId} setUserId={setUserId}
          Firstname={Firstname} setFirstname={setFirstname}
          Lastname={Lastname} setLastname={setLastname}
          Email={Email} setEmail={setEmail}
          ContactNumber={ContactNumber} setContactNumber={setContactNumber}
          userName={userName} setuserName={setuserName}
          Password={Password} setPassword={setPassword}
          Role={Role} setRole={setRole}
          TargetQuota={TargetQuota} setTargetQuota={setTargetQuota}
          Department={Department} setDepartment={setDepartment}
          Location={Location} setLocation={setLocation}
          Company={Company} setCompany={setCompany}
          Manager={Manager} setManager={setManager}
          TSM={TSM} setTSM={setTSM}

          Status={Status} setStatus={setStatus}
          LoginAttempts={LoginAttempts} setLoginAttempts={setLoginAttempts}
          LockUntil={LockUntil} setLockUntil={setLockUntil}

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
