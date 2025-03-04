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

interface Activity {
  typeactivity: string;
  callback: string;
  callstatus: string;
  typecall: string;
  quotationnumber: string;
  quotationamount: string;
  remarks: string;
  date_created: string; // Ensure this is a valid date string
}

const PAGE_SIZE = 5;

const AddUserForm: React.FC<AddUserFormProps> = ({ onCancel, refreshPosts, userDetails, editUser, }) => {
  const [referenceid, setReferenceid] = useState(userDetails.referenceid || "");
  const [manager, setManager] = useState(userDetails.manager || "");
  const [tsm, setTsm] = useState(userDetails.tsm || "");

  const [companyname, setcompanyname] = useState(editUser ? editUser.companyname : "");
  const [contactperson, setcontactperson] = useState(editUser ? editUser.contactperson : "");
  const [contactnumber, setcontactnumber] = useState(editUser ? editUser.contactnumber : "");
  const [emailaddress, setemailaddress] = useState(editUser ? editUser.emailaddress : "");
  const [typeclient, settypeclient] = useState(editUser ? editUser.typeclient : "");
  const [address, setaddress] = useState(editUser ? editUser.address : "");
  const [area, setarea] = useState(editUser ? editUser.area : "");
  const [projectname, setprojectname] = useState(editUser ? editUser.projectname : "");
  const [projectcategory, setprojectcategory] = useState(editUser ? editUser.projectcategory : "");
  const [projecttype, setprojecttype] = useState(editUser ? editUser.projecttype : "");
  const [source, setsource] = useState(editUser ? editUser.source : "");

  const [typeactivity, settypeactivity] = useState(editUser ? editUser.typeactivity : "");
  const [remarks, setremarks] = useState(editUser ? editUser.remarks : "");
  const [callback, setcallback] = useState(editUser ? editUser.callback : "");
  const [typecall, settypecall] = useState(editUser ? editUser.typecall : "");
  const [quotationnumber, setquotationnumber] = useState(editUser ? editUser.quotationnumber : "");
  const [quotationamount, setquotationamount] = useState(editUser ? editUser.quotationamount : "");
  const [sonumber, setsonumber] = useState(editUser ? editUser.sonumber : "");
  const [soamount, setsoamount] = useState(editUser ? editUser.soamount : "");
  const [callstatus, setcallstatus] = useState(editUser ? editUser.callstatus : "");

  const [startdate, setstartdate] = useState(editUser ? editUser.startdate : "");
  const [enddate, setenddate] = useState(editUser ? editUser.enddate : "");
  const [activitynumber, setactivitynumber] = useState(editUser?.activitynumber || "");
  const [activitystatus, setactivitystatus] = useState(editUser ? editUser.activitystatus : "");

  const [currentPage, setCurrentPage] = useState(1);

  // 🔥 FIX: Ensure activityList is always an array
  const [activityList, setActivityList] = useState<{
    typeactivity: string;
    callback: string;
    callstatus: string;
    typecall: string;
    remarks: string;
    quotationnumber: string;
    quotationamount: string;
    sonumber: string;
    soamount: string;
  }[]>([]);


  // Fetch progress data when activitynumber change
  useEffect(() => {
    if (editUser?.activitynumber) {
      fetch(`/api/ModuleSales/Task/DailyActivity/FetchActivity?activitynumber=${editUser.activitynumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.data)) {
            const sortedData = data.data.sort((a: Activity, b: Activity) =>
              new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
            );
            setActivityList(sortedData);
            setCurrentPage(1); // Reset pagination when new data loads
          } else {
            setActivityList([]);
          }
        })
        .catch(() => setActivityList([]));
    }
  }, [editUser?.activitynumber]);

  const totalPages = Math.ceil(activityList.length / PAGE_SIZE);
  const currentRecords = activityList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser ? `/api/ModuleSales/Task/DailyActivity/EditUser` : `/api/ModuleSales/Task/DailyActivity/CreateUser`;
    const method = editUser ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editUser?.id, referenceid, manager, tsm, companyname, contactperson, contactnumber, emailaddress, typeclient,
        address, area, projectname, projectcategory, projecttype, source, typeactivity, startdate, enddate, activitynumber, activitystatus, remarks,
        callback, typecall, quotationnumber, quotationamount, sonumber, soamount, callstatus
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
          remarks={remarks} setremarks={setremarks}
          callback={callback} setcallback={setcallback}
          typecall={typecall} settypecall={settypecall}
          quotationnumber={quotationnumber} setquotationnumber={setquotationnumber}
          quotationamount={quotationamount} setquotationamount={setquotationamount}
          sonumber={sonumber} setsonumber={setsonumber}
          soamount={soamount} setsoamount={setsoamount}
          callstatus={callstatus} setcallstatus={setcallstatus}

          startdate={startdate} setstartdate={setstartdate}
          enddate={enddate} setenddate={setenddate}

          activitynumber={activitynumber} setactivitynumber={setactivitynumber}
          activitystatus={activitystatus} setactivitystatus={setactivitystatus}

          editPost={editUser}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded text-xs">
            {editUser ? "Update" : "Submit"}
          </button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
        </div>
      </form>

      {/* Historical Records Table */}
      <div className="mt-6">
        <h3 className="text-xs font-bold mb-2">Historical Records</h3>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left px-4 py-2 border">Type of Activity</th>
                <th className="text-left px-4 py-2 border">Callback</th>
                <th className="text-left px-4 py-2 border">Call Status</th>
                <th className="text-left px-4 py-2 border">Type of Call</th>
                <th className="text-left px-4 py-2 border">Q# Number</th>
                <th className="text-left px-4 py-2 border">Q-Amount</th>
                <th className="text-left px-4 py-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((activity, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-100">
                    <td className="px-4 py-2 border">{activity.typeactivity}</td>
                    <td className="px-4 py-2 border">
                      {activity.callback
                        ? new Date(activity.callback).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : ""}
                    </td>

                    <td className="px-4 py-2 border">{activity.callstatus}</td>
                    <td className="px-4 py-2 border">{activity.typecall}</td>
                    <td className="px-4 py-2 border">{activity.quotationnumber}</td>
                    <td className="px-4 py-2 border">{activity.quotationamount}</td>
                    <td className="px-4 py-2 border">{activity.remarks}</td>
                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-2 border">No activities found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {currentRecords.length > 0 ? (
            currentRecords.map((activity, index) => (
              <div key={index} className="bg-white text-xs shadow-md rounded-lg p-4 mb-2">
                <p><strong>Type of Activity:</strong> {activity.typeactivity}</p>
                {activity.callback && (
                  <p><strong>Callback:</strong> {new Date(activity.callback).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                  })}</p>
                )}
                <p><strong>Call Status:</strong> {activity.callstatus}</p>
                <p><strong>Type of Call:</strong> {activity.typecall}</p>
                <p><strong>Q# Number:</strong> {activity.quotationnumber}</p>
                <p><strong>Q-Amount:</strong> {activity.quotationamount}</p>
                <p><strong>Remarks:</strong> {activity.remarks}</p>
              </div>
            ))
          ) : (
            <p className="text-center py-2">No activities found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between mt-4">
            <button
              className={`px-4 py-2 text-xs bg-gray-500 text-white rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-xs font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`px-4 py-2 text-xs bg-blue-500 text-white rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddUserForm;
