"use client";

import React, { useEffect, useMemo, useState } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import UserFetcher from "../../components/User/UserFetcher";
import Table from "../../components/Pantsin/Table";
import Filter from "../../components/Pantsin/Filters";
import Pagination from "../../components/Pantsin/Pagination";
import Form from "../../components/Pantsin/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Activity {
  _id: string;
  ReferenceID: string;
  Email: string;
  Type: string;
  Status: string;
  date_created: string; // ISO
}

const ITEMS_PER_PAGE = 10;

const ActivityPage: React.FC = () => {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Search / filter
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Delete confirmation modal for single delete
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null);

  // Bulk delete confirmation modal toggle
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  // Inline edit form
  const [editing, setEditing] = useState<Activity | null>(null);

  // Bulk delete selected IDs
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  /* ---------------- Fetch ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/pantsin/FetchData");
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setActivity(json.data as Activity[]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load Activity Logs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- Filter + Pagination ---------------- */
  const filtered = useMemo(() => {
    return activity.filter((o) => {
      const s = searchTerm.trim().toLowerCase();
      if (
        !o.ReferenceID.toLowerCase().includes(s) &&
        !o.Email.toLowerCase().includes(s)
      )
        return false;

      const d = new Date(o.date_created);
      if (startDate && d < new Date(startDate)) return false;
      if (endDate) {
        const e = new Date(endDate);
        e.setDate(e.getDate() + 1);
        if (d >= e) return false;
      }
      return true;
    });
  }, [activity, searchTerm, startDate, endDate]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  /* ---------------- Delete ---------------- */
  const confirmDelete = (activity: Activity) => setDeleteTarget(activity);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch("/api/pantsin/DeleteData", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget._id }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setActivity((prev) => prev.filter((o) => o._id !== deleteTarget._id));
      toast.success("Activity Logs Deleted");
      setSelectedIds((prev) => {
        const copy = new Set(prev);
        copy.delete(deleteTarget._id);
        return copy;
      });
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  /* ---------------- Bulk Delete ---------------- */
  const openBulkDeleteModal = () => {
    if (selectedIds.size === 0) {
      toast.info("No Activity Logs selected");
      return;
    }
    setBulkDeleteConfirmOpen(true);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.info("No Activity Logs selected");
      return;
    }

    try {
      const res = await fetch("/api/pantsin/DeleteBulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setActivity((prev) => prev.filter((o) => !selectedIds.has(o._id)));
      toast.success(`${selectedIds.size} Activity(s) deleted`);
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      toast.error("Bulk delete failed");
    }
  };

  /* ---------------- Update (inline form) ---------------- */
  const startEdit = (activity: Activity) =>
    setEditing({ ...activity }); // clone for local edits

  const cancelEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const res = await fetch("/api/pantsin/UpdateData", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setActivity((prev) =>
        prev.map((o) => (o._id === editing._id ? editing : o))
      );
      toast.success("Activity updated");
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  /* ---------------- Selection handlers ---------------- */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const toggleSelectAll = () => {
    const allSelected = paginated.every((o) => selectedIds.has(o._id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const copy = new Set(prev);
        paginated.forEach((o) => copy.delete(o._id));
        return copy;
      });
    } else {
      setSelectedIds((prev) => {
        const copy = new Set(prev);
        paginated.forEach((o) => copy.add(o._id));
        return copy;
      });
    }
  };

  /* ---------------- Bulk Delete Confirm Modal ---------------- */
  const BulkDeleteConfirmModal: React.FC<{
    isOpen: boolean;
    count: number;
    onCancel: () => void;
    onConfirm: () => void;
  }> = ({ isOpen, count, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl text-center">
          <h2 className="text-lg font-semibold mb-4">
            Delete {count} {count === 1 ? "Activity" : "Activities"}
          </h2>
          <p className="text-sm mb-6">
            Are you sure you want to delete {count} {count === 1 ? "Activity" : "Activities"}? This
            action cannot be undone.
          </p>
          <div className="flex justify-center gap-3 text-xs">
            <button onClick={onCancel} className="px-4 py-2 border rounded-md">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- JSX ---------------- */
  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {() => (
            <div className="container mx-auto p-4 text-gray-900">
              <div className="bg-white border shadow-md rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                  Activity Logs
                </h2>

                {/* Filters */}
                <Filter
                  searchTerm={searchTerm}
                  setSearchTerm={(v) => {
                    setSearchTerm(v);
                    setCurrentPage(1);
                  }}
                  startDate={startDate}
                  setStartDate={(v) => {
                    setStartDate(v);
                    setCurrentPage(1);
                  }}
                  endDate={endDate}
                  setEndDate={(v) => {
                    setEndDate(v);
                    setCurrentPage(1);
                  }}
                />

                {/* Inline edit form */}
                {editing && (
                  <Form
                    open={Boolean(editing)}
                    value={editing as Activity}
                    onChange={(v) => setEditing(v)}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                  />
                )}

                {/* Table */}
                <Table
                  paginated={paginated}
                  selectedIds={selectedIds}
                  toggleSelectAll={toggleSelectAll}
                  toggleSelect={toggleSelect}
                  startEdit={startEdit}
                  confirmDelete={confirmDelete}
                  handleBulkDelete={openBulkDeleteModal}
                  loading={loading}
                />

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={(p) => setCurrentPage(p)}
                />
              </div>

              {/* Single Delete Confirm Modal */}
              {deleteTarget && (
                <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center px-4">
                  <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl text-center">
                    <h2 className="text-lg font-semibold mb-4">
                      Delete {deleteTarget.ReferenceID}
                    </h2>
                    <p className="text-sm mb-6">Are you sure you want to delete?</p>
                    <div className="flex justify-center gap-3 text-xs">
                      <button
                        onClick={() => setDeleteTarget(null)}
                        className="px-4 py-2 border rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bulk Delete Confirm Modal */}
              <BulkDeleteConfirmModal
                isOpen={bulkDeleteConfirmOpen}
                count={selectedIds.size}
                onCancel={() => setBulkDeleteConfirmOpen(false)}
                onConfirm={async () => {
                  setBulkDeleteConfirmOpen(false);
                  await handleBulkDelete();
                }}
              />

              <ToastContainer className="text-xs" autoClose={1500} />
            </div>
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default ActivityPage;
