import React, { useEffect, useState, useCallback, useMemo } from "react";
import { BsPlusCircle, BsThreeDotsVertical } from "react-icons/bs";

interface OutboundTableProps {
    posts: any[];
}

const getTypeOfClientColor = (type: string) => {
    switch (type) {
        case "Top 50": return "bg-green-300";
        case "Next 30": return "bg-yellow-300";
        case "Below 20": return "bg-orange-300";
        case "New Account - Client Development": return "bg-gray-200";
        case "CSR Inquiries": return "bg-blue-300";
        default: return "bg-white";
    }
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
                sortedPosts.map((post) => (
                    <div key={post._id} className={`relative border-b-2 rounded-md shadow-md p-4 flex flex-col mb-2 ${getTypeOfClientColor(post.type_of_client)}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <BsPlusCircle className="text-gray-700" onClick={() => toggleExpand(post._id)} />
                                <h3 className="text-xs font-semibold uppercase">{post.account_name}</h3>
                            </div>
                        </div>

                        {expandedCards[post._id] && (
                            <div className="mt-4 text-xs capitalize">
                                <p><strong>Contact Person:</strong> {post.contact_person}</p>
                                <p><strong>Contact No.:</strong> {post.contact_number}</p>
                                <p><strong>Email:</strong> {post.email}</p>
                                <p><strong>Address:</strong> {post.address}</p>
                            </div>
                        )}

                        <div className="border-t border-gray-900 mt-3 pt-2 text-xs flex justify-between items-center">
                            <span className="font-bold">{post.type_of_client}</span>
                            <span className="italic capitalize">{post.fullname}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-4 text-sm">No accounts available</div>
            )}
        </div>
    );
};

export default OutboundTable;