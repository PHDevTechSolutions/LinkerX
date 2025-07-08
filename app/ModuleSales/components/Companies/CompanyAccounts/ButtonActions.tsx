import React, { useState } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";

interface ButtonActionsProps {
    bulkEditMode: boolean;
    bulkRemoveMode: boolean;
    bulkChangeMode: boolean;
    selectedUsers: Set<string>;
    updatedUserLength: number;
    newTypeClient: string;
    newStatus: string;
    newRemarks: string;
    selectedTsa: string;
    tsaList: any[];
    toggleBulkEditMode: () => void;
    toggleBulkRemoveMode: () => void;
    toggleBulkChangeMode: () => void;
    handleSelectAll: () => void;
    handleDeselectAll: () => void;
    handleBulkEdit: () => Promise<void> | void;
    handleBulkRemove: () => Promise<void> | void;
    handleBulkChange: () => Promise<void> | void;
    setNewTypeClient: (value: string) => void;
    setNewStatus: (value: string) => void;
    setNewRemarks: (value: string) => void;
}

const ButtonActions: React.FC<ButtonActionsProps> = ({
    bulkEditMode,
    bulkRemoveMode,
    bulkChangeMode,
    selectedUsers,
    updatedUserLength,
    newTypeClient,
    newStatus,
    newRemarks,
    toggleBulkEditMode,
    toggleBulkRemoveMode,
    toggleBulkChangeMode,
    handleSelectAll,
    handleDeselectAll,
    handleBulkEdit,
    handleBulkRemove,
    handleBulkChange,
    setNewTypeClient,
    setNewStatus,
    setNewRemarks,
}) => {
    const [isApplyingEdit, setIsApplyingEdit] = useState(false);
    const [isApplyingRemove, setIsApplyingRemove] = useState(false);
    const [isApplyingChange, setIsApplyingChange] = useState(false);

    const handleApplyEdit = async () => {
        setIsApplyingEdit(true);
        try {
            await handleBulkEdit();
        } finally {
            setIsApplyingEdit(false);
        }
    };

    const handleApplyRemove = async () => {
        setIsApplyingRemove(true);
        try {
            await handleBulkRemove();
        } finally {
            setIsApplyingRemove(false);
        }
    };

    const handleApplyChange = async () => {
        setIsApplyingChange(true);
        try {
            await handleBulkChange();
        } finally {
            setIsApplyingChange(false);
        }
    };

    return (
        <>
            <div className="flex gap-2 mb-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                <button
                    onClick={toggleBulkEditMode}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-400 hover:text-white"
                >
                    <CiEdit size={16} />
                    {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
                </button>

                <button
                    onClick={toggleBulkRemoveMode}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-400 hover:text-white"
                >
                    <CiTrash size={16} />
                    {bulkRemoveMode ? "Cancel Remove Edit" : "Bulk Remove"}
                </button>

                <button
                    onClick={toggleBulkChangeMode}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-blue-400 hover:text-white"
                >
                    <CiEdit size={16} />
                    {bulkChangeMode ? "Cancel Bulk Change" : "Bulk Change"}
                </button>
            </div>

            {(bulkEditMode || bulkChangeMode || bulkRemoveMode) && (
                <div className="mb-4 p-3 bg-gray-100 rounded-md text-xs">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedUsers.size === updatedUserLength && updatedUserLength > 0}
                                onChange={handleSelectAll}
                                className="w-4 h-4"
                            />
                            <span className="ml-2">Select All</span>
                            <button
                                onClick={handleDeselectAll}
                                className="ml-4 px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-200"
                                disabled={selectedUsers.size === 0}
                            >
                                Deselect All
                            </button>
                            <span className="ml-4 font-semibold text-gray-700">
                                Selected: {selectedUsers.size} / {updatedUserLength}
                            </span>
                        </div>

                        {bulkEditMode && (
                            <div className="flex items-center gap-2">
                                <select
                                    value={newTypeClient}
                                    onChange={(e) => setNewTypeClient(e.target.value)}
                                    className="px-2 py-1 border rounded-md"
                                >
                                    <option value="">Select Client</option>
                                    <option value="Top 50">Top 50</option>
                                    <option value="Next 30">Next 30</option>
                                    <option value="Balance 20">Balance 20</option>
                                    <option value="CSR Client">CSR Client</option>
                                    <option value="TSA Client">TSA Client</option>
                                </select>
                                <button
                                    onClick={handleApplyEdit}
                                    className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500 text-xs"
                                    disabled={!newTypeClient || isApplyingEdit}
                                >
                                    {isApplyingEdit ? "Applying..." : "Apply Changes"}
                                </button>
                            </div>
                        )}

                        {bulkRemoveMode && (
                            <div className="flex items-center gap-2">
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="px-2 py-1 border rounded-md"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Remove">Remove</option>
                                    <option value="For Deletion">For Deletion</option>
                                </select>
                                <input
                                    type="text"
                                    value={newRemarks}
                                    onChange={(e) => setNewRemarks(e.target.value)}
                                    placeholder="Reason/Remarks..."
                                    className="px-2 py-1 border rounded-md"
                                />
                                <button
                                    onClick={handleApplyRemove}
                                    className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500 text-xs"
                                    disabled={!newStatus || isApplyingRemove}
                                >
                                    {isApplyingRemove ? "Applying..." : "Apply Changes"}
                                </button>
                            </div>
                        )}

                        {bulkChangeMode && (
                            <div className="flex items-center gap-2">
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="px-2 py-1 border rounded-md"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Used">Active</option>
                                    <option value="New Client">New Client</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Non-Buying">Non-Buying</option>
                                </select>
                                <button
                                    onClick={handleApplyChange}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                                    disabled={!newStatus || isApplyingChange}
                                >
                                    {isApplyingChange ? "Applying..." : "Apply Changes"}
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-xs mt-2 text-gray-600">
                        This section allows you to perform a <strong>Bulk Status Change</strong> on selected records. You can easily update the
                        status of multiple records from <strong>On Hold</strong> to either <strong>Active</strong> or <strong>Used</strong>.
                        To begin, select the appropriate status from the dropdown list. Once the status is chosen, click the <strong>Apply Changes</strong> button to apply the update to all
                        selected records. This feature simplifies the process of managing multiple records at once, saving time and ensuring consistency.
                    </p>
                </div>
            )}
        </>
    );
};

export default ButtonActions;
