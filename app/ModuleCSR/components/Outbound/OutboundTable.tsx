import React, { useEffect, useState, useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";

interface OutboundTableProps {
    posts: any[];
}

const getTypeOfClientColor = (type: string) => {
    switch (type) {
        case "Successful Call": return "bg-green-100";
        case "Unsuccessful Call": return "bg-red-100";
        default: return "";
    }
};

const calculateTimeConsumed = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInSeconds = (end.getTime() - start.getTime()) / 1000;

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = Math.floor(diffInSeconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
};

const OutboundTable: React.FC<OutboundTableProps> = ({ posts }) => {
    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => {
            const dateA = a.start_date ? new Date(a.start_date) : new Date(0);
            const dateB = b.start_date ? new Date(b.start_date) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
    }, [posts]);

    return (
        <div className="overflow-x-auto">
            {sortedPosts.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 text-xs">
                    <thead>
                        <tr className="bg-gray-100 text-left uppercase font-bold border-b">
                            <th className="p-3 border">Account Name</th>
                            <th className="p-3 border">Contact Person</th>
                            <th className="p-3 border">Contact Number</th>
                            <th className="p-3 border">Email</th>
                            <th className="p-3 border">Type of Client</th>
                            <th className="p-3 border">Type of Call</th>
                            <th className="p-3 border">Call Status</th>
                            <th className="p-3 border">Remarks</th>
                            <th className="p-3 border">Agent / TSM</th>
                            <th className="p-3 border">Call Duration</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPosts.map((post) => {
                            const timeConsumed = post.start_date && post.end_date
                                ? calculateTimeConsumed(post.start_date, post.end_date)
                                : "N/A";

                            return (
                                <tr key={post._id} className={`border-b hover:bg-gray-50 ${getTypeOfClientColor(post.call_status)}`}>
                                    <td className="p-3 border">{post.account_name}</td>
                                    <td className="p-3 border">{post.contact_person}</td>
                                    <td className="p-3 border">{post.contact_number}</td>
                                    <td className="p-3 border">{post.email}</td>
                                    <td className="p-3 border">{post.type_of_client}</td>
                                    <td className="p-3 border">{post.type_of_call}</td>
                                    <td className="p-3 border">{post.call_status}</td>
                                    <td className="p-3 border">{post.remarks}</td>
                                    <td className="p-3 border italic">{post.agent_fullname} / {post.tsm_fullname}</td>
                                    <td className="p-3 border flex items-center gap-2">
                                        <CiClock2 size={13} className="text-gray-900" />
                                        <span className="italic">{post.start_date} - {post.end_date} ({timeConsumed})</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-4 text-sm">No accounts available</div>
            )}
        </div>
    );
};

export default OutboundTable;
