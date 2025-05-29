import React, { useMemo, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Post {
  _id: string;
  ReferenceNumber: string;
  ProductCategories: string;
  CategoryDescription: string;
}

interface TableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  Role: string;
}

const ITEMS_PER_PAGE = 10;

const Table: React.FC<TableProps> = ({ posts, handleEdit, handleDelete, Role }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [posts, currentPage]);

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Issued Items");

    worksheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "Reference Number", key: "ReferenceNumber", width: 20 },
      { header: "Product Category", key: "ProductCategories", width: 20 },
      { header: "Category Description", key: "CategoryDescription", width: 25 },
    ];

    posts.forEach((post, index) => {
      worksheet.addRow({
        index: index + 1,
        ReferenceNumber: post.ReferenceNumber,
        ProductCategories: post.ProductCategories,
        CategoryDescription: post.CategoryDescription,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "categories.xlsx");
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-4 text-xs">
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded">
            Export Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full bg-white text-xs">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {["Catogory ID", "Product Category", "Description", "Actions"].map((header) => (
                <th key={header} className="px-3 py-6 text-left whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {paginatedPosts.map((post) => (
              <tr key={post._id} className="text-left border-b cursor-pointer hover:bg-gray-50">
                <td className="px-3 py-6">{post.ReferenceNumber}</td>
                <td className="px-3 py-6 capitalize">{post.ProductCategories}</td>
                <td className="px-3 py-6 capitalize">{post.CategoryDescription}</td>
                <td className="px-3 py-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex space-x-2">
                    {(Role !== "Auditor" && Role !== "Support Staff") && (
                    <button onClick={() => handleEdit(post)} className="text-xs py-2 px-4 rounded bg-blue-600 hover:bg-blue-800 text-white flex items-center">
                      <FaEdit size={15} className="mr-1" /> Edit
                    </button>
                    )}
                    {(Role !== "Auditor" && Role !== "Support Staff") && (
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

      <div className="flex justify-between items-center mt-4 text-xs">
        <span>Page {currentPage} of {totalPages}</span>
        <div className="space-x-2">
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Prev</button>
          <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Next</button>
        </div>
      </div>
    </>
  );
};

export default Table;
