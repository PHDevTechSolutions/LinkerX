import React, { useEffect } from "react";

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    ProductCategories: string; setProductCategories: (value: string) => void;
    CategoryDescription: string; setCategoryDescription: (value: string) => void;
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    ProductCategories, setProductCategories,
    CategoryDescription, setCategoryDescription,
    editData,
}) => {

    // Generate Reference Number only when not editing
    useEffect(() => {
        if (editData) {
            // Populate form fields for edit
            setReferenceNumber(editData.ReferenceNumber || "");  
        } else {
            setReferenceNumber(generateReferenceNumber());
        }
    }, [editData]);

    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `LED-ID-${randomString}-${randomNumber}`;
    };

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} readOnly className="w-full px-3 py-2 border rounded text-xs" />

            {/* Product Categories */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Product Category</label>
                <input type="text" value={ProductCategories} onChange={(e) => setProductCategories(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Recipient / Department */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Category Description</label>
                <input type="text" value={CategoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>
        </div>
    );
};

export default FormFields;
