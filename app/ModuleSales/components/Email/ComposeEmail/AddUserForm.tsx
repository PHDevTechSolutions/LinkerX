import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./UserFormFields";
import { CiTrash, CiTurnL1, CiSaveUp1, CiEdit, CiMail } from "react-icons/ci";

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

    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<"success" | "error" | "">("");

    // 🔹 Save or update the message locally
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editUser
            ? `/api/ModuleSales/Email/ComposeEmail/EditEmail`
            : `/api/ModuleSales/Email/ComposeEmail/CreateEmail`;

        const method = editUser ? "PUT" : "POST";

        try {
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

            if (!response.ok) throw new Error("Request failed");

            setAlertMessage(editUser ? "The email information has been updated successfully." : "A new email has been sent successfully.");
            setAlertType("success");

            // Optionally refresh list
            refreshPosts();

        } catch (error) {
            setAlertMessage("Failed to save account. Please try again.");
            setAlertType("error");
        }

        // Clear alert after 3 seconds
        setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
        }, 3000);
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
            <form onSubmit={handleSubmit} className="bg-white text-gray-900 shadow-md border rounded-lg p-4 text-xs mt-20">
                <div className="flex justify-end mb-4 gap-1">
                    {channel === "System" ? (
                        <button
                            type="submit"
                            className="bg-blue-400 text-white px-4 py-2 rounded text-xs flex items-center"
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
                        className="px-4 py-2 border rounded text-xs flex items-center gap-1"
                        onClick={onCancel}
                    >
                        <CiTurnL1 size={20} /> Cancel
                    </button>
                </div>

                <h2 className="text-lg font-bold mb-4">
                    {editUser ? "Edit Email Information" : "Add New Email"}
                </h2>
                <p className="text-xs text-gray-600 mb-4">
                    This section allows you to <strong>{editUser ? "update" : "create"}</strong> notes. If you're editing existing notes, you can update fields such as the note's title, description, and status. If you're adding new notes, you can fill in these fields to create a new entry.
                </p>

                {/* Alert message */}
                {alertMessage && (
                    <div
                        className={`mb-4 p-2 rounded border text-xs ${alertType === "success"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            }`}
                    >
                        {alertMessage}
                    </div>
                )}

                <FormFields
                    referenceid={referenceid} setreferenceid={setReferenceid}
                    sender={sender} setsender={setSender}
                    recepient={recepient} setrecepient={setrecepient}
                    subject={subject} setsubject={setsubject}
                    message={message} setmessage={setmessage}
                    channel={channel} setchannel={setChannel}
                />
            </form>

            <ToastContainer className="text-xs" autoClose={1000} />
        </>
    );
};

export default AddUserForm;
