import React, { useState, useEffect } from 'react';
import Select from 'react-select';

interface FormFieldsProps {
    userName: string;
    setuserName: (value: string) => void;
    UserID: string;
    setUserID: (value: string) => void;
    CompanyName: string;
    setCompanyName: (value: string) => void;
    Remarks: string;
    setRemarks: (value: string) => void;
    ItemCode: string;
    setItemCode: (value: string) => void;
    ItemDescription: string;
    setItemDescription: (value: string) => void;
    QtySold: string;
    setQtySold: (value: string) => void;
    SalesAgent: string;
    setSalesAgent: (value: string) => void;
    editPost?: any;
}

const SkuFormFields: React.FC<FormFieldsProps> = ({
    userName, setuserName,
    UserID, setUserID,
    CompanyName, setCompanyName,
    Remarks, setRemarks,
    ItemCode, setItemCode,
    ItemDescription, setItemDescription,
    QtySold, setQtySold,
    SalesAgent, setSalesAgent,
    editPost
}) => {

    return (
        <>
            <div className="mb-4">
                <input type="hidden" id="Username" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                <input type="hidden" id="UserID" value={UserID} onChange={(e) => setUserID(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="CompanyName">Company Name</label>
                <input type="text" id="CompanyName" value={CompanyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="Remarks">Item Category</label>
                <select id="Remarks" value={Remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                    <option value="No Stocks / Insufficient Stocks">No Stocks / Insufficient Stocks</option>
                    <option value="Item Not Carried">Item Not Carried</option>
                    <option value="Non Standard Item">Non Standard Item</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="ContactNumber">ItemCode</label>
                <input type="text" id="ItemCode" value={ItemCode} onChange={(e) => setItemCode(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="ItemDescription">Item Description</label>
                <textarea id="ItemDescription" value={ItemDescription} onChange={(e) => setItemDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={4}></textarea>
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="QtySold">QTY</label>
                <input type="number" id="QtySold" value={QtySold} onChange={(e) => setQtySold(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="SalesAgent">Sales Agent</label>
                <select id="SalesAgent" value={SalesAgent} onChange={(e) => setSalesAgent(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                    <option value="">Select Agent</option>
                    <option value="Joseph Candazo">Joseph Candazo</option>
                    <option value="Cristy Bobis">Cristy Bobis</option>
                    <option value="Ansley Patelo">Ansley Patelo</option>
                    <option value="Jeff Puying">Jeff Puying</option>
                    <option value="Vincent Ortiz">Vincent Ortiz</option>
                    <option value="Wilnie Ardelozo">Wilnie Ardelozo</option>
                    <option value="Sherilyn Rapote">Sherilyn Rapote</option>
                    <option value="Michael Quijano">Michael Quijano</option>
                    <option value="Erwin Laude">Erwin Laude</option>
                    <option value="Lotty Deguzman">Lotty Deguzman</option>
                    <option value="Banjo Lising">Banjo Lising</option>
                    <option value="Jeffrey Lacson">Jeffrey Lacson</option>
                    <option value="Gene Mark Roxas">Gene Mark Roxas</option>
                    <option value="Dionisio Doyugan">Dionisio Doyugan</option>
                    <option value="Gretchell Aquino">Gretchell Aquino</option>
                    <option value="Eryll Joyce Encina">Eryll Joyce Encina</option>
                    <option value="Jonna Clarin">Jonna Clarin</option>
                    <option value="Vincent Bote">Vincent Bote</option>
                    <option value="Julius Abuel">Julius Abuel</option>
                    <option value="Raegan Bautista">Raegan Bautista</option>
                    <option value="Rodelio Ico">Rodelio Ico</option>
                    <option value="Rodolfo Delizo">Rodolfo Delizo</option>
                    <option value="Princess Joy Ambre">Princess Joy Ambre</option>
                    <option value="Krizelle Payno">Krizelle Payno</option>
                    <option value="Patrick Managuelod">Patrick Managuelod</option>
                    <option value="Ferdinand Canete">Ferdinand Canete</option>
                    <option value="Mark Villagonzalo">Mark Villagonzalo</option>
                    <option value="Reynaldo Piedad">Reynaldo Piedad</option>
                    <option value="Jujeno Marie Del Rio">Jujeno Marie Del Rio</option>
                    <option value="Khay Yango">Khay Yango</option>
                    <option value="Duke Menil">Duke Menil</option>
                    <option value="Juverson Mamolo">Juverson Mamolo</option>
                    <option value="Andrew Banaglorosio">Andrew Banaglorosio</option>
                    <option value="Kurt Guanco">Kurt Guanco</option>
                    <option value="Annie Mabilanga">Annie Mabilanga</option>
                    <option value="Jessie De Guzman">Jessie De Guzman</option>
                    <option value="Airish Echanes">Airish Echanes</option>
                    <option value="Paula Cauguiran">Paula Cauguiran</option>
                    <option value="Jessie Deguzman">Jessie Deguzman</option>
                    <option value="Krista Ilaya">Krista Ilaya</option>
                    <option value="Merie Tumbado">Merie Tumbado</option>
                    <option value="Cris Acierto">Cris Acierto</option>
                    <option value="Randy Bacor">Randy Bacor</option>
                    <option value="Cesar Paredes">Cesar Paredes</option>
                    <option value="Rosemarie Nollora">Rosemarie Nollora</option>
                    <option value="Roselyn Barnes">Roselyn Barnes</option>
                    <option value="Jean Dela Cerna">Jean Dela Cerna</option>
                    <option value="Florencio Jacinto Jr">Florencio Jacinto Jr</option>
                    <option value="Erish Tomas Cajipe">Erish Tomas Cajipe</option>
                </select>
            </div>
        </>
    );
};

export default SkuFormFields;
