import React, { useEffect, useState } from "react";

interface UsersCardProps {
    posts: any[];
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
    const [groupedUsers, setGroupedUsers] = useState<any[]>([]);
    const [totals, setTotals] = useState({
        totalOutbound: 0,
        totalSuccessful: 0,
        totalInbound: 0,
        totalCalls: 0,
    });

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10; // Number of items per page

    useEffect(() => {
        let totalOutbound = 0;
        let totalSuccessful = 0;
        let totalInbound = 0;
        let totalCalls = 0;

        const grouped = posts.reduce((acc, post) => {
            const key = `${post.AgentFirstname} ${post.AgentLastname}`;
            if (!acc[key]) {
                acc[key] = {
                    AgentFirstname: post.AgentFirstname,
                    AgentLastname: post.AgentLastname,
                    ReferenceID: post.referenceid,
                    TotalOutbound: 0,
                    Successful: 0,
                    InboundCall: 0,
                    TotalCalls: 0,
                };
            }

            // Count based on typecall "touchbase"
            if (post.typecall === "Touch Base") {
                acc[key].TotalOutbound += 1;
                acc[key].TotalCalls += 1;
                totalOutbound += 1;
                totalCalls += 1;
            }

            if (post.typeactivity === "Inbound Call") {
                acc[key].InboundCall += 1;
                totalInbound += 1;
            }
            if (post.callstatus === "Successful") {
                acc[key].Successful += 1;
                totalSuccessful += 1;
            }

            return acc;
        }, {} as Record<string, any>);

        const sortedUsers = Object.values(grouped).sort(
            (a: any, b: any) => b.TotalCalls - a.TotalCalls
        );

        setGroupedUsers(sortedUsers);
        setTotals({ totalOutbound, totalSuccessful, totalInbound, totalCalls });

        // Reset to first page when data changes
        setCurrentPage(1);
    }, [posts]);

    // Pagination Logic
    const totalPages = Math.ceil(groupedUsers.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentUsers = groupedUsers.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="overflow-x-auto px-2">
            {/* Cards for Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[ 
                    { title: "Total Outbound", value: totals.totalOutbound, bg: "bg-blue-900" },
                    { title: "Successful Calls", value: totals.totalSuccessful, bg: "bg-red-700" },
                    { title: "Inbound Calls", value: totals.totalInbound, bg: "bg-green-900" },
                    { title: "Total Calls", value: totals.totalCalls, bg: "bg-orange-500" },
                ].map((card, index) => (
                    <div key={index} className={`p-4 ${card.bg} text-white shadow rounded-lg text-center`}>
                        <h3 className="text-xs md:text-sm font-semibold">{card.title}</h3>
                        <p className="text-lg md:text-xl font-bold">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 text-xs md:text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-center text-xs">
                            <th className="py-2 px-4 border">Rank</th>
                            <th className="py-2 px-4 border">Agent</th>
                            <th className="py-2 px-4 border">Total Outbound</th>
                            <th className="py-2 px-4 border">Successful</th>
                            <th className="py-2 px-4 border">Inbound Call</th>
                            <th className="py-2 px-4 border">Total Calls</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((agent, index) => (
                                <tr key={index} className="border-t text-center text-xs">
                                    <td className="py-2 px-4 font-bold">
                                        <span
                                            className={`w-full rounded-lg p-2 text-[10px] ${
                                                index === 0
                                                    ? "bg-green-300"
                                                    : index === 1
                                                    ? "bg-gray-300"
                                                    : index >= 2 && index <= 9
                                                    ? "bg-yellow-300"
                                                    : "bg-red-300"
                                            }`}
                                        >
                                            Rank {indexOfFirstPost + index + 1}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 capitalize">
                                        {agent.AgentFirstname} {agent.AgentLastname}
                                        <br />
                                        <span className="text-gray-900 text-[10px]">({agent.ReferenceID})</span>
                                    </td>
                                    <td className="py-2 px-4 text-red-700 font-semibold">
                                        {agent.TotalOutbound}
                                    </td>
                                    <td className="py-2 px-4 text-green-700 font-semibold">
                                        {agent.Successful}
                                    </td>
                                    <td className="py-2 px-4">{agent.InboundCall}</td>
                                    <td className="py-2 px-4 font-bold">{agent.TotalCalls}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 border">
                                    No accounts available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 text-xs">
                    <button
                        className="bg-gray-200 px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    <button
                        className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-4">
                        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>
                    <button
                        className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </button>
                    <button
                        className="bg-gray-200 px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                </div>
            )}
        </div>
    );
};

export default UsersCard;
