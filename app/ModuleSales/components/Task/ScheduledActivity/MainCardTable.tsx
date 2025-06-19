import React, { useState, useMemo } from "react";
import TableView from "./TableView";
import Pagination from "./Pagination";
import GridView from "./GridView";
import CardView from "./CardView";
import Form from "./Form";
import { FaTable, FaTasks, FaCalendarAlt } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";

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
    startdate: string;
    enddate: string;
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
    const [view, setView] = useState<"table" | "grid" | "card">("table");
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<Post | null>(null);

    // Pagination logic
    const postsByDate = useMemo(() => {
        const map = new Map<string, Post[]>();
        for (const post of posts) {
            const dateKey = new Date(post.date_created).toISOString().split("T")[0]; // "YYYY-MM-DD"
            if (!map.has(dateKey)) map.set(dateKey, []);
            map.get(dateKey)!.push(post);
        }

        // Sorted by date descending (today first)
        return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
    }, [posts]);

    const totalPages = postsByDate.length;
    const currentDatePosts = postsByDate[currentPage - 1]?.[1] || [];

    const handleEdit = (post: Post) => {
        setEditUser(post);
        setShowForm(true);
    };

    return (
        <div className="bg-white col-span-3">
            {/* View switcher and items per page */}
            <div className="mb-2 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                {/* View Buttons */}
                <div className="flex flex-wrap gap-2 text-[10px] justify-center md:justify-start">
                    <button
                        onClick={() => setView("table")}
                        className={`flex items-center gap-1 px-3 py-1 rounded ${view === "table" ? "bg-blue-400 text-white" : "bg-gray-100"
                            }`}
                    >
                        <FaTable size={12} />
                        Table
                    </button>

                    <button className="flex items-center gap-1 border bg-white text-black text-[10px] px-4 py-2 shadow-sm rounded hover:bg-orange-400 hover:text-white transition" onClick={() => setShowForm(true)} >
                        <CiSquarePlus size={15} /> Create Activity</button>
                </div>

                {/* Items Per Page + Pagination */}
                <div className="flex items-center justify-center md:justify-end gap-2 text-[10px] text-gray-600">
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
                    {view === "table" && <TableView posts={currentDatePosts} handleEdit={handleEdit} refreshPosts={fetchAccount} />}
                </>
            )}
        </div>
    );
};

export default MainCardTable;
