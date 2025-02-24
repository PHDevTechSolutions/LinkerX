import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";

interface FormFieldsProps {
    referenceid: string;
    setreferenceid: (value: string) => void;
    manager: string;
    setmanager: (value: string) => void;
    tsm: string;
    settsm: (value: string) => void;
    companyname: string;
    setcompanyname: (value: string) => void;
    contactperson: string;
    setcontactperson: (value: string) => void;
    contactnumber: string;
    setcontactnumber: (value: string) => void;
    emailaddress: string;
    setemailaddress: (value: string) => void;
    typeclient: string;
    settypeclient: (value: string) => void;
    editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
    referenceid,
    setreferenceid,
    manager,
    setmanager,
    tsm,
    settsm,
    companyname,
    setcompanyname,
    contactperson,
    setcontactperson,
    contactnumber,
    setcontactnumber,
    emailaddress,
    setemailaddress,
    typeclient,
    settypeclient,
    editPost,
}) => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [contactPersons, setContactPersons] = useState<string[]>([]);
    const [contactNumbers, setContactNumbers] = useState<string[]>([]);
    const [emailAddresses, setEmailAddresses] = useState<string[]>([]);

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
                    <input type="hidden"
                        id="referenceid" value={referenceid} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    <input type="hidden" id="manager" value={manager} onChange={(e) => setmanager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                    <input type="hidden" id="tsm" value={tsm} onChange={(e) => settsm(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
                    <Select id="companyname" options={companies} onChange={handleCompanySelect} isClearable className="text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Contact Person</label>
                    {contactPersons.map((person, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input type="text" value={person} onChange={(e) => handleContactPersonChange(index, e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
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
                            <input type="text" value={number} onChange={(e) => handleContactNumberChange(index, e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
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
                            <input type="text" value={email} onChange={(e) => handleEmailAddressChange(index, e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
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
                    <input type="text" id="typeclient" value={typeclient} onChange={(e) => settypeclient(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>
            </div>
        </>
    );
};

export default UserFormFields;
