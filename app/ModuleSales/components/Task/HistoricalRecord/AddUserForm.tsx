import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface AddPostFormProps {
    userDetails: {
        id: string;
        ReferenceID: string;
    };
    onCancel: () => void;
}

const INBOUND_ACTIVITIES = [
    "Inbound Call",
    "Assisting Other Agents Client",
    "Preparation: Bidding Preparation",
    "Client Meeting",
    "Site Visit",
    "Coordination of Pick-Up / Delivery to Client",
    "Email and Viber Checking",
    "Email Blast",
    "Email, SMS & Viber Replies",
    "Inbound Call - Existing",
    "Payment Follow-Up",
    "Quotation Follow-Up",
    "Preparation: Preparation of Quote: Existing Client",
    "Preparation: Preparation of Quote: New Client",
    "Preparation: Preparation of Report",
    "Walk-In Client",
];

const AddUserForm: React.FC<AddPostFormProps> = ({ userDetails }) => {
    // Initialize state with the userDetails props, using default values in case of missing fields
    const [ReferenceID, setReferenceID] = useState(userDetails.ReferenceID || "");
    const [startdate, setStartdate] = useState("");
    const [enddate, setEnddate] = useState("");
    const [timeMotionData, setTimeMotionData] = useState({ inbound: 0, outbound: 0, others: 0 });
    const [touchbaseData, setTouchbaseData] = useState<Record<string, number>>({});
    const [callData, setCallData] = useState({ dailyInbound: 0, dailyOutbound: 0, dailySuccessful: 0, dailyUnsuccessful: 0, mtdInbound: 0, mtdOutbound: 0, mtdSuccessful: 0, mtdUnsuccessful: 0, });
    const [activityData, setActivityData] = useState<Record<string, number>>({});
    const [countsales, setCountsales] = useState<Record<string, number>>({});

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().toISOString().slice(0, 7);

    useEffect(() => {
        // This ensures that the form is correctly populated when userDetails changes
        setReferenceID(userDetails.ReferenceID);
    }, [userDetails]);

    useEffect(() => {
        fetchProgressData();
    }, [ReferenceID]);

    // Fetch data when date range changes
    useEffect(() => {
        fetchProgressData();
    }, [startdate, enddate]);

    const fetchProgressData = async () => {
        try {
            const response = await fetch(
                `/api/ModuleSales/Agents/SalesAssociateActivity/FetchProgress?referenceid=${encodeURIComponent(ReferenceID)}`
            );
            const data = await response.json();

            if (!data.success) {
                console.error("Failed to fetch progress data:", data.error);
                return;
            }

            const filteredData = data.data.filter((item: any) => {
                const itemDate = new Date(item.date_created).toISOString().split("T")[0];
                return (!startdate || itemDate >= startdate) && (!enddate || itemDate <= enddate);
            });

            setTimeMotionData(computeTimeSpent(filteredData));
            setTouchbaseData(countTouchBase(filteredData));
            setCallData(computeCallSummary(filteredData));
            setActivityData(countActivities(filteredData));

            let totalActualSales = 0;
            let monthToDateSales = 0;
            let yearToDateSales = 0;

            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();

            filteredData.forEach((item: any) => {
                // Convert 'actualsales' to number safely using a helper function
                const actualSales = isNaN(Number(item.actualsales)) ? 0 : Number(item.actualsales);

                totalActualSales += actualSales;

                if (new Date(item.date_created).getMonth() + 1 === currentMonth) {
                    monthToDateSales += actualSales;
                }

                if (new Date(item.date_created).getFullYear() === currentYear) {
                    yearToDateSales += actualSales;
                }
            });

            setCountsales({
                MonthToDateSales: monthToDateSales,
                YearToDateSales: yearToDateSales,
                TotalActualSales: totalActualSales,
            });
        } catch (error) {
            console.error("Error fetching progress data:", error);
        }
    };

    const computeTimeSpent = (data: any[]) => {
        return data.reduce(
            (acc: { inbound: number; outbound: number; others: number } & Record<string, number>, item) => {
                if (item.startdate && item.enddate) {
                    const duration = (new Date(item.enddate).getTime() - new Date(item.startdate).getTime()) / 1000;

                    if (INBOUND_ACTIVITIES.includes(item.typeactivity)) {
                        acc.inbound += duration;
                    } else if (item.typeactivity === "Outbound Call") {
                        acc.outbound += duration;
                    } else {
                        acc.others += duration;
                    }

                    // List of valid activity keys
                    const validActivities = new Set([
                        "Account Development",
                        "Accounting: Accounts Receivable and Payment",
                        "Accounting: Billing Concern",
                        "Accounting: Refund Request",
                        "Accounting: Sales Order Concern",
                        "Accounting: TPC Request",
                        "Admin Concern: Coordination of Payment Terms Request",
                        "CSR Inquiries",
                        "Coordination of Pick-Up / Delivery to Client",
                        "Coordination With CS (Email Acknowledgement)",
                        "Marketing Concern",
                        "Email and Viber Checking",
                        "Email Blast",
                        "Email, SMS & Viber Replies",
                        "Inbound Call",
                        "Payment Follow-Up",
                        "Quotation Follow-Up",
                        "Logistic Concern: Shipping Cost Estimation",
                        "Outbound Call",
                        "Preparation: Bidding Preparation",
                        "Preparation: Preparation of Report",
                        "Preparation: Preparation of SPF",
                        "Preparation: Preparation of Quote: New Client",
                        "Preparation: Preparation of Quote: Existing Client",
                        "Preparation: Sales Order Preparation",
                        "Technical: Dialux Simulation Request",
                        "Technical: Drawing Request",
                        "Technical: Inquiry",
                        "Technical: Site Visit Request",
                        "Technical: TDS Request",
                        "Walk-In Client",
                        "Warehouse: Coordination to Billing",
                        "Warehouse: Coordination to Dispatch",
                        "Warehouse: Coordination to Inventory",
                        "Warehouse: Delivery / Helper Concern",
                        "Warehouse: Replacement Request / Concern",
                        "Warehouse: Sample Request / Concern",
                        "Warehouse: SO Status Follow Up",
                    ]);

                    if (validActivities.has(item.typeactivity)) {
                        acc[item.typeactivity] = (acc[item.typeactivity] || 0) + duration;
                    }
                }
                return acc;
            },
            {
                inbound: 0,
                outbound: 0,
                others: 0,
            } as { inbound: number; outbound: number; others: number } & Record<string, number>
        );
    };

    const computeCallSummary = (data: any[]): {
        dailyInbound: number;
        dailyOutbound: number;
        dailySuccessful: number;
        dailyUnsuccessful: number;
        mtdInbound: number;
        mtdOutbound: number;
        mtdSuccessful: number;
        mtdUnsuccessful: number;
    } => {
        return data.reduce(
            (acc, item) => {
                const itemDate = item.date_created.split("T")[0];
                const itemMonth = item.date_created.slice(0, 7);

                const isWithinDateRange =
                    (!startdate || itemDate >= startdate) && (!enddate || itemDate <= enddate);

                if (isWithinDateRange) {
                    if (item.typeactivity === "Inbound Call") {
                        acc.dailyInbound += 1;
                    }
                    if (item.typeactivity === "Outbound Call") {
                        acc.dailyOutbound += 1;
                    }
                    if (item.callstatus === "Successful") {
                        acc.dailySuccessful += 1;
                    } else if (item.callstatus === "Unsuccessful") {
                        acc.dailyUnsuccessful += 1;
                    }

                    // Total Outbound Calls = Successful + Unsuccessful
                    acc.dailyOutbound = acc.dailySuccessful + acc.dailyUnsuccessful;
                }

                if (itemMonth === currentMonth) {
                    if (item.typeactivity === "Inbound Call") {
                        acc.mtdInbound += 1;
                    }
                    if (item.typeactivity === "Outbound Call") {
                        acc.mtdOutbound += 1;
                    }
                    if (item.callstatus === "Successful") {
                        acc.mtdSuccessful += 1;
                    } else if (item.callstatus === "Unsuccessful") {
                        acc.mtdUnsuccessful += 1;
                    }

                    // Total Outbound Calls = Successful + Unsuccessful
                    acc.mtdOutbound = acc.mtdSuccessful + acc.mtdUnsuccessful;
                }

                return acc;
            },
            {
                dailyInbound: 0,
                dailyOutbound: 0,
                dailySuccessful: 0,
                dailyUnsuccessful: 0,
                mtdInbound: 0,
                mtdOutbound: 0,
                mtdSuccessful: 0,
                mtdUnsuccessful: 0,
            }
        );
    };

    const countActivities = (data: any[]) =>
        data.reduce((acc: Record<string, number>, item) => {
            if (["Account Development", "Preparation: Preparation of Quote: Existing Client"].includes(item.typeactivity)) {
                acc[item.typeactivity] = (acc[item.typeactivity] || 0) + 1;
            }
            return acc;
        }, {});

    const countTouchBase = (data: any[]) =>
        data.reduce((acc: Record<string, number>, item) => {
            if (item.typecall === "Touch Base") {
                const key = `${item.typeclient}-${item.typecall}`;
                acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
        }, {});

    return (
        <>
            <form className="bg-white shadow-md rounded-lg p-4 text-xs">
                {/* User Information Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Reference ID */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold">Reference ID</label>
                        <input
                            type="text"
                            value={ReferenceID}
                            onChange={(e) => setReferenceID(e.target.value)}
                            className="p-2 border rounded-lg"
                        />
                    </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                        <label className="text-xs font-medium text-gray-600">Start Date</label>
                        <input
                            type="date"
                            value={startdate}
                            onChange={(e) => setStartdate(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-600">End Date</label>
                        <input
                            type="date"
                            value={enddate}
                            onChange={(e) => setEnddate(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Touch Base Summary */}
                    <div className="border rounded-lg p-4 text-center overflow-x-auto">
                        <h3 className="font-semibold text-sm mb-2">Client Engagement Overview</h3>
                        <p className="text-gray-600 mt-1 mb-4 text-xs">
                            This table provides a summary of client interactions, categorized by client type. It helps in tracking engagement levels and understanding communication patterns.
                        </p>
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                                    <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-center">Counts</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.entries(touchbaseData).map(([key, count], index) => {
                                    const [typeclient] = key.split("-");
                                    return (
                                        <tr key={index} className="border-b whitespace-nowrap">
                                            <td className="px-6 py-4 text-xs text-left">{typeclient}</td>
                                            <td className="px-6 py-4 px-2 py-1 text-center">{count}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>

            <ToastContainer className="text-xs" autoClose={1000} />
        </>
    );
};

export default AddUserForm;
