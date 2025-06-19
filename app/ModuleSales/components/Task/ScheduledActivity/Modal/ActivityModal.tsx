import React from "react";
import { CiCircleRemove, CiSaveUp1 } from "react-icons/ci";
import { motion } from "framer-motion";

interface Activity {
  id: number;
  date_created: string;
  typeactivity: string;
  startdate: string;
  enddate: string;
  callback?: string;
  callstatus?: string;
  typecall?: string;
  quotationnumber?: string;
  quotationamount?: string;
  soamount?: string;
  sonumber?: string;
  actualsales?: string;
  remarks?: string;
  activitystatus?: string;
}

interface ActivityModalProps {
  activity: Activity;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onClose: () => void;
  onSave: () => void;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const ActivityModal: React.FC<ActivityModalProps> = ({
  activity,
  onChange,
  onClose,
  onSave,
}) => {
  const remarksRegex = /^[a-zA-Z0-9\s.,?!'"-]{0,200}$/;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="bg-white p-6 rounded-lg w-full max-w-xl"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        transition={{ duration: 0.15 }}
      >
        <h2 className="text-sm font-bold mb-4">Edit Activity Logs</h2>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <input
            name="typeactivity"
            value={activity.typeactivity}
            onChange={onChange}
            className="border p-2 rounded"
            placeholder="Type of Activity"
            disabled
          />

          <input
            name="callback"
            value={activity.callback || ""}
            onChange={onChange}
            className="border p-2 rounded"
            placeholder="Callback"
            disabled
          />

          <select
            name="callstatus"
            value={activity.callstatus || ""}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
          >
            <option value="">Select Status</option>
            <option value="Successful">Successful</option>
            <option value="Unsuccessful">Unsuccessful</option>
          </select>

          <select
            name="typecall"
            value={activity.typecall || ""}
            onChange={onChange}
            className="border p-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="Cannot Be Reached">Cannot Be Reached</option>
            <option value="Follow Up Pending">Follow Up Pending</option>
            <option value="Inactive">Inactive</option>
            <option value="Requirements">No Requirements</option>
            <option value="Not Connected with the Company">
              Not Connected with the Company
            </option>
            <option value="Request for Quotation">Request for Quotation</option>
            <option value="Ringing Only">Ringing Only</option>
            <option value="Sent Quotation - Standard">
              Sent Quotation - Standard
            </option>
            <option value="Sent Quotation - With Special Price">
              Sent Quotation - With Special Price
            </option>
            <option value="Sent Quotation - With SPF">
              Sent Quotation - With SPF
            </option>
            <option value="Touch Base">Touch Base</option>
            <option value="Waiting for Future Projects">
              Waiting for Future Projects
            </option>
            <option value="With SPFS">With SPFS</option>
          </select>

          <input
            name="quotationnumber"
            value={activity.quotationnumber || ""}
            onChange={(e) => {
              const value = e.target.value;
              const alphanumeric = /^[a-zA-Z0-9]*$/;
              if (value.length <= 30 && alphanumeric.test(value)) {
                onChange(e);
              }
            }}
            className="border p-2 rounded uppercase"
            placeholder="Q# Number"
          />

          <input
            name="quotationamount"
            value={activity.quotationamount || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits and at most one dot
              const validNumber = /^\d*\.?\d*$/;
              if (validNumber.test(value)) {
                onChange(e);
              }
            }}
            className="border p-2 rounded"
            placeholder="Q-Amount"
          />

          <input
            name="soamount"
            value={activity.soamount || ""}
            onChange={(e) => {
              const value = e.target.value;
              const validNumber = /^\d*\.?\d*$/;
              if (validNumber.test(value)) {
                onChange(e);
              }
            }}
            className="border p-2 rounded"
            placeholder="SO-Amount"
          />

          <input
            name="sonumber"
            value={activity.sonumber || ""}
            onChange={(e) => {
              const value = e.target.value;
              const alphanumeric = /^[a-zA-Z0-9]*$/;
              if (value.length <= 30 && alphanumeric.test(value)) {
                onChange(e);
              }
            }}
            className="border p-2 rounded uppercase"
            placeholder="SO-Number"
          />

          <input
            name="actualsales"
            value={activity.actualsales || ""}
            onChange={(e) => {
              const value = e.target.value;
              const validNumber = /^\d*\.?\d*$/;
              if (validNumber.test(value)) {
                onChange(e);
              }
            }}
            className="border p-2 rounded"
            placeholder="Actual Sales"
          />
        </div>

        <div className="relative mt-4">
          <textarea
            name="remarks"
            value={activity.remarks || ""}
            onChange={(e) => {
              if (remarksRegex.test(e.target.value)) {
                onChange(e);
              }
            }}
            className="border p-2 text-xs rounded w-full capitalize" rows={5}
            placeholder="Remarks"
          />
          <small className="absolute right-2 bottom-1 text-xs text-gray-400">
            {(activity.remarks?.length || 0)}/200
          </small>
        </div>

        <input
          name="activitystatus"
          value={activity.activitystatus || ""}
          onChange={onChange}
          className="border p-2 text-xs rounded w-full mt-4"
          placeholder="Status"
          disabled
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 text-xs text-white px-5 py-2 rounded flex items-center gap-1"
          >
            <CiCircleRemove size={18} /> Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-blue-900 text-white text-xs px-5 py-2 rounded flex items-center gap-1"
          >
            <CiSaveUp1 size={18} /> Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ActivityModal;
