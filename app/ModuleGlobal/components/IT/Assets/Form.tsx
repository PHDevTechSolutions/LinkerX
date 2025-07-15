"use client";

import React from "react";
import { CiSaveUp1, CiTurnL1 } from "react-icons/ci";
import FormFields from './FormFields';

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

interface FormProps {
  formData: AssetItem;
  setFormData: React.Dispatch<React.SetStateAction<AssetItem>>;
  onClose: () => void;
  onSubmit: () => void;
  isEditMode: boolean;
}

const Form: React.FC<FormProps> = ({
  formData,
  setFormData,
  onClose,
  onSubmit,
  isEditMode,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white p-4 rounded shadow w-full max-w-2xl">
        <h3 className="text-sm font-bold mb-4">
          {isEditMode ? "Update Asset" : "Add New Asset"}
        </h3>

        <FormFields formData={formData} handleChange={handleChange} />

        <div className="flex justify-end gap-1 text-[10px] mt-4">
          <button
            onClick={onClose}
            className="hover:bg-gray-100 px-4 py-2 border rounded flex items-center gap-1"
          >
            <CiTurnL1 size={15} /> Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-400 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <CiSaveUp1 size={15} /> {isEditMode ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
