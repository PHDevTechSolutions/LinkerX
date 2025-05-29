import React, { useMemo, useState } from "react";
import { FaTrash, FaEdit, FaTh, FaList, FaThLarge } from "react-icons/fa";

interface Post {
    _id: string;
    ReferenceNumber: string;
    ProductName: string;
    ProductSKU: string;
    ProductDescription: string;
    ProductCategories: string;
    ProductQuantity: string;
    ProductCostPrice: string;
    ProductSellingPrice: string;
    ProductStatus: string;
    ProductImage: string;
}

interface TableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
    Location: string;
}

const getStatusBadgeColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "available") return "bg-emerald-500 text-white";
    if (normalized === "low-stock") return "bg-yellow-500 text-white";
    if (normalized === "no-stock") return "bg-red-600 text-white";
    if (normalized === "draft") return "bg-gray-500 text-white";
    return "bg-gray-100 text-gray-800";
};

const ITEMS_PER_PAGE = 10;

const Table: React.FC<TableProps> = ({ posts, handleEdit, handleDelete, Role }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [modalPost, setModalPost] = useState<Post | null>(null);
    const [viewMode, setViewMode] = useState("table"); // table | grid | card

    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [posts, currentPage]);

    const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const shortDesc = (desc: string) => (desc.length > 10 ? desc.slice(0, 10) + "..." : desc);
    const onRowClick = (post: Post) => {
        if (post.ProductDescription.length > 10) setModalPost(post);
    };

    return (
        <>
            {/* View Mode Tabs */}
            <div className="flex items-center justify-end mb-2 space-x-2 text-xs">
                <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1 rounded border ${viewMode === "table" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                >
                    <FaList className="inline mr-1" /> Table
                </button>
                <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 rounded border ${viewMode === "grid" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                >
                    <FaTh className="inline mr-1" /> Grid
                </button>
                <button
                    onClick={() => setViewMode("card")}
                    className={`px-3 py-1 rounded border ${viewMode === "card" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                >
                    <FaThLarge className="inline mr-1" /> Card
                </button>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
                <div className="overflow-x-auto w-full">
                    <table className="w-full bg-white text-xs">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                {["#", "SKU", "Image", "Product Name", "Description", "Categories", "QTY", "Cost Price", "Selling Price", "Status", "Actions"].map((header) => (
                                    <th key={header} className="px-3 py-6 text-left whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPosts.map((post) => (
                                <tr key={post._id} className="text-left border-b capitalize cursor-pointer hover:bg-gray-50" onClick={() => onRowClick(post)}>
                                    <td className="px-3 py-6">{post.ReferenceNumber}</td>
                                    <td className="px-3 py-6">{post.ProductSKU}</td>
                                    <td className="px-3 py-6">
                                        <img src={post?.ProductImage || "/default.png"} alt={post?.ProductName || "Product Image"} className="w-12 h-12 object-cover rounded" />
                                    </td>
                                    <td className="px-3 py-6">{post.ProductName}</td>
                                    <td className="px-3 py-6">{shortDesc(post.ProductDescription)}</td>
                                    <td className="px-3 py-6">{post.ProductCategories}</td>
                                    <td className="px-3 py-6">{post.ProductQuantity}</td>
                                    <td className="px-3 py-6">{post.ProductCostPrice}</td>
                                    <td className="px-3 py-6">{post.ProductSellingPrice}</td>
                                    <td className="px-3 py-6">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(post.ProductStatus)}`}>{post.ProductStatus}</span>
                                    </td>
                                    <td className="px-3 py-6" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex space-x-2">
                                            {(Role !== "Auditor") && (
                                            <button onClick={() => handleEdit(post)} className="text-xs py-2 px-4 rounded bg-blue-600 hover:bg-blue-800 text-white flex items-center">
                                                <FaEdit size={15} className="mr-1" /> Edit
                                            </button>
                                            )}
                                            {(Role !== "Sales Staff" && Role !== "Auditor" && Role !== "Purchasing Officer") && (
                                            <button onClick={() => handleDelete(post._id)} className="text-xs py-2 px-4 rounded bg-red-600 hover:bg-red-800 text-white flex items-center">
                                                <FaTrash size={15} className="mr-1" /> Delete
                                            </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                    {paginatedPosts.map((post) => (
                        <div key={post._id} className="bg-white rounded shadow hover:shadow-md p-3 cursor-pointer" onClick={() => onRowClick(post)}>
                            <img src={post?.ProductImage || "/default.png"} alt={post?.ProductName || "Product Image"} className="w-full h-auto object-cover rounded" />
                            <div className="mt-2">
                                <h3 className="font-bold text-sm mb-1 capitalize">{post.ProductName}</h3>
                                <p className="capitalize">{shortDesc(post.ProductDescription)}</p>
                                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(post.ProductStatus)}`}>{post.ProductStatus}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Card View */}
            {viewMode === "card" && (
                <div className="flex flex-col gap-4 text-xs">
                    {paginatedPosts.map((post) => (
                        <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden md:flex cursor-pointer" onClick={() => onRowClick(post)}>
                            <img src={post?.ProductImage || "/default.png"} alt={post?.ProductName || "Product Image"} className="w-full md:w-48 h-48 object-cover" />
                            <div className="p-4 flex-1">
                                <h3 className="font-bold text-sm mb-1 capitalize">{post.ProductName}</h3>
                                <p className="mb-2 text-gray-700 capitalize">{post.ProductDescription}</p>
                                <p className="mb-1 uppercase"><strong>SKU:</strong> {post.ProductSKU}</p>
                                <p><strong>Categories:</strong> {post.ProductCategories}</p>
                                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(post.ProductStatus)}`}>{post.ProductStatus}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-xs">
                <span>Page {currentPage} of {totalPages}</span>
                <div className="space-x-2">
                    <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Prev</button>
                    <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Next</button>
                </div>
            </div>

            {/* Modal */}
            {modalPost && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999] p-4" onClick={() => setModalPost(null)}>
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setModalPost(null)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold">✕</button>
                        <div className="relative w-full overflow-hidden rounded-t-lg">
                            <img src={modalPost.ProductImage} alt={modalPost.ProductName} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 text-xs">
                            <h3 className="text-lg font-bold mb-3 capitalize">{modalPost.ProductName}</h3>
                            <p className="mb-2 uppercase"><strong>SKU:</strong> {modalPost.ProductSKU}</p>
                            <p className="capitalize"><strong>Description:</strong> {modalPost.ProductDescription}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Table;