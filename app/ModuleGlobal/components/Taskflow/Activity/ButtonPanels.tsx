"use client";

import React from "react";
import { CiTrash, CiEdit } from "react-icons/ci";
import { BiTransfer } from "react-icons/bi";

interface Props {
  Role: string; // ✅ added this for role check

  bulkDeleteMode: boolean;
  bulkEditMode: boolean;
  bulkTransferMode: boolean;
  bulkTransferTSAMode: boolean;

  toggleBulkDeleteMode: () => void;
  toggleBulkEditMode: () => void;
  toggleBulkTransferMode: () => void;
  toggleBulkTransferTSAMode: () => void;

  selectedUsers: Set<string>;
  updatedUser: any[];
  handleSelectAll: () => void;

  tsmList: any[];
  tsaList: any[];
  selectedTsm: string;
  setSelectedTsm: (val: string) => void;
  selectedTsa: string;
  setSelectedTsa: (val: string) => void;
  handleBulkTransfer: () => void;
  handleBulkTSATransfer: () => void;
  handleBulkDelete: () => void;
  handleBulkEdit: () => void;
  newTypeClient: string;
  setNewTypeClient: (val: string) => void;
}

const ButtonActions: React.FC<Props> = ({
  Role,
  bulkDeleteMode,
  bulkEditMode,
  bulkTransferMode,
  bulkTransferTSAMode,
  toggleBulkDeleteMode,
  toggleBulkEditMode,
  toggleBulkTransferMode,
  toggleBulkTransferTSAMode,
  selectedUsers,
  updatedUser,
  handleSelectAll,
  tsmList,
  tsaList,
  selectedTsm,
  setSelectedTsm,
  selectedTsa,
  setSelectedTsa,
  handleBulkTransfer,
  handleBulkTSATransfer,
  handleBulkDelete,
  handleBulkEdit,
  newTypeClient,
  setNewTypeClient
}) => {
  return (
    <>
      <div className="flex grid grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-2 mb-3">
        {Role === "Super Admin" && (
          <button
            onClick={toggleBulkDeleteMode}
            className="flex items-center gap-1 px-2 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-red-700 hover:text-white"
          >
            <CiTrash size={16} />
            {bulkDeleteMode ? "Cancel Bulk Delete" : "Bulk Delete"}
          </button>
        )}
        <button
          onClick={toggleBulkEditMode}
          className="flex items-center gap-1 px-2 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-900 hover:text-white"
        >
          <CiEdit size={16} />
          {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
        </button>
        <button
          onClick={toggleBulkTransferMode}
          className="flex items-center gap-1 px-2 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white"
        >
          <BiTransfer size={16} />
          {bulkTransferMode ? "Cancel Bulk Transfer" : "Bulk Transfer to TSM"}
        </button>
        <button
          onClick={toggleBulkTransferTSAMode}
          className="flex items-center gap-1 px-2 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-purple-900 hover:text-white"
        >
          <BiTransfer size={16} />
          {bulkTransferTSAMode ? "Cancel Bulk Transfer" : "Bulk Transfer to TSA"}
        </button>
      </div>

      {(bulkDeleteMode || bulkEditMode || bulkTransferMode || bulkTransferTSAMode) && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedUsers.size === updatedUser.length && updatedUser.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4"
              />
              <span className="ml-2">Select All</span>
              <span className="ml-4 font-semibold text-gray-700">
                Selected: {selectedUsers.size} / {updatedUser.length}
              </span>
            </div>

            {bulkTransferMode && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium">Territory Sales Manager:</label>
                <select value={selectedTsm} onChange={(e) => setSelectedTsm(e.target.value)} className="px-2 py-1 border rounded-md capitalize">
                  <option value="">Select Territory Sales Manager</option>
                  {tsmList.map((tsm) => (
                    <option key={tsm._id || tsm.ReferenceID} value={tsm.ReferenceID}>
                      {tsm.Firstname} {tsm.Lastname}
                    </option>
                  ))}
                </select>
                <button onClick={handleBulkTransfer} className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs" disabled={!selectedTsm}>
                  Transfer
                </button>
              </div>
            )}

            {bulkTransferTSAMode && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium">Territory Sales Associates:</label>
                <select value={selectedTsa} onChange={(e) => setSelectedTsa(e.target.value)} className="px-2 py-1 border rounded-md capitalize">
                  <option value="">Select Territory Sales Associates</option>
                  {tsaList.map((tsa) => (
                    <option key={tsa._id || tsa.ReferenceID} value={tsa.ReferenceID}>
                      {tsa.Firstname} {tsa.Lastname}
                    </option>
                  ))}
                </select>
                <button onClick={handleBulkTSATransfer} className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs" disabled={!selectedTsa}>
                  Transfer
                </button>
              </div>
            )}

            {bulkDeleteMode && Role === "Super Admin" && (
              <button onClick={handleBulkDelete} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs" disabled={selectedUsers.size === 0}>
                Bulk Delete
              </button>
            )}

            {bulkEditMode && (
              <div className="flex items-center gap-2">
                <select value={newTypeClient} onChange={(e) => setNewTypeClient(e.target.value)} className="px-2 py-1 border rounded-md">
                  <option value="">Select Client</option>
                  <option value="Top 50">Top 50</option>
                  <option value="Next 30">Next 30</option>
                  <option value="Balance 20">Balance 20</option>
                  <option value="CSR Client">CSR Client</option>
                  <option value="TSA Client">TSA Client</option>
                </select>
                <button onClick={handleBulkEdit} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs" disabled={!newTypeClient}>
                  Apply Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonActions;
