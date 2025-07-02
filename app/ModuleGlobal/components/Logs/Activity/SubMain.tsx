"use client";
import React from "react";
import ButtonPanels from "./ButtonPanels";
import GridXchire from "./GridXchire";
import TableXchire from "./TableXchire";
import AnalyticsContainer from "./Analytics/AnalyticsContainer";

interface SubMainProps {
  updatedUser: any[];
  bulkDeleteMode: boolean;
  bulkEditMode: boolean;
  bulkTransferMode: boolean;
  bulkTransferTSAMode: boolean;
  selectedUsers: Set<string>;
  handleSelectUser: (id: string) => void;
  handleEdit: (post: any) => void;
  formatDate: (timestamp: number) => string;
  statusColors: Record<string, string>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleBulkDeleteMode: () => void;
  toggleBulkEditMode: () => void;
  toggleBulkTransferMode: () => void;
  toggleBulkTransferTSAMode: () => void;
  handleBulkDelete: () => void;
  handleBulkEdit: () => void;
  handleBulkTransfer: () => void;
  handleBulkTSATransfer: () => void;
  handleSelectAll: () => void;
  tsmList: any[];
  tsaList: any[];
  selectedTsm: string;
  setSelectedTsm: (val: string) => void;
  selectedTsa: string;
  setSelectedTsa: (val: string) => void;
  newTypeClient: string;
  setNewTypeClient: (val: string) => void;
}

const SubMain: React.FC<SubMainProps> = ({
  updatedUser,
  bulkDeleteMode,
  bulkEditMode,
  bulkTransferMode,
  bulkTransferTSAMode,
  selectedUsers,
  handleSelectUser,
  handleEdit,
  formatDate,
  statusColors,
  activeTab,
  setActiveTab,
  toggleBulkDeleteMode,
  toggleBulkEditMode,
  toggleBulkTransferMode,
  toggleBulkTransferTSAMode,
  handleBulkDelete,
  handleBulkEdit,
  handleBulkTransfer,
  handleBulkTSATransfer,
  handleSelectAll,
  tsmList,
  tsaList,
  selectedTsm,
  setSelectedTsm,
  selectedTsa,
  setSelectedTsa,
  newTypeClient,
  setNewTypeClient,
}) => {
  return (
    <div className="mb-4">
      <ButtonPanels
        bulkDeleteMode={bulkDeleteMode}
        bulkEditMode={bulkEditMode}
        bulkTransferMode={bulkTransferMode}
        bulkTransferTSAMode={bulkTransferTSAMode}
        toggleBulkDeleteMode={toggleBulkDeleteMode}
        toggleBulkEditMode={toggleBulkEditMode}
        toggleBulkTransferMode={toggleBulkTransferMode}
        toggleBulkTransferTSAMode={toggleBulkTransferTSAMode}
        selectedUsers={selectedUsers}
        updatedUser={updatedUser}
        handleSelectAll={handleSelectAll}
        tsmList={tsmList}
        tsaList={tsaList}
        selectedTsm={selectedTsm}
        setSelectedTsm={setSelectedTsm}
        selectedTsa={selectedTsa}
        setSelectedTsa={setSelectedTsa}
        handleBulkTransfer={handleBulkTransfer}
        handleBulkTSATransfer={handleBulkTSATransfer}
        handleBulkDelete={handleBulkDelete}
        handleBulkEdit={handleBulkEdit}
        newTypeClient={newTypeClient}
        setNewTypeClient={setNewTypeClient}
      />

      <div className="flex space-x-2 mb-4 text-[10px]">
        <button
          className={`px-4 py-2 rounded ${activeTab === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("table")}
        >
          Table View
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("grid")}
        >
          Grid View
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "analytics" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      {activeTab === "table" ? (
        <div className="overflow-x-auto">
          <TableXchire
            updatedUser={updatedUser}
            bulkDeleteMode={bulkDeleteMode}
            bulkEditMode={bulkEditMode}
            bulkTransferMode={bulkTransferMode}
            bulkTransferTSAMode={bulkTransferTSAMode}
            selectedUsers={selectedUsers}
            handleSelectUser={handleSelectUser}
            handleEdit={handleEdit}
            formatDate={formatDate}
            statusColors={statusColors}
          />
        </div>
      ) : activeTab === "grid" ? (
        <GridXchire
          updatedUser={updatedUser}
          selectedUsers={selectedUsers}
          handleSelectUser={handleSelectUser}
          handleEdit={handleEdit}
          formatDate={formatDate}
          statusColors={statusColors}
          bulkDeleteMode={bulkDeleteMode}
          bulkEditMode={bulkEditMode}
          bulkTransferMode={bulkTransferMode}
          bulkTransferTSAMode={bulkTransferTSAMode}
        />
      ) : (
        <AnalyticsContainer updatedUser={updatedUser} />
      )}
    </div>
  );
};

export default SubMain;
