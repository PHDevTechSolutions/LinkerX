import React, { useEffect, useState } from "react";
import Select from 'react-select';

interface FormFieldsProps {
    referenceid: string; setreferenceid: (value: string) => void;
    manager: string; setmanager: (value: string) => void;
    tsm: string; settsm: (value: string) => void;
    companyname: string; setcompanyname: (value: string) => void;
    contactperson: string; setcontactperson: (value: string) => void;
    editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
    referenceid, setreferenceid,
    manager, setmanager,
    tsm, settsm,
    companyname, setcompanyname,
    contactperson, setcontactperson,
    editPost,
}) => {
    // Fetch companies and set options
    const [companyOptions, setCompanyOptions] = useState<any[]>([]);

    useEffect(() => {
        if (editPost) {
            setcompanyname(editPost.companyname || "");
            setmanager(editPost.manager || "");
            settsm(editPost.tsm || "");
            setreferenceid(editPost.referenceid || "");
        }
    }, [editPost]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('/api/ModuleSales/Task/DailyActivity/FetchAccount');
                const data = await response.json();
                setCompanyOptions(data.map((company: any) => ({
                    value: company.companyname,
                    label: company.companyname,
                })));
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompanies();
    }, []);

    const handleCompanyChange = async (selectedOption: any) => {
        const selectedCompany = selectedOption ? selectedOption.value : '';
        setcompanyname(selectedCompany);
    
        if (selectedCompany) {
            try {
                const response = await fetch(`/api/ModuleSales/Task/DailyActivity/FetchAccount?referenceid=${encodeURIComponent(selectedCompany)}`);
                if (response.ok) {
                    const companyDetails = await response.json();
                    setcontactperson(companyDetails.data?.contactperson || '');
                } else {
                    console.error(`Company not found: ${selectedCompany}`);
                    resetFields();
                }
            } catch (error) {
                console.error('Error fetching company details:', error);
                resetFields();
            }
        } else {
            resetFields();
        }
    };    

    const resetFields = () => {
        setcontactperson('');
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
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
                    {editPost ? (
                        <input type="text" id="companyname" value={companyname} readOnly className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" />
                    ) : (
                        <Select id="companyname" options={companyOptions} onChange={handleCompanyChange} className="w-full text-xs capitalize" placeholder="Select Company" isClearable />
                    )}
                </div>
            </div>
        </>
    );
};

export default UserFormFields;
