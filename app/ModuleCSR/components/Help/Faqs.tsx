"use client";

import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const CSRFaqs: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean[]>(Array(11).fill(false)); // 11 items

    const toggleCard = (index: number) => {
        setIsOpen((prev) =>
            prev.map((state, i) => (i === index ? !state : state))
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg text-xs text-gray-900">
            {/* Accreditation Requirements */}
            <div className="border rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => toggleCard(0)}
                    className="w-full text-left p-4 font-semibold hover:bg-gray-300 flex justify-between items-center"
                >
                    Accreditation Requirements
                    {isOpen[0] ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </button>
                {isOpen[0] && (
                    <div className="p-4 space-y-1 text-xs border-t">
                        <p>Submit the following documents along with the application:</p>
                        <ul className="list-disc list-inside">
                            <li>Current SEC/DTI Registration with articles and by-laws.</li>
                            <li>Current Mayor's Permit.</li>
                            <li>Current BIR Registration (Form 2303).</li>
                            <li>Latest Financial Statement 2021.</li>
                            <li>General Information Sheet.</li>
                            <li>2 Valid Government IDs of owners with pictures (colored).</li>
                            <li>Credit Terms Agreement and Conditions.</li>
                        </ul>
                        <p className="mt-2 text-gray-500">
                            **Note:** Applications with incomplete details and documents will not be approved.
                        </p>
                    </div>
                )}
            </div>

            {/* Accreditation Request */}
            <div className="border rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => toggleCard(1)}
                    className="w-full text-left p-4 font-semibold hover:bg-gray-300 flex justify-between items-center"
                >
                    Accreditation Request (Admin Sheets)
                    {isOpen[1] ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </button>
                {isOpen[1] && (
                    <div className="p-4 space-y-1 text-xs border-t">
                        <p>(Documents Needed)</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Mayor's Permit</li>
                            <li>SEC Registration</li>
                            <li>BIR Registration</li>
                            <li>TAX Clearance</li>
                            <li>PHILGEPS Registration</li>
                            <li>General Information Sheet</li>
                            <li>Google Maps of Office & Warehouses, Branches</li>
                            <li>DOLE Registration</li>
                            <li>Secretary Certificate for Authorized Person</li>
                            <li>BANK Details</li>
                            <li>List of Ongoing and Completed Projects</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Refund Request (Accounting Sheets) */}
            <div className="border rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => toggleCard(2)}
                    className="w-full text-left p-4 font-semibold hover:bg-gray-300 flex justify-between items-center"
                >
                    Refund Request (Accounting Sheets)
                    {isOpen[2] ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </button>
                {isOpen[2] && (
                    <div className="p-4 space-y-1 text-xs border-t">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Card 1 */}
                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">Refund Request (Accounting Sheets)</p>
                                    <p className="italic">Details Needed:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Reason for Refund</li>
                                        <li>Total AMT. of Refund</li>
                                        <li>Passbook</li>
                                        <li>Sales Head Approval</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">Documents Needed:</p>
                                    <p className="italic">Reason: Wrong Deposit</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Copy of Proof of Payment</li>
                                        <li>Collection Receipt or Acknowledgement Receipt</li>
                                        <li>Copy of 2307 (If Applicable)</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">Reason: Double Payment</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Copy of Proof of Payment</li>
                                        <li>Collection Receipt or Acknowledgement Receipt</li>
                                        <li>Copy of Sales Order</li>
                                        <li>Copy of Delivery Receipt</li>
                                        <li>Copy of Sales Invoice</li>
                                        <li>Copy of 2307 (If Applicable)</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">Return Items With Re-Stocking Fee</p>
                                    <p className="italic">Details Needed:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Reason for Refund</li>
                                        <li>Total AMT. of Refund</li>
                                        <li>Passbook</li>
                                        <li>Sales Head Approval</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 5 */}
                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">Document Needed: Cancel Order / Wrong Item Delivered</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Copy of Sales Order</li>
                                        <li>Copy of Delivery Receipt</li>
                                        <li>Copy of SI</li>
                                        <li>Copy of Replacement / Pull-Out Slip</li>
                                        <li>Copy of Another SO Containing the Re-Stocking Cancellation Charge</li>
                                        <li>Copy of 2307 (If Applicable)</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 6 */}
                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">Reason: Deposit in Advance / Unavailability of Stocks</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Copy of Sales Order</li>
                                        <li>Copy of Proof of Payment</li>
                                        <li>Collection Receipt or Acknowledgement Receipt</li>
                                        <li>Copy of 2307 (If Applicable)</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 7 */}
                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">Reason: Unserved Items / Excess Amount Deposited</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Copy of Sales Order</li>
                                        <li>Copy of Delivery Receipt</li>
                                        <li>Copy of Sales Invoice</li>
                                        <li>Collection Receipt or Acknowledgement Receipt</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 8 */}
                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">E-Commerce: Busted Items / Cancel Order</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Summary of Excel Report</li>
                                        <li>Copy of Replacement / Pull-Out Slip</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">Regular SO</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <p className="text-red-500">Customer Details</p>
                                        <li>Company Name / Customer Name</li>
                                        <li>Customer Registered Address</li>
                                        <li>TIN / Business Style</li>
                                        <li>PO Reference / Quotation Reference</li>
                                        <p className="text-red-500">Shipping Address</p>
                                        <li>Contact Information</li>
                                        <li>Delivery Address / Delivery Date</li>
                                        <li>Payment Terms / Special Instruction</li>
                                        <p>Product Details</p>
                                        <li>Item Code</li>
                                        <li>Image</li>
                                        <li>Item Specs</li>
                                        <li>QTY</li>
                                        <li>Unit Price</li>
                                        <li>Total Amount</li>
                                        <p className="text-red-500">Signatories</p>
                                        <li>Agent Details and Signature</li>
                                        <li>Sales Manager Details and Signature</li>
                                        <li>Sales Head and Signature Email to: orders@ecoshiftcorp.com</li>
                                    </ul>
                                </div>
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p>Documents Needed</p>
                                    <li>Purchased Order / Notice to Proceed / National Tax Allotment</li>
                                    <li>Signed Quotation / Email Quotation from Client</li>
                                    <li>Sample Slip / Job Request Form (If Applicable)</li>
                                    <li>Copy of Deposit Slip</li>
                                    <li>Form 251 and Other Special Approval (if Applicable)</li>
                                    <li>PEZA Certificate / Vat Exempt Certificate (if Applicable)</li>
                                </div>
                            </div>

                            <div className="border rounded-lg shadow-md transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">SO Cancellation</p>
                                    <p>Details Needed:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Company Name</li>
                                        <li>Sales Order Reference Number</li>
                                        <li>Reason for Cancellation</li>
                                        <li>Sales Manager Approval</li>
                                        <li>Sales Head Approval w/Restocking Fee / Cancellation Fee</li>
                                        <li>Any Proof of Cancellation</li>
                                        <p>Email to: orders@ecoshiftcorp.com</p>
                                        <p>CC: Sales Head</p>
                                    </ul>
                                </div>
                                <div className="p-4 space-y-1 text-xs border-t">
                                    <p className="font-bold">Request for Advance Sales Invoice / Proforma Invoice</p>
                                    <p>Details Needed:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Company Name</li>
                                        <li>SO Number</li>
                                        <li>VAT Type</li>
                                        <li>Payment Terms</li>
                                        <li>Days of Payment Processing</li>
                                        <li>Attach Proof of Client Request</li>
                                        <li>Purpose of Client</li>
                                        <p>Email to: j.bellen@ecoshiftcorp.com, billings@ecoshiftcorp.com</p>
                                        <p>CC: Sales Head</p>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* Branches */}
            <div className="border rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => toggleCard(3)}
                    className="w-full text-left p-4 font-semibold hover:bg-gray-300 flex justify-between items-center"
                >
                    Branches
                    {isOpen[3] ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </button>
                {isOpen[3] && (
                    <div className="p-4 space-y-1 text-xs border-t">
                        <p>Branch Locations:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Mandaluyong: Suite 405, J&L Building, 251 EDSA, Mandaluyong Metro Manila.</li>
                            <li>Cebu Branch: Unit #1 RGY Bldg, J De Veyra St., NRA, Carreta, Cebu City.</li>
                            <li>Davao Branch: Saavedra Bldg, No.3 Pag-Asa Village, Davao City, Matina Aplaya.</li>
                            <li>CDO Branch: Warehouse #29, Alwana Business Park, Cugman, Cagayan De Oro.</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Delivery Options */}
            <div className="border rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => toggleCard(4)}
                    className="w-full text-left p-4 font-semibold hover:bg-gray-300 flex justify-between items-center"
                >
                    Delivery Options
                    {isOpen[4] ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </button>
                {isOpen[4] && (
                    <div className="p-4 space-y-1 text-xs border-t">
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                Company Truck Delivery: 3-5 working days. Free within Metro Manila for purchases of at least P5,000.00.
                            </li>
                            <li>
                                Free Delivery Outside Metro Manila: Available in Bulacan, Rizal, Pampanga, Cavite, Laguna, and Batangas for purchases of at least P25,000.00.
                            </li>
                            <li>Third-Party Couriers: Available via Lalamove and Grab.</li>
                            <li>Third-Party Services: AP Cargo and Capex.</li>
                            <li>Customer Pickup: Available from our Pasig Warehouse.</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Payment Options */}
            <div className="border rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => toggleCard(5)}
                    className="w-full text-left p-4 font-semibold hover:bg-gray-300 flex justify-between items-center"
                >
                    Payment Options
                    {isOpen[5] ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </button>
                {isOpen[5] && (
                    <div className="p-4 space-y-1 text-xs border-t">
                        <ul className="list-disc list-inside space-y-1">
                            <li>Bank Deposit (BDO and Metrobank)</li>
                            <li>Gcash</li>
                            <li>Credit Card (Client Needs to Visit Head Office to Swipe the Card)</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Warranty */}
            <div className="border rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => toggleCard(6)}
                    className="w-full text-left p-4 font-semibold hover:bg-gray-300 flex justify-between items-center"
                >
                    Warranty
                    {isOpen[6] ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </button>
                {isOpen[6] && (
                    <div className="p-4 space-y-1 text-xs border-t">
                        <p>Standard 1-Year Warranty</p>
                    </div>
                )}
            </div>

            {/* Production Promotion */}
            <div className="border rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => toggleCard(7)}
                    className="w-full text-left p-4 font-semibold hover:bg-gray-300 flex justify-between items-center"
                >
                    Production Promotion
                    {isOpen[7] ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </button>
                {isOpen[7] && (
                    <div className="p-4 space-y-1 text-xs border-t">
                        <p>No details available.</p>
                    </div>
                )}
            </div>

            <div className="border rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => toggleCard(7)}
                    className="w-full text-left p-4 font-semibold hover:bg-gray-300 flex justify-between items-center"
                >
                    Procurement
                    {isOpen[7] ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </button>
                {isOpen[7] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow-md p-4">
                        <div className="p-4 space-y-1 text-xs border-t shadow-md rounded-md">
                            <p className="font-bold">SPF Guidelines</p>
                            <p className="italic">Details Needed</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>RFQ or Proof Bidding Docs</li>
                                <li>Complete Specifications of Items</li>
                                <li>Sales Manager Approval</li>
                                <li>Sales Head Approval</li>
                                <li>2 Million Worth to Proceed</li>
                            </ul>
                        </div>
                        <div className="p-4 space-y-1 text-xs border-t shadow-md rounded-md">
                            <p className="font-bold">TODO: </p>
                            <li>Email for Review to: d.catausan@disruptivesolutionsinc.com</li>
                            <li>CC: Procurement and CS</li>
                            <li>velado@ecoshiftcorp.com, j.matabang@ecoshiftcorp.com, a.dolot@ecoshiftcorp.com, customerservice@ecoshiftcorp.com</li>
                            <li>Engineering Head to Review and Recommend</li>
                            <li>Procurement to Proceed on Sourcing 5-7Days - Sourcing Lead Time Days Extension - For more than 5 items, Saturdays, Sundays, & Holiday not Included</li>
                            <li>Cut Off Time: Monday to Saturday 3:00PM, Saturday Request - For Monday Process</li>
                            <li>NO Local SPF</li>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CSRFaqs;
