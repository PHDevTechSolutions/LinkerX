import React, { useState } from "react";
import TableView from "./TableView";
import Pagination from "./Pagination";
import GridView from "./GridView";
import CardView from "./CardView";
import Form from "./Form";
import { FaTable, FaTasks, FaCalendarAlt } from "react-icons/fa";

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
    activitynumber: string;
}

interface UserDetails {
    UserId: string;
    ReferenceID: string;
    Manager: string;
    TSM: string;
    TargetQuota: string;
}

interface MainCardTableProps {
    posts: Post[];
    userDetails: {
        UserId: string;
        Firstname: string;
        Lastname: string;
        Email: string;
        Role: string;
        Department: string;
        Company: string;
        TargetQuota: string;
        ReferenceID: string;
        Manager: string;
        TSM: string;
    };
    fetchAccount: () => void; // Callback to refresh data after editing
}

const MainCardTable: React.FC<MainCardTableProps> = ({ posts, userDetails, fetchAccount }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [view, setView] = useState<"table" | "grid" | "card">("table");
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<Post | null>(null);

    // Pagination logic
    const totalPages = Math.ceil(posts.length / itemsPerPage);
    const paginatedData = posts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleEdit = (post: Post) => {
        setEditUser(post);
        setShowForm(true);
    };

    return (
        <div className="bg-white col-span-3">
            {/* View switcher and items per page */}
            <div className="mb-2 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                {/* View Buttons */}
                <div className="flex flex-wrap gap-2 text-xs justify-center md:justify-start">
                    <button
                        onClick={() => setView("table")}
                        className={`flex items-center gap-1 px-3 py-1 rounded ${view === "table" ? "bg-blue-400 text-white" : "bg-gray-100"
                            }`}
                    >
                        <FaTable size={12} />
                        Table
                    </button>

                    <button
                        onClick={() => setView("grid")}
                        className={`flex items-center gap-1 px-3 py-1 rounded ${view === "grid" ? "bg-blue-400 text-white" : "bg-gray-100"
                            }`}
                    >
                        <FaTasks size={12} />
                        Logs
                    </button>

                    <button
                        onClick={() => setView("card")}
                        className={`flex items-center gap-1 px-3 py-1 rounded ${view === "card" ? "bg-blue-400 text-white" : "bg-gray-100"
                            }`}
                    >
                        <FaCalendarAlt size={12} />
                        Calendar
                    </button>
                </div>

                {/* Items Per Page + Pagination */}
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-2 text-[10px] text-gray-600">
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border px-3 py-2 rounded text-[10px]"
                    >
                        {[10, 25, 50, 100].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {showForm ? (
                <Form
                    onCancel={() => {
                        setShowForm(false);
                        setEditUser(null);
                    }}
                    refreshPosts={fetchAccount} // Pass refresh callback
                    userDetails={{
                        id: editUser ? editUser.id : userDetails.UserId,
                        referenceid: editUser ? (editUser as any).referenceid : userDetails.ReferenceID,
                        manager: editUser ? (editUser as any).manager : userDetails.Manager,
                        tsm: editUser ? (editUser as any).tsm : userDetails.TSM,
                        targetquota: editUser ? (editUser as any).targetquota : userDetails.TargetQuota,
                    }}
                    editUser={editUser}
                />
            ) : (
                <>
                    {view === "table" && (<TableView posts={paginatedData} handleEdit={handleEdit} refreshPosts={fetchAccount} />)}
                    {view === "grid" && <GridView posts={paginatedData} handleEdit={handleEdit} />}
                    {view === "card" && <CardView posts={paginatedData} handleEdit={handleEdit} />}
                </>
            )}
        </div>
    );
};

export default MainCardTable;
