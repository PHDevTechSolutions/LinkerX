import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./UserFormFields";

interface AddUserFormProps {
    userDetails: {
        id: string;
        referenceid: string;
    };
    onCancel: () => void;
    refreshPosts: () => void;
    editUser?: any;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ userDetails, onCancel, refreshPosts, editUser }) => {
    const [referenceid, setReferenceid] = useState(userDetails.referenceid || "");
    const [title, settitle] = useState(editUser ? editUser.title : "");
    const [description, setdescription] = useState(editUser ? editUser.description : "");
    const [status, setstatus] = useState(editUser ? editUser.status : "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Log form data to ensure it is being correctly set
        console.log({ referenceid, title, description, status });

        const url = editUser ? `/api/ModuleSales/Boards/Notes/EditUser` : `/api/ModuleSales/Boards/Notes/CreateUser`;
        const method = editUser ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editUser?.id, referenceid, title, description, status }),
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
                    title={title} settitle={settitle}
                    description={description} setdescription={setdescription}
                    status={status} setstatus={setstatus}
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
