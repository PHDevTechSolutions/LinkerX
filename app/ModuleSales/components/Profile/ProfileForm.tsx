"use client";

import React from "react";

type ProfileFormProps = {
    userDetails: {
        id: string;
        Firstname: string;
        Lastname: string;
        Email: string;
        Role: string;
        Department: string;
        Status: string;
    };
    handleSubmit: (e: React.FormEvent) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ userDetails, handleSubmit, handleChange, handleSelectChange }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="Firstname" className="block text-xs font-medium text-gray-700">First Name</label>
                <input type="text" id="Firstname" name="Firstname" value={userDetails.Firstname} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"/>
            </div>
            <div>
                <label htmlFor="Lastname" className="block text-xs font-medium text-gray-700">Last Name</label>
                <input type="text" id="Lastname" name="Lastname" value={userDetails.Lastname} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"/>
            </div>
            <div>
                <label htmlFor="Email" className="block text-xs font-medium text-gray-700">Email</label>
                <input type="email" id="Email" name="Email" value={userDetails.Email} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs"/>
            </div>
            <div>
                <label htmlFor="Role" className="block text-xs font-medium text-gray-700">Role</label>
                <select id="Role" name="Role" value={userDetails.Role} onChange={handleSelectChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize">
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                </select>

            </div>
            <div>
                <label htmlFor="Department" className="block text-xs font-medium text-gray-700">Department</label>
                <select id="Department" name="Department" value={userDetails.Department} onChange={handleSelectChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize">
                    <option value="">Select Department</option>
                    <option value="Sales">Sales</option>
                </select>

            </div>
            <div>
                <label htmlFor="Department" className="block text-xs font-medium text-gray-700">Change Status</label>
                <select id="Status" name="Status" value={userDetails.Status} onChange={handleSelectChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize">
                    <option value="" disabled>Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Busy">Busy</option>
                    <option value="Do not Disturb">Do not Disturb</option>
                </select>

            </div>
            <button type="submit" className="bg-blue-600 text-white text-xs px-4 py-2 rounded mr-2">Save Changes</button>
        </form>
    );
};

export default ProfileForm;
