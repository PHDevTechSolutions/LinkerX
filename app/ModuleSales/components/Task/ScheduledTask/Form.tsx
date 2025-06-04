import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormFields from "./FormFields";
import { CiTrash, CiCircleRemove, CiSaveUp1, CiEdit, CiTurnL1 } from "react-icons/ci";

interface AddUserFormProps {
  onCancel: () => void;
  refreshPosts: () => void;
  userDetails: {
    id: string;
    referenceid: string;
    manager: string;
    tsm: string;
    targetquota: string;
  };
  companyData?: {
    companyname: string;
    typeclient: string;
    contactperson: string;
    contactnumber: string;
    emailaddress: string;
    address: string;
    deliveryaddress: string;
    area: string;
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
  actualsales: string;
  remarks: string;
  date_created: string; // Ensure this is a valid date string
}

const PAGE_SIZE = 5;

const AddUserForm: React.FC<AddUserFormProps> = ({ onCancel, refreshPosts, userDetails, editUser, companyData, }) => {
  const [referenceid, setReferenceid] = useState(userDetails.referenceid || "");
  const [manager, setManager] = useState(userDetails.manager || "");
  const [tsm, setTsm] = useState(userDetails.tsm || "");
  const [targetquota, setTargetQuota] = useState(userDetails.targetquota || "");

  const [companyname, setcompanyname] = useState(editUser ? editUser.companyname : companyData?.companyname || "");
  const [typeclient, settypeclient] = useState(editUser ? editUser.typeclient : companyData?.typeclient || "");
  const [contactperson, setcontactperson] = useState(editUser ? editUser.contactperson : companyData?.contactperson || "");
  const [contactnumber, setcontactnumber] = useState(editUser ? editUser.contactnumber : companyData?.contactnumber || "");
  const [emailaddress, setemailaddress] = useState(editUser ? editUser.emailaddress : companyData?.emailaddress || "");
  const [address, setaddress] = useState(editUser ? editUser.address : companyData?.address || "");
  const [deliveryaddress, setdeliveryaddress] = useState(editUser ? editUser.deliveryaddress : companyData?.deliveryaddress || "");
  const [area, setarea] = useState(editUser ? editUser.area : companyData?.area || "");

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
  const [actualsales, setactualsales] = useState(editUser ? editUser.actualsales : "");
  const [callstatus, setcallstatus] = useState(editUser ? editUser.callstatus : "");

  const [startdate, setstartdate] = useState(editUser ? editUser.startdate : "");
  const [enddate, setenddate] = useState(editUser ? editUser.enddate : "");
  const [activitynumber, setactivitynumber] = useState(editUser?.activitynumber || "");
  const [activitystatus, setactivitystatus] = useState(editUser ? editUser.activitystatus : "");

  const [ticketreferencenumber, setticketreferencenumber] = useState(editUser ? editUser.ticketreferencenumber : "");
  const [wrapup, setwrapup] = useState(editUser ? editUser.wrapup : "");
  const [inquiries, setinquiries] = useState(editUser ? editUser.inquiries : "");
  const [csragent, setcsragent] = useState(editUser ? editUser.csragent : "");

  const [currentPage, setCurrentPage] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalRemarks, setModalRemarks] = useState("");

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 🔥 FIX: Ensure activityList is always an array
  const [activityList, setActivityList] = useState<{
    id: number;
    typeactivity: string;
    callback: string;
    callstatus: string;
    typecall: string;
    remarks: string;
    quotationnumber: string;
    quotationamount: string;
    sonumber: string;
    soamount: string;
    actualsales: string;
    activitystatus: string;
    date_created: string;
  }[]>([]);

