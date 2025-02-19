import React, { useState, useEffect } from 'react';
import Select from 'react-select';

interface ReceivedFieldsProps {
    userName: string;
    setuserName: (value: string) => void;
    UserID: string;
    setUserID: (value: string) => void;
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
    editPost?: any;
}

const ReceivedPOFields: React.FC<ReceivedFieldsProps> = ({
    userName, setuserName,
    UserID, setUserID,
    DateTime, setDateTime,
    CompanyName, setCompanyName,
    ContactNumber, setContactNumber,
    PONumber, setPONumber,
    POAmount, setPOAmount,
    SONumber, setSONumber,
    SODate, setSODate,
    SalesAgent, setSalesAgent,
    PaymentTerms, setPaymentTerms,
    PaymentDate, setPaymentDate,
    DeliveryPickupDate, setDeliveryPickupDate,
    POStatus, setPOStatus,
    POSource, setPOSource,
    editPost
}) => {

    const [companies, setCompanies] = useState<any[]>([]);

    const formatAmount = (value: string) => {
        const formattedValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except dot
        if (formattedValue) {
            const number = parseFloat(formattedValue);
            setPOAmount(number.toLocaleString('en-US')); // Format with commas
        } else {
            setPOAmount('');
        }
    };

    return (
        <>
            <input type="hidden" id="Username" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
            <input type="hidden" id="UserID" value={UserID} onChange={(e) => setUserID(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="CompanyName">Company Name</label>
                    <input type="text" id="CompanyName" value={CompanyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled/>
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
                    <select id="SalesAgent" value={SalesAgent} onChange={(e) => setSalesAgent(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
                        <option value="">Select Agent</option>
                        <option value="Airish Echanes">Airish Echanes</option>
                        <option value="Andrew Banaglorosio">Andrew Banaglorosio</option>
                        <option value="Annie Mabilanga">Annie Mabilanga</option>
                        <option value="Ansley Patelo">Ansley Patelo</option>
                        <option value="Banjo Lising">Banjo Lising</option>
                        <option value="Cesar Paredes">Cesar Paredes</option>
                        <option value="Cris Acierto">Cris Acierto</option>
                        <option value="Cristy Bobis">Cristy Bobis</option>
                        <option value="Dionisio Doyugan">Dionisio Doyugan</option>
                        <option value="Duke Menil">Duke Menil</option>
                        <option value="Erish Tomas Cajipe">Erish Tomas Cajipe</option>
                        <option value="Erwin Laude">Erwin Laude</option>
                        <option value="Eryll Joyce Encina">Eryll Joyce Encina</option>
                        <option value="Florencio Jacinto Jr">Florencio Jacinto Jr</option>
                        <option value="Gene Mark Roxas">Gene Mark Roxas</option>
                        <option value="Gretchell Aquino">Gretchell Aquino</option>
                        <option value="Jean Dela Cerna">Jean Dela Cerna</option>
                        <option value="Jeff Puying">Jeff Puying</option>
                        <option value="Jeffrey Lacson">Jeffrey Lacson</option>
                        <option value="Jessie De Guzman">Jessie De Guzman</option>
                        <option value="Jessie Deguzman">Jessie Deguzman</option>
                        <option value="Jonna Clarin">Jonna Clarin</option>
                        <option value="Jujeno Marie Del Rio">Jujeno Marie Del Rio</option>
                        <option value="Julius Abuel">Julius Abuel</option>
                        <option value="Joseph Candazo">Joseph Candazo</option>
                        <option value="Khay Yango">Khay Yango</option>
                        <option value="Krista Ilaya">Krista Ilaya</option>
                        <option value="Krizelle Payno">Krizelle Payno</option>
                        <option value="Kurt Guanco">Kurt Guanco</option>
                        <option value="Lotty Deguzman">Lotty Deguzman</option>
                        <option value="Mark Villagonzalo">Mark Villagonzalo</option>
                        <option value="Michael Quijano">Michael Quijano</option>
                        <option value="Merie Tumbado">Merie Tumbado</option>
                        <option value="Patrick Managuelod">Patrick Managuelod</option>
                        <option value="Paula Cauguiran">Paula Cauguiran</option>
                        <option value="Princess Joy Ambre">Princess Joy Ambre</option>
                        <option value="Raegan Bautista">Raegan Bautista</option>
                        <option value="Reynaldo Piedad">Reynaldo Piedad</option>
                        <option value="Randy Bacor">Randy Bacor</option>
                        <option value="Rodelio Ico">Rodelio Ico</option>
                        <option value="Rodolfo Delizo">Rodolfo Delizo</option>
                        <option value="Rosemarie Nollora">Rosemarie Nollora</option>
                        <option value="Roselyn Barnes">Roselyn Barnes</option>
                        <option value="Sherilyn Rapote">Sherilyn Rapote</option>
                        <option value="Vincent Bote">Vincent Bote</option>
                        <option value="Vincent Ortiz">Vincent Ortiz</option>
                        <option value="Wilnie Ardelozo">Wilnie Ardelozo</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
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
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Source">Source</label>
                    <select id="Source" value={POSource} onChange={(e) => setPOSource(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Source</option>
                        <option value="CS Email">CS Email</option>
                        <option value="Sales Email">Sales Email</option>
                        <option value="Sales Agent">Sales Agent</option>
                    </select>
                </div>
            </div>
        </>
    );
};

export default ReceivedPOFields;
