"use client";

import React, { useState } from "react";
import Select from "react-select";
import ExcelJS from "exceljs";
// Notifications
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface ImportFormProps {
  isEditing: boolean;
  manager: string; setmanager: (value: string) => void;
  selectedManager: any; setSelectedManager: (value: any) => void; managerOptions: any[];
  tsm: string; settsm: (value: string) => void; TSAOptions: any[];
  selectedTSM: any; setSelectedTSM: (value: any) => void; TSMOptions: any[];
  referenceid: string; setreferenceid: (value: string) => void;
  selectedReferenceID: any; setSelectedReferenceID: (value: any) => void;
  targetquota: string; settargetquota: (value: string) => void;
  setShowImportForm: (value: boolean) => void;
}

const ImportForm: React.FC<ImportFormProps> = ({
  isEditing,
  manager, setmanager,
  selectedManager, setSelectedManager,
  managerOptions,
  tsm, settsm,
  selectedTSM, setSelectedTSM,
  TSMOptions,
  referenceid, setreferenceid,
  selectedReferenceID, setSelectedReferenceID,
  TSAOptions,
  targetquota, settargetquota,
  setShowImportForm,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result as ArrayBuffer;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);
      const worksheet = workbook.worksheets[0];

      const parsedData: any[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row

        parsedData.push({
          referenceid,
          tsm,
          manager,
          targetquota,
          companyname: row.getCell(1).value || "",
          contactperson: row.getCell(2).value || "",
          contactnumber: row.getCell(3).value || "",
          emailaddress: row.getCell(4).value || "",
          typeclient: row.getCell(5).value || "",
          address: row.getCell(6).value || "",
          area: row.getCell(7).value || "",
          projectname: row.getCell(8).value || "",
          projectcategory: row.getCell(9).value || "",
          projecttype: row.getCell(10).value || "",
          source: row.getCell(11).value || "",
          date_created: row.getCell(12).value || "",
          activitystatus: row.getCell(13).value || "",
          activitynumber: row.getCell(14).value || "",
        });
      });

      console.log("Parsed Excel Data:", parsedData);
      setJsonData(parsedData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!file) {
      toast.error("Please upload a file.");
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data);
        const worksheet = workbook.worksheets[0];

        const jsonData: any[] = [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;

          jsonData.push({
            referenceid,
            tsm,
            manager,
            targetquota,
            companyname: row.getCell(1).value || "",
            contactperson: row.getCell(2).value || "",
            contactnumber: row.getCell(3).value || "",
            emailaddress: row.getCell(4).value || "",
            typeclient: row.getCell(5).value || "",
            address: row.getCell(6).value || "",
            area: row.getCell(7).value || "",
            projectname: row.getCell(8).value || "",
            projectcategory: row.getCell(9).value || "",
            projecttype: row.getCell(10).value || "",
            source: row.getCell(11).value || "",
            date_created: row.getCell(12).value || "",
            activitystatus: row.getCell(13).value || "",
            activitynumber: row.getCell(14).value || "",
          });
        });

        console.log("Parsed Excel Data:", jsonData);

        const response = await fetch("/api/Data/Applications/Taskflow/Activity/Import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            referenceid,
            tsm,
            manager,
            targetquota,
            data: jsonData,
          }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success(`${result.insertedCount} records imported successfully!`);
          setreferenceid("");
          settsm("");
          setmanager("");
          settargetquota("");
          setFile(null);
        } else {
          toast.error(result.message || "Import failed.");
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error uploading file.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Import Accounts</h2>
      <form onSubmit={handleFileUpload}>
        <div className="flex flex-wrap -mx-4">
          {/* Manager */}
          <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="Manager">Manager</label>
            {isEditing ? (
              <input type="text" id="manager" value={manager} onChange={(e) => setmanager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
            ) : (
              <Select
                id="Manager"
                className="text-[10px] capitalize"
                placeholder="Select Manager"
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    border: "none",
                    borderBottom: state.isFocused ? "2px solid #3B82F6" : "1px solid #D1D5DB",
                    boxShadow: "none",
                    borderRadius: "0px",
                    minHeight: "3px",
                    fontSize: "12px",
                    backgroundColor: "white",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    fontSize: "12px",
                    zIndex: 5,
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    textTransform: "capitalize",
                  }),
                }}

                options={managerOptions} value={selectedManager} onChange={(option) => {
                  setSelectedManager(option);
                  setmanager(option ? option.value : "");
                }}
              />
            )}
          </div>

          {/* TSM */}
          <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="TSM">Territory Sales Manager</label>
            {isEditing ? (
              <input type="text" id="tsm" value={tsm} onChange={(e) => settsm(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
            ) : (
              <Select
                id="TSM"
                className="text-[10px] capitalize"
                placeholder="Select Territory Sales Manager"
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    border: "none",
                    borderBottom: state.isFocused ? "2px solid #3B82F6" : "1px solid #D1D5DB",
                    boxShadow: "none",
                    borderRadius: "0px",
                    minHeight: "3px",
                    fontSize: "12px",
                    backgroundColor: "white",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    fontSize: "12px",
                    zIndex: 5,
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    textTransform: "capitalize",
                  }),
                }}

                options={TSMOptions} value={selectedTSM} onChange={(option) => {
                  setSelectedTSM(option);
                  settsm(option ? option.value : "");
                }}
              />
            )}
          </div>

          {/* TSA */}
          <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="referenceid">Territory Sales Associate</label>
            {isEditing ? (
              <input type="text" id="referenceid" value={referenceid} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border-b rounded text-xs capitalize" readOnly />
            ) : (
              <Select
                id="ReferenceID"
                className="text-[10px] capitalize"
                placeholder="Select Territory Sales Associates"
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    border: "none",
                    borderBottom: state.isFocused ? "2px solid #3B82F6" : "1px solid #D1D5DB",
                    boxShadow: "none",
                    borderRadius: "0px",
                    minHeight: "3px",
                    fontSize: "12px",
                    backgroundColor: "white",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    fontSize: "12px",
                    zIndex: 5,
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    textTransform: "capitalize",
                  }),
                }}

                options={TSAOptions} value={selectedReferenceID} onChange={(option) => {
                  setSelectedReferenceID(option);
                  setreferenceid(option ? option.value : "");
                }}
              />
            )}
          </div>

          {/* Quota */}
          <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
            <select value={targetquota} onChange={(e) => settargetquota(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs capitalize">
              <option value="">Select Quota</option>
              <option value="1750000">1,750,000</option>
              <option value="1000000">1,000,000</option>
              <option value="950000">950,000</option>
              <option value="700000">700,000</option>
              <option value="500000">500,000</option>
              <option value="300000">300,000</option>
              <option value="0">0</option>
            </select>
          </div>

          {/* File Input */}
          <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
            <input type="file" className="w-full px-3 py-2 border-b text-xs" onChange={handleFileChange} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className={`bg-blue-600 text-xs text-white px-4 py-2 rounded flex items-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
          <button type="button" className="bg-gray-500 text-xs text-white px-4 py-2 rounded" onClick={() => setShowImportForm(false)}>Cancel</button>
        </div>
      </form>

      {/* Preview Table */}
      {jsonData.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-bold mb-2">Preview Data ({jsonData.length} records)</h3>
          <div className="overflow-auto max-h-64 border rounded-md">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-200 text-xs">
                  <th className="border px-2 py-1">Company Name</th>
                  <th className="border px-2 py-1">Contact Person</th>
                  <th className="border px-2 py-1">Contact Number</th>
                  <th className="border px-2 py-1">Email Address</th>
                  <th className="border px-2 py-1">Type of Client</th>
                  <th className="border px-2 py-1">Address</th>
                  <th className="border px-2 py-1">Area</th>
                  <th className="border px-2 py-1">Project Name</th>
                  <th className="border px-2 py-1">Project Category</th>
                  <th className="border px-2 py-1">Project Type</th>
                  <th className="border px-2 py-1">Source</th>
                  <th className="border px-2 py-1">Date Created</th>
                  <th className="border px-2 py-1">Activity Status</th>
                  <th className="border px-2 py-1">Activity Number</th>
                </tr>
              </thead>
              <tbody>
                {jsonData.map((item, index) => (
                  <tr key={index} className="text-xs border">
                    <td className="border px-2 py-1">{item.companyname}</td>
                    <td className="border px-2 py-1">{item.contactperson}</td>
                    <td className="border px-2 py-1">{item.contactnumber}</td>
                    <td className="border px-2 py-1">{item.emailaddress}</td>
                    <td className="border px-2 py-1">{item.typeclient}</td>
                    <td className="border px-2 py-1">{item.address}</td>
                    <td className="border px-2 py-1">{item.area}</td>
                    <td className="border px-2 py-1">{item.projectname}</td>
                    <td className="border px-2 py-1">{item.projectcategory}</td>
                    <td className="border px-2 py-1">{item.projecttype}</td>
                    <td className="border px-2 py-1">{item.source}</td>
                    <td className="border px-2 py-1">{item.date_created}</td>
                    <td className="border px-2 py-1">{item.activitystatus}</td>
                    <td className="border px-2 py-1">{item.activitynumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportForm;
