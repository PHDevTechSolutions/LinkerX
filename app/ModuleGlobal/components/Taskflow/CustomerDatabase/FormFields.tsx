import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FaPlus, FaMinus } from "react-icons/fa";

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
                const response = await fetch("/api/fetchtsm?Role=Territory Sales Manager");
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
                const response = await fetch("/api/fetchtsa?Role=Territory Sales Associate");
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
                        <input type="text" id="manager" value={manager} onChange={(e) => setmanager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
                    ) : (
                        <Select id="Manager"
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
                                setmanager(option ? option.value : ""); // Save ReferenceID as Manager
                            }} className="text-xs capitalize" />
                    )}
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TSM">Territory Sales Manager</label>
                    {isEditing ? (
                        <input type="text" id="tsm" value={tsm} onChange={(e) => settsm(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
                    ) : (
                        <Select id="TSM"
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
                                settsm(option ? option.value : ""); // Save ReferenceID as Manager
                            }} className="text-xs capitalize" />
                    )}
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="referenceid">Territory Sales Associate</label>
                    {isEditing ? (
                        <input type="text" id="referenceid" value={referenceid} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
                    ) : (
                        <Select id="ReferenceID"
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
                                setreferenceid(option ? option.value : ""); // Save ReferenceID as Manager
                            }} className="text-xs capitalize" />
                    )}
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
                    <input type="text" id="companyname" value={companyname} onChange={(e) => setcompanyname(e.target.value)} className="w-full px-3 py-2 border-b text-xs capitalize"
                    />
                </div>
                {/* Contact Person */}
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
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

                            {/* Show plus button only on the first row */}
                            {index === 0 && (
                                <button
                                    type="button"
                                    onClick={addContactPerson}
                                    className="p-2 hover:bg-green-700 hover:rounded-full hover:text-white"
                                >
                                    <FaPlus size={10} />
                                </button>
                            )}

                            {/* Show minus button on rows except the first */}
                            {index !== 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeContactPerson(index)}
                                    className="p-2 hover:bg-red-700 hover:rounded-full hover:text-white"
                                >
                                    <FaMinus size={10} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Number */}
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Contact Number</label>
                    {contactNumbers.map((number, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={number}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const numbersOnly = input.replace(/[^0-9]/g, "");
                                    handleContactNumberChange(index, numbersOnly);
                                }}
                                className="w-full px-3 py-2 border-b text-xs"
                            />

                            {index === 0 && (
                                <button
                                    type="button"
                                    onClick={addContactNumber}
                                    className="p-2 hover:bg-green-700 hover:rounded-full hover:text-white"
                                >
                                    <FaPlus size={10} />
                                </button>
                            )}

                            {index !== 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeContactNumber(index)}
                                    className="p-2 hover:bg-red-700 hover:rounded-full hover:text-white"
                                >
                                    <FaMinus size={10} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Email Address */}
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
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

                                {index === 0 && (
                                    <button
                                        type="button"
                                        onClick={addEmailAddress}
                                        className="p-2 hover:bg-green-700 hover:rounded-full hover:text-white"
                                    >
                                        <FaPlus size={10} />
                                    </button>
                                )}

                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeEmailAddress(index)}
                                        className="p-2 hover:bg-red-700 hover:rounded-full hover:text-white"
                                    >
                                        <FaMinus size={10} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="typeclient">Type of Client</label>
                    <select id="typeclient" value={typeclient} onChange={(e) => settypeclient(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs capitalize">
                        <option value="">Select Client</option>
                        <option value="Top 50">Top 50</option>
                        <option value="Next 30">Next 30</option>
                        <option value="Balance 20">Balance 20</option>
                        <option value="CSR Client">CSR Client</option>
                        <option value="TSA Client">TSA Client</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="address">Address</label>
                    <input type="text" id="address" value={address} onChange={(e) => setaddress(e.target.value)} className="w-full px-3 py-2 border-b text-xs capitalize" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="area">Area</label>
                    <select id="area" value={area ?? ""} onChange={(e) => setarea(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs capitalize" required>
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
                        <option value="NCR">NCR</option>
                        <option value="CAR">CAR</option>
                        <option value="BARMM">BARMM</option>
                        <option value="Caraga">Region XIII</option>
                        <option value="Mimaropa Region">MIMAROPA Region</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="area">Status</label>
                    <select id="status" value={status} onChange={(e) => setstatus(e.target.value)} className="w-full px-3 py-2 border-b bg-white text-xs capitalize">
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
