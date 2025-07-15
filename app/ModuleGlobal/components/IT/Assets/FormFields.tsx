"use client";

import React from "react";

interface AssetItem {
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
    // Optional laptop/desktop-only fields
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

interface Props {
    formData: AssetItem;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FormFields: React.FC<Props> = ({ formData, handleChange }) => {
    const { type } = formData;
    const isLaptopOrDesktop = type === "Laptop" || type === "Desktop";
    const isPrinter = type === "Printer";

    return (
        <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Always visible field: Device Type */}
            <div>
                <label className="block mb-1">Device</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border-b px-1 py-1 outline-none bg-white"
                >
                    <option value="">Select Type</option>
                    <option value="Printer">Printer</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                </select>
            </div>
            <div>
                <label className="block mb-1">Location</label>
                <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border-b px-1 py-1 outline-none bg-white"
                >
                    <option value="">Select Location</option>
                    <option value="Primex Office">Primex Office</option>
                    <option value="J&L Office">J&L Office</option>
                    <option value="Pasig Warehouse Office">Pasig Warehouse Office</option>
                    <option value="Cebu Branch">Cebu Branch</option>
                    <option value="CDO Branch">CDO Branch</option>
                    <option value="Davao Branch">Davao Branch</option>
                </select>
            </div>

            <div>
                <label className="block mb-1">Designation</label>
                <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full border-b px-1 py-1 outline-none bg-white"
                >
                    <option value="">Select Designation</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Admin">Admin</option>
                    <option value="CSR">CSR</option>
                    <option value="Dispatching">Logistics / Dispatching</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Purchasing">Purchasing / Procurement</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Sales">Sales</option>
                    <option value="Technical">Technical</option>
                </select>
            </div>

            <div>
                <label className="block mb-1">Brand</label>
                <input name="brand" value={formData.brand} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none capitalize" />
            </div>

            <div>
                <label className="block mb-1">Model</label>
                <input name="model" value={formData.model} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none capitalize" />
            </div>

            {/* Shared fields (Laptop/Desktop or Printer) */}
            {(isPrinter) && (
                <>
                    <div>
                        <label className="block mb-1">Serial Number</label>
                        <input name="serialNumber" value={formData.serialNumber} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none capitalize" />
                    </div>

                    <div>
                        <label className="block mb-1">IP Address</label>
                        <input name="ipAddress" value={formData.ipAddress} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none capitalize" />
                    </div>

                    <div>
                        <label className="block mb-1">MAC Address</label>
                        <input name="macAddress" value={formData.macAddress} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none capitalize" />
                    </div>

                    <div>
                        <label className="block mb-1">Printer Name</label>
                        <input name="printerName" value={formData.printerName} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none capitalize" />
                    </div>

                    <div>
                        <label className="block mb-1">Warranty Date</label>
                        <input type="date" name="warrantyDate" value={formData.warrantyDate} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none" />
                    </div>

                    <div>
                        <label className="block mb-1">SI Number</label>
                        <input name="siNumber" value={formData.siNumber} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none uppercase" />
                    </div>

                    <div>
                        <label className="block mb-1">Date of Purchase</label>
                        <input type="date" name="dateOfPurchase" value={formData.dateOfPurchase} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none" />
                    </div>
                </>
            )}

            {/* Laptop/Desktop only fields */}
            {isLaptopOrDesktop && (
                <>
                    <div>
                        <label className="block mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status || ""}
                            onChange={handleChange}
                            className="w-full border-b px-1 py-1 outline-none bg-white"
                        >
                            <option value="">Select Status</option>
                            <option value="New">New</option>
                            <option value="Old">Old</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Old User</label>
                        <input name="oldUser" value={formData.oldUser || ""} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none uppercase" />
                    </div>

                    <div>
                        <label className="block mb-1">New User</label>
                        <input name="newUser" value={formData.newUser || ""} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none uppercase" />
                    </div>

                    <div>
                        <label className="block mb-1">Date Release</label>
                        <input type="date" name="dateRelease" value={formData.dateRelease || ""} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none" />
                    </div>

                    <div>
                        <label className="block mb-1">Date Return</label>
                        <input type="date" name="dateReturn" value={formData.dateReturn || ""} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none" />
                    </div>

                    <div>
                        <label className="block mb-1">Processor</label>
                        <input name="processor" value={formData.processor || ""} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none" />
                    </div>

                    <div>
                        <label className="block mb-1">RAM</label>
                        <select
                            name="ram"
                            value={formData.ram || ""}
                            onChange={handleChange}
                            className="w-full border-b px-1 py-1 outline-none bg-white"
                        >
                            <option value="">Select Ram</option>
                            <option value="4">4GB</option>
                            <option value="8">8GB</option>
                            <option value="12">12GB</option>
                            <option value="16">16GB</option>
                            <option value="32">32GB</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Storage</label>
                        <input name="storage" value={formData.storage || ""} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none uppercase" />
                    </div>

                    <div>
                        <label className="block mb-1">Accessories</label>
                        <input name="accessories" value={formData.accessories || ""} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none capitalize" />
                    </div>

                    <div>
                        <label className="block mb-1">Inclusions</label>
                        <input name="inclusions" value={formData.inclusions || ""} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none capitalize" />
                    </div>
                </>
            )}

            <div>
                <label className="block mb-1">Remarks</label>
                <input name="remarks" value={formData.remarks} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none capitalize" />
            </div>

            <div>
                <label className="block mb-1">Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border-b px-1 py-1 outline-none" />
            </div>
        </div>
    );
};

export default FormFields;
