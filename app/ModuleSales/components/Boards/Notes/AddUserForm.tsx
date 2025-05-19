import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./UserFormFields";
import { CiTrash, CiTurnL1, CiSaveUp1, CiEdit } from "react-icons/ci";

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
            <form onSubmit={handleSubmit} className="bg-white text-gray-900 shadow-md border rounded-lg p-4 text-xs mt-20">
                <div className="flex justify-end mb-4 gap-1">
                    <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded text-xs flex items-center">
                        {editUser ? <CiEdit size={20} /> : <CiSaveUp1 size={20} />}
                        {editUser ? "Update" : "Submit"}
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 border rounded text-xs flex items-center gap-1"
                        onClick={onCancel}
                    >
                        <CiTurnL1 size={20} /> Cancel
                    </button>
                </div>

                <h2 className="text-lg font-bold mb-4">
                    {editUser ? "Edit Notes Information" : "Add New Notes"}
                </h2>
                <p className="text-xs text-gray-600 mb-4">
                    This section allows you to <strong>{editUser ? "update" : "create"}</strong> notes. If you're editing existing notes, you can update fields such as the note's title, description, and status. If you're adding new notes, you can fill in these fields to create a new entry. The form helps to efficiently manage and organize notes by tracking their key information, ensuring that all necessary details are captured and easy to access for future reference.
                </p>

                <FormFields
                    referenceid={referenceid} setreferenceid={setReferenceid}
                    title={title} settitle={settitle}
                    description={description} setdescription={setdescription}
                    status={status} setstatus={setstatus}
                />
            </form>
            <ToastContainer className="text-xs" autoClose={1000} />
        </>
    );
};

export default AddUserForm;
