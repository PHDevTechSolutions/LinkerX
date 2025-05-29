import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { FaTimesCircle } from "react-icons/fa";

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    ProductName: string; setProductName: (value: string) => void;
    ProductSKU: string; setProductSKU: (value: string) => void;
    ProductDescription: string; setProductDescription: (value: string) => void;
    ProductCategories: string; setProductCategories: (value: string) => void;
    ProductQuantity: string; setProductQuantity: (value: string) => void;
    ProductCostPrice: string; setProductCostPrice: (value: string) => void;
    ProductSellingPrice: string; setProductSellingPrice: (value: string) => void;
    ProductStatus: string; setProductStatus: (value: string) => void;
    ProductImage: File | null; setProductImage: React.Dispatch<React.SetStateAction<File | null>>;
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    ProductName, setProductName,
    ProductSKU, setProductSKU,
    ProductDescription, setProductDescription,
    ProductCategories, setProductCategories,
    ProductQuantity, setProductQuantity,
    ProductCostPrice, setProductCostPrice,
    ProductSellingPrice, setProductSellingPrice,
    ProductStatus, setProductStatus,
    ProductImage, setProductImage,
    editData,
}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [productcategories, setproductcategories] = useState<{ id: string; ProductCategories: string; value: string; label: string }[]>([]);

    // Generate Reference Number only when not editing
    useEffect(() => {
        if (editData) {
            // Populate form fields for edit
            setReferenceNumber(editData.ReferenceNumber || "");
            setProductName(editData.ProductName || "");
            setProductSKU(editData.ProductSKU || "");
            setProductDescription(editData.ProductDescription || "");
            setProductCategories(editData.ProductCategories || "");
            setProductQuantity(editData.ProductQuantity || "");
            setProductCostPrice(editData.ProductCostPrice || "");
            setProductSellingPrice(editData.ProductSellingPrice || "");
            setProductStatus(editData.ProductStatus || "");

            // Set image preview from existing URL if any
            if (editData.ProductImage && typeof editData.ProductImage === "string") {
                setImagePreview(editData.ProductImage);
            }
        } else {
            setReferenceNumber(generateReferenceNumber());
        }
    }, [editData]);

    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `Product-${randomString}-${randomNumber}`;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file.");
                return;
            }
            setProductImage(file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);


    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/ModuleWarehouse/Inventory/FetchCategories');
                const data = await response.json();
                setproductcategories(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchProducts();
    }, []);

    const ProductOptions = productcategories.map((product) => ({
        value: product.ProductCategories,
        label: product.ProductCategories,
    }));
    
    // Handle Data after Fetching Products
    const handleProductChange = async (selectedOption: any) => {
        const selected = selectedOption ? selectedOption.value : '';
        setProductCategories(selected);

        if (selected) {
            try {
                const response = await fetch(`/api/ModuleWarehouse/Inventory/FetchCategories?ProductCategories=${encodeURIComponent(selected)}`);
                if (response.ok) {
                    const details = await response.json();
                    console.log('Fetched Product Details:', details);
                    //
                } else {
                    console.error(`data not found: ${selected}`);
                    resetFields();
                }
            } catch (error) {
                console.error('Error fetching data details:', error);
                resetFields();
            }
        } else {
            resetFields();
        }
    };

    // Reset Fields When Close or Change Products on Select Option
    const resetFields = () => {
        //
    };

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} readOnly className="w-full px-3 py-2 border rounded text-xs" />

            {/* Product Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Product Name</label>
                <input type="text" value={ProductName} onChange={(e) => setProductName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* SKU */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Product SKU</label>
                <input type="text" value={ProductSKU} onChange={(e) => setProductSKU(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
            </div>

            {/* Description */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Description</label>
                <textarea value={ProductDescription} onChange={(e) => setProductDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3} />
            </div>

            {/* Categories */}
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Categories</label>
                {editData ? (
                    <input type="text" id="ProductName" value={ProductCategories} onChange={(e) => setProductCategories(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" placeholder="Enter Company Name" />
                ) : (
                    <Select id="CompanyName" options={ProductOptions} onChange={handleProductChange} className="w-full text-xs capitalize" isClearable />
                )}
            </div>

            {/* Quantity */}
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Quantity</label>
                <input type="number" value={ProductQuantity} onChange={(e) => setProductQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>

            {/* Cost Price */}
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Cost Price</label>
                <input type="number" value={ProductCostPrice} onChange={(e) => setProductCostPrice(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>

            {/* Selling Price */}
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Selling Price</label>
                <input type="number" value={ProductSellingPrice} onChange={(e) => setProductSellingPrice(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>

            {/* Image */}
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Product Image</label>
                <input type="file" onChange={handleImageChange} className="w-full px-3 py-2 border rounded text-xs" />

                {imagePreview && (
                    <div className="mt-2 flex items-center space-x-2">
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded" />
                        <button
                            type="button"
                            onClick={() => {
                                setImagePreview(null);
                                setProductImage(null);
                            }}
                            className="px-2 py-1 text-xs border rounded-full hover:bg-red-600"
                        >
                            <FaTimesCircle />
                        </button>
                    </div>
                )}
            </div>

            {/* Status */}
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Status</label>
                <select value={ProductStatus} onChange={(e) => setProductStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Low-Stock">Low-Stock</option>
                    <option value="No-Stock">No-Stock</option>
                    <option value="Draft">Draft</option>
                </select>
            </div>
        </div>
    );
};

export default FormFields;
