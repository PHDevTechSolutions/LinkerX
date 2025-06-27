import React, { useEffect, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

interface FormFieldsProps {
  // Users Credentials
  referenceid: string; setreferenceid: (value: string) => void;
  manager: string; setmanager: (value: string) => void;
  tsm: string; settsm: (value: string) => void;
  //
  companyname: string; setcompanyname: (value: string) => void;
  contactperson: string; setcontactperson: (value: string) => void;
  remarks: string; setremarks: (value: string) => void;
  activitystatus: string; setactivitystatus: (value: string) => void;
  isMaximized?: boolean;
  editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
  // Users Credentials
  referenceid, setreferenceid,
  manager, setmanager,
  tsm, settsm,
  //
  companyname, setcompanyname,
  contactperson, setcontactperson,
  remarks, setremarks,
  activitystatus, setactivitystatus,
  isMaximized = false, // default false
  editPost,
}) => {
  // Select Fields

  // Dynamic Fields
  const [contactPersons, setContactPersons] = useState<string[]>([]);
  const [contactNumbers, setContactNumbers] = useState<string[]>([]);
  const [emailAddresses, setEmailAddresses] = useState<string[]>([]);

  useEffect(() => {
    setContactPersons(contactperson ? contactperson.split(", ") : [""]);
  }, [contactperson]);

  // Add new fields
  const addContactPerson = () => setContactPersons([...contactPersons, ""]);

  // Remove fields
  const removeContactPerson = (index: number) => {
    if (contactPersons.length > 1) {
      const updated = contactPersons.filter((_, i) => i !== index);
      setContactPersons(updated);
      setcontactperson(updated.join(", ")); // Update the contactperson field
    }
  };

  // Handle changes
  const handleContactPersonChange = (index: number, value: string) => {
    const updated = [...contactPersons];
    updated[index] = value;
    setContactPersons(updated);
    setcontactperson(updated.join(", "));
  };

  useEffect(() => {
    if (editPost) {
      setcompanyname(editPost.companyname || "");
      setmanager(editPost.manager || "");
      settsm(editPost.tsm || "");
      setreferenceid(editPost.referenceid || "");

      // Ensure contact persons, numbers, and emails are properly set
      setContactPersons(editPost.contactperson ? editPost.contactperson.split(", ") : [""]);
    }
  }, [editPost]);

  // Ensure selected values are updated when options are available
  const fieldWidthClass = isMaximized ? "w-full sm:w-1/2 px-4 mb-4" : "w-full px-4 mb-4";
  const isEditMode = !!editPost && Object.keys(editPost).length > 0;

  return (
    <>
      <div className={`flex flex-wrap -mx-4`}>
        <div className={fieldWidthClass}>
          <input type="hidden" id="referenceid" value={referenceid} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
          <input type="hidden" id="manager" value={manager} onChange={(e) => setmanager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
          <input type="hidden" id="tsm" value={tsm} onChange={(e) => settsm(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
        </div>
      </div>

      <div className={`flex flex-wrap -mx-4`}>

        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
          <input
            type="text"
            id="companyname"
            value={companyname}
            onChange={(e) => {
              const input = e.target.value;
              const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
              setcompanyname(sanitized);
            }}
            className="w-full px-3 py-2 border rounded text-xs capitalize" required
          />
        </div>

        {/* Contact Person */}
        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2">Contact Person</label>
          {contactPersons.map((person, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={person}
                onChange={(e) => {
                  const input = e.target.value;
                  const lettersOnly = input.replace(/[^a-zA-Z\s]/g, "");
                  handleContactPersonChange(index, lettersOnly);
                }}
                className="w-full px-3 py-2 border rounded text-xs capitalize" />

              <button type="button" onClick={addContactPerson} className="p-2 bg-gray-100 shadow-sm rounded hover:bg-green-500 hover:text-white"><CiCirclePlus size={18} /></button>
              {index > 0 && (
                <button type="button" onClick={() => removeContactPerson(index)} className="p-2 bg-red-400 text-white rounded hover:bg-red-600"><CiCircleMinus size={18} /></button>
              )}
            </div>
          ))}
        </div>

        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="remarks">Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => {
              const input = e.target.value;
              const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
              setremarks(sanitized);
            }}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
            rows={5}>

          </textarea>
        </div>

        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="activitystatus">Status</label>
          <select
            id="activitystatus"
            value={activitystatus}
            onChange={(e) => setactivitystatus(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
            required
          >
            <option value="">Select Status</option>
            <option value="Cold">Cold</option>
            <option value="Warm">Warm</option>
            <option value="Hot">Hot</option>
            <option value="Done">Done</option>
          </select>
        </div>

      </div>
    </>
  );
};

export default UserFormFields;
