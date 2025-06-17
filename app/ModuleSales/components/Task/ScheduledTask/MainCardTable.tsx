import React, { useState, useMemo, useEffect } from "react";
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
}

interface MainCardTableProps {
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
}

const MainCardTable: React.FC<MainCardTableProps> = ({ userDetails }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [view, setView] = useState<"table" | "grid" | "card">("table");
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<Post | null>(null);

    const fetchAccount = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ModuleSales/Reports/AccountManagement/FetchActivity");
            if (!res.ok) throw new Error("Network response was not ok");
            const data = await res.json();
            if (process.env.NODE_ENV === "development") {
                console.log("Fetched data:", data);
            }
            setPosts(data.data || []);
        } catch (error) {
            // Replace this with your toast or other error notification
            alert("Error fetching users.");
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on mount
    useEffect(() => {
        fetchAccount();
    }, []);

    // Group posts by date (YYYY-MM-DD) and sort descending
    const postsByDate = useMemo(() => {
        const map = new Map<string, Post[]>();
        for (const post of posts) {
            const dateKey = new Date(post.date_created).toISOString().split("T")[0];
            if (!map.has(dateKey)) map.set(dateKey, []);
            map.get(dateKey)!.push(post);
        }
        return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
    }, [posts]);

    const totalPages = postsByDate.length;

    // Reset current page if out of range after posts update
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    const currentDatePosts = postsByDate[currentPage - 1]?.[1] ?? [];

    const handleEdit = (post: Post) => {
        setEditUser(post);
        setShowForm(true);
    };

    return (
        <div className="bg-white col-span-3">
            {/* View switcher and pagination */}
            <div className="mb-2 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                {/* View Buttons */}
                <div className="flex flex-wrap gap-2 text-[10px] justify-center md:justify-start">
                    {["table", "grid", "card"].map((v) => {
                        const Icon = v === "table" ? FaTable : v === "grid" ? FaTasks : FaCalendarAlt;
                        return (
                            <button
                                key={v}
                                onClick={() => setView(v as "table" | "grid" | "card")}
                                className={`flex items-center gap-1 px-3 py-1 rounded ${view === v ? "bg-blue-400 text-white" : "bg-gray-100"
                                    }`}
                            >
                                <Icon size={12} />
                                {v.charAt(0).toUpperCase() + v.slice(1)}
                            </button>
                        );
                    })}
                    <button className="flex items-center gap-1 border bg-white text-black text-[10px] px-4 py-2 shadow-sm rounded hover:bg-blue-400 hover:text-white transition" onClick={() => setShowForm(true)} >
                        <CiSquarePlus size={15} /> 
                        Create New (Manual) Activity
                    </button>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center md:justify-end gap-2 text-[10px] text-gray-600">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading data...</div>
            ) : showForm ? (
                <Form
                    onCancel={() => {
                        setShowForm(false);
                        setEditUser(null);
                    }}
                    refreshPosts={() => {
                        fetchAccount();
                        setShowForm(false);
                        setEditUser(null);
                    }}
                    userDetails={{
                        id: editUser?.id ?? userDetails.UserId,
                        referenceid: (editUser as any)?.referenceid ?? userDetails.ReferenceID,
                        manager: (editUser as any)?.manager ?? userDetails.Manager,
                        tsm: (editUser as any)?.tsm ?? userDetails.TSM,
                        targetquota: (editUser as any)?.targetquota ?? userDetails.TargetQuota,
                    }}
                    editUser={editUser}
                />
            ) : (
                <>
                    {view === "table" && <TableView posts={currentDatePosts} handleEdit={handleEdit} refreshPosts={fetchAccount} />}
                    {view === "grid" && <GridView posts={currentDatePosts} handleEdit={handleEdit} />}
                    {view === "card" && <CardView posts={currentDatePosts} handleEdit={handleEdit} />}
                </>
            )}
        </div>
    );
};

export default MainCardTable;
