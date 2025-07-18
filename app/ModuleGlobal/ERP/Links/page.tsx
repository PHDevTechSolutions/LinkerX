'use client';

import React, { useState, useEffect } from 'react';
import ParentLayout from '../../components/Layouts/ParentLayout';
import SessionChecker from '../../components/Session/SessionChecker';
import UserFetcher from '../../components/User/UserFetcher';
import Table from '../../components/Links/Table';
import Form from '../../components/Links/Form';
import Filters from '../../components/Links/Filters';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LinkPost {
    _id: string;
    Url: string;
    LinkName: string;
    PhotoUrl?: string;
}

const Page: React.FC = () => {
    const [posts, setPosts] = useState<LinkPost[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLength, setPageLength] = useState(5);

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [selected, setSelected] = useState<LinkPost | null>(null);
    const [formData, setFormData] = useState({
        Url: '',
        LinkName: '',
        PhotoFile: null as File | null,
    });

    const openAdd = () => {
        setMode('add');
        setFormData({ Url: '', LinkName: '', PhotoFile: null });
        setIsOpen(true);
    };
    const openEdit = (row: LinkPost) => {
        setMode('edit');
        setSelected(row);
        setFormData({ Url: row.Url, LinkName: row.LinkName, PhotoFile: null });
        setIsOpen(true);
    };

    const openDeleteConfirm = (row: LinkPost) => {
        setSelected(row);
        setIsDeleteOpen(true);
    };

    const closeModal = () => setIsOpen(false);
    const closeDeleteModal = () => setIsDeleteOpen(false);

    // Fetch links list
    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/Data/Links/Fetch');
            const data = await res.json();
            setPosts(data);
        } catch {
            toast.error('Error fetching links');
        }
    };
    useEffect(() => {
        fetchLinks();
    }, []);

    // Derived filtered and pagination data
    const filtered = posts.filter((p) =>
        [p.Url, p.LinkName].some((f) => f?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const last = currentPage * pageLength;  // use pageLength here
    const first = last - pageLength;         // and here
    const currentPosts = filtered.slice(first, last);
    const totalPages = Math.ceil(filtered.length / pageLength);

    // Upload image file to Cloudinary (client-side)
    const uploadToCloudinary = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'Xchire');

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dhczsyzcz/image/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            return data.secure_url || null;
        } catch (error) {
            console.error('Cloudinary upload failed:', error);
            toast.error('Image upload failed');
            return null;
        }
    };

    // Handle form submit with photo upload
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.Url || !formData.LinkName) {
            toast.error('Please fill in all fields');
            return;
        }

        let photoUrl = selected?.PhotoUrl || '';

        // Upload photo if a new file is selected
        if (formData.PhotoFile) {
            const uploadedUrl = await uploadToCloudinary(formData.PhotoFile);
            if (!uploadedUrl) return;
            photoUrl = uploadedUrl;
        }

        const endpoint =
            mode === 'add'
                ? '/api/Data/Links/Create'
                : `/api/Data/Links/Edit?id=${selected?._id}`;

        const method = mode === 'add' ? 'POST' : 'PUT';

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Url: formData.Url,
                    LinkName: formData.LinkName,
                    PhotoUrl: photoUrl,
                }),
            });

            if (!res.ok) {
                const { message } = await res.json();
                toast.error(message || 'Failed to save link');
                return;
            }

            toast.success(mode === 'add' ? 'Link added!' : 'Link updated!');
            closeModal();
            fetchLinks();
        } catch {
            toast.error('An error occurred');
        }
    };

    // Delete confirm
    const confirmDelete = async () => {
        if (!selected) return;
        try {
            const res = await fetch(`/api/Data/Links/Delete?id=${selected._id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                toast.error('Delete failed');
                return;
            }
            toast.success('Link deleted');
            closeDeleteModal();
            fetchLinks();
        } catch {
            toast.error('Delete error');
        }
    };

    // UI with added file input for photo
    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {() => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">

                                {/* Add/Edit Modal */}
                                {isOpen && (
                                    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center px-4">
                                        <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
                                            <h2 className="text-lg font-semibold mb-4">
                                                {mode === 'add' ? 'Add New Link' : 'Update Link'}
                                            </h2>
                                            <Form
                                                mode={mode}
                                                formData={formData}
                                                setFormData={setFormData}
                                                onSubmit={handleSubmit}
                                                onCancel={closeModal}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4 p-4 border bg-white shadow-md rounded-lg">
                                    <h2 className="text-lg font-bold mb-2">Links</h2>
                                    <Filters
                                        searchTerm={searchTerm}
                                        onSearchChange={(val) => {
                                            setSearchTerm(val);
                                            setCurrentPage(1);
                                        }}
                                        onAddClick={openAdd}
                                    />

                                    <Table
                                        rows={currentPosts}
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        pageLength={pageLength}
                                        onPageLengthChange={(len) => {
                                            setPageLength(len);
                                            setCurrentPage(1);
                                        }}
                                        onPageChange={setCurrentPage}
                                        onEdit={openEdit}
                                        onDelete={openDeleteConfirm}
                                    />
                                </div>
                            </div>

                            <ToastContainer className="text-xs" autoClose={1500} />

                            {/* Delete Confirm Modal */}
                            {isDeleteOpen && (
                                <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center px-4">
                                    <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl text-center">
                                        <h2 className="text-lg font-semibold mb-4">Delete Link</h2>
                                        <p className="text-sm mb-6">
                                            Are you sure you want to delete&nbsp;
                                            <span className="font-medium">{selected?.LinkName}</span>?
                                        </p>
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={closeDeleteModal}
                                                className="px-4 py-2 border rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmDelete}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default Page;
