import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./UserFormFields";
import { CiEdit, CiSaveUp1, CiTurnL1 } from "react-icons/ci";

interface AddPostFormProps {
  userDetails: { id: string; };
  onCancel: () => void;
  refreshPosts: () => void;  // Add a refreshPosts callback
  userName: any;
  editUser?: any; // Optional prop for the post being edited
}

const AddUserForm: React.FC<AddPostFormProps> = ({ userDetails, onCancel, refreshPosts, editUser }) => {
  
  const [ReferenceID, setReferenceID] = useState(editUser ? editUser.ReferenceID: "");
  const [Firstname, setFirstname] = useState(editUser ? editUser.Firstname : "");
  const [Lastname, setLastname] = useState(editUser ? editUser.Lastname : "");
  const [Email, setEmail] = useState(editUser ? editUser.Email : "");
  const [userName, setuserName] = useState(editUser ? editUser.userName : "");
  const [Status, setStatus] = useState(editUser ? editUser.Status : "");
  const [TargetQuota, setTargetQuota] = useState(editUser ? editUser.TargetQuota : "");

  // Ensure the correct ID is set depending on edit or create mode
  const [UserId, setUserId] = useState(editUser ? editUser._id : userDetails.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser ? `/api/ModuleSales/ListSalesAssociates/TerritorySalesAssociates/EditUser` : `/api/ModuleSales/ListSalesAssociates/TerritorySalesAssociates/CreateUser`; // API endpoint changes based on edit or add
    const method = editUser ? "PUT" : "POST"; // HTTP method changes based on edit or add

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Firstname, Lastname, Email, userName, Status, TargetQuota,
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
        <div className="flex justify-end gap-2 mb-4">
          <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded text-xs flex items-center gap-1">
            {editUser ? <CiEdit size={15} /> : <CiSaveUp1 size={15} />}
            {editUser ? "Update" : "Submit"}
          </button>
          <button type="button" className="border px-4 py-2 rounded text-xs flex items-center gap-1" onClick={onCancel}><CiTurnL1 size={15} /> Back</button>
        </div>
        <FormFields
          ReferenceID={ReferenceID} setReferenceID={setReferenceID}
          Firstname={Firstname} setFirstname={setFirstname}
          Lastname={Lastname} setLastname={setLastname}
          Email={Email} setEmail={setEmail}
          userName={userName} setuserName={setuserName}
          Status={Status} setStatus={setStatus}
          TargetQuota={TargetQuota} setTargetQuota={setTargetQuota}
          editPost={editUser}
        />
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddUserForm;
