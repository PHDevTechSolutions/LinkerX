import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Doughnut Chart
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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
    const [showModal, setShowModal] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    const chartData = {
        labels: ["Outbound Call", "Inbound Call"],
        datasets: [
            {
                data: [
                    callData.dailyOutbound || 0, // Total Outbound Calls
                    callData.dailyInbound || 0, // Total Inbound Calls
                ],
                backgroundColor: ["#990000", "#000068"], // Colors for the segments
                hoverOffset: 4,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {},
            datalabels: {
                color: "#FFFFFF",
                font: {
                    weight: "bold" as "bold",
                    size: 14,
                },
                formatter: (value: number) => value,
            },
        },
    };

    useEffect(() => {
        // This ensures that the form is correctly populated when userDetails changes
        setReferenceID(userDetails.ReferenceID);
    }, [userDetails]);

    useEffect(() => {
        fetchProgressData();
    }, [ReferenceID]);

    const fetchProgressData = async () => {
        try {
            const response = await fetch(
                `/api/ModuleSales/Task/Historical/FetchActualSales?referenceid=${encodeURIComponent(ReferenceID)}`
            );
            const data = await response.json();

            if (!data.success) {
                console.error("Failed to fetch progress data:", data.error);
                return;
            }

            const today = new Date();
            const startOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
            const startOfYear = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
            const endOfToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));

            // ⬇️ 1. Filter based on selected date range
            const filteredData = data.data.filter((item: any) => {
                const itemDate = new Date(item.date_created);
                const itemDateStr = itemDate.toISOString().split("T")[0];

                return (!startdate || itemDateStr >= startdate) &&
                    (!enddate || itemDateStr <= enddate);
            });

            // ⬇️ 2. Process filtered data for charts, tables, etc.
            setTimeMotionData(computeTimeSpent(filteredData));
            setTouchbaseData(countTouchBase(filteredData));
            setCallData(computeCallSummary(filteredData));
            setActivityData(countActivities(filteredData));

            // ⬇️ 3. Compute month-to-date and year-to-date based on filtered data
            let totalActualSales = 0;
            let monthToDateSales = 0;
            let yearToDateSales = 0;

            filteredData.forEach((item: any) => {
                const actualSales = parseFloat(item.actualsales);
                if (isNaN(actualSales) || actualSales === 0) return;

                const itemDate = new Date(item.date_created);

                totalActualSales += actualSales;

                if (itemDate >= startOfYear && itemDate <= endOfToday) {
                    yearToDateSales += actualSales;
                }

                if (itemDate >= startOfMonth && itemDate <= endOfToday) {
                    monthToDateSales += actualSales;
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

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        return `${hours}h ${minutes}m ${secs}s`;
    };

    const handleApplyFilter = async () => {
        if (startdate && enddate) {
            setShowModal(false);   // Close modal
            setIsLoading(true);    // Show loading animation

            // Wait 5 seconds, then fetch data and stop loading
            setTimeout(async () => {
                await fetchProgressData();
                setIsLoading(false);  // Stop loading
            }, 3000);
        } else {
            alert("Please select both start and end dates.");
        }
    };

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-sm font-semibold mb-4">Filter the date to generate data</h2>
                        <div className="grid grid-cols-1 gap-4 mb-4">
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
                        <button
                            onClick={handleApplyFilter}
                            className="w-full bg-blue-500 text-white py-2 rounded text-xs hover:bg-blue-600"
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white bg-opacity-70">
                    <div className="flex flex-col items-center">
                        <span className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></span>
                        <p className="mt-3 text-sm text-blue-600">Loading data...</p>
                    </div>
                </div>
            )}

            {!isLoading && !showModal && (
                <form className="bg-white shadow-md rounded-lg p-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {/* Chart Doughnut */}
                        <div className="border rounded-lg p-4 text-center">
                            <h3 className="font-semibold text-sm mb-2">Call Activity Chart</h3>
                            <p className="text-xs text-gray-600 mb-4">
                                This chart provides a visual representation of daily call activities, categorized into outbound calls, inbound calls, and other related activities. It helps in analyzing call distribution and performance trends over time.
                            </p>
                            <Doughnut data={chartData} options={chartOptions} />
                        </div>

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

                        {/* Time Motion */}
                        <div className="border rounded-lg p-4 text-center overflow-x-auto">
                            <h3 className="font-semibold text-sm mb-2">Daily Time and Motion Analysis</h3>
                            <p className="text-gray-600 mt-1 mb-4 text-xs">
                                This summary provides an overview of time spent on client interactions, outbound calls, and other activities. It helps in assessing productivity and optimizing workflow efficiency.
                            </p>
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                                        <th className="px-6 py-4 font-semibold text-gray-700">Client Engagement</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Outbound Calls</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Other Activities</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left">{formatDuration(timeMotionData.inbound)}</td>
                                        <td className="px-6 py-4 text-xs text-left">{formatDuration(timeMotionData.outbound)}</td>
                                        <td className="px-6 py-4 text-xs text-left">{formatDuration(timeMotionData.others)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Daily Productivity */}
                        <div className="border rounded-lg p-4 text-center overflow-x-auto">
                            <h3 className="font-semibold text-sm mb-2">Daily Call Productivity Report</h3>
                            <p className="text-gray-600 mt-1 mb-4 text-xs">
                                This table provides an overview of daily and month-to-date (MTD) call productivity, including total outbound calls, successful and unsuccessful attempts, and inbound call volume.
                            </p>
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                                        <th className="px-6 py-4 text-xs text-left">Call Productivity</th>
                                        <th className="px-6 py-4 text-xs text-center">Daily</th>
                                        <th className="px-6 py-4 text-xs text-center">MTD</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left">Total Outbound Calls</td>
                                        <td className="px-6 py-4 text-xs font-semibold">{callData.dailyOutbound || 0}</td>
                                        <td className="px-6 py-4 text-xs font-semibold">{callData.mtdOutbound || 0}</td>
                                    </tr>
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left">Successful Calls</td>
                                        <td className="px-6 py-4 text-xs">{callData.dailySuccessful || 0}</td>
                                        <td className="px-6 py-4 text-xs">{callData.mtdSuccessful || 0}</td>
                                    </tr>
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left">Unsuccessful Calls</td>
                                        <td className="px-6 py-4 text-xs">{callData.dailyUnsuccessful || 0}</td>
                                        <td className="px-6 py-4 text-xs">{callData.mtdUnsuccessful || 0}</td>
                                    </tr>
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left">Total Inbound Calls</td>
                                        <td className="px-6 py-4 text-xs">{callData.dailyInbound || 0}</td>
                                        <td className="px-6 py-4 text-xs">{callData.mtdInbound || 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Quote Productivity */}
                        <div className="border rounded-lg p-4 text-center overflow-x-auto">
                            <h3 className="font-semibold text-sm mb-2">Quotation Productivity Overview</h3>
                            <p className="text-gray-600 mt-1 mb-4 text-xs">
                                This table presents a summary of quotation-related activities, including new account development and quotes prepared for existing clients. The data is categorized into daily and month-to-date (MTD) metrics.
                            </p>
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                                        <th className="px-6 py-4 text-xs text-left">Quotation Productivity</th>
                                        <th className="px-6 py-4 text-xs text-center">Daily</th>
                                        <th className="px-6 py-4 text-xs text-center">MTD</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left">New Account Development</td>
                                        <td className="px-6 py-4 text-xs text-center">{activityData["Account Development"] || 0}</td>
                                        <td className="px-6 py-4 text-xs text-center">{activityData["Account Development"] || 0}</td>
                                    </tr>
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left">Existing Client</td>
                                        <td className="px-6 py-4 text-xs text-center">{activityData["Preparation: Preparation of Quote: Existing Client"] || 0}</td>
                                        <td className="px-6 py-4 text-xs text-center">{activityData["Preparation: Preparation of Quote: Existing Client"] || 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Performance */}
                        <div className="border rounded-lg p-4 text-center overflow-x-auto">
                            <h3 className="font-semibold text-sm mb-2">Sales Performance Summary</h3>
                            <p className="text-gray-600 mt-1 mb-4 text-xs">
                                This table provides an overview of sales performance, tracking actual sales from Sales Orders (SO) to Delivery Receipts (DR). Metrics include Month-to-Date (MTD) and Year-to-Date (YTD) sales figures.
                            </p>
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                                        <th className="px-6 py-4 text-xs text-left">Sales Performance</th>
                                        <th className="px-6 py-4 text-xs text-center">SO to DR (Actual Sales)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left">Month to Date</td>
                                        <td className="px-6 py-4 text-xs text-center">{formatCurrency(countsales["MonthToDateSales"] || 0)}</td>
                                    </tr>
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left">Year to Date</td>
                                        <td className="px-6 py-4 text-xs text-center">{formatCurrency(countsales["YearToDateSales"] || 0)}</td>
                                    </tr>
                                    <tr className="border-b whitespace-nowrap">
                                        <td className="px-6 py-4 text-xs text-left font-bold">Total Actual Sales</td>
                                        <td className="px-6 py-4 text-xs text-center font-bold">{formatCurrency(countsales["TotalActualSales"] || 0)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 col-span-3 mt-6 overflow-x-auto">
                        <h3 className="font-semibold text-sm mb-2">Daily Activity Summary</h3>
                        <p className="text-gray-600 mt-1 mb-4 text-xs">
                            A detailed breakdown of time spent on various daily activities, providing insights into productivity and task distribution.
                        </p>
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                                    <th className="px-6 py-4 text-xs text-left">Daily Activities Breakdown</th>
                                    <th className="px-6 py-4 text-xs text-left">Time Spent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.entries(timeMotionData)
                                    .filter(([activity]) => validActivities.has(activity)) // Filter only valid activities
                                    .sort(([a], [b]) => a.localeCompare(b)) // Sort activities alphabetically
                                    .map(([activity, duration]) => (
                                        <tr key={activity} className="border-b whitespace-nowrap">
                                            <td className="px-6 py-4 text-xs text-left">{activity}</td>
                                            <td className="px-6 py-4 text-xs text-left font-bold">{formatDuration(duration)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </form>
            )}

            <ToastContainer className="text-xs" autoClose={1000} />
        </>
    );
};

export default AddUserForm;
