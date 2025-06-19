"use client";

import React, { useState } from "react";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { CiCircleMinus, CiCirclePlus, CiSaveUp2, CiTurnL1 } from "react-icons/ci";
import { IoCloudDownloadOutline } from "react-icons/io5";
import PreviewTable from "../../../components/Companies/CompanyAccounts/PreviewTable";

interface ImportFormProps {
    referenceid: string;
    manager: string;
    tsm: string;
    isMaximized: boolean;
    setIsMaximized: (value: boolean) => void;
    setShowImportForm: (value: boolean) => void;
    status: string;
    setstatus: (value: string) => void;
    fieldWidthClass: string;
}

const ImportForm: React.FC<ImportFormProps> = ({
    referenceid,
    manager,
    tsm,
    isMaximized,
    setIsMaximized,
    setShowImportForm,
    status,
    setstatus,
    fieldWidthClass,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB max file size

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        const validTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error("Invalid file type. Please upload an Excel file.");
            return;
        }

        // Validate file size
        if (selectedFile.size > maxSizeInBytes) {
            toast.error("File too large. Max size is 2MB.");
            return;
        }

        setLoading(true);
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target?.result as ArrayBuffer;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(data);
            const worksheet = workbook.worksheets[0];

            const parsedData: any[] = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header

                parsedData.push({
                    referenceid,
                    tsm,
                    manager,
                    status,
                    companyname: row.getCell(1).value || "",
                    contactperson: row.getCell(2).value || "",
                    contactnumber: row.getCell(3).value || "",
                    emailaddress: row.getCell(4).value || "",
                    typeclient: row.getCell(5).value || "",
                    address: row.getCell(6).value || "",
                    deliveryaddress: row.getCell(7).value || "",
                    area: row.getCell(8).value || "",
                });
            });

            setJsonData(parsedData);
            setLoading(false);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || jsonData.length === 0) {
            toast.error("Please upload a valid file.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/ModuleSales/UserManagement/CompanyAccounts/ImportAccounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ referenceid, tsm, manager, status, data: jsonData }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success(`${result.insertedCount} records imported successfully!`);
                setFile(null);
                setJsonData([]);
            } else {
                toast.error(result.message || "Import failed.");
            }
        } catch (error) {
            toast.error("Error uploading file.");
        }
        setLoading(false);
    };

    const downloadSampleTemplate = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sample");

        worksheet.addRow([
            "Company Name",
            "Contact Person",
            "Contact Number",
            "Email Address",
            "Type of Client",
            "Address",
            "Delivery Address",
            "Area",
        ]);

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Taskflow_Template.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setFile(null);
        setJsonData([]);
        const fileInput = document.getElementById("fileInput") as HTMLInputElement | null;
        if (fileInput) fileInput.value = "";
    };

    return (
        <div className={`bg-white text-gray-900 rounded-lg p-4 text-xs mt-20 transition-all duration-300 fixed right-0 w-full ${isMaximized ? "max-w-7xl" : "max-w-md"}`}>
            <form onSubmit={handleFileUpload}>
                {/* Buttons */}
                <div className="flex justify-end mb-4 gap-1 flex-wrap">
                    <button type="button" className="px-4 py-2 border rounded text-xs flex gap-1" onClick={() => setIsMaximized(!isMaximized)}>
                        {isMaximized ? <CiCircleMinus size={15} /> : <CiCirclePlus size={15} />}
                        {isMaximized ? "Minimize" : "Maximize"}
                    </button>
                    <button type="submit" className="bg-blue-500 text-xs text-white px-4 py-2 rounded flex items-center gap-1" disabled={loading}>
                        <CiSaveUp2 size={15} />
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="border text-xs px-4 py-2 rounded flex items-center gap-1"
                        disabled={loading}
                    >
                        Clear
                    </button>
                    <button type="button" onClick={downloadSampleTemplate} className="border text-xs px-4 py-2 rounded flex items-center gap-1">
                        <IoCloudDownloadOutline size={15} /> Download Template
                    </button>
                    <button type="button" className="border text-xs px-4 py-2 rounded flex items-center gap-1" onClick={() => setShowImportForm(false)}>
                        <CiTurnL1 size={15} /> Back
                    </button>
                </div>

                <h2 className="text-lg font-bold mb-2">Account Import Section</h2>
                <p className="text-xs text-gray-600 mb-4">
                    Upload and integrate bulk account data using the sample template.
                </p>

                <div className="flex flex-wrap -mx-4">
                    <div className={fieldWidthClass}>
                        <input type="hidden" value={referenceid} readOnly />
                        <input type="hidden" value={manager} />
                        <input type="hidden" value={tsm} />
                    </div>

                    <div className={fieldWidthClass}>
                        <label className="block text-xs font-bold mb-2">Status</label>
                        <select value={status} onChange={(e) => setstatus(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs capitalize">
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                        </select>
                    </div>

                    <div className={fieldWidthClass}>
                        <label className="block text-xs font-bold mb-2">Excel File</label>
                        <input type="file" accept=".xls,.xlsx" className="w-full px-3 py-2 border-b text-xs" onChange={handleFileChange} />
                        <p className="text-xs text-gray-600 mt-1">Accepted formats: .xls, .xlsx | Max size: 2MB</p>
                    </div>
                </div>
            </form>

            {loading && <p className="text-sm mt-4 text-blue-500 animate-pulse">⏳ Processing file, please wait...</p>}

            {/* Preview Table */}
            {jsonData.length > 0 && (
                <div className="mt-4">
                    <PreviewTable data={jsonData} />
                </div>
            )}
        </div>
    );
};

export default ImportForm;
