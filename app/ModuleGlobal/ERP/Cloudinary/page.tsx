"use client";

import React, { useState, useEffect, useMemo } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import UserFetcher from "../../components/User/UserFetcher";
import Table from "../../components/Cloudinary/Table";
import Filter from "../../components/Cloudinary/Filters";
import Pagination from "../../components/Cloudinary/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MediaItem {
    asset_id: string;
    public_id: string;
    format: string;
    bytes: number;
    created_at: string;
    secure_url: string;
}

const ITEMS_PER_PAGE = 10;

const Page: React.FC = () => {
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/Data/Applications/Cloudinary/Fetch");
                const json = await res.json();
                if (!json.success) throw new Error(json.error);
                setMediaList(json.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load media library");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Filtered and searched list
    const filtered = useMemo(() => {
        return mediaList.filter((item) => {
            const searchLower = searchTerm.toLowerCase();
            const createdDate = new Date(item.created_at);
            if (
                searchTerm &&
                !item.public_id.toLowerCase().includes(searchLower) &&
                !item.format.toLowerCase().includes(searchLower)
            ) {
                return false;
            }
            if (startDate && createdDate < new Date(startDate)) {
                return false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setDate(end.getDate() + 1); // include whole day
                if (createdDate >= end) {
                    return false;
                }
            }
            return true;
        });
    }, [mediaList, searchTerm, startDate, endDate]);

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = useMemo(() => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, startDate, endDate]);

    const confirmDelete = (item: MediaItem) => {
        setDeleteTarget(item);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch("/api/Data/Applications/Delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ public_id: deleteTarget.public_id }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);

            toast.success(`Deleted ${deleteTarget.public_id}`);
            setMediaList((prev) =>
                prev.filter((item) => item.public_id !== deleteTarget.public_id)
            );
            setDeleteTarget(null);
        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                <div className="mb-4 p-4 bg-white border shadow-md rounded-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-bold">Cloudinary Media Library</h2>
                                    </div>
                                    {/* Search & Date Filters */}
                                    <Filter
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        startDate={startDate}
                                        setStartDate={setStartDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                    />
                                    {loading ? (
                                        <p className="text-center py-8">Loading…</p>
                                    ) : filtered.length === 0 ? (
                                        <p className="text-center py-8">No media found.</p>
                                    ) : (
                                        <Table mediaItems={paginated} confirmDelete={confirmDelete} />
                                    )}

                                    {/* Pagination */}
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        setCurrentPage={setCurrentPage}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                        totalItems={filtered.length}
                                    />
                                </div>
                            </div>

                            {/* Delete Confirmation Modal */}
                            {deleteTarget && (
                                <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center px-4">
                                    <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl text-center">
                                        <h2 className="text-lg font-semibold mb-4">
                                            Delete {deleteTarget.public_id}
                                        </h2>
                                        <p className="text-sm mb-6">
                                            Are you sure you want to delete this media? This action cannot
                                            be undone.
                                        </p>
                                        <div className="flex justify-center gap-3 text-xs">
                                            <button
                                                onClick={() => setDeleteTarget(null)}
                                                className="px-4 py-2 border rounded-md"
                                                disabled={deleting}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
                                                disabled={deleting}
                                            >
                                                {deleting ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <ToastContainer className="text-xs" autoClose={1500} />
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default Page;
