import React, { useEffect, useState } from "react";
import Select from "react-select";
import { CiCircleMinus, CiCirclePlus  } from "react-icons/ci";

interface FormFieldsProps {
  // Users Credentials
  referenceid: string; setreferenceid: (value: string) => void;
  manager: string; setmanager: (value: string) => void;
  tsm: string; settsm: (value: string) => void;
  //
  companyname: string; setcompanyname: (value: string) => void;
  contactperson: string; setcontactperson: (value: string) => void;
  contactnumber: string; setcontactnumber: (value: string) => void;
  emailaddress: string; setemailaddress: (value: string) => void;
  typeclient: string; settypeclient: (value: string) => void;
  address: string; setaddress: (value: string) => void;
  area: string; setarea: (value: string) => void;
  status: string; setstatus: (value: string) => void;

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
  contactnumber, setcontactnumber,
  emailaddress, setemailaddress,
  typeclient, settypeclient,
  address, setaddress,
  area, setarea,
  status, setstatus,
  editPost,
}) => {
  // Select Fields
  const [managerOptions, setManagerOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedManager, setSelectedManager] = useState<{ value: string; label: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [TSMOptions, setTSMOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedTSM, setSelectedTSM] = useState<{ value: string; label: string } | null>(null);
  const [TSAOptions, setTSAOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedReferenceID, setSelectedReferenceID] = useState<{ value: string; label: string } | null>(null);
  // Dynamic Fields
  const [contactPersons, setContactPersons] = useState<string[]>([]);
  const [contactNumbers, setContactNumbers] = useState<string[]>([]);
  const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
  
  useEffect(() => {
    setContactPersons(contactperson ? contactperson.split(", ") : [""]);
    setContactNumbers(contactnumber ? contactnumber.split(", ") : [""]);
    setEmailAddresses(emailaddress ? emailaddress.split(", ") : [""]);
  }, [contactperson, contactnumber, emailaddress]);

  // Add new fields
  const addContactPerson = () => setContactPersons([...contactPersons, ""]);
  const addContactNumber = () => setContactNumbers([...contactNumbers, ""]);
  const addEmailAddress = () => setEmailAddresses([...emailAddresses, ""]);

  // Remove fields
  const removeContactPerson = (index: number) => {
    if (contactPersons.length > 1) {
      const updated = contactPersons.filter((_, i) => i !== index);
      setContactPersons(updated);
      setcontactperson(updated.join(", ")); // Update the contactperson field
    }
  };

  const removeContactNumber = (index: number) => {
    if (contactNumbers.length > 1) {
      const updated = contactNumbers.filter((_, i) => i !== index);
      setContactNumbers(updated);
      setcontactnumber(updated.join(", ")); // Update the contactnumber field
    }
  };

  const removeEmailAddress = (index: number) => {
    if (emailAddresses.length > 1) {
      const updated = emailAddresses.filter((_, i) => i !== index);
      setEmailAddresses(updated);
      setemailaddress(updated.join(", ")); // Update the emailaddress field
    }
  };

  // Handle changes
  const handleContactPersonChange = (index: number, value: string) => {
    const updated = [...contactPersons];
    updated[index] = value;
    setContactPersons(updated);
    setcontactperson(updated.join(", "));
  };

  const handleContactNumberChange = (index: number, value: string) => {
    const updated = [...contactNumbers];
    updated[index] = value;
    setContactNumbers(updated);
    setcontactnumber(updated.join(", "));
  };

  const handleEmailAddressChange = (index: number, value: string) => {
    const updated = [...emailAddresses];
    updated[index] = value;
    setEmailAddresses(updated);
    setemailaddress(updated.join(", "));
  };

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch("/api/manager?Role=Manager");
        if (!response.ok) {
          throw new Error("Failed to fetch managers");
        }
        const data = await response.json();

        // Use ReferenceID as value
        const options = data.map((user: any) => ({
          value: user.ReferenceID, // ReferenceID ang isesend
          label: `${user.Firstname} ${user.Lastname}`, // Pero ang nakikita sa UI ay Name
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
        const response = await fetch("/api/tsm?Role=Territory Sales Manager");
        if (!response.ok) {
          throw new Error("Failed to fetch managers");
        }
        const data = await response.json();

        // Use ReferenceID as value
        const options = data.map((user: any) => ({
          value: user.ReferenceID, // ReferenceID ang isesend
          label: `${user.Firstname} ${user.Lastname}`, // Pero ang nakikita sa UI ay Name
        }));

        setTSMOptions(options);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchTSM();
  }, []);

  useEffect(() => {
    const fetchTSA = async () => {
      try {
        const response = await fetch("/api/tsa?Role=Territory Sales Associate");
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data = await response.json();

        // Use ReferenceID as value
        const options = data.map((user: any) => ({
          value: user.ReferenceID, // ReferenceID ang isesend
          label: `${user.Firstname} ${user.Lastname}`, // Pero ang nakikita sa UI ay Name
        }));

        setTSAOptions(options);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchTSA();
  }, []);

  useEffect(() => {
    if (editPost) {
      setIsEditing(true);
      setcompanyname(editPost.companyname || "");
      settypeclient(editPost.typeclient || "");
      setaddress(editPost.address || "");
      setarea(editPost.area || "");
      setstatus(editPost.status || "");
      setmanager(editPost.manager || "");
      settsm(editPost.tsm || "");
      setreferenceid(editPost.referenceid || "");
  
      // Ensure contact persons, numbers, and emails are properly set
      setContactPersons(editPost.contactperson ? editPost.contactperson.split(", ") : [""]);
      setContactNumbers(editPost.contactnumber ? editPost.contactnumber.split(", ") : [""]);
      setEmailAddresses(editPost.emailaddress ? editPost.emailaddress.split(", ") : [""]);
    }
  }, [editPost]);
  

  // Ensure selected values are updated when options are available
  useEffect(() => {
    if (isEditing && editPost) {
      setSelectedManager(managerOptions.find((opt) => opt.value === editPost.manager) || null);
      setSelectedTSM(TSMOptions.find((opt) => opt.value === editPost.tsm) || null);
      setSelectedReferenceID(TSAOptions.find((opt) => opt.value === editPost.referenceid) || null);
    }
  }, [isEditing, editPost, managerOptions, TSMOptions, TSAOptions]);

  return (
    <>
    <div className="flex flex-wrap -mx-4">
      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Manager">Manager</label>
          {isEditing ? (
            <input type="text" id="manager" value={manager} onChange={(e) => setmanager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly/>
          ) : (
            <Select id="Manager" options={managerOptions} value={selectedManager} onChange={(option) => {
                setSelectedManager(option);
                setmanager(option ? option.value : ""); // Save ReferenceID as Manager
              }} className="text-xs capitalize"/>
          )}
        </div>
      <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="TSM">Territory Sales Manager</label>
          {isEditing ? (
            <input type="text" id="tsm" value={tsm} onChange={(e) => settsm(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly/>
          ) : (
            <Select id="TSM" options={TSMOptions} value={selectedTSM} onChange={(option) => {
                setSelectedTSM(option);
                settsm(option ? option.value : ""); // Save ReferenceID as Manager
              }} className="text-xs capitalize"/>
          )}
      </div>
      <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="referenceid">Territory Sales Associate</label>
          {isEditing ? (
            <input type="text" id="referenceid" value={referenceid} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly/>
          ) : (
            <Select id="ReferenceID" options={TSAOptions} value={selectedReferenceID} onChange={(option) => {
                setSelectedReferenceID(option);
                setreferenceid(option ? option.value : ""); // Save ReferenceID as Manager
              }} className="text-xs capitalize"/>
          )}
        </div>
    </div>
    <div className="flex flex-wrap -mx-4">
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
      <input type="text" id="companyname" value={companyname} onChange={(e) => setcompanyname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"
      />
    </div>
    {/* Contact Person */}
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Contact Person</label>
        {contactPersons.map((person, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input type="text" value={person} onChange={(e) => handleContactPersonChange(index, e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize"/>
            <button type="button" onClick={addContactPerson} className="p-2 bg-green-700 text-white rounded hover:bg-green-600"><CiCirclePlus size={16} /></button>
            {index > 0 && (
              <button type="button" onClick={() => removeContactPerson(index)} className="p-2 bg-red-700 text-white rounded hover:bg-red-600"><CiCircleMinus size={16} /></button>
            )}
          </div>
        ))}
      </div>

      {/* Contact Number */}
      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Contact Number</label>
        {contactNumbers.map((number, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input type="text" value={number} onChange={(e) => handleContactNumberChange(index, e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
            <button type="button" onClick={addContactNumber} className="p-2 bg-green-700 text-white rounded hover:bg-green-600"><CiCirclePlus size={16} /></button>
            {index > 0 && (
              <button type="button" onClick={() => removeContactNumber(index)} className="p-2 bg-red-700 text-white rounded hover:bg-red-600"><CiCircleMinus size={16} /></button>
            )}
          </div>
        ))}
      </div>

      {/* Email Address */}
      <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
        <label className="block text-xs font-bold mb-2">Email Address</label>
        {emailAddresses.map((email, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input type="text" value={email} onChange={(e) => handleEmailAddressChange(index, e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
            <button type="button" onClick={addEmailAddress} className="p-2 bg-green-700 text-white rounded hover:bg-green-600"><CiCirclePlus size={16} /></button>
            {index > 0 && (
              <button type="button" onClick={() => removeEmailAddress(index)} className="p-2 bg-red-700 text-white rounded hover:bg-red-600"><CiCircleMinus size={16} /></button>
            )}
          </div>
        ))}
      </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="typeclient">Type of Client</label>
      <select id="typeclient" value={typeclient} onChange={(e) => settypeclient(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize">
        <option value="">Select Client</option>
        <option value="Top 50">Top 50</option>
        <option value="Next 30">Next 30</option>
        <option value="Balance 20">Balance 20</option>
        <option value="Revived Account - Existing">Revived Account - Existing</option>
        <option value="Revived Account - Resigned Agent">Revived Account - Resigned Agent</option>
        <option value="New Account - Client Development">New Account - Client Development</option>
        <option value="Transferred Account">Transferred Account</option>
      </select>
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="address">Address</label>
      <input type="text" id="address" value={address} onChange={(e) => setaddress(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="area">Area</label>
      <input type="text" id="area" value={area} onChange={(e) => setarea(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
      <label className="block text-xs font-bold mb-2" htmlFor="area">Status</label>
      <select id="status" value={status} onChange={(e) => setstatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize">
        <option value="">Select Status</option>
        <option value="Active">Active</option>
        <option value="Used">Used</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  </div>
    </>
  );
};

export default UserFormFields;
