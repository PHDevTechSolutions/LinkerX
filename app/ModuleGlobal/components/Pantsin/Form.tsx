"use client";

import React from "react";
import { CiSaveUp1, CiTurnL1 } from "react-icons/ci";

interface Order {
  _id: string;
  ReferenceID: string;
  Email: string;
  Type: string;
  Status: string;
  date_created: string;
}

interface FormProps {
  open: boolean;
  value: Order;
  onChange: (v: Order) => void;
  onSave: () => void;
  onCancel: () => void;
}

const Form: React.FC<FormProps> = ({
  open,
  value,
  onChange,
  onSave,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 text-xs">
        <h3 className="font-semibold mb-4">
          Editing&nbsp;
          <span className="text-blue-600">{value.ReferenceID}</span>
        </h3>

        <div className="space-y-4">
          {/* Reference ID */}
          <div>
            <label className="block mb-1">Reference ID</label>
            <input
              type="text"
              className="w-full border-b px-1 py-1 outline-none"
              value={value.ReferenceID}
              onChange={(e) =>
                onChange({ ...value, ReferenceID: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border-b px-1 py-1 outline-none"
              value={value.Email}
              onChange={(e) => onChange({ ...value, Email: e.target.value })}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block mb-1">Type</label>
            <input
              type="text"
              className="w-full border-b px-1 py-1 outline-none"
              value={value.Type}
              onChange={(e) => onChange({ ...value, Type: e.target.value })}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1">Status</label>
            <select
              className="w-full border-b px-1 py-1 outline-none bg-transparent"
              value={value.Status}
              onChange={(e) => onChange({ ...value, Status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Date Created */}
          <div>
            <label className="block mb-1">Date Created</label>
            <input
              type="datetime-local"
              className="w-full border-b px-1 py-1 outline-none"
              value={new Date(value.date_created).toISOString().slice(0, 16)}
              onChange={(e) =>
                onChange({
                  ...value,
                  date_created: new Date(e.target.value).toISOString(),
                })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-1 text-[10px] mt-4">
          <button
            onClick={onCancel}
            className="hover:bg-gray-100 px-4 py-2 border rounded flex items-center gap-1"
          >
            <CiTurnL1 size={15} /> Back
          </button>
          <button
            onClick={onSave}
            className="bg-blue-400 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <CiSaveUp1 size={15} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
