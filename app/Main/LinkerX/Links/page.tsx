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
  Email: string;
  Url: string;
  LinkName: string;
  Description: string;
  PhotoUrl?: string;
  Slug: string;
  Category: string;
}

interface UserDetails {
  id: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Password: string;
  ContactPassword: string;
  Role: string;
  profilePicture?: string;
}

const Page: React.FC = () => {
  const [posts, setPosts] = useState<LinkPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLength, setPageLength] = useState(8);
  const [isExpanded, setIsExpanded] = useState(false);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    id: '',
    Firstname: '',
    Lastname: '',
    Email: '',
    Password: '',
    ContactPassword: '',
    Role: '',
    profilePicture: '',
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [selected, setSelected] = useState<LinkPost | null>(null);
  const [formData, setFormData] = useState({
    Email: '',
    Url: '',
    LinkName: '',
    Description: '',
    Slug: '',
    Category: '',
    PhotoFile: null as File | null,
  });

  const openAdd = () => {
    setMode('add');
    setFormData({
      Email: userDetails.Email,
      Url: '',
      LinkName: '',
      Description: '',
      Slug: '',
      Category: '',
      PhotoFile: null,
    });
    setIsOpen(true);
  };

  const openEdit = (row: LinkPost) => {
    setMode('edit');
    setSelected(row);
    setFormData({
      Email: row.Email,
      Url: row.Url,
      LinkName: row.LinkName,
      Description: row.Description,
      Slug: row.Slug,
      Category: row.Category,
      PhotoFile: null,
    });
    setIsOpen(true);
  };

  const openDeleteConfirm = (row: LinkPost) => {
    setSelected(row);
    setIsDeleteOpen(true);
  };

  const closeModal = () => setIsOpen(false);
  const closeDeleteModal = () => setIsDeleteOpen(false);

  // Fetch user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get('id');

      if (userId) {
        try {
          const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
          if (!response.ok) throw new Error('Failed to fetch user data');
          const data = await response.json();

          const fetchedDetails: UserDetails = {
            id: data._id || '',
            Firstname: data.Firstname || '',
            Lastname: data.Lastname || '',
            Email: data.Email || '',
            Password: '',
            ContactPassword: '',
            Role: data.Role || '',
          };

          setUserDetails(fetchedDetails);
        } catch (err) {
          console.error('Error fetching user data:', err);
          toast.error('Error loading user');
        }
      }
    };

    fetchUserData();
  }, []);

  // Auto-fill Email in formData when userDetails is loaded
  useEffect(() => {
    if (userDetails.Email) {
      setFormData((prev) => ({ ...prev, Email: userDetails.Email }));
    }
  }, [userDetails.Email]);

  // Fetch and filter links by user email
  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/Data/Links/Fetch');
      const data: LinkPost[] = await res.json();

      // Filter only current user's links
      const userLinks = data.filter((link) => link.Email === userDetails.Email);
      setPosts(userLinks);
    } catch {
      toast.error('Error fetching links');
    }
  };

  useEffect(() => {
    if (userDetails.Email) {
      fetchLinks();
    }
  }, [userDetails.Email]);

  const filtered = posts.filter((p) =>
    [p.Url, p.LinkName].some((f) => f?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const last = currentPage * pageLength;
  const first = last - pageLength;
  const currentPosts = filtered.slice(first, last);
  const totalPages = Math.ceil(filtered.length / pageLength);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Url || !formData.LinkName) {
      toast.error('Please fill in all fields');
      return;
    }

    let photoUrl = selected?.PhotoUrl || '';

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
          Email: formData.Email,
          Url: formData.Url,
          LinkName: formData.LinkName,
          Description: formData.Description,
          Slug: formData.Slug,
          Category: formData.Category,
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

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {() => (
            <div className="container mx-auto p-4 text-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                {isOpen && (
                  <div
                    className="fixed inset-0 z-[999] bg-black/40 flex items-end px-4"
                    onClick={closeModal} // close when clicking outside
                  >
                    <div
                      onClick={(e) => e.stopPropagation()} // prevent outside click when inside form
                      className={`bg-white rounded-t-2xl w-full overflow-hidden p-6 shadow-xl transition-all duration-300 transform ${isExpanded ? 'max-h-[90vh] animate-slide-up' : 'max-h-[30vh] animate-slide-up'
                        }`}
                    >
                      {/* Expand Handle / Button */}
                      <div className="flex justify-center mb-2">
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="w-10 h-1.5 bg-gray-300 rounded-full"
                          title="Expand"
                        />
                      </div>

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
                  <h2 className="text-lg font-bold mb-2">Links / URL</h2>
                  <p className="text-xs text-gray-600 mb-4">
                    Browse, manage, and update your saved links. You can search, add new entries, edit existing ones, or delete them from the table below.
                  </p>
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