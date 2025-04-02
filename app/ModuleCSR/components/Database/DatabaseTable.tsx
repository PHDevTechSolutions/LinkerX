import React, { useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

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
        default: return "";
    }
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
                            <th className="p-3 border">Contact No.</th>
                            <th className="p-3 border">Email</th>
                            <th className="p-3 border">Address</th>
                            <th className="p-3 border">Type of Client</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Assigned To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPosts.map((post) => (
                            <tr key={post._id} className={`border-b hover:bg-gray-50 ${getTypeOfClientColor(post.type_of_client)}`}>
                                <td className="p-3 border">{post.account_name}</td>
                                <td className="p-3 border">{post.contact_person}</td>
                                <td className="p-3 border">{post.contact_number}</td>
                                <td className="p-3 border">{post.email}</td>
                                <td className="p-3 border">{post.address}</td>
                                <td className="p-3 border font-bold">{post.type_of_client}</td>
                                <td className="p-3 border">{post.status}</td>
                                <td className="p-3 border italic capitalize">{post.fullname}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-4 text-sm">No accounts available</div>
            )}
        </div>
    );
};

export default OutboundTable;
