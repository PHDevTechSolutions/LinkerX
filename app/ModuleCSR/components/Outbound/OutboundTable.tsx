import React, { useEffect, useState, useCallback, useMemo } from "react";
import { BsPlusCircle, BsThreeDotsVertical } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";

interface OutboundTableProps {
    posts: any[];
}

const getTypeOfClientColor = (type: string) => {
    switch (type) {
        case "Successful Call": return "border-green-800";
        case "Unsuccessful Call": return "border-red-800";
        default: return "bg-white";
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
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

    const toggleExpand = useCallback((postId: string) => {
        setExpandedCards((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    }, []);

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => {
            const dateA = a.start_date ? new Date(a.start_date) : new Date(0);
            const dateB = b.start_date ? new Date(b.start_date) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
    }, [posts]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => {
                    const timeConsumed = post.start_date && post.end_date 
                        ? calculateTimeConsumed(post.start_date, post.end_date)
                        : 'N/A';

                    return (
                        <div key={post._id} className={`relative border-b-2 rounded-md shadow-md p-4 flex flex-col mb-2 ${getTypeOfClientColor(post.call_status)}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <BsPlusCircle size={12} className="text-gray-700" onClick={() => toggleExpand(post._id)} />
                                    <h3 className="text-xs font-semibold uppercase">{post.account_name}</h3>
                                </div>
                            </div>

                            {expandedCards[post._id] && (
                                <div className="mt-4 text-xs capitalize">
                                    <p><strong>Contact Person:</strong> {post.contact_person}</p>
                                    <p><strong>Contact Number:</strong> {post.contact_number}</p>
                                    <p><strong>Email:</strong> {post.email}</p>
                                    <p className="mt-4"><strong>Type of Client:</strong> {post.type_of_client}</p>
                                    <p><strong>Type of Call:</strong> {post.type_of_call}</p>
                                    <p><strong>Call Status:</strong> {post.call_status}</p>
                                    <div className="border-t border-gray-800 pb-4 mt-4"></div>
                                    <p><strong>Remarks:</strong><span className="lowercase"> {post.remarks} </span></p>
                                </div>
                            )}

                            <div className="border-t border-gray-900 mt-3 pt-2 text-xs flex justify-between items-center">
                                <span className="italic capitalize">{post.agent_fullname} / {post.tsm_fullname}</span>
                                <span className="italic">{timeConsumed}</span>
                            </div>
                            <div className="border-t border-gray-900 mt-3 pt-2 text-xs flex gap-2">
                              <CiClock2 size={13} className="text-gray-900" />
                              <span className="italic capitalize">
                                <strong>Call Duration:</strong> {post.start_date} - {post.end_date}
                                </span>
                              </div>

                        </div>
                    );
                })
            ) : (
                <div className="col-span-full text-center py-4 text-sm">No accounts available</div>
            )}
        </div>
    );
};

export default OutboundTable;
