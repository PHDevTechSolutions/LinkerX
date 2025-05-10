import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./UserFormFields";
import { CiTrash, CiCircleRemove, CiSaveUp1, CiEdit } from "react-icons/ci";

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
    const [title, settitle] = useState(editUser ? editUser.title : "");
    const [description, setdescription] = useState(editUser ? editUser.description : "");
    const [link, setlink] = useState(editUser ? editUser.link : "");
    const [type, settype] = useState(editUser ? editUser.type : "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Log form data to ensure it is being correctly set
        console.log({ title, description, link, type });

        const url = editUser ? `/api/ModuleSales/HelpCenter/Tutorials/EditUser` : `/api/ModuleSales/HelpCenter/Tutorials/CreateUser`;
        const method = editUser ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editUser?.id, title, description, link, type }),
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
                    {editUser ? "Edit Information" : "Add New"}
                </h2>
                <FormFields
                    title={title} settitle={settitle}
                    description={description} setdescription={setdescription}
                    link={link} setlink={setlink}
                    type={type} settype={settype}
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
