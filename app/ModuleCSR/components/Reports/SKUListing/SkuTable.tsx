import React, { useEffect, useState, useCallback, useMemo } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const socket = io("http://localhost:3000");

interface Post {
    _id: string;
    userName: string;
    createdAt: string;
    CompanyName: string;
    Remarks: string;
    ItemCode: string;
    ItemDescription: string;
    QtySold: string;
    SalesAgent: string;
}

interface AccountsTableProps {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
}

const TransactionCards: React.FC<AccountsTableProps> = ({ posts, setPosts, handleEdit, handleDelete, Role }) => {
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});

    const toggleExpand = useCallback((postId: string) => {
        setExpandedCards((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    }, []);

    const toggleMenu = useCallback((postId: string) => {
        setMenuVisible((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    }, []);

    const remarksFilter = useMemo(() => [
        "No Stocks / Insufficient Stocks",
        "Item Not Carried",
        "Non Standard Item",
    ], []);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => remarksFilter.includes(post.Remarks));
    }, [posts, remarksFilter]);

    const totalQty = useMemo(() => {
        return filteredPosts.reduce((total, post) => total + parseFloat(post.QtySold), 0);
    }, [filteredPosts]);

    useEffect(() => {
        const newPostListener = (newPost: Post) => {
            setPosts((prevPosts) => {
                if (!prevPosts.some(post => post._id === newPost._id)) {
                    return [newPost, ...prevPosts];
                }
                return prevPosts;
            });
        };

        socket.on("newPost", newPostListener);
        return () => {
            socket.off("newPost", newPostListener);
        };
    }, [setPosts]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                    <div key={post._id} className="relative border rounded-md shadow-md p-4 flex flex-col bg-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-semibold capitalize">{post.CompanyName}</h3>
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
                            <div className="mt-2">
                                <p className="text-xs"><strong>Category:</strong> {post.ItemCode} / QTY: {post.QtySold}</p>
                                <p className="text-xs mt-2"><strong>Description:</strong> {post.ItemDescription}</p>
                            </div>
                        )}
                        <div className="border-t border-gray-300 mt-3 pt-2 text-xs flex justify-between items-center">
                            <span className="italic capitalize">{post.SalesAgent}</span>
                            <span className="italic">{post.Remarks}</span>
                        </div>
                        {menuVisible[post._id] && (
                            <div className="absolute right-2 top-10 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                                <button onClick={() => handleEdit(post)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    Edit Details
                                </button>
                                <button onClick={() => handleDelete(post._id)} className="border-t w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 text-xs">No records found</p>
            )}
            <div className="col-span-full mt-4 text-xs">
                <strong>Total Quantity Sold:</strong> {totalQty}
            </div>
        </div>
    );
};

export default TransactionCards;