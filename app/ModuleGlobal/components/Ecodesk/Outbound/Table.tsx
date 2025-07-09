import React, { useMemo, useCallback } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { CiClock2 } from "react-icons/ci";

// Define interface for props
interface OutboundTableProps {
    posts: any[];
}

// Define CSS properties for row styling
const getTypeOfClientColor = (type: string) => {
    switch (type) {
        case "Successful Call":
            return "bg-green-100";
        case "Unsuccessful Call":
            return "bg-red-100";
        default:
            return "";
    }
};

// Calculate time consumed between start and end date
const calculateTimeConsumed = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return "N/A";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInSeconds = (end.getTime() - start.getTime()) / 1000;

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = Math.floor(diffInSeconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
};

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
  
    // Use UTC getters instead of local ones to prevent timezone shifting.
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // if hour is 0, display as 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  
    // Use toLocaleDateString with timeZone 'UTC' to format the date portion
    const formattedDateStr = date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  
    // Return combined date and time string
    return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
  };

const OutboundTable: React.FC<OutboundTableProps> = ({ posts }) => {
    // Filter to include only "Outbound Call" type clients
    const filteredPosts = useMemo(() => {
        return posts.filter((post) => post?.typeactivity === "Outbound Call");
    }, [posts]);

    // Sort posts by start date (latest first)
    const sortedPosts = useMemo(() => {
        return [...filteredPosts].sort((a, b) => {
            const dateA = a?.startdate ? new Date(a.startdate).getTime() : 0;
            const dateB = b?.startdate ? new Date(b.startdate).getTime() : 0;
            return dateB - dateA;
        });
    }, [filteredPosts]);

    // Render each row using react-window
    const Row = useCallback(({ index, style }: ListChildComponentProps) => {
        const post = sortedPosts[index];
        if (!post) return null;

        const timeConsumed = calculateTimeConsumed(post?.startdate, post?.enddate);
        const uniqueKey = post?._id || `${post?.referenceid}-${index}`;
        

        return (
            <div
                style={style}
                key={uniqueKey}
                className={`grid grid-cols-10 text-xs bg-white border-b hover:bg-gray-50 ${getTypeOfClientColor(post?.callstatus)}`}
            >
                <div className="px-6 py-4 text-xs capitalize min-w-[200px]">{post?.companyname || "N/A"}</div>
                <div className="px-6 py-4 text-xs capitalize min-w-[200px]">{post?.contactperson || "N/A"}</div>
                <div className="px-6 py-4 text-xs min-w-[150px]">{post?.contactnumber || "N/A"}</div>
                <div className="px-6 py-4 text-xs min-w-[200px]">{post?.emailaddress || "N/A"}</div>
                <div className="px-6 py-4 text-xs min-w-[150px]">{post?.typeclient || "N/A"}</div>
                <div className="px-6 py-4 text-xs min-w-[150px]">{post?.typecall || "N/A"}</div>
                <div className="px-6 py-4 text-xs min-w-[150px]">{post?.callstatus || "N/A"}</div>
                <div className="px-6 py-4 text-xs capitalize min-w-[200px]">{post?.remarks || "N/A"}</div>
                <div className="px-6 py-4 text-xs italic capitalize min-w-[250px]">
                    {post?.AgentFirstname} {post?.AgentLastname} / {post?.ManagerFirstname} {post?.ManagerLastname}
                </div>
                <div className="px-6 py-4 text-xs flex items-center gap-2 min-w-[300px]">
                    <CiClock2 size={13} className="text-gray-900" />
                    <span className="italic">
                        {formatDate(post.startdate)} - {formatDate(post.enddate)} / ({timeConsumed})
                    </span>
                </div>
            </div>
        );
    }, [sortedPosts]);

    return (
        <div className="overflow-x-auto max-w-[1360px]">
            {sortedPosts.length > 0 ? (
                <div className="min-w-max">
                    {/* Table header */}
                    <div className="grid grid-cols-10 bg-gray-100 text-left uppercase font-bold text-xs whitespace-nowrap border-l-4 border-emerald-400">
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[200px]">Account Name</div>
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[200px]">Contact Person</div>
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[150px]">Contact Number</div>
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[200px]">Email</div>
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[150px]">Type of Client</div>
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[150px]">Type of Call</div>
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[150px]">Call Status</div>
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[200px]">Remarks</div>
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[250px]">Agent / TSM</div>
                        <div className="px-6 py-4 font-semibold text-gray-700 min-w-[300px]">Call Duration</div>
                    </div>

                    {/* Virtualized list */}
                    <List
                        height={500} // Height of the scrollable area
                        itemCount={sortedPosts.length} // Number of rows
                        itemSize={100} // Height of each row
                        width="100%" // Full width
                    >
                        {Row}
                    </List>
                </div>
            ) : (
                <div className="text-center py-4 text-sm">No outbound calls available</div>
            )}
        </div>
    );
};

export default OutboundTable;
