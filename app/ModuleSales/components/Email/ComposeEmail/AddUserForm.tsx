import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./UserFormFields";
import { CiTrash, CiCircleRemove, CiSaveUp1, CiEdit, CiMail } from "react-icons/ci";

interface AddUserFormProps {
    userDetails: {
        id: string;
        referenceid: string;
        sender: string;
    };
    onCancel: () => void;
    refreshPosts: () => void;
    editUser?: any;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ userDetails, onCancel, refreshPosts, editUser }) => {
    const [referenceid, setReferenceid] = useState(userDetails.referenceid || "");
    const [sender, setSender] = useState(userDetails.sender || "");
    const [recepient, setrecepient] = useState(editUser ? editUser.recepient : "");
    const [subject, setsubject] = useState(editUser ? editUser.subject : "");
    const [message, setmessage] = useState(editUser ? editUser.message : "");

    const [channel, setChannel] = useState("System");

    // 🔹 Save or update the message locally
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editUser ? `/api/ModuleSales/Email/ComposeEmail/EditEmail` : `/api/ModuleSales/Email/ComposeEmail/CreateEmail`;
        const method = editUser ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: editUser?.id,
                referenceid,
                sender,
                recepient,
                subject,
                message
            }),
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

    // 🔹 Send the actual email
    const handleEmail = async () => {
        try {
            const response = await axios.post("/api/send-email", {
                sender,
                recepient,
                subject,
                message,
            });

            if (response.data.success) {
                toast.success("Email sent successfully!", { autoClose: 1000 });
            } else {
                toast.error("Failed to send email.", { autoClose: 1000 });
            }
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("An error occurred while sending the email.", { autoClose: 1000 });
        }
    };

    useEffect(() => {
        if (editUser) {
            setReferenceid(editUser.referenceid);
            setSender(editUser.sender);
            setrecepient(editUser.recepient);
            setsubject(editUser.subject);
            setmessage(editUser.message);
        }
    }, [editUser]);

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
                <h2 className="text-xs font-bold mb-4">
                    {editUser ? "Edit Notes Information" : "Add New Notes"}
                </h2>
                <p className="text-xs text-gray-600 mb-4">
                    This section allows you to <strong>{editUser ? "update" : "create"}</strong> notes. If you're editing existing notes, you can update fields such as the note's title, description, and status. If you're adding new notes, you can fill in these fields to create a new entry.
                </p>

                <FormFields
                    referenceid={referenceid} setreferenceid={setReferenceid}
                    sender={sender} setsender={setSender}
                    recepient={recepient} setrecepient={setrecepient}
                    subject={subject} setsubject={setsubject}
                    message={message} setmessage={setmessage}
                    channel={channel} setchannel={setChannel}
                />

                <div className="flex flex-wrap gap-2 mt-4">
                    {channel === "System" ? (
                        <button
                            type="submit"
                            className="bg-blue-900 text-white px-4 py-2 rounded text-xs flex items-center gap-1"
                        >
                            {editUser ? <CiEdit size={20} /> : <CiSaveUp1 size={20} />}
                            {editUser ? "Update" : "Submit"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleEmail}
                            className="bg-green-600 text-white px-4 py-2 rounded text-xs flex items-center gap-1"
                        >
                            <CiMail size={20} /> Send Email
                        </button>
                    )}

                    <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded text-xs flex items-center gap-1"
                        onClick={onCancel}
                    >
                        <CiCircleRemove size={20} /> Cancel
                    </button>
                </div>

            </form>

            <ToastContainer className="text-xs" autoClose={1000} />
        </>
    );
};

export default AddUserForm;
