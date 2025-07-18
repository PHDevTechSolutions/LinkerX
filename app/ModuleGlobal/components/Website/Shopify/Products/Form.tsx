"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { CiSaveUp1, CiTurnL1 } from "react-icons/ci";

interface Variant {
  price: string;
  inventory_quantity?: number;
}
interface ShopifyProduct {
  id: number;
  title: string;
  product_type: string;
  vendor: string;
  status: string;
  variants: Variant[];
  created_at: string;
}
interface Props {
  product: ShopifyProduct;
  onClose: () => void;
  onSaved: () => void;
}

const EditModal: React.FC<Props> = ({ product, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: product.title,
    product_type: product.product_type,
    vendor: product.vendor,
    price: product.variants?.[0]?.price ?? "0.00",
    stock: product.variants.reduce(
      (s, v) => s + (v.inventory_quantity ?? 0),
      0
    ),
    status: product.status,
  });

  const handleChange = (k: string, v: any) =>
    setForm({ ...form, [k]: v });

  const handleSave = async () => {
    try {
      await fetch(`/api/Data/Applications/Shopify/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("Product updated");
      onSaved();
      onClose();
    } catch (e) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-sm">Edit Product</h3>

        {/* Text inputs */}
        {["title", "product_type", "vendor"].map((f) => (
          <input
            key={f}
            className="w-full px-3 py-2 border-b text-xs capitalize"
            placeholder={f}
            value={(form as any)[f]}
            onChange={(e) => handleChange(f, e.target.value)}
          />
        ))}

        {/* Status select */}
        <select
          className="w-full px-3 py-2 border-b text-xs capitalize bg-white"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
        </select>

        {/* Price & Stock */}
        <input
          className="w-full px-3 py-2 border-b text-xs"
          placeholder="price"
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
        <input
          className="w-full px-3 py-2 border-b text-xs"
          placeholder="stock"
          type="number"
          value={form.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
        />

        {/* Actions */}
        <div className="flex justify-end gap-1 text-[10px]">
          <button
            onClick={onClose}
            className="hover:bg-gray-100 px-4 py-2 border rounded flex items-center gap-1"
          >
            <CiTurnL1 size={15} /> Back
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-400 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <CiSaveUp1 size={15} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
