import React, { useMemo, useCallback } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { BsThreeDotsVertical } from "react-icons/bs";

// Define interface for props
interface OutboundTableProps {
    posts: any[];
}

// Define row background based on type of client
const getTypeOfClientColor = (type: string) => {
    switch (type) {
        case "Top 50":
            return "bg-green-300";
        case "Next 30":
            return "bg-yellow-300";
        case "Below 20":
            return "bg-orange-300";
        case "New Account - Client Development":
            return "bg-gray-200";
        case "CSR Inquiries":
            return "bg-blue-300";
        default:
            return "";
    }
};

const OutboundTable: React.FC<OutboundTableProps> = ({ posts }) => {
    // Sort posts by start date (latest first)
    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => {
            const dateA = a?.startdate ? new Date(a.startdate).getTime() : 0;
            const dateB = b?.startdate ? new Date(b.startdate).getTime() : 0;
            return dateB - dateA;
        });
    }, [posts]);

    // Render each row using react-window
    const Row = useCallback(({ index, style }: ListChildComponentProps) => {
        const post = sortedPosts[index];
        if (!post) return null;

        const uniqueKey = post?._id || `${post?.referenceid}-${index}`;

        return (
            <div
                style={style}
                key={uniqueKey}
                className={`grid grid-cols-7 text-xs bg-white border-b hover:bg-gray-50 ${getTypeOfClientColor(post?.typeclient)}`}
            >
                <div className="p-3 border capitalize min-w-[200px]">{post?.companyname || "N/A"}</div>
                <div className="p-3 border capitalize min-w-[200px]">{post?.contactperson || "N/A"}</div>
                <div className="p-3 border min-w-[150px]">{post?.contactnumber || "N/A"}</div>
                <div className="p-3 border min-w-[200px]">{post?.emailaddress || "N/A"}</div>
                <div className="p-3 border capitalize min-w-[200px]">{post?.address || "N/A"}</div>
                <div className="p-3 border font-bold capitalize min-w-[150px]">{post?.typeclient || "N/A"}</div>
                <div className="p-3 border italic capitalize min-w-[250px]">
                    {post?.AgentFirstname} {post?.AgentLastname} / {post?.ManagerFirstname} {post?.ManagerLastname}
                </div>
            </div>
        );
    }, [sortedPosts]);

    return (
        <div className="overflow-x-auto max-w-[1360px]">
            {sortedPosts.length > 0 ? (
                <div className="min-w-max">
                    {/* Table header */}
                    <div className="grid grid-cols-7 bg-gray-100 text-left uppercase font-bold border-b text-xs">
                        <div className="p-3 border min-w-[200px]">Account Name</div>
                        <div className="p-3 border min-w-[200px]">Contact Person</div>
                        <div className="p-3 border min-w-[150px]">Contact No.</div>
                        <div className="p-3 border min-w-[200px]">Email</div>
                        <div className="p-3 border min-w-[200px]">Address</div>
                        <div className="p-3 border min-w-[150px]">Type of Client</div>
                        <div className="p-3 border min-w-[250px]">Assigned To</div>
                    </div>

                    {/* Virtualized list */}
                    <List
                        height={500} // Height of the scrollable area
                        itemCount={sortedPosts.length} // Number of rows
                        itemSize={50} // Height of each row
                        width="100%" // Full width
                    >
                        {Row}
                    </List>
                </div>
            ) : (
                <div className="text-center py-4 text-sm">No accounts available</div>
            )}
        </div>
    );
};

export default OutboundTable;
