import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./UserFormFields";

interface AddUserFormProps {
  onCancel: () => void;
  refreshPosts: () => void;
  userDetails: {
    id: string;
    referenceid: string;
    manager: string;
    tsm: string;
  };
  editUser?: any;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onCancel, refreshPosts, userDetails, editUser,}) => {
  const [referenceid, setReferenceid] = useState(userDetails.referenceid || "");
  const [manager, setManager] = useState(userDetails.manager || "");
  const [tsm, setTsm] = useState(userDetails.tsm || "");
  //
  const [companyname, setcompanyname] = useState("");
  const [contactperson, setcontactperson] = useState("");
  const [contactnumber, setcontactnumber] = useState("");
  const [emailaddress, setemailaddress] = useState("");
  const [typeclient, settypeclient] = useState("");
  const [address, setaddress] = useState("");
  const [area, setarea] = useState("");
  const [projectname, setprojectname] = useState("");
  const [projectcategory, setprojectcategory] = useState("");
  const [projecttype, setprojecttype] = useState("");
  const [source, setsource] = useState("");
  const [typeactivity, settypeactivity] = useState("Select Activity");
  // Inbound & Outbound Fields
  const [callback, setcallback] = useState("");
  const [callstatus, setcallstatus] = useState("");
  const [typecall, settypecall] = useState("");
  const [remarks, setremarks] = useState("");
  const [quotationnumber, setquotationnumber] = useState("");
  const [quotationamount, setquotationamount] = useState("");
  const [sonumber, setsonumber] = useState("");
  const [soamount, setsoamount] = useState("");

  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");

  const [activitystatus, setactivitystatus] = useState("");
  const [activitynumber, setactivitynumber] = useState("");

  useEffect(() => {
    if (editUser) {
      setReferenceid(editUser.referenceid || "");
      setManager(editUser.manager || "");
      setTsm(editUser.tsm || "");
      setcompanyname(editUser.companyname || "");
      setcontactperson(editUser.contactperson || "");
      setcontactnumber(editUser.contactnumber || "");
      setemailaddress(editUser.emailaddress || "");
      settypeclient(editUser.typeclient || "");
      setaddress(editUser.address || "");
      setarea(editUser.area || "");
      setprojectname(editUser.projectname || "");
      setprojectcategory(editUser.projectcategory || "");
      setprojecttype(editUser.projecttype || "");
      setsource(editUser.source || "");
      settypeactivity(editUser.typeactivity || "");

      setcallback(editUser.callback || "");
      setcallstatus(editUser.callstatus || "");
      settypecall(editUser.typecall || "");
      setremarks(editUser.setremarks || "");
      setquotationnumber(editUser.quotationnumber || "");
      setquotationamount(editUser.quotationamount || "");
      setsonumber(editUser.sonumber || "");
      setsoamount(editUser.soamount || "");

      setactivitystatus(editUser.activitystatus || "");
    }
  }, [editUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser ? `/api/ModuleSales/Task/DailyActivity/EditUser` : `/api/ModuleSales/Task/DailyActivity/CreateUser`;
    const method = editUser ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editUser?.id, referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient, address, area, projectname, projectcategory, projecttype, source, typeactivity, callback, callstatus, typecall, remarks, quotationnumber, quotationamount, sonumber, soamount, startdate, enddate, activitystatus, activitynumber }),
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
        manager={manager} setmanager={setManager}
        tsm={tsm} settsm={setTsm}
        //
        companyname={companyname} setcompanyname={setcompanyname} 
        contactperson={contactperson} setcontactperson={setcontactperson}
        contactnumber={contactnumber} setcontactnumber={setcontactnumber}
        emailaddress={emailaddress} setemailaddress={setemailaddress}
        typeclient={typeclient} settypeclient={settypeclient}
        address={address} setaddress={setaddress}
        area={area} setarea={setarea}
        projectname={projectname} setprojectname={setprojectname}
        projectcategory={projectcategory} setprojectcategory={setprojectcategory}
        projecttype={projecttype} setprojecttype={setprojecttype}
        source={source} setsource={setsource}
        typeactivity={typeactivity} settypeactivity={settypeactivity}

        callback={callback} setcallback={setcallback}
        callstatus={callstatus} setcallstatus={setcallstatus}
        typecall={typecall} settypecall={settypecall}

        remarks={remarks} setremarks={setremarks}
        quotationnumber={quotationnumber} setquotationnumber={setquotationnumber}
        quotationamount={quotationamount} setquotationamount={setquotationamount}
        sonumber={sonumber} setsonumber={setsonumber}
        soamount={soamount} setsoamount={setsoamount}

        startdate={startdate} setstartdate={setstartdate}
        enddate={enddate} setenddate={setenddate}

        activitystatus={activitystatus} setactivitystatus={setactivitystatus}
        activitynumber={activitynumber} setactivitynumber={setactivitynumber}
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
