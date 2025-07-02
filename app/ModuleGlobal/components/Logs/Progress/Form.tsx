import React, { useState, useEffect } from "react";
// Route
import FormFields from "./FormFields";
// Icons
import { CiSaveUp1, CiEdit, CiTurnL1 } from "react-icons/ci";
// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [companyname, setcompanyname] = useState("");
    const [typeclient, settypeclient] = useState("");
    const [activitynumber, setactivitynumber] = useState("");
    const [typeactivity, settypeactivity] = useState("");
    const [callback, setcallback] = useState("");
    const [callstatus, setcallstatus] = useState("");
    const [typecall, settypecall] = useState("");
    const [quotationnumber, setquotationnumber] = useState("");
    const [quotationamount, setquotationamount] = useState("");
    const [sonumber, setsonumber] = useState("");
    const [soamount, setsoamount] = useState("");
    const [actualsales, setactualsales] = useState("");
    const [remarks, setremarks] = useState("");
    const [activitystatus, setactivitystatus] = useState("");

    useEffect(() => {
        if (editUser) {
            setreferenceid(editUser.referenceid || "");
            setmanager(editUser.manager || "");
            settsm(editUser.tsm || "");
            setcompanyname(editUser.companyname || "");
            settypeclient(editUser.typeclient || "");
            setactivitynumber(editUser.activitynumber || "");
            settypeactivity(editUser.typeactivity || "");
            setcallback(editUser.callback || "");
            setcallstatus(editUser.callstatus || "");
            settypecall(editUser.typecall || "");
            setquotationnumber(editUser.quotationnumber || "");
            setquotationamount(editUser.quotationamount || "");
            setsonumber(editUser.sonumber || "");
            setsoamount(editUser.soamount || "");
            setactualsales(editUser.actualsales || "");
            setremarks(editUser.remarks || "");
            setactivitystatus(editUser.activitystatus || "");
        }
    }, [editUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editUser ? `/api/ModuleGlobal/Logs/ProgressLogs/EditData` : `/api/ModuleSales/UserManagement/CompanyAccounts/CreateUser`;
        const method = editUser ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: editUser?.id, referenceid, manager, tsm, companyname, typeclient, activitynumber, typeactivity, callback, callstatus, typecall,
                quotationnumber, quotationamount, sonumber, soamount, actualsales, remarks, activitystatus
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

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
                <h2 className="text-xs font-bold mb-4">
                    {editUser ? "Edit Account Information" : "Add New Account"}
                </h2>
                <FormFields
                    referenceid={referenceid} setreferenceid={setreferenceid}
                    manager={manager} setmanager={setmanager}
                    tsm={tsm} settsm={settsm}
                    companyname={companyname} setcompanyname={setcompanyname}
                    typeclient={typeclient} settypeclient={settypeclient}
                    activitynumber={activitynumber} setactivitynumber={setactivitynumber}
                    typeactivity={typeactivity} settypeactivity={settypeactivity}
                    callback={callback} setcallback={setcallback}
                    callstatus={callstatus} setcallstatus={setcallstatus}
                    typecall={typecall} settypecall={settypecall}
                    quotationnumber={quotationnumber} setquotationnumber={setquotationnumber}
                    quotationamount={quotationamount} setquotationamount={setquotationamount}
                    sonumber={sonumber} setsonumber={setsonumber}
                    soamount={soamount} setsoamount={setsoamount}
                    actualsales={actualsales} setactualsales={setactualsales}
                    remarks={remarks} setremarks={setremarks}
                    activitystatus={activitystatus} setactivitystatus={setactivitystatus}
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
