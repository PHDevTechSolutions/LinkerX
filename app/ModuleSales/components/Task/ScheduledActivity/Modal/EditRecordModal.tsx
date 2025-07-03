import React from "react";
import { CiCircleRemove, CiSaveUp1 } from "react-icons/ci";

interface Activity {
  id: number | string;
  typeactivity: string;
  callback?: string;
  callstatus: string;
  typecall: string;
  quotationnumber: string;
  quotationamount: number | string;
  soamount: number | string;
  sonumber: string;
  actualsales: number | string;
  remarks: string;
  activitystatus: string;

  referenceid: string;
  manager: string;
  tsm: string;
  activitynumber: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  emailaddress: string;
  typeclient: string;
  address: string;
  deliveryaddress: string;
  area: string;
  projectname: string;
  projectcategory: string;
  projecttype: string;
  source: string;
  targetquota: string;
}

interface EditRecordModalProps {
  selectedActivity: Activity;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleModalClose: () => void;
  handleSaveEdit: () => void;
}

const EditRecordModal: React.FC<EditRecordModalProps> = ({
  selectedActivity,
  handleInputChange,
  handleModalClose,
  handleSaveEdit,
}) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl">
        <h2 className="text-md font-bold mb-4">Edit History Logs</h2>

        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Hidden Fields */}
          <input type="hidden" name="referenceid" value={selectedActivity.referenceid} onChange={handleInputChange} />
          <input type="hidden" name="manager" value={selectedActivity.manager} onChange={handleInputChange} />
          <input type="hidden" name="tsm" value={selectedActivity.tsm} onChange={handleInputChange} />
          <input type="hidden" name="activitynumber" value={selectedActivity.activitynumber} onChange={handleInputChange} />
          <input type="hidden" name="companyname" value={selectedActivity.companyname} onChange={handleInputChange} />
          <input type="hidden" name="contactperson" value={selectedActivity.contactperson} onChange={handleInputChange} />
          <input type="hidden" name="contactnumber" value={selectedActivity.contactnumber} onChange={handleInputChange} />
          <input type="hidden" name="emailaddress" value={selectedActivity.emailaddress} onChange={handleInputChange} />
          <input type="hidden" name="typeclient" value={selectedActivity.typeclient} onChange={handleInputChange} />
          <input type="hidden" name="address" value={selectedActivity.address} onChange={handleInputChange} />
          <input type="hidden" name="deliveryaddress" value={selectedActivity.deliveryaddress} onChange={handleInputChange} />
          <input type="hidden" name="area" value={selectedActivity.area} onChange={handleInputChange} />
          <input type="hidden" name="projectname" value={selectedActivity.projectname} onChange={handleInputChange} />
          <input type="hidden" name="projectcategory" value={selectedActivity.projectcategory} onChange={handleInputChange} />
          <input type="hidden" name="projecttype" value={selectedActivity.projecttype} onChange={handleInputChange} />
          <input type="hidden" name="source" value={selectedActivity.source} onChange={handleInputChange} />
          <input type="hidden" name="targetquota" value={selectedActivity.targetquota} onChange={handleInputChange} />
          {/* Hidden Fields */}

          <input
            name="typeactivity"
            value={selectedActivity.typeactivity || ""}
            onChange={handleInputChange}
            className="border-b p-2"
            placeholder="Type of Activity"
            disabled
          />
          <input
            name="callback"
            value={selectedActivity.callback || ""}
            onChange={handleInputChange}
            className="border-b p-2"
            placeholder="Callback"
            disabled
          />

          <select
            name="callstatus"
            value={selectedActivity.callstatus || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border-b text-xs capitalize"
            required
            disabled={!selectedActivity.callstatus}
          >
            <option value="">Select Status</option>
            <option value="Successful">Successful</option>
            <option value="Unsuccessful">Unsuccessful</option>
          </select>

          <select
            name="typecall"
            value={selectedActivity.typecall || ""}
            onChange={handleInputChange}
            className="border-b p-2 bg-white"
            required
            disabled={!selectedActivity.typecall}
          >
            <option value="">Select Type</option>
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
            <option value="Regular SO">Regular SO</option>
            <option value="Willing to Wait">Willing to Wait</option>
            <option value="SPF - Special Project">SPF - Special Project</option>
            <option value="Local SPF">Local SPF</option>
            <option value="SPF - Local">SPF - Local</option>
            <option value="SPF - Foreign">SPF - Foreign</option>
            <option value="Promo">Promo</option>
            <option value="FB Marketplace">FB Marketplace</option>
            <option value="Internal Order">Internal Order</option>
          </select>

          <input
            name="quotationnumber"
            value={selectedActivity.quotationnumber || ""}
            onChange={handleInputChange}
            className="border-b p-2 uppercase"
            placeholder="Q# Number"
          />
          <input
            name="quotationamount"
            value={selectedActivity.quotationamount || ""}
            onChange={handleInputChange}
            className="border-b p-2"
            placeholder="₱0.00"
          />
          <input
            name="soamount"
            value={selectedActivity.soamount || ""}
            onChange={handleInputChange}
            className="border-b p-2"
            placeholder="₱0.00"
          />
          <input
            name="sonumber"
            value={selectedActivity.sonumber || ""}
            onChange={handleInputChange}
            className="border-b p-2 uppercase"
            placeholder="SO-Number"
          />
          <input
            name="actualsales"
            value={selectedActivity.actualsales || ""}
            onChange={handleInputChange}
            className="border-b p-2"
            placeholder="₱0.00"
          />
          <textarea
            name="remarks"
            value={selectedActivity.remarks || ""}
            onChange={handleInputChange}
            className="border-b p-2 col-span-2 capitalize"
            placeholder="Remarks"
          />
          <input
            name="activitystatus"
            value={selectedActivity.activitystatus || ""}
            onChange={handleInputChange}
            className="border-b p-2 col-span-2"
            placeholder="Status"
            disabled
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleModalClose}
            className="hover:bg-gray-200 text-[10px] border text-black px-5 py-2 rounded flex items-center gap-1"
          >
            <CiCircleRemove size={15} /> Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="bg-blue-700 hover:bg-blue-800 text-white text-[10px] px-5 py-2 rounded flex items-center gap-1"
          >
            <CiSaveUp1 size={15} /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRecordModal;
