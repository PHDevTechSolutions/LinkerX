import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { AiOutlineLeft, AiOutlineRight, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

const socket = io("http://localhost:3001");

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const STATUS_COLORS: Record<string, string> = {
    Closed: "bg-gray-100 text-gray-700",
    Endorsed: "bg-blue-300 text-dark",
    "Converted Into Sales": "bg-orange-300 text-dark",
};

const REMARKS_COLORS: Record<string, string> = {
    "No Stocks / Insufficient Stocks": "border-gray-500",
    "Item Not Carried": "border-black",
    "Quotation For Approval": "border-orange-400",
    "Customer Requested Cancellation": "border-red-500",
    "Accreditation / Partnership": "border-blue-500",
    "For Spf": "border-purple-500",
    "No Response From Client": "border-yellow-500",
    Assisted: "border-green-500",
    "Disapproved Quotation": "border-red-600",
    "For Site Visit": "border-indigo-500",
    "Non Standard Item": "border-teal-500",
    "PO Received": "border-green-600",
    "Not Converted to Sales": "border-gray-700",
    "For Occular Inspection": "border-blue-600"
};

interface Post {
    userId: string; _id: string; TicketReferenceNumber: string; userName: string; CompanyName: string;
    CustomerName: string; ContactNumber: string; Email: string; CityAddress: string; CustomerSegment: string;
    Channel: string; Source: string; WrapUp: string; CustomerType: string; TicketEndorsed: string;
    TicketReceived: string; Status: string; Remarks: string; createdAt: string;
}

interface ActivityCardsProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    handleStatusUpdate: (postId: string, newStatus: string) => void;
    handleRemarksUpdate: (postId: string, newRemarks: string) => void;
    userDetails: { 
        id: string; 
        Role: string; 
      };
}

