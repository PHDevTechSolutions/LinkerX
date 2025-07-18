import React, { useEffect, useState } from "react";
import Select from "react-select";
import * as ExcelJS from "exceljs";
import { toast } from "react-toastify";

interface ImportFormProps {
  isEditing: boolean;
  manager: string;
  setManager: (value: string) => void;
  selectedManager: any;
  setSelectedManager: (option: any) => void;
  tsm: string;
  setTsm: (value: string) => void;
  selectedTSM: any;
  setSelectedTSM: (option: any) => void;
  referenceid: string;
  setReferenceid: (value: string) => void;
  selectedReferenceID: any;
  setSelectedReferenceID: (option: any) => void;
  status: string;
  setStatus: (value: string) => void;
  setShowImportForm: (value: boolean) => void;
}

const ImportForm: React.FC<ImportFormProps> = ({
  isEditing,
  manager,
  setManager,
  selectedManager,
  setSelectedManager,
  tsm,
  setTsm,
  selectedTSM,
  setSelectedTSM,
  referenceid,
  setReferenceid,
  selectedReferenceID,
  setSelectedReferenceID,
  status,
  setStatus,
  setShowImportForm,
}) => {
  const [managerOptions, setManagerOptions] = useState<any[]>([]);
  const [TSMOptions, setTSMOptions] = useState<any[]>([]);
  const [TSAOptions, setTSAOptions] = useState<any[]>([]);
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
        if (rowNumber === 1) return;

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
          area: row.getCell(7).value || "",
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
            status,
            companyname: row.getCell(1).value || "",
            contactperson: row.getCell(2).value || "",
            contactnumber: row.getCell(3).value || "",
            emailaddress: row.getCell(4).value || "",
            typeclient: row.getCell(5).value || "",
            address: row.getCell(6).value || "",
            area: row.getCell(7).value || "",
          });
        });

        const response = await fetch("/api/Data/Applications/Taskflow/CustomerDatabase/Import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ referenceid, tsm, manager, status, data: jsonData }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success(`${result.insertedCount} records imported successfully!`);
          setReferenceid("");
          setTsm("");
          setManager("");
          setStatus("");
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

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch("/api/UserManagement/FetchManager?Role=Manager");
        const data = await res.json();
        const options = data.map((user: any) => ({
          value: user.ReferenceID,
          label: `${user.Firstname} ${user.Lastname}`,
        }));
        setManagerOptions(options);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    const fetchTSM = async () => {
      try {
        const res = await fetch("/api/UserManagement/FetchTSM?Role=Territory Sales Manager");
        const data = await res.json();
        const options = data.map((user: any) => ({
          value: user.ReferenceID,
          label: `${user.Firstname} ${user.Lastname}`,
        }));
        setTSMOptions(options);
      } catch (error) {
        console.error("Error fetching TSM:", error);
      }
    };

    fetchTSM();
  }, []);

  useEffect(() => {
    const fetchTSA = async () => {
      try {
        const res = await fetch("/api/UserManagement/FetchTSA?Role=Territory Sales Associate");
        const data = await res.json();
        const options = data.map((user: any) => ({
          value: user.ReferenceID,
          label: `${user.Firstname} ${user.Lastname}`,
        }));
        setTSAOptions(options);
      } catch (error) {
        console.error("Error fetching TSA:", error);
      }
    };

    fetchTSA();
  }, []);

  return (
    <>
      <form onSubmit={handleFileUpload}>
        <div className="flex flex-wrap -mx-4">
          {/* Manager */}
          <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
            <label className="block text-xs font-bold mb-2">Manager</label>
            {isEditing ? (
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs capitalize"
                readOnly
              />
            ) : (
              <Select
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
                options={managerOptions}
                value={selectedManager}
                onChange={(option) => {
                  setSelectedManager(option);
                  setManager(option ? option.value : "");
                }}
                className="text-xs capitalize"
              />
            )}
          </div>

          {/* TSM */}
          <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
            <label className="block text-xs font-bold mb-2">Territory Sales Manager</label>
            {isEditing ? (
              <input
                type="text"
                value={tsm}
                onChange={(e) => setTsm(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs capitalize"
                readOnly
              />
            ) : (
              <Select
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
                options={TSMOptions}
                value={selectedTSM}
                onChange={(option) => {
                  setSelectedTSM(option);
                  setTsm(option ? option.value : "");
                }}
                className="text-xs capitalize"
              />
            )}
          </div>

          {/* TSA */}
          <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
            <label className="block text-xs font-bold mb-2">Territory Sales Associate</label>
            {isEditing ? (
              <input
                type="text"
                value={referenceid}
                onChange={(e) => setReferenceid(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs capitalize"
                readOnly
              />
            ) : (
              <Select
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
                options={TSAOptions}
                value={selectedReferenceID}
                onChange={(option) => {
                  setSelectedReferenceID(option);
                  setReferenceid(option ? option.value : "");
                }}
                className="text-xs capitalize"
              />
            )}
          </div>

          {/* Status */}
          <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border-b bg-white text-xs capitalize"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Used">Used</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
            <input
              type="file"
              className="w-full px-3 py-2 border-b text-xs"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex justify-end mb-4 gap-1 text-[10px]">
          <button
            type="submit"
            className={`bg-blue-400 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
          <button
            type="button"
            className="hover:bg-gray-100 px-4 py-2 border rounded flex items-center gap-1"
            onClick={() => setShowImportForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Preview Table */}
      {jsonData.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-bold mb-2">
            Preview Data ({jsonData.length} records)
          </h3>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default ImportForm;
