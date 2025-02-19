import React, { useState, useEffect } from 'react';
import Select from 'react-select';

interface ReceivedFieldsProps {
    userName: string;
    setuserName: (value: string) => void;
    UserID: string;
    setUserID: (value: string) => void;
    DateRecord: string;
    setDateRecord: (value: string) => void;
    CompanyName: string;
    setCompanyName: (value: string) => void;
    CustomerName: string;
    setCustomerName: (value: string) => void;
    ContactNumber: string;
    setContactNumber: (value: string) => void;
    TicketType: string;
    setTicketType: (value: string) => void;
    TicketConcern: string;
    setTicketConcern: (value: string) => void;
    TrackingRemarks: string;
    setTrackingRemarks: (value: string) => void;
    TrackingStatus: string;
    setTrackingStatus: (value: string) => void;

    Department: string;
    setDepartment: (value: string) => void;
    EndorsedDate: string;
    setEndorsedDate: (value: string) => void;
    ClosedDate: string;
    setClosedDate: (value: string) => void;
    editPost?: any;
}

const AddTrackingFields: React.FC<ReceivedFieldsProps> = ({
    userName, setuserName,
    UserID, setUserID,
    DateRecord, setDateRecord,
    CompanyName, setCompanyName,
    CustomerName, setCustomerName,
    ContactNumber, setContactNumber,
    TicketType, setTicketType,
    TicketConcern, setTicketConcern,
    TrackingRemarks, setTrackingRemarks,
    TrackingStatus, setTrackingStatus,

    Department, setDepartment,
    EndorsedDate, setEndorsedDate,
    ClosedDate, setClosedDate,
    editPost
}) => {

    const [companies, setCompanies] = useState<any[]>([]);
    
        useEffect(() => {
            const fetchCompanies = async () => {
                try {
                    const response = await fetch('/api/ModuleCSR/companies');
                    const data = await response.json();
                    setCompanies(data);
                } catch (error) {
                    console.error('Error fetching companies:', error);
                }
            };
            fetchCompanies();
        }, []);
    
        const CompanyOptions = companies.map((company) => ({
            value: company.CompanyName,
            label: company.CompanyName,
        }));
    
        const handleCompanyChange = async (selectedOption: any) => {
            const selectedCompany = selectedOption ? selectedOption.value : '';
            setCompanyName(selectedCompany);
    
            if (selectedCompany) {
                try {
                    const response = await fetch(`/api/ModuleCSR/companies?CompanyName=${encodeURIComponent(selectedCompany)}`);
                    if (response.ok) {
                        const companyDetails = await response.json();
                        setCustomerName(companyDetails.CustomerName || '');
                        setContactNumber(companyDetails.ContactNumber || '');
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
            setCustomerName('');
            setContactNumber('');
        };

    return (
        <>
            <input type="hidden" id="Username" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
            <input type="hidden" id="UserID" value={UserID} onChange={(e) => setUserID(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DateRecord">Date Record</label>
                    <input type="datetime-local" id="DateRecord" value={DateRecord} onChange={(e) => setDateRecord(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="CompanyName">Company Name</label>
                    {editPost ? (
                        <input type="text" id="CompanyName" value={CompanyName} readOnly className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" />
                    ) : (
                        <Select id="CompanyName" options={CompanyOptions} onChange={handleCompanyChange} className="w-full text-xs capitalize" placeholder="Select Company" isClearable />
                    )}
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="CustomerName">Customer Name</label>
                    <input type="text" id="CustomerName" value={CustomerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100 capitalize" readOnly />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ContactNumber">Contact Number</label>
                    <input type="text" id="ContactNumber" value={ContactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TicketType">Ticket Type</label>
                    <select id="TicketType" value={TicketType} onChange={(e) => setTicketType(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50">
                        <option value="">Select Ticket Type</option>
                        <option value="After Sales">After Sales</option>
                        <option value="Follow Up">Follow Up</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Technical">Technical</option>
                        <option value="Pricing">Pricing</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Product">Product</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TicketConcern">Ticket Concern</label>
                    <select id="TicketConcern" value={TicketConcern} onChange={(e) => setTicketConcern(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50">
                        <option value="">Select Ticket Concern</option>
                        <option value="Delivery / Pickup">Delivery / Pickup</option>
                        <option value="Quotation">Quotation</option>
                        <option value="Documents">Documents</option>
                        <option value="Return Call">Return Call</option>
                        <option value="Payment">Payment</option>
                        <option value="Refund">Refund</option>
                        <option value="Replacement">Replacement</option>
                        <option value="Site Visit">Site Visit</option>
                        <option value="TDS">TDS</option>
                        <option value="Shop Drawing">Shop Drawing</option>
                        <option value="Dialux">Dialux</option>
                        <option value="Product Testing">Product Testing</option>
                        <option value="SPF">SPF</option>
                        <option value="Replacement To Supplier">Replacement To Supplier</option>
                        <option value="Accreditation Request">Accreditation Request</option>
                        <option value="Job Request">Job Request</option>
                        <option value="Product Recommendation">Product Recommendation</option>
                        <option value="Payment Terms">Payment Terms</option>
                        <option value="Wrong Order">Wrong Order</option>
                        <option value="Repair">Repair</option>
                        <option value="Product Certificate">Product Certificate</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DateClosed">Department</label>
                    <select id="Department" value={Department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
                        <option value="">Select Department</option>
                        <option value="Accounting">Accounting</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Purchasing">Purchasing</option>
                        <option value="Sales">Sales</option>
                        <option value="Warehouse">Warehouse</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="EndorsedDate">Endorsed Date</label>
                    <input type="datetime-local" id="EndorsedDate" value={EndorsedDate} onChange={(e) => setEndorsedDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ClosedDate">Closed Date</label>
                    <input type="datetime-local" id="ClosedDate" value={ClosedDate} onChange={(e) => setClosedDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TrackingStatus">Status</label>
                    <select id="TrackingStatus" value={TrackingStatus} onChange={(e) => setTrackingStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50">
                        <option value="">Select Status</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/1 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TrackingRemarks">Remarks</label>
                    <textarea id="TrackingRemarks" value={TrackingRemarks} onChange={(e) => setTrackingRemarks(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
                </div>

            </div>

        </>
    );
};

export default AddTrackingFields;
