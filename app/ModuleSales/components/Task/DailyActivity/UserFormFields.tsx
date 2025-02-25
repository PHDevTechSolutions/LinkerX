import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { CiCirclePlus, CiCircleMinus, CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

interface FormFieldsProps {
    referenceid: string; setreferenceid: (value: string) => void;
    manager: string; setmanager: (value: string) => void;
    tsm: string; settsm: (value: string) => void;
    companyname: string; setcompanyname: (value: string) => void;
    contactperson: string; setcontactperson: (value: string) => void;
    contactnumber: string; setcontactnumber: (value: string) => void;
    emailaddress: string; setemailaddress: (value: string) => void;
    typeclient: string; settypeclient: (value: string) => void;
    address: string; setaddress: (value: string) => void;
    area: string; setarea: (value: string) => void;
    projectname: string; setprojectname: (value: string) => void;
    projectcategory: string; setprojectcategory: (value: string) => void;
    projecttype: string; setprojecttype: (value: string) => void;
    source: string; setsource: (value: string) => void;
    typeactivity: string; settypeactivity: (value: string) => void;
    editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
    referenceid, setreferenceid,
    manager, setmanager,
    tsm, settsm,
    companyname, setcompanyname,
    contactperson, setcontactperson,
    contactnumber, setcontactnumber,
    emailaddress, setemailaddress,
    typeclient, settypeclient,
    address, setaddress,
    area, setarea,
    projectname, setprojectname,
    projectcategory, setprojectcategory,
    projecttype, setprojecttype,
    source, setsource,
    typeactivity, settypeactivity,
    editPost,
}) => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [contactPersons, setContactPersons] = useState<string[]>([]);
    const [contactNumbers, setContactNumbers] = useState<string[]>([]);
    const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    // Fetch companies based on referenceid
    useEffect(() => {
        if (referenceid) {
            // API call to fetch company data
            fetch(`/api/ModuleSales/Companies/CompanyAccounts/FetchAccount?referenceid=${referenceid}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setCompanies(data.data.map((company: any) => ({
                            value: company.companyname,
                            label: company.companyname,
                            contactperson: company.contactperson,
                            contactnumber: company.contactnumber,
                            emailaddress: company.emailaddress,
                            typeclient: company.typeclient,
                            address: company.address,
                            area: company.area,
                        })));
                    } else {
                        console.error("Error fetching companies:", data.error);
                    }
                })
                .catch((error) => console.error("Error fetching companies:", error));
        }
    }, [referenceid]);

    useEffect(() => {
        setContactPersons(contactperson ? contactperson.split(", ") : [""]);
        setContactNumbers(contactnumber ? contactnumber.split(", ") : [""]);
        setEmailAddresses(emailaddress ? emailaddress.split(", ") : [""]);
    }, [contactperson, contactnumber, emailaddress]);

    const handleCompanySelect = (selectedOption: any) => {
        setcompanyname(selectedOption ? selectedOption.value : "");
        setcontactperson(selectedOption ? selectedOption.contactperson : "");
        setcontactnumber(selectedOption ? selectedOption.contactnumber : "");
        setemailaddress(selectedOption ? selectedOption.emailaddress : "");
        settypeclient(selectedOption ? selectedOption.typeclient : "");
        setaddress(selectedOption ? selectedOption.address : "");
        setarea(selectedOption ? selectedOption.area : "");
    };

    const handleContactPersonChange = (index: number, value: string) => {
        const newContactPersons = [...contactPersons];
        newContactPersons[index] = value;
        setContactPersons(newContactPersons);
    };

    const handleContactNumberChange = (index: number, value: string) => {
        const newContactNumbers = [...contactNumbers];
        newContactNumbers[index] = value;
        setContactNumbers(newContactNumbers);
    };

    const handleEmailAddressChange = (index: number, value: string) => {
        const newEmailAddresses = [...emailAddresses];
        newEmailAddresses[index] = value;
        setEmailAddresses(newEmailAddresses);
    };

    // Remove specific contact info
    const removeContactPerson = (index: number) => {
        const newContactPersons = contactPersons.filter((_, i) => i !== index);
        setContactPersons(newContactPersons);
    };

    const removeContactNumber = (index: number) => {
        const newContactNumbers = contactNumbers.filter((_, i) => i !== index);
        setContactNumbers(newContactNumbers);
    };

    const removeEmailAddress = (index: number) => {
        const newEmailAddresses = emailAddresses.filter((_, i) => i !== index);
        setEmailAddresses(newEmailAddresses);
    };

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <input type="hidden" id="referenceid" value={referenceid} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    <input type="hidden" id="manager" value={manager} onChange={(e) => setmanager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    <input type="hidden" id="tsm" value={tsm} onChange={(e) => settsm(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
                    <Select id="companyname" options={companies} onChange={handleCompanySelect} isClearable className="text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Contact Person</label>
                    {contactPersons.map((person, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input type="text" value={person} onChange={(e) => handleContactPersonChange(index, e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
                            {index > 0 && (
                                <button type="button" onClick={() => removeContactPerson(index)} className="p-2 bg-red-700 text-white rounded hover:bg-red-600" >
                                    <CiCircleMinus size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Contact Number</label>
                    {contactNumbers.map((number, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input type="text" value={number} onChange={(e) => handleContactNumberChange(index, e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
                            {index > 0 && (
                                <button type="button" onClick={() => removeContactNumber(index)} className="p-2 bg-red-700 text-white rounded hover:bg-red-600">
                                    <CiCircleMinus size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Email Address</label>
                    {emailAddresses.map((email, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input type="text" value={email} onChange={(e) => handleEmailAddressChange(index, e.target.value)} className="w-full px-3 py-2 border rounded text-xs" readOnly />
                            {index > 0 && (
                                <button type="button" onClick={() => removeEmailAddress(index)} className="p-2 bg-red-700 text-white rounded hover:bg-red-600">
                                    <CiCircleMinus size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Type Client</label>
                    <input type="text" id="typeclient" value={typeclient} onChange={(e) => settypeclient(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/8 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Address</label>
                    <input type="text" id="address" value={address} onChange={(e) => setaddress(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Area</label>
                    <input type="text" id="area" value={area} onChange={(e) => setarea(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
                </div>
            </div>
            <div>
                <div className="mb-4">
                    <div className="border rounded-lg shadow-sm">
                        {/* Accordion Header */}
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer transition"
                        >
                            <span className="text-xs text-dark">Project Information</span>
                            {isOpen ? <CiSquareMinus className="text-xl text-white" /> : <CiSquarePlus className="text-xl text-white" />}
                        </div>

                        {/* Accordion Content */}
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "p-4" : "max-h-0 p-0"}`}>
                            <div className="flex flex-wrap -mx-4 rounded">
                                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                    <label className="block text-xs font-bold mb-2">Project Name ( Optional )</label>
                                    <input type="text" id="projectname" value={projectname} onChange={(e) => setprojectname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                    <label className="block text-xs font-bold mb-2">Project Category</label>
                                    <select value={projectcategory} onChange={(e) => setprojectcategory(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                        <option value="">Select Category</option>
                                        <option value="Bollard Light">Bollard Light</option>
                                        <option value="Bulb Light">Bulb Light</option>
                                    </select>
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                    <label className="block text-xs font-bold mb-2">Type</label>
                                    <select value={projecttype} onChange={(e) => setprojecttype(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                        <option value="">Select Category</option>
                                        <option value="B2B">B2B</option>
                                        <option value="B2C">B2C</option>
                                    </select>
                                </div>
                                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                    <label className="block text-xs font-bold mb-2">Source</label>
                                    <select value={source} onChange={(e) => setsource(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                                        <option value="">Select Category</option>
                                        <option value="B2B">Existing</option>
                                        <option value="B2C">Referral</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="mb-4">
                    <div className="border rounded-lg shadow-sm">

                        {/* Accordion Header */}
                        <div onClick={() => setIsAccordionOpen(!isAccordionOpen)} className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer transition">
                            <span className="text-xs text-dark">Progress Information</span>
                            {isAccordionOpen ? (
                                <CiSquareMinus className="text-xl text-white" />
                            ) : (
                                <CiSquarePlus className="text-xl text-white" />
                            )}
                        </div>

                        {/* Collapsible Content */}
                        <div className={`overflow-hidden transition-all duration-300 ${isAccordionOpen ? "p-4" : "max-h-0 p-0"}`}>
                            <div className="flex flex-wrap -mx-4 rounded">
                                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4 relative">
                                    <label className="block text-xs font-bold mb-2">Type of Activity</label>
                                    {/* Dropdown Button */}
                                    <div onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsSubmenuOpen(false);}}
                                        className="w-full px-3 py-2 border rounded text-xs capitalize bg-white shadow-sm flex justify-between items-center hover:bg-gray-100 cursor-pointer">
                                        {typeactivity}
                                        {isDropdownOpen ? (
                                            <FaChevronDown className="text-gray-500 text-xs" />
                                        ) : (
                                            <FaChevronRight className="text-gray-500 text-xs" />
                                        )}
                                    </div>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute left-4 w-[70%] mt-1 bg-white border rounded shadow-md text-xs z-10">
                                            <ul className="py-1">
                                                {/* Accounting Option with Submenu */}
                                                <li className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center cursor-pointer"
                                                    onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}>
                                                    Accounting
                                                    {isSubmenuOpen ? (
                                                        <FaChevronDown className="text-gray-500 text-xs" />
                                                    ) : (
                                                        <FaChevronRight className="text-gray-500 text-xs" />
                                                    )}
                                                </li>

                                                {/* Submenu for Accounting */}
                                                {isSubmenuOpen && (
                                                    <ul className="mt-1 ml-0 text-left bg-white border-l border-gray-300">
                                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                settypeactivity("Accounts Receivable");
                                                                setIsDropdownOpen(false);
                                                                setIsSubmenuOpen(false);
                                                            }}>
                                                            Accounts Receivable
                                                        </li>
                                                    </ul>
                                                )}

                                                {/* Outbound Call (No Submenu) */}
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => {
                                                        settypeactivity("Outbound Call");
                                                        setIsDropdownOpen(false);
                                                        setIsSubmenuOpen(false);
                                                    }}>
                                                    Outbound Call
                                                </li>

                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Remarks Section */}
                            <div className="flex flex-wrap -mx-4 rounded">
                                <div className="w-full sm:w-1/2 md:w-1/10 px-4 mb-4">
                                    <label className="block text-xs font-bold mb-2">Remarks</label>
                                    <textarea className="w-full px-3 py-2 border rounded text-xs capitalize" rows={5}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserFormFields;