const ActivityCards: React.FC<ActivityCardsProps> = ({ userDetails, posts, handleEdit, handleDelete, handleStatusUpdate, handleRemarksUpdate, }) => {
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [groupedPosts, setGroupedPosts] = useState<Record<string, Record<string, Post[]>>>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});
    const [statusMenuVisible, setStatusMenuVisible] = useState<{ [key: string]: boolean }>({});
    const [remarksMenuVisible, setRemarksMenuVisible] = useState<{ [key: string]: boolean }>({});
    
    const [UserId, setUserId] = useState(userDetails?.id || ""); // Initialize with UserId from userDetails
    const [Role, setRole] = useState(userDetails?.Role || "");


    useEffect(() => {
        if (userDetails?.id) {
          setUserId(userDetails.id);
        }
        if (userDetails?.Role) {
          setRole(userDetails.Role);
        }
      }, [userDetails]);

    useEffect(() => {
        socket.on("newPost", (newPost: Post) => {
            if (!posts.some((post) => post._id === newPost._id)) {
                posts.unshift(newPost);
            }
        });
        return () => {
            socket.off("newPost");
        };
    }, [posts]);

    useEffect(() => {
    const grouped = posts.reduce((acc, post) => {
      const postDate = new Date(post.createdAt);
      const key = `${postDate.toLocaleString("en-US", { month: "short" })} ${postDate.getDate()}-${daysOfWeek[postDate.getDay()].slice(0, 3)}`;
      
      // Group by day
      acc[key] = acc[key] || {};
      // Group by user within the day
      acc[key][post.userName] = acc[key][post.userName] || [];
      acc[key][post.userName].push(post);

      return acc;
    }, {} as Record<string, Record<string, Post[]>>);

    const currentDate = new Date();
    const filteredPosts = Array.from({ length: 4 }, (_, i) => {
      const date = new Date();
      date.setDate(currentDate.getDate() - (3 - i) + currentPage * 4);
      const key = `${date.toLocaleString("en-US", { month: "short" })} ${date.getDate()}-${daysOfWeek[date.getDay()].slice(0, 3)}`;

      return { key, posts: grouped[key] || {} };
    }).reduce((acc, { key, posts }) => ({ ...acc, [key]: posts }), {});

    setGroupedPosts(filteredPosts);
  }, [posts, currentPage]);

    const toggleExpand = (postId: string) => {
        setExpandedCards((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;
        if (source.droppableId !== destination.droppableId) {
            handleStatusUpdate(draggableId, destination.droppableId);
        }
    };

    const toggleMenu = (postId: string) => {
        setMenuVisible({ [postId]: !menuVisible[postId] });
        setStatusMenuVisible({});
        setRemarksMenuVisible({});
    };

    const toggleStatusMenu = (postId: string) => {
        setStatusMenuVisible({ [postId]: !statusMenuVisible[postId] });
        setRemarksMenuVisible({});
    };

    const toggleRemarksMenu = (postId: string) => {
        setRemarksMenuVisible({ [postId]: !remarksMenuVisible[postId] });
        setStatusMenuVisible({});
    };

    const updateStatus = (postId: string, newStatus: string) => {
        handleStatusUpdate(postId, newStatus);
        setStatusMenuVisible({});
    };

    const updateRemarks = (postId: string, newRemarks: string) => {
        handleRemarksUpdate(postId, newRemarks);
        setRemarksMenuVisible({});
    };

    const formatDate = (timestamp: string) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp).toLocaleString("en-US", {
            year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true,
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="col-span-4 items-center mb-4 text-xs flex justify-end space-x-2">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} className="p-1 bg-gray-300 rounded"><AiOutlineLeft /></button>
                <button onClick={() => setCurrentPage((prev) => prev + 1)} className="p-1 bg-gray-300 rounded"><AiOutlineRight /></button>
            </div>
            {Object.entries(groupedPosts).map(([day, posts]) => (
                <div key={day} className="bg-white">
                    <h2 className="text-xs font-bold mb-2 text-center"><span>{day}</span></h2>

                    {/* Iterate through each user */}
                    <div className="grid grid-cols-1 border">
                        {Object.entries(posts).map(([userName, userPosts]) => (
                            <div key={userName} className="p-3">
                                <h3 className="text-xs font-semibold mb-2 capitalize">{userName}</h3>
                                {userPosts.map((post) => {
                                    const statusClass = REMARKS_COLORS[post.Remarks] || "bg-gray-100 text-gray-800";
                                    const circleColor = STATUS_COLORS[post.Status] || "bg-gray-300";
                                    return (
                                        <div key={post._id} className={`relative border-b-2 rounded-md shadow-md p-4 flex flex-col mb-2 ${statusClass}`}>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-3 h-3 border border-black shadow-xl rounded-full ${circleColor}`}></span>
                                                    <h3 className="text-xs font-semibold capitalize">
                                                        {post.TicketReferenceNumber}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <button onClick={() => toggleExpand(post._id)} className="text-gray-500 hover:text-gray-800">
                                                        {expandedCards[post._id] ? <AiOutlineMinus size={12} /> : <AiOutlinePlus size={12} />}
                                                    </button>
                                                    <button onClick={() => toggleMenu(post._id)} className="text-gray-500 hover:text-gray-800">
                                                        <BsThreeDotsVertical size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            {expandedCards[post._id] && (
                                                <div className="mt-4 text-xs capitalize flex-grow">
                                                    <p><strong>Company:</strong> {post.CompanyName}</p>
                                                    <p><strong>Customer:</strong> {post.CustomerName}</p>
                                                    <p><strong>Contact:</strong> {post.ContactNumber} / {post.Email}</p>
                                                    <p><strong>Address:</strong> {post.CityAddress}</p>
                                                    <p className="mt-2"><strong>Client Segment:</strong> {post.CustomerSegment}</p>
                                                    <hr className="my-2 border-gray-900" />
                                                    <p>{post.Channel}, {post.Source}, {post.WrapUp}, {post.CustomerType}</p>
                                                </div>
                                            )}
                                            {/* Card Footer */}
                                            <div className="border-t border-gray-900 mt-3 pt-2 text-xs flex justify-between items-center">
                                                <span className="flex items-center gap-1">
                                                    Endorsed: {formatDate(post.TicketEndorsed)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    Received: {formatDate(post.TicketReceived)}
                                                </span>
                                            </div>

                                            {/* Dropdown Menu */}
                                            {menuVisible[post._id] && (
                                                <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                                                    <button onClick={() => handleEdit(post)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                        Edit Details
                                                    </button>
                                                    <button onClick={() => toggleStatusMenu(post._id)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                        Change Status
                                                    </button>
                                                    <button onClick={() => toggleRemarksMenu(post._id)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                        Change Remarks
                                                    </button>
                                                    <button onClick={() => handleDelete(post._id)} className="border-t w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}

                                            {/* Status Change Menu */}
                                            {statusMenuVisible[post._id] && (
                                                <div className="absolute right-16 top-20 bg-white shadow-lg rounded-lg border w-50 z-20 text-xs">
                                                    {Object.keys(STATUS_COLORS).map((status) => (
                                                        <button key={status} onClick={() => updateStatus(post._id, status)} className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100">
                                                            <span className={`w-3 h-3 rounded-full border border-black ${STATUS_COLORS[status].split(" ")[0]}`}></span>
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Remarks Change Menu */}
                                            {remarksMenuVisible[post._id] && (
                                                <div className="absolute right-16 top-20 bg-white shadow-lg rounded-lg border w-50 z-20 text-xs">
                                                    {Object.keys(REMARKS_COLORS).map((remark) => (
                                                        <button key={remark} onClick={() => updateRemarks(post._id, remark)} className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100">
                                                            <span className={`w-3 h-3 rounded-full border border-black ${REMARKS_COLORS[remark]}`}></span>
                                                            {remark}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

};

export default ActivityCards;