  type Activity = {
    id: number;
    typeactivity: string;
    callback: string;
    callstatus: string;
    typecall: string;
    remarks: string;
    quotationnumber: string;
    quotationamount: string;
    sonumber: string;
    soamount: string;
    actualsales: string;
    activitystatus: string;
    date_created: string;
  };

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
        id: editUser?.id, referenceid, manager, tsm, targetquota, companyname, contactperson, contactnumber, emailaddress, typeclient,
        address, deliveryaddress, area, projectname, projectcategory, projecttype, source, typeactivity, startdate, enddate, activitynumber, activitystatus, remarks,
        callback, typecall, quotationnumber, quotationamount, sonumber, soamount, actualsales, callstatus, ticketreferencenumber, wrapup, inquiries, csragent,
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

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  // Deletes the record after confirmation
  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(`/api/ModuleSales/Task/DailyActivity/DeleteProgress`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedId }),
      });

      if (response.ok) {
        toast.success("Post deleted successfully.");
      } else {
        toast.error("Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post.");
    } finally {
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };

  const handleShowRemarks = (remarks: string) => {
    setModalRemarks(remarks);
    setShowModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditClick = (activityId: number) => {
    const selected = activityList.find((act) => act.id === activityId);
    if (selected) {
      setSelectedActivity(selected);
      setIsEditModalOpen(true);
    }
  };

  // Handle input change inside modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedActivity((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  // Save edited activity to API
  const handleSaveEdit = async () => {
    if (!selectedActivity) return;

    try {
      const response = await fetch('/api/ModuleSales/Task/DailyActivity/EditProgress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedActivity),
      });

      if (response.ok) {
        // Update local list after saving
        const updatedList = activityList.map((activity) =>
          activity.id === selectedActivity.id ? selectedActivity : activity
        );
        setActivityList(updatedList);

        toast.success('Activity updated successfully!'); // Optional kung gumagamit ka ng toast
        setIsEditModalOpen(false);
        setSelectedActivity(null);
      } else {
        toast.error('Failed to update activity.');
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('An error occurred while updating.');
    }
  };

  // Close modal
  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <div className="flex justify-end gap-2">
          <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded text-xs flex items-center gap-1">
            {editUser ? <CiEdit size={15} /> : <CiSaveUp1 size={15} />}
            {editUser ? "Update" : "Submit"}
          </button>
          <button type="button" className="border text-black px-4 py-2 rounded text-xs flex items-center gap-1" onClick={onCancel}><CiTurnL1 size={15} /> Back</button>
        </div>
        <h2 className="text-xs font-bold mb-4">
          {editUser ? "Edit Account Information" : "Add New Account"}
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          The process of <strong>creating</strong> or <strong>editing an account</strong> involves updating key information associated with a company. When adding or editing an account, fields such as company name, contact details, client type, and status play an essential role in maintaining accurate and up-to-date records. These fields ensure smooth management and tracking of company accounts within the system, allowing for better organization and coordination. Properly updating these details is crucial for improving communication and ensuring the integrity of the data throughout the process.
        </p>
        <FormFields
          referenceid={referenceid} setreferenceid={setReferenceid}
          manager={manager} setmanager={setManager}
          tsm={tsm} settsm={setTsm}
          targetquota={targetquota} settargetquota={setTargetQuota}
          //
          companyname={companyname} setcompanyname={setcompanyname}
          contactperson={contactperson} setcontactperson={setcontactperson}
          contactnumber={contactnumber} setcontactnumber={setcontactnumber}
          emailaddress={emailaddress} setemailaddress={setemailaddress}
          typeclient={typeclient} settypeclient={settypeclient}
          address={address} setaddress={setaddress}
          deliveryaddress={deliveryaddress} setdeliveryaddress={setdeliveryaddress}
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
          actualsales={actualsales} setactualsales={setactualsales}
          callstatus={callstatus} setcallstatus={setcallstatus}
          startdate={startdate} setstartdate={setstartdate}
          enddate={enddate} setenddate={setenddate}
          activitynumber={activitynumber} setactivitynumber={setactivitynumber}
          activitystatus={activitystatus} setactivitystatus={setactivitystatus}

          ticketreferencenumber={ticketreferencenumber} setticketreferencenumber={setticketreferencenumber}
          wrapup={wrapup} setwrapup={setwrapup}
          inquiries={inquiries} setinquiries={setinquiries}
          csragent={csragent} setcsragent={setcsragent}

          //PassedRecords
          currentRecords={currentRecords}

          editPost={editUser}
        />
        {/* Historical Records Table */}
        <div className="mt-6">
          <h3 className="text-xs font-bold mb-2">Historical Records</h3>
          <p className="text-xs text-gray-600 mb-4">
            This section displays <strong>historical records</strong> of past activities, allowing users to view key details related to calls and related actions. It includes columns such as activity type, callback, call status, and related amounts. The table helps in tracking and reviewing past interactions for better decision-making and analysis.
          </p>

          {/* Desktop View */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                  <th className="px-6 py-4 font-semibold text-gray-700">Type of Activity</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Callback</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Call Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Type of Call</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Q# Number</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Q-Amount</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">SO-Amount</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">SO-Number</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Actual Sales (Final Amount)</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRecords.length > 0 ? (
                  currentRecords.map((activity, index) => (
                    <tr key={index} className="border-b whitespace-nowrap">
                      <td className="px-6 py-4 text-xs">{activity.typeactivity}</td>
                      <td className="px-6 py-4 text-xs">
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

                      <td className="px-6 py-4 text-xs">{activity.callstatus}</td>
                      <td className="px-6 py-4 text-xs">{activity.typecall}</td>
                      <td className="px-6 py-4 text-xs uppercase">{activity.quotationnumber}</td>
                      <td className="px-6 py-4 text-xs">{activity.quotationamount}</td>
                      <td className="px-6 py-4 text-xs">{activity.soamount}</td>
                      <td className="px-6 py-4 text-xs uppercase">{activity.sonumber}</td>
                      <td className="px-6 py-4 text-xs">{activity.actualsales}</td>
                      <td className="px-6 py-4 border break-words truncate max-w-xs cursor-pointer" onClick={() => handleShowRemarks(activity.remarks)}>
                        {activity.remarks}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span
                          className={`px-2 py-1 text-[8px] font-semibold rounded-full whitespace-nowrap ${activity.activitystatus === "Cold"
                            ? "bg-blue-200 text-black"
                            : activity.activitystatus === "Warm"
                              ? "bg-yellow-200 text-black"
                            : activity.activitystatus === "Hot"
                              ? "bg-red-200 text-black" 
                            : activity.activitystatus === "Done"
                              ? "bg-green-200 text-black"   
                              : "bg-green-100 text-green-700"
                            }`}
                        >
                          {activity.activitystatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs flex">
                        <button onClick={() => handleDeleteClick(activity.id.toString())} className="bg-white p-2 rounded-md flex mr-1 text-red-600">
                          <CiTrash size={15} />
                        </button>
                        <button onClick={() => handleEditClick(activity.id)} className="bg-white p-2 rounded-md flex text-blue-900">
                          <CiEdit size={15} /> 
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-2 border">No activities found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {isEditModalOpen && selectedActivity && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-xl">
                  <h2 className="text-md font-bold mb-4">Edit Activity</h2>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <input
                      name="typeactivity"
                      value={selectedActivity.typeactivity || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      placeholder="Type of Activity"
                      disabled
                    />
                    <input
                      name="callback"
                      value={selectedActivity.callback || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      placeholder="Callback"
                      disabled
                    />

                    <select
                      name="callstatus"
                      value={selectedActivity.callstatus || ""}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange(e)}
                      className="w-full px-3 py-2 border rounded text-xs capitalize"
                      required
                      disabled={!selectedActivity.callstatus} // Disable if empty
                    >
                      <option value="">Select Status</option>
                      <option value="Successful">Successful</option>
                      <option value="Unsuccessful">Unsuccessful</option>
                    </select>

                    <select
                      name="typecall"
                      value={selectedActivity.typecall || ""}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange(e)}
                      className="border p-2 rounded"
                      required
                      disabled={!selectedActivity.typecall} // Disable if empty
                    >
                      <option value="">Select Status</option>
                      <option value="Cannot Be Reached">Cannot Be Reached</option>
                      <option value="Follow Up Pending">Follow Up Pending</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Requirements">No Requirements</option>
                      <option value="Not Connected with the Company">Not Connected with the Company</option>
                      <option value="Request for Quotation">Request for Quotation</option>
                      <option value="Ringing Only">Ringing Only</option>
                      <option value="Sent Quotation - Standard">Sent Quotation - Standard</option>
                      <option value="Sent Quotation - With Special Price">Sent Quotation - With Special Price</option>
                      <option value="Sent Quotation - With SPF">Sent Quotation - With SPF</option>
                      <option value="Touch Base">Touch Base</option>
                      <option value="Waiting for Future Projects">Waiting for Future Projects</option>
                      <option value="With SPFS">With SPFS</option>
                    </select>

                    <input
                      name="quotationnumber"
                      value={selectedActivity.quotationnumber || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded uppercase"
                      placeholder="Q# Number"
                    />
                    <input
                      name="quotationamount"
                      value={selectedActivity.quotationamount || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      placeholder="Q-Amount"
                    />
                    <input
                      name="soamount"
                      value={selectedActivity.soamount || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      placeholder="SO-Amount"
                    />
                    <input
                      name="sonumber"
                      value={selectedActivity.sonumber || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded uppercase"
                      placeholder="SO-Number"
                    />
                    <input
                      name="actualsales"
                      value={selectedActivity.actualsales || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded"
                      placeholder="Actual Sales"
                    />
                    <textarea
                      name="remarks"
                      value={selectedActivity.remarks || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded col-span-2 capitalize"
                      placeholder="Remarks"
                    />
                    <input
                      name="activitystatus"
                      value={selectedActivity.activitystatus || ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded col-span-2"
                      placeholder="Status"
                      disabled
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={handleModalClose}
                      className="bg-gray-400 text-xs text-white px-5 py-2 rounded mr-2 flex items-center gap-1"
                    >
                      <CiCircleRemove size={20} />Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-blue-900 text-white text-xs px-5 py-2 rounded flex items-center gap-1"
                    >
                      <CiSaveUp1 size={20} />Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for showing full remarks */}
            {showModal && (
              <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
                  <h3 className="font-semibold text-lg mb-4">Remarks</h3>
                  <div className="modal-body">
                    <p className="text-sm capitalize break-words">{modalRemarks}</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="mt-4 text-blue-500 px-4 py-2 border border-blue-500 rounded text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
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
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
            <p className="text-xs">Are you sure you want to delete this post?</p>
            <div className="mt-4 flex justify-end">
              <button className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2 flex items-center gap-1" onClick={confirmDelete}>
                <CiTrash size={20} /> Delete
              </button>
              <button className="bg-gray-300 text-xs px-4 py-2 rounded flex items-center gap-1" onClick={() => setShowDeleteModal(false)}>
                <CiCircleRemove size={20} />Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddUserForm;
