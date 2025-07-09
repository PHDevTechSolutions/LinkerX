import React from "react";
import { CiTrash, CiEdit, CiSliderHorizontal } from "react-icons/ci";

interface ButtonActionsProps {
  bulkEditMode: boolean;
  toggleBulkEditMode: () => void;
  bulkTransferMode: boolean;
  toggleBulkTransferMode: () => void;
  selectedUsers: Set<string>;
  updatedUserLength: number;
  setSelectedUsers: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleBulkDelete: () => void;
  handleBulkTransfer: () => void;
  selectedTsm: string;
  setSelectedTsm: React.Dispatch<React.SetStateAction<string>>;
  tsmList: any[];
}

const ButtonActions: React.FC<ButtonActionsProps> = ({
  bulkEditMode,
  toggleBulkEditMode,
  bulkTransferMode,
  toggleBulkTransferMode,
  selectedUsers,
  updatedUserLength,
  setSelectedUsers,
  handleBulkDelete,
  handleBulkTransfer,
  selectedTsm,
  setSelectedTsm,
  tsmList,
}) => {
  return (
    <>
      <div className="flex gap-2 mb-3">
        <button
          onClick={toggleBulkEditMode}
          className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white"
        >
          <CiTrash size={16} />
          {bulkEditMode ? "Cancel Bulk Delete" : "Bulk Delete"}
        </button>
        <button
          onClick={toggleBulkTransferMode}
          className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white"
        >
          <CiSliderHorizontal size={16} />
          {bulkTransferMode ? "Cancel Bulk Transfer" : "Bulk Transfer to Another Manager"}
        </button>
      </div>

      {bulkEditMode && (
        <div className="mb-4 p-2 bg-gray-100 rounded-md text-xs flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedUsers.size === updatedUserLength && updatedUserLength > 0}
              onChange={() => {
                if (selectedUsers.size === updatedUserLength) {
                  setSelectedUsers(new Set());
                } else {
                  setSelectedUsers(new Set(Array.from({ length: updatedUserLength }, (_, i) => `user-${i}`)));
                }
              }}
              className="w-4 h-4"
            />
            <span className="ml-2">Select All</span>
            <span className="ml-4 font-semibold text-gray-700">
              Selected: {selectedUsers.size} / {updatedUserLength}
            </span>
          </div>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
            disabled={selectedUsers.size === 0}
          >
            Bulk Delete
          </button>
        </div>
      )}

      {bulkTransferMode && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedUsers.size === updatedUserLength && updatedUserLength > 0}
                onChange={() => {
                  if (selectedUsers.size === updatedUserLength) {
                    setSelectedUsers(new Set());
                  } else {
                    setSelectedUsers(new Set(Array.from({ length: updatedUserLength }, (_, i) => `user-${i}`)));
                  }
                }}
                className="w-4 h-4"
              />
              <span className="ml-2">Select All</span>
              <span className="ml-4 font-semibold text-gray-700">
                Selected: {selectedUsers.size} / {updatedUserLength}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Territory Sales Manager:</label>
              <select
                value={selectedTsm}
                onChange={(e) => setSelectedTsm(e.target.value)}
                className="px-2 py-1 border rounded-md capitalize"
              >
                <option value="">Select Territory Sales Manager</option>
                {tsmList.map((tsa) => (
                  <option key={tsa._id || tsa.ReferenceID} value={tsa.ReferenceID}>
                    {tsa.Firstname} {tsa.Lastname}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBulkTransfer}
                className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs"
                disabled={!selectedTsm}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonActions;
