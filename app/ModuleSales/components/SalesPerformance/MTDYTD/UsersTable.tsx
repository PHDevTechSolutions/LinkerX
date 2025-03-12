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
    mtdVariance: number;
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
            return activeTab === "MTD"
                ? postDate.getMonth() === today.getMonth() && postDate.getFullYear() === today.getFullYear()
                : postDate.getFullYear() === currentYear;
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
                    mtdVariance: 0,
                    records: [],
                };
            }

            acc[key].records.push(post);
            acc[key].totalSOAmount += post.soamount;
            acc[key].totalActualSales += post.actualsales;
            acc[key].mtdVariance = acc[key].targetQuota - acc[key].totalActualSales;

            return acc;
        }, {});

        setGroupedData(grouped);
    }, [posts, activeTab]);

    return (
        <div className="overflow-x-auto">
            <div className="mb-4 border-b border-gray-200">
                <nav className="flex space-x-4">
                    <button onClick={() => setActiveTab("MTD")} className={`py-2 px-4 text-xs font-medium ${activeTab === "MTD" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}>MTD</button>
                    <button onClick={() => setActiveTab("YTD")} className={`py-2 px-4 text-xs font-medium ${activeTab === "YTD" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}>YTD</button>
                </nav>
            </div>

            <table className="min-w-full bg-white border border-gray-200 text-xs">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-4 border">Agent</th>
                        <th className="py-2 px-4 border">{activeTab === "MTD" ? "Month" : "Year"}</th>
                        <th className="py-2 px-4 border">Target</th>
                        <th className="py-2 px-4 border">SO Amount</th>
                        <th className="py-2 px-4 border">Actual Sales</th>
                        <th className="py-2 px-4 border">Achievement</th>
                        <th className="py-2 px-4 border">Par</th>
                        <th className="py-2 px-4 border">Variance</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(groupedData).length > 0 ? (
                        Object.values(groupedData).map((group) => {
                            const achievement = group.targetQuota > 0 ? (group.totalActualSales / group.targetQuota) * 100 : 0;
                            return (
                                <tr key={group.ReferenceID + group.date_created} className="border-t">
                                    <td className="py-2 px-4 border capitalize font-bold bg-gray-100">{group.AgentFirstname} {group.AgentLastname}<br /><span className="text-gray-900 text-[8px]">({group.ReferenceID})</span></td>
                                    <td className="py-2 px-4 border capitalize">{group.date_created}</td>
                                    <td className="py-2 px-4 border">₱{formatCurrency(group.targetQuota)}</td>
                                    <td className="py-2 px-4 border">₱{formatCurrency(group.totalSOAmount)}</td>
                                    <td className="py-2 px-4 border">₱{formatCurrency(group.totalActualSales)}</td>
                                    <td className="py-2 px-4 border">{achievement.toFixed(2)}%</td>
                                    <td className="py-2 px-4 border">{group.parPercentage.toFixed(2)}%</td>
                                    <td className="py-2 px-4 border text-red-700 font-semibold">₱{formatCurrency(group.mtdVariance)}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={8} className="text-center py-4 border">No accounts available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UsersCard;