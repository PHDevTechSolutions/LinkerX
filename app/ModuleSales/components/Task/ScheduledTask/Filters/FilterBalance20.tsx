import React, { useMemo, useEffect, useState } from "react";
import { FcBusinessman, FcPhone, FcInvite, FcHome } from "react-icons/fc";
import { FaPlusCircle } from "react-icons/fa";

interface Post {
    id: string;
    companyname: string;
    contactperson: string;
    contactnumber: string;
    typeclient: string;
    activitystatus: string;
    ticketreferencenumber: string;
    date_created: string;
    date_updated: string | null;
    referenceid: string;
    emailaddress: string;
    address: string;
    activitynumber: string;
    status: string;
}

interface FilterCardProps {
    userDetails: any;
    posts: Post[];
    handleSubmit: (post: Post) => void;
    expandedIds: string[];
    setExpandedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterTop50: React.FC<FilterCardProps> = ({
    userDetails,
    posts,
    handleSubmit,
    expandedIds,
    setExpandedIds,
}) => {
    const pageSize = 4;
    const [currentPage, setCurrentPage] = useState(1);

    // Filter posts by "Top 50" and ensure date_updated is valid
    const filteredAccounts = useMemo(() => {
        return posts
            .filter((post) => post.typeclient === "Balance 20")
            .filter((post) => post.date_updated !== null && !isNaN(new Date(post.date_updated).getTime()))
            .sort(
                (a, b) =>
                    new Date(a.date_updated!).getTime() - new Date(b.date_updated!).getTime()
            );
    }, [posts]);

    const totalFilteredPages = Math.ceil(filteredAccounts.length / pageSize);

    // Reset current page if out of bounds
    useEffect(() => {
        if (currentPage > totalFilteredPages) {
            setCurrentPage(1);
        }
    }, [totalFilteredPages, currentPage]);

    // Slice posts for current page
    const currentPosts = filteredAccounts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () =>
        setCurrentPage((prev) => Math.min(prev + 1, totalFilteredPages));

    return (
        <div className="space-y-2">
            <div className="grid gap-2">
                {currentPosts.length === 0 && (
                    <p className="text-xs text-center text-gray-500">No Balance 20 accounts to display.</p>
                )}

                {currentPosts.map((post) => {
                    const isExpanded = expandedIds.includes(post.id);

                    return (
                        <div
                            key={post.id}
                            className="border-b border-gray-200 p-4 hover:shadow-lg transition duration-300 bg-gray-50"
                        >
                            {/* Hidden inputs for form data */}
                            <input type="hidden" name="referenceid" value={userDetails.ReferenceID} />
                            <input type="hidden" name="tsm" value={userDetails.TSM} />
                            <input type="hidden" name="manager" value={userDetails.Manager} />

                            {/* Header: company name and Add button */}
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() =>
                                    setExpandedIds((prev) =>
                                        prev.includes(post.id)
                                            ? prev.filter((id) => id !== post.id)
                                            : [...prev, post.id]
                                    )
                                }
                            >
                                <p
                                    className="text-[10px] font-bold text-gray-800 uppercase"
                                    style={{
                                        maxWidth: "calc(100% - 60px)",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "normal",
                                    }}
                                >
                                    {post.companyname}
                                </p>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Do you want to add ${post.companyname}?`)) {
                                            handleSubmit(post);
                                        }
                                    }}
                                    className="flex items-center gap-1 bg-blue-400 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow"
                                >
                                    <FaPlusCircle size={12} />
                                    Add
                                </button>
                            </div>

                            {/* Expanded details */}
                            {isExpanded && (
                                <div className="mt-3 space-y-1 text-xs text-gray-700">
                                    <p className="text-[10px] text-blue-600 font-semibold uppercase">
                                        {post.typeclient}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <FcBusinessman size={16} />
                                        <span className="font-medium capitalize">{post.contactperson}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FcPhone size={16} />
                                        <span className="font-medium">{post.contactnumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FcInvite size={16} />
                                        <span className="font-medium">{post.emailaddress}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FcHome size={16} />
                                        <span className="font-medium capitalize truncate">{post.address}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-8 p-2">
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-[10px] border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-[10px] text-gray-600">
                    Page <strong>{currentPage}</strong> of {totalFilteredPages || 1}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalFilteredPages || totalFilteredPages === 0}
                    className="px-4 py-2 text-[10px] border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default FilterTop50;
