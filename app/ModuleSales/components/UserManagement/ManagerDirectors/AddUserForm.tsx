import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./UserFormFields";

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
  const [userName, setuserName] = useState(editUser ? editUser.userName : "");
  const [Password, setPassword] = useState(editUser ? editUser.Password : "");
  const [Role, setRole] = useState(editUser ? editUser.Role : "");
  const [Department, setDepartment] = useState(editUser ? editUser.Department : "");
  const [Location, setLocation] = useState(editUser ? editUser.Location: "");
  const [Company, setCompany] = useState(editUser ? editUser.Company : "");

  const [Status, setStatus] = useState(editUser ? editUser.Status: "");
  const [LoginAttempts, setLoginAttempts] = useState(editUser ? editUser.LoginAttempts: "");
  const [LockUntil, setLockUntil] = useState(editUser ? editUser.LockUntil: "");

  // Ensure the correct ID is set depending on edit or create mode
  const [UserId, setUserId] = useState(editUser ? editUser._id : userDetails.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser ? `/api/ModuleSales/UserManagement/ManagerDirector/EditUser` : `/api/ModuleSales/UserManagement/ManagerDirector/CreateUser`; // API endpoint changes based on edit or add
    const method = editUser ? "PUT" : "POST"; // HTTP method changes based on edit or add

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceID, Firstname, Lastname, Email, userName, Password, Role, Department, Location, Company, UserId, Status, LoginAttempts, LockUntil,
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
          userName={userName} setuserName={setuserName}
          Password={Password} setPassword={setPassword}
          Role={Role} setRole={setRole}
          Department={Department} setDepartment={setDepartment}
          Location={Location} setLocation={setLocation}
          Company={Company} setCompany={setCompany}

          Status={Status} setStatus={setStatus}
          LoginAttempts={LoginAttempts} setLoginAttempts={setLoginAttempts}
          LockUntil={LockUntil} setLockUntil={setLockUntil}
          editPost={editUser}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded text-xs">{editUser ? "Update" : "Submit"}</button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddUserForm;
