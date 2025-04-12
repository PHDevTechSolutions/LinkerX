"use client";

import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

type ProfileFormProps = {
    userDetails: {
        id: string;
        Firstname: string;
        Lastname: string;
        Password: string;
        Email: string;
        ContactNumber: string;
        Role: string;
        Department: string;
        Status: string;
    };
    handleSubmit: (e: React.FormEvent) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ userDetails, handleSubmit, handleChange, handleSelectChange }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<string>(`https://robohash.org/${userDetails.Email}?size=200x200`);

    // List of avatars
    const avatars = [
        `https://robohash.org/${userDetails.Email}?set=set1&size=200x200`,
        `https://robohash.org/${userDetails.Email}?set=set2&size=200x200`,
        `https://robohash.org/${userDetails.Email}?set=set3&size=200x200`,
        `https://robohash.org/${userDetails.Email}?set=set4&size=200x200`,
        `https://robohash.org/${userDetails.Email}?set=set5&size=200x200`,
    ];

    // Generate a code based on userDetails
    useEffect(() => {
        if (userDetails.id && userDetails.Firstname && userDetails.Lastname) {
            const code = `${userDetails.id}-${userDetails.Firstname.substring(0, 2)}${userDetails.Lastname.substring(0, 2)}-000`;
            setGeneratedCode(code);
        }
    }, [userDetails]);

    // Automatically generate QR Code when generatedCode is set
    useEffect(() => {
        if (generatedCode) {
            generateQRCode(generatedCode);
        }
    }, [generatedCode]);

    const generateQRCode = async (text: string) => {
        try {
            const qrData = `Taskflow System | ERP Module - Ecoshift Corporation,\nAgentName: ${userDetails.Firstname} ${userDetails.Lastname}\nPosition: ${userDetails.Role}\nContactNumber: ${userDetails.ContactNumber}\nEmail: ${userDetails.Email}\nLink: https://ecoshiftcorp.com`;
            const qr = await QRCode.toDataURL(qrData);
            setQrCode(qr);
        } catch (err) {
            console.error('Error generating QR code', err);
        }
    };

    const handleAvatarChange = useCallback((avatar: string) => {
        setSelectedAvatar(avatar);
        // Save selected avatar in localStorage immediately
        localStorage.setItem('selectedAvatar', avatar);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 p-6 text-xs">
            <div className="bg-white shadow-md rounded-lg p-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'blank' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('blank')}
                >
                    Generate Code
                </button>

                {activeTab === 'profile' && (
                    <div className="flex flex-col items-center mt-6">
                        <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
                            <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
                        </div>

                        {/* Avatar Carousel */}
                        <div className="mt-4 flex space-x-4 overflow-x-auto">
                            {avatars.map((avatar, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleAvatarChange(avatar)}
                                    className="cursor-pointer"
                                >
                                    <img
                                        src={avatar}
                                        alt={`Avatar ${index + 1}`}
                                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-300 hover:border-blue-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-sm font-semibold">{userDetails.Firstname} {userDetails.Lastname}</p>
                    </div>
                )}

                {activeTab === 'blank' && (
                    <div className="flex flex-col items-center mt-6">
                        {generatedCode && <p className="text-sm font-semibold">Generated Code: {generatedCode}</p>}
                        {qrCode && (
                            <img
                                src={qrCode}
                                alt="Generated QR Code"
                                className="mt-4"
                                style={{ width: '300px', height: '300px' }} // Set the width and height directly with inline styles
                            />
                        )}
                    </div>
                )}
            </div>

            {/* User Details Form Card */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="Firstname" className="block text-xs font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            id="Firstname"
                            name="Firstname"
                            value={userDetails.Firstname}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
                        />
                    </div>
                    <div>
                        <label htmlFor="Lastname" className="block text-xs font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            id="Lastname"
                            name="Lastname"
                            value={userDetails.Lastname}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="Password" className="block text-xs font-medium text-gray-700">
                            Current Password / Change Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="Password"
                            name="Password"
                            value={userDetails.Password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-xs"
                        />
                        <div
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 top-[20px] flex items-center cursor-pointer text-gray-500"
                        >
                            {showPassword ? <IoIosEyeOff size={18} /> : <IoIosEye size={18} />}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="Email" className="block text-xs font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="Email"
                            name="Email"
                            value={userDetails.Email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs"
                        />
                    </div>
                    <div>
                        <label htmlFor="ContactNumber" className="block text-xs font-medium text-gray-700">Contact Number</label>
                        <input
                            type="text"
                            id="ContactNumber"
                            name="ContactNumber"
                            value={userDetails.ContactNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs"
                        />
                    </div>
                    <div>
                        <label htmlFor="Department" className="block text-xs font-medium text-gray-700">Department</label>
                        <select
                            id="Department"
                            name="Department"
                            value={userDetails.Department}
                            onChange={handleSelectChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
                        >
                            <option value="">Select Department</option>
                            <option value="IT Department">IT Department</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="Status" className="block text-xs font-medium text-gray-700">Change Status</label>
                        <select
                            id="Status"
                            name="Status"
                            value={userDetails.Status}
                            onChange={handleSelectChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Busy">Busy</option>
                            <option value="Do not Disturb">Do not Disturb</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white text-xs px-4 py-2 rounded">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
