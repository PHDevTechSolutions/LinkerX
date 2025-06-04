import React, { useState } from "react";
import TableView from "./TableView";
import Pagination from "./Pagination";
import GridView from "./GridView";
import CardView from "./CardView";
import Form from "./Form";

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
    const [itemsPerPage, setItemsPerPage] = useState(10);
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
        <div className="bg-white rounded-lg shadow p-4 col-span-3">
            {/* View switcher and items per page */}
            <div className="mb-4 flex justify-between items-center">
                <div className="space-x-2 text-xs">
                    <button
                        onClick={() => setView("table")}
                        className={`px-3 py-1 rounded ${view === "table" ? "bg-blue-600 text-white" : "bg-gray-100"
                            }`}
                    >
                        Table
                    </button>
                    <button
                        onClick={() => setView("grid")}
                        className={`px-3 py-1 rounded ${view === "grid" ? "bg-blue-600 text-white" : "bg-gray-100"
                            }`}
                    >
                        Grid
                    </button>
                    <button
                        onClick={() => setView("card")}
                        className={`px-3 py-1 rounded ${view === "card" ? "bg-blue-600 text-white" : "bg-gray-100"
                            }`}
                    >
                        Card
                    </button>
                </div>

                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border px-3 py-2 rounded text-xs"
                >
                    {[10, 25, 50, 100].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
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
                    {view === "table" && (
                        <TableView posts={paginatedData} handleEdit={handleEdit} />
                    )}
                    {view === "grid" && <GridView posts={paginatedData} handleEdit={handleEdit} />}
                    {view === "card" && <CardView posts={paginatedData} />}
                </>
            )}

            {/* Pagination - you can add your pagination component here */}
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default MainCardTable;
