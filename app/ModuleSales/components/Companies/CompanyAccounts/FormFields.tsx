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
  contactnumber: string; setcontactnumber: (value: string) => void;
  emailaddress: string; setemailaddress: (value: string) => void;
  typeclient: string; settypeclient: (value: string) => void;
  companygroup: string; setcompanygroup: (value: string) => void;
  address: string; setaddress: (value: string) => void;
  deliveryaddress: string; setdeliveryaddress: (value: string) => void;
  area: string; setarea: (value: string) => void;
  status: string; setstatus: (value: string) => void;
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
  contactnumber, setcontactnumber,
  emailaddress, setemailaddress,
  typeclient, settypeclient,
  companygroup, setcompanygroup,
  address, setaddress,
  deliveryaddress, setdeliveryaddress,
  area, setarea,
  status, setstatus,
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
    if (editPost) {
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
  const fieldWidthClass = isMaximized ? "w-full sm:w-1/2 px-4 mb-4" : "w-full px-4 mb-4";
  const isEditMode = !!editPost && Object.keys(editPost).length > 0;


  return (
    <>
      <div className={`flex flex-wrap -mx-4`}>
        <div className={fieldWidthClass}>
          <input type="hidden" id="referenceid" value={referenceid} onChange={(e) => setreferenceid(e.target.value)} />
          <input type="hidden" id="manager" value={manager} onChange={(e) => setmanager(e.target.value)} />
          <input type="hidden" id="tsm" value={tsm} onChange={(e) => settsm(e.target.value)} />
        </div>
      </div>

      <div className={`flex flex-wrap -mx-4`}>

        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
          <input type="text" id="companyname" value={companyname} onChange={(e) => setcompanyname(e.target.value)} className="w-full px-3 py-2 border-b text-xs capitalize" required
          />
        </div>

        {/* Affiliate or Group */}
        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="companygroup">Affiliate or Group</label>
          <input type="text" id="companygroup" value={companygroup} onChange={(e) => { const input = e.target.value;
              const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
              setcompanygroup(sanitized);
            }}

            className="w-full px-3 py-2 border-b text-xs uppercase"
          />
        </div>

        {/* Type of Client */}
        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="typeclient">Type of Client</label>
          <select id="typeclient" value={typeclient ?? ""} onChange={(e) => settypeclient(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs capitalize" required>
            <option value="">Select Client</option>
            <option value="Top 50">Top 50</option>
            <option value="Next 30">Next 30</option>
            <option value="Balance 20">Balance 20</option>
            <option value="CSR Client">CSR Client</option>
            <option value="TSA Client">TSA Client</option>
          </select>
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
                className="w-full px-3 py-2 border-b text-xs capitalize"
              />
              <button
                type="button"
                onClick={addContactPerson}
                className="p-2 hover:bg-green-500 hover:text-white"
              >
                <CiCirclePlus size={18} />
              </button>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeContactPerson(index)}
                  className="p-2 bg-red-400 text-white rounded hover:bg-red-600"
                >
                  <CiCircleMinus size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Contact Number */}
        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2">Contact Number</label>
          {contactNumbers.map((number, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={number}
                onChange={(e) => {
                  const input = e.target.value;
                  const numbersOnly = input.replace(/[^0-9]/g, ""); // allow digits only
                  handleContactNumberChange(index, numbersOnly);
                }}
                className="w-full px-3 py-2 border-b text-xs"
              />
              <button
                type="button"
                onClick={addContactNumber}
                className="p-2 hover:bg-green-500 hover:text-white"
              >
                <CiCirclePlus size={18} />
              </button>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeContactNumber(index)}
                  className="p-2 bg-red-400 text-white rounded hover:bg-red-600"
                >
                  <CiCircleMinus size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Email Address */}
        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2">Email Address</label>
          {emailAddresses.map((email, index) => {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            return (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => handleEmailAddressChange(index, e.target.value)}
                  className={`w-full px-3 py-2 border-b text-xs ${email.length > 0 && !isValidEmail ? "border-red-500" : ""
                    }`}
                />
                <button
                  type="button"
                  onClick={addEmailAddress}
                  className="p-2 hover:bg-green-500 hover:text-white"
                >
                  <CiCirclePlus size={16} />
                </button>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeEmailAddress(index)}
                    className="p-2 bg-red-400 text-white rounded hover:bg-red-600"
                  >
                    <CiCircleMinus size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Complete Address */}
        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="address">Registered Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => {
              const input = e.target.value;
              const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
              setaddress(sanitized);
            }}
            className="w-full px-3 py-2 border-b text-xs capitalize"
          />
        </div>

        {/* Delivery Address */}
        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="deliveryaddress">Delivery Address</label>
          <input
            type="text"
            id="deliveryaddress"
            value={deliveryaddress}
            onChange={(e) => {
              const input = e.target.value;
              const sanitized = input.replace(/[^a-zA-Z,\s]/g, "");
              setdeliveryaddress(sanitized);
            }}
            className="w-full px-3 py-2 border-b text-xs capitalize" />
        </div>

        {/* Region / Area */}
        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="area">Area</label>
          <select id="typeclient" value={area ?? ""} onChange={(e) => setarea(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs capitalize" required>
            <option value="">Select Region</option>
            <option value="Ilocos Region">Region I - Ilocos Region</option>
            <option value="Cagayan Valley">Region II - Cagayan Valley</option>
            <option value="Central Luzon">Region III - Central Luzon</option>
            <option value="Calabarzon">Region IV - CALABARZON</option>
            <option value="Bicol Region">Region V - Bicol Region</option>
            <option value="Western Visayas">Region VI - Western Visayas</option>
            <option value="Central Visayas">Region VII - Cental Visayas</option>
            <option value="Easter Visayas">Region VIII - Easter Visayas</option>
            <option value="Zamboanga Peninsula">Region VIX - Zamboanga Peninsula</option>
            <option value="Northern Mindanao">Region X - Nothern Mindanao</option>
            <option value="Davao Region">Region XI - Davao Region</option>
            <option value="Soccsksargen">Region XII - SOCCSKSARGEN</option>
            <option value="National Capital Region">NCR</option>
            <option value="Cordillera Administrative Region">CAR</option>
            <option value="Bangsamoro Autonomous Region in Muslim Mindanao">BARMM</option>
            <option value="Caraga">Region XIII</option>
            <option value="Mimaropa Region">MIMAROPA Region</option>
          </select>
        </div>

        <div className={fieldWidthClass}>
          <label className="block text-xs font-bold mb-2" htmlFor="status">Status</label>
          <select id="status" value={status ?? ""} onChange={(e) => setstatus(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs capitalize" required>
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="New Client">New Client</option>
            <option value="Non-Buying">Non-Buying</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default UserFormFields;