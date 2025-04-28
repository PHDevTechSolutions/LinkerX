import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./UserFormFields";
import { CiSaveUp1, CiCircleRemove, CiEdit } from "react-icons/ci";

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
  const [userName, setUserName] = useState(editUser ? editUser.userName : "");
  const [Password, setPassword] = useState(editUser ? editUser.Password : "");
  const [Role, setRole] = useState(editUser ? editUser.Role : "");
  const [Department, setDepartment] = useState(editUser ? editUser.Department : "");
  const [Status, setStatus] = useState(editUser ? editUser.Status : "");
  const [Company, setCompany] = useState(editUser ? editUser.Company : "");
  const [Location, setLocation] = useState(editUser ? editUser.Location: "");

  // Ensure the correct ID is set depending on edit or create mode
  const [UserId, setUserId] = useState(editUser ? editUser._id : userDetails.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser ? `/api/ModuleCSR/User/EditUser` : `/api/ModuleCSR/User/CreateUser`; // API endpoint changes based on edit or add
    const method = editUser ? "PUT" : "POST"; // HTTP method changes based on edit or add

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceID, Firstname, Lastname, Email, userName, Password, Role, Department, Status, UserId, Company, Location,
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
        <h2 className="text-xs font-bold mb-4">{editUser ? "Edit User Profile" : "Add User Profile"}</h2>
        <p className="text-xs mb-2">
          This section is responsible for managing user data, allowing the creation of new users or updating existing user details. It includes form fields for entering user-related information such as name, email, role, department, and login credentials. The heading dynamically changes based on whether a user is being edited or a new one is being added.
        </p>
        <FormFields
          UserId={UserId} setUserId={setUserId}
          ReferenceID={ReferenceID} setReferenceID={setReferenceID}
          Firstname={Firstname} setFirstname={setFirstname}
          Lastname={Lastname} setLastname={setLastname}
          Email={Email} setEmail={setEmail}
          userName={userName} setUserName={setUserName}
          Password={Password} setPassword={setPassword}
          Role={Role} setRole={setRole}
          Department={Department} setDepartment={setDepartment}
          Status={Status} setStatus={setStatus}
          Company={Company} setCompany={setCompany}
          Location={Location} setLocation={setLocation}

          editPost={editUser}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded text-xs flex items-center gap-1">
            {editUser ? <CiEdit size={20} /> : <CiSaveUp1 size={20} />}
            {editUser ? "Update" : "Submit"}
          </button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs flex items-center gap-1" onClick={onCancel}><CiCircleRemove size={20} />Back</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddUserForm;
