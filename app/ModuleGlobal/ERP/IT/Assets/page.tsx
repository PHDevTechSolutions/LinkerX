"use client";

import React, { useEffect, useState } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
import Table from '../../../components/IT/Assets/Table';
import Filters from '../../../components/IT/Assets/Filters';
import Pagination from '../../../components/IT/Assets/Pagination';
import Form from '../../../components/IT/Assets/Form';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AssetItem {
    _id?: string;
    location: string;
    designation: string;
    brand: string;
    model: string;
    serialNumber: string;
    ipAddress: string;
    macAddress: string;
    type: string;
    printerName: string;
    remarks: string;
    warrantyDate: string;
    siNumber: string;
    dateOfPurchase: string;
    price: number;
    status?: string;
    oldUser?: string;
    newUser?: string;
    dateRelease?: string;
    dateReturn?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    accessories?: string;
    inclusions?: string;
}

const AssetInventoryPage: React.FC = () => {
    const [posts, setPosts] = useState<AssetItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState<AssetItem>({
        location: "",
        designation: "",
        brand: "",
        model: "",
        serialNumber: "",
        ipAddress: "",
        macAddress: "",
        type: "",
        printerName: "",
        remarks: "",
        warrantyDate: "",
        siNumber: "",
        dateOfPurchase: "",
        price: 0,
        status: "",
        oldUser: "",
        newUser: "",
        dateRelease: "",
        dateReturn: "",
        processor: "",
        ram: "",
        storage: "",
        accessories: "",
        inclusions: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        try {
            const res = await fetch("/api/Data/IT/Assets/Fetch");
            const data = await res.json();
            setPosts(data);
        } catch {
            toast.error("Error fetching asset data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch("/api/Data/IT/Assets/Create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed to create asset");
            toast.success("Asset created");
            setModalOpen(false);
            fetchData();
        } catch {
            toast.error("Error creating asset");
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/Data/IT/Assets/Edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed to update asset");
            toast.success("Asset updated");
            setModalOpen(false);
            fetchData();
        } catch {
            toast.error("Error updating asset");
        }
    };

    const handleDelete = async (_id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this asset?");
        if (!confirmDelete) return;

        try {
            const res = await fetch("/api/Data/IT/Assets/Delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: _id }),
            });
            if (!res.ok) throw new Error("Delete failed");
            toast.success("Asset deleted");
            fetchData();
        } catch {
            toast.error("Error deleting asset");
        }
    };

    const filteredPosts = posts.filter(post =>
        Object.values(post).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1">
                                <div className="mb-4 p-4 bg-white border shadow-md rounded-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-bold">Asset Inventory</h2>
                                        <button
                                            onClick={() => {
                                                setFormData({
                                                    location: "",
                                                    designation: "",
                                                    brand: "",
                                                    model: "",
                                                    serialNumber: "",
                                                    ipAddress: "",
                                                    macAddress: "",
                                                    type: "",
                                                    printerName: "",
                                                    remarks: "",
                                                    warrantyDate: "",
                                                    siNumber: "",
                                                    dateOfPurchase: "",
                                                    price: 0,
                                                    status: "",
                                                    oldUser: "",
                                                    newUser: "",
                                                    dateRelease: "",
                                                    dateReturn: "",
                                                    processor: "",
                                                    ram: "",
                                                    storage: "",
                                                    accessories: "",
                                                    inclusions: "",
                                                });
                                                setIsEditMode(false);
                                                setModalOpen(true);
                                            }}
                                            className="bg-blue-600 text-white text-xs px-3 py-2 rounded"
                                        >
                                           + Add Asset
                                        </button>
                                    </div>

                                    <Filters search={search} setSearch={setSearch} />

                                    <Table
                                        posts={currentItems}
                                        loading={loading}
                                        handleEdit={(item) => {
                                            setFormData(item);
                                            setIsEditMode(true);
                                            setModalOpen(true);
                                        }}
                                        handleDelete={handleDelete}
                                    />

                                    <Pagination
                                        totalPages={totalPages}
                                        currentPage={currentPage}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </div>

                            {modalOpen && (
                                <Form
                                    formData={formData}
                                    setFormData={setFormData}
                                    onClose={() => setModalOpen(false)}
                                    onSubmit={isEditMode ? handleUpdate : handleSubmit}
                                    isEditMode={isEditMode}
                                />
                            )}

                            <ToastContainer className="text-xs" autoClose={1500} />
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default AssetInventoryPage;
