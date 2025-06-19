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
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
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
            className="border p-2 rounded"
            required
            disabled={!selectedActivity.typecall}
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
  );
};

export default EditRecordModal;
