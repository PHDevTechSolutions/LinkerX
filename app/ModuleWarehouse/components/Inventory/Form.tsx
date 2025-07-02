import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./FormFields";
import { FaCheckCircle, FaEdit, FaTimes } from "react-icons/fa";

interface FormProps {
  onCancel: () => void;
  refreshPosts: () => void;
  Email: string;
  editData?: any;
}

const Form: React.FC<FormProps> = ({ onCancel, refreshPosts, editData }) => {
  const [ReferenceNumber, setReferenceNumber] = useState(editData?.ReferenceNumber || "");
  const [ProductName, setProductName] = useState(editData?.ProductName || "");
  const [ProductSKU, setProductSKU] = useState(editData?.ProductSKU || "");
  const [ProductDescription, setProductDescription] = useState(editData?.ProductDescription || "");
  const [ProductCategories, setProductCategories] = useState(editData?.ProductCategories || "");
  const [ProductQuantity, setProductQuantity] = useState(editData?.ProductQuantity || "");
  const [ProductCostPrice, setProductCostPrice] = useState(editData?.ProductCostPrice || "");
  const [ProductSellingPrice, setProductSellingPrice] = useState(editData?.ProductSellingPrice || "");
  const [ProductStatus, setProductStatus] = useState(editData?.ProductStatus || "");
  const [ProductImage, setProductImage] = useState<File | null>(null);
  

  // Update and Create Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = !!editData;
    const url = isEdit ? `/api/ModuleWarehouse/Inventory/EditData` : `/api/ModuleWarehouse/Inventory/CreateData`;
    const method = isEdit ? "PUT" : "POST";

    let body: BodyInit;
    let headers: HeadersInit = {};

    // Check if ProductImage is a new File object (not a string URL)
    const isNewImage = ProductImage && typeof ProductImage !== "string";

    if (isEdit && isNewImage) {
      // Editing and new image file selected — use FormData
      const formData = new FormData();
      formData.append("id", editData._id);
      formData.append("ReferenceNumber", String(ReferenceNumber));
      formData.append("ProductName", String(ProductName));
      formData.append("ProductSKU", String(ProductSKU));
      formData.append("ProductDescription", String(ProductDescription));
      formData.append("ProductCategories", String(ProductCategories));
      formData.append("ProductQuantity", String(ProductQuantity));
      formData.append("ProductCostPrice", String(ProductCostPrice));
      formData.append("ProductSellingPrice", String(ProductSellingPrice));
      formData.append("ProductStatus", String(ProductStatus));
      formData.append("ProductImage", ProductImage); // file input

      body = formData;
      // DO NOT set Content-Type, browser will set multipart/form-data boundary
    } else if (isEdit) {
      // Editing but no new image — send JSON
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({
        id: editData._id,
        ReferenceNumber,
        ProductName,
        ProductSKU,
        ProductDescription,
        ProductCategories,
        ProductQuantity,
        ProductCostPrice,
        ProductSellingPrice,
        ProductStatus,
        ProductImage: ProductImage || "", // existing image URL or empty
      });
    } else {
      // Creating new product — use FormData (with image if available)
      const formData = new FormData();
      formData.append("ReferenceNumber", String(ReferenceNumber));
      formData.append("ProductName", String(ProductName));
      formData.append("ProductSKU", String(ProductSKU));
      formData.append("ProductDescription", String(ProductDescription));
      formData.append("ProductCategories", String(ProductCategories));
      formData.append("ProductQuantity", String(ProductQuantity));
      formData.append("ProductCostPrice", String(ProductCostPrice));
      formData.append("ProductSellingPrice", String(ProductSellingPrice));
      formData.append("ProductStatus", String(ProductStatus));

      if (ProductImage) {
        formData.append("ProductImage", ProductImage);
      }

      body = formData;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (response.ok) {
        toast.success(isEdit ? "Product Updated Successfully" : "Product Added Successfully", {
          autoClose: 1000,
          onClose: () => {
            onCancel();
            refreshPosts();
          },
        });
      } else {
        toast.error(isEdit ? "Failed to Update Product" : "Failed to Add Product", {
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Network error or server problem", { autoClose: 1000 });
      console.error("Fetch error:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editData ? "Update Product Information" : "Product Information"}</h2>
        <FormFields
          ReferenceNumber={ReferenceNumber} setReferenceNumber={setReferenceNumber}
          ProductName={ProductName} setProductName={setProductName}
          ProductSKU={ProductSKU} setProductSKU={setProductSKU}
          ProductDescription={ProductDescription} setProductDescription={setProductDescription}
          ProductCategories={ProductCategories} setProductCategories={setProductCategories}
          ProductQuantity={ProductQuantity} setProductQuantity={setProductQuantity}
          ProductCostPrice={ProductCostPrice} setProductCostPrice={setProductCostPrice}
          ProductSellingPrice={ProductSellingPrice} setProductSellingPrice={setProductSellingPrice}
          ProductStatus={ProductStatus} setProductStatus={setProductStatus}
          ProductImage={ProductImage} setProductImage={setProductImage}
          editData={editData}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-[#2563EB] hover:bg-blue-900 text-white px-4 py-2 rounded text-xs flex gap-1">
            {editData ? (
              <><FaEdit size={14} /> Update</>
            ) : (
              <><FaCheckCircle size={14} /> Submit</>
            )}
          </button>

          <button type="button" className="hover:bg-gray-100 bg-white border px-4 py-2 rounded text-xs flex gap-1" onClick={onCancel}>
            <FaTimes size={15} />Cancel
          </button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default Form;
