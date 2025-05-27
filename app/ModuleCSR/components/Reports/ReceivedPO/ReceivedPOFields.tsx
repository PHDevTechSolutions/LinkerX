import React, { useState, useEffect } from 'react';
import Select from 'react-select';

type OptionType = {
    value: string;
    label: string;
};


interface ReceivedFieldsProps {
    userName: string;
    setuserName: (value: string) => void;
    ReferenceID: string;
    setReferenceID: (value: string) => void;
    DateTime: string;
    setDateTime: (value: string) => void;
    CompanyName: string;
    setCompanyName: (value: string) => void;
    ContactNumber: string;
    setContactNumber: (value: string) => void;
    PONumber: string;
    setPONumber: (value: string) => void;
    POAmount: string;
    setPOAmount: (value: string) => void;
    SONumber: string;
    setSONumber: (value: string) => void;
    SODate: string;
    setSODate: (value: string) => void;
    SalesAgent: string;
    setSalesAgent: (value: string) => void;
    PaymentTerms: string;
    setPaymentTerms: (value: string) => void;
    PaymentDate: string;
    setPaymentDate: (value: string) => void;
    DeliveryPickupDate: string;
    setDeliveryPickupDate: (value: string) => void;
    POStatus: string;
    setPOStatus: (value: string) => void;
    POSource: string;
    setPOSource: (value: string) => void;
    Remarks: string;
    setRemarks: (value: string) => void;

    SalesAgentName: any;
    setSalesAgentName: (value: any) => void;
    editPost?: any;
}

const ReceivedPOFields: React.FC<ReceivedFieldsProps> = ({
    userName, setuserName,
    ReferenceID, setReferenceID,
    DateTime, setDateTime,
    CompanyName, setCompanyName,
    ContactNumber, setContactNumber,
    PONumber, setPONumber,
    POAmount, setPOAmount,
    SONumber, setSONumber,
    SODate, setSODate,
    SalesAgent, setSalesAgent,
    SalesAgentName, setSalesAgentName,
    PaymentTerms, setPaymentTerms,
    PaymentDate, setPaymentDate,
    DeliveryPickupDate, setDeliveryPickupDate,
    POStatus, setPOStatus,
    POSource, setPOSource,
    Remarks, setRemarks,
    editPost
}) => {

    const [companies, setCompanies] = useState<any[]>([]);
    const [salesAgents, setSalesAgents] = useState<OptionType[]>([]);
    const [isManualCompany, setIsManualCompany] = useState(false);

    const formatAmount = (value: string) => {
        const formattedValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except dot
        if (formattedValue) {
            const number = parseFloat(formattedValue);
            setPOAmount(number.toLocaleString('en-US')); // Format with commas
        } else {
            setPOAmount('');
        }
    };

    useEffect(() => {
        const fetchTSA = async () => {
            try {
                const response = await fetch("/api/tsa?Roles=Territory Sales Associate,E-Commerce Staff");
                if (!response.ok) throw new Error("Failed to fetch agents");

                const data = await response.json();
                const options: OptionType[] = data.map((user: any) => ({
                    value: `${user.Firstname} ${user.Lastname}`, // Store Firstname Lastname as value
                    label: `${user.Firstname} ${user.Lastname}`, // Display Firstname Lastname
                }));
                setSalesAgents(options);
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };

        fetchTSA();

    }, []);

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
        setContactNumber('');
    };

    return (
        <>
            <input type="hidden" id="Username" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
            <input type="hidden" id="ReferenceID" value={ReferenceID} onChange={(e) => setReferenceID(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold" htmlFor="CompanyName">Company Name</label>
                        <button
                            type="button"
                            onClick={() => {
                                setIsManualCompany(prev => !prev);
                                if (!isManualCompany) resetFields(); // clear customer & contact when switching to manual
                            }}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            {isManualCompany ? 'Use Select' : 'Manual'}
                        </button>
                    </div>
                    <div>
                        {isManualCompany ? (
                            <input
                                type="text"
                                id="CompanyName"
                                value={CompanyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full px-3 py-2 border rounded text-xs capitalize"
                                placeholder="Enter Company Name"
                            />
                        ) : (
                            <Select
                                id="CompanyName"
                                options={CompanyOptions}
                                onChange={handleCompanyChange}
                                className="w-full text-xs capitalize"
                                placeholder="Select Company"
                                isClearable
                            />
                        )}
                    </div>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ContactNumber">Contact Number</label>
                    <input type="text" id="ContactNumber" value={ContactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PONumber">PO Number</label>
                    <input type="text" id="PONumber" value={PONumber} onChange={(e) => setPONumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="POAmount">Amount</label>
                    <input id="number" value={POAmount} onChange={(e) => formatAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="SONumber">SO Number</label>
                    <input type="text" id="SONumber" value={SONumber} onChange={(e) => setSONumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="SODate">SO Date</label>
                    <input type="datetime-local" id="SODate" value={SODate} onChange={(e) => setSODate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="SalesAgent">Sales Agent</label>
                    <Select
                        options={salesAgents}
                        value={salesAgents.find((option) => option.value === SalesAgent) || null}
                        onChange={(selected: OptionType | null) => {
                            setSalesAgent(selected?.value || ""); // Set the selected agent's ReferenceID
                            // Find the full name of the selected agent and update the SalesAgentName field
                            const selectedAgent = salesAgents.find((agent) => agent.value === selected?.value);
                            setSalesAgentName(selectedAgent ? `${selectedAgent.label}` : ""); // Update SalesAgentName
                        }}
                        placeholder="Select Agent"
                        isSearchable
                        className="text-xs capitalize"
                    />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PaymentTerms">Payment Terms</label>
                    <select id="PaymentTerms" value={PaymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
                        <option value="">Select Payment Terms</option>
                        <option value="Cash">Cash</option>
                        <option value="30 Days Terms">30 Days Terms</option>
                        <option value="Bank Deposit">Bank Deposit</option>
                        <option value="Dated Check">Dated Check</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PaymentDate">Payment Date</label>
                    <input type="datetime-local" id="PaymentDate" value={PaymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DeliveryPickupDate">Delivery Pick-Up Date</label>
                    <input type="datetime-local" id="DeliveryPickupDate" value={DeliveryPickupDate} onChange={(e) => setDeliveryPickupDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="POStatus">PO Status</label>
                    <textarea id="POStatus" value={POStatus} onChange={(e) => setPOStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Source">Source</label>
                    <select id="Source" value={POSource} onChange={(e) => setPOSource(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Source</option>
                        <option value="CS Email">CS Email</option>
                        <option value="Sales Email">Sales Email</option>
                        <option value="Sales Agent">Sales Agent</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Source">Status</label>
                    <select id="Source" value={Remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Type</option>
                        <option value="PO Received">PO Received</option>
                    </select>
                </div>
            </div>
        </>
    );
};

export default ReceivedPOFields;
