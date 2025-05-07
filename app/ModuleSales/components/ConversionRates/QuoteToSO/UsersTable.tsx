import React, { useEffect, useState } from "react";

interface Post {
    id: string;
    AgentFirstname: string;
    AgentLastname: string;
    referenceid: string;
    date_created: string;
    targetquota: number;
    soamount: number;
    actualsales: number;
    typeactivity: string;
}

interface GroupedData {
    AgentFirstname: string;
    AgentLastname: string;
    ReferenceID: string;
    date_created: string;
    totalSOAmount: number;
    totalActualSales: number;
    targetQuota: number;
    parPercentage: number;
    preparationQuoteCount: number;
    salesorderCount: number;
    OutboundCalls: number;
    records: Post[];
}

interface UsersCardProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    ReferenceID: string;
    fetchAccount: () => Promise<void>;
}

const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", { minimumFractionDigits: 0 });
};

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
    const [groupedData, setGroupedData] = useState<{ [key: string]: GroupedData }>({});
    const [activeTab, setActiveTab] = useState("MTD");

    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // Default to current month
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Default to current year

    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from(new Array(10), (_, index) => new Date().getFullYear() - index); // Last 10 years

    useEffect(() => {
        const fixedDays = 26;
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        const parPercentages: { [key: number]: number } = {
            1: 8.3, 2: 16.6, 3: 25.0, 4: 33.3, 5: 41.6, 6: 50.0,
            7: 58.3, 8: 66.6, 9: 75.0, 10: 83.3, 11: 91.6, 12: 100.0
        };

        const filteredPosts = posts.filter(post => {
            const postDate = new Date(post.date_created);
            return (
                (selectedMonth === postDate.getMonth() + 1 && selectedYear === postDate.getFullYear()) ||
                (activeTab === "YTD" && postDate.getFullYear() === selectedYear)
            );
        });

        const grouped = filteredPosts.reduce((acc: { [key: string]: GroupedData }, post: Post) => {
            const date = new Date(post.date_created);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const monthName = date.toLocaleString("en-US", { month: "long" });
            const key = activeTab === "MTD"
                ? `${post.AgentFirstname} ${post.AgentLastname} ${monthName} ${year}`
                : `${post.AgentFirstname} ${post.AgentLastname} ${year}`;

            if (!acc[key]) {
                const daysLapsed = activeTab === "MTD" ? Math.min(today.getDate(), fixedDays) : fixedDays * 12;
                const parPercentage = activeTab === "YTD" ? (parPercentages[month] || 0) : (daysLapsed / fixedDays) * 100;

                acc[key] = {
                    AgentFirstname: post.AgentFirstname,
                    AgentLastname: post.AgentLastname,
                    ReferenceID: post.referenceid,
                    date_created: activeTab === "MTD" ? `${monthName} ${year}` : `${year}`,
                    totalSOAmount: 0,
                    totalActualSales: 0,
                    targetQuota: post.targetquota * (activeTab === "YTD" ? 12 : 1),
                    parPercentage,
                    preparationQuoteCount: 0,
                    salesorderCount: 0,
                    OutboundCalls: 0,
                    records: [],
                };
            }

            acc[key].records.push(post);
            acc[key].totalSOAmount += post.soamount;
            acc[key].totalActualSales += post.actualsales;
            acc[key].preparationQuoteCount += post.typeactivity === "Preparation: Preparation of Quote: Existing Client" || post.typeactivity === "Preparation: Preparation of Quote: New Client" ? 1 : 0;
            acc[key].salesorderCount += post.typeactivity === "Preparation: Sales Order Preparation" ? 1 : 0;
            acc[key].OutboundCalls += post.typeactivity === "Outbound Call" ? 1 : 0;

            return acc;
        }, {});

        setGroupedData(grouped);
    }, [posts, activeTab, selectedMonth, selectedYear]);

    return (
        <div className="overflow-x-auto">
            {/* Filter by Month and Year */}
            <div className="mb-4 flex items-center gap-4">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="py-2 px-4 text-xs border shadow-md"
                >
                    {months.map((month, index) => (
                        <option key={index} value={index + 1}>
                            {month}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="py-2 px-4 text-xs border shadow-md"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="mb-4 border-b border-gray-200">
                <nav className="flex space-x-4">
                    <button onClick={() => setActiveTab("MTD")} className={`py-2 px-4 text-xs font-medium ${activeTab === "MTD" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}>MTD</button>
                    <button onClick={() => setActiveTab("YTD")} className={`py-2 px-4 text-xs font-medium ${activeTab === "YTD" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}>YTD</button>
                </nav>
            </div>

            <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                        <th className="px-6 py-4 font-semibold text-gray-700">Agent</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">{activeTab === "MTD" ? "Month" : "Year"}</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Target</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">(MTD) # of Quote</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">(MTD) # of SO</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">% Quote to SO</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Target</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Object.keys(groupedData).length > 0 ? (
                        Object.values(groupedData).map((group) => {
                            const percentageCalls = group.preparationQuoteCount > 0
                                ? (group.salesorderCount / group.preparationQuoteCount) * 100
                                : 0;

                            return (
                                <tr key={group.ReferenceID + group.date_created} className="border-b whitespace-nowrap">
                                    <td className="px-6 py-4 text-xs capitalize font-bold">{group.AgentFirstname} {group.AgentLastname}<br /><span className="text-gray-900 text-[8px]">({group.ReferenceID})</span></td>
                                    <td className="px-6 py-4 text-xs">{group.date_created}</td>
                                    <td className="px-6 py-4 text-xs">₱{formatCurrency(group.targetQuota)}</td>
                                    <td className="px-6 py-4 text-xs">{group.salesorderCount}</td>
                                    <td className="px-6 py-4 text-xs">{group.preparationQuoteCount}</td>
                                    <td className="px-6 py-4 text-xs">{percentageCalls.toFixed(2)}%</td>
                                    <td className="px-6 py-4 text-xs">
                                        {percentageCalls > 30 ? (
                                            <span className="text-green-600 ml-2 mr-2">&#8593;</span>
                                        ) : (
                                            <span className="text-red-600 ml-2 mr-2">&#8595;</span>
                                        )}
                                        30%
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center text-xs py-4 border">No accounts available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UsersCard;
