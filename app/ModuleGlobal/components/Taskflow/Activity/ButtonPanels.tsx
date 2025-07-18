"use client";
import React from "react";
import { CiTrash, CiEdit } from "react-icons/ci";

interface Props {
    bulkDeleteMode: boolean;
    bulkEditMode: boolean;
    toggleBulkDeleteMode: () => void;
    toggleBulkEditMode: () => void;
    selectedUsers: Set<string>;
    updatedUser: any[];
    handleSelectAll: () => void;
    handleBulkDelete: () => void;
    handleBulkEdit: () => void;
    newTypeClient: string;
    setNewTypeClient: (val: string) => void;
}

const ButtonActions: React.FC<Props> = ({
    bulkDeleteMode,
    bulkEditMode,
    toggleBulkDeleteMode,
    toggleBulkEditMode,
    selectedUsers,
    updatedUser,
    handleSelectAll,
    handleBulkDelete,
    handleBulkEdit,
    newTypeClient,
    setNewTypeClient
}) => {
    return (
        <>
            <div className="flex grid grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-2 mb-3">
                <button onClick={toggleBulkDeleteMode} className="flex items-center gap-1 px-2 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-red-700 hover:text-white">
                    <CiTrash size={16} />
                    {bulkDeleteMode ? "Cancel Bulk Delete" : "Bulk Delete"}
                </button>
                <button onClick={toggleBulkEditMode} className="flex items-center gap-1 px-2 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-900 hover:text-white">
                    <CiEdit size={16} />
                    {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
                </button>
            </div>

            {(bulkDeleteMode || bulkEditMode) && (
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

                        {bulkDeleteMode && (
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
                                <button onClick={handleBulkEdit} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs" disabled={!newTypeClient}>Apply Changes</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ButtonActions;
