import React from "react";

interface ConfirmationModalProps {
  userDetails: {
    referenceid: string;
    manager: string;
    tsm: string;
  };
  activitystatus: string;
  activityremarks: string;
  startdate: Date;
  enddate: Date;
  duration: number | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  userDetails,
  activitystatus,
  activityremarks,
  startdate,
  enddate,
  duration,
  onCancel,
  onConfirm,
}) => {
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 relative">
        <h3 className="text-base font-bold mb-4">Confirm Your Details</h3>

        <div className="text-xs space-y-2 mb-6">
          <p><strong>Reference ID:</strong> {userDetails.referenceid}</p>
          <p><strong>Manager:</strong> {userDetails.manager}</p>
          <p><strong>TSM:</strong> {userDetails.tsm}</p>
          <p><strong>Activity Status:</strong> {activitystatus}</p>
          <p><strong>Remarks:</strong> {activityremarks}</p>
          <p><strong>Start Date:</strong> {formatDateTime(startdate)}</p>
          <p><strong>End Date:</strong> {formatDateTime(enddate)}</p>
          <p><strong>Duration (minutes):</strong> {duration ?? "-"}</p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded text-xs hover:bg-gray-400"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            Confirm & Submit
          </button>
        </div>

        <button
          onClick={onCancel}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
