import React, { useState, useMemo } from "react";
import TableView from "./TableView";
import Pagination from "./Pagination";
import GridView from "./GridView";
import CardView from "./CardView";
import Form from "./Form";
import PersonalModalForm from "./Modal/PersonalModalForm";

import { FaTable, FaTasks, FaCalendarAlt } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { PiHandTapThin } from "react-icons/pi";

interface Post {
    id: string;
    companyname: string;
    contactperson: string;
    contactnumber: string;
    typeclient: string;
    activitystatus: string;
    activityremarks: string;
    ticketreferencenumber: string;
    date_created: string;
    date_updated: string | null;
    activitynumber: string;
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
    fetchAccount: () => void;
}

const MainCardTable: React.FC<MainCardTableProps> = ({
    posts,
    userDetails,
    fetchAccount,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [view, setView] = useState<"table" | "grid" | "card">("table");
    const [showMainForm, setShowMainForm] = useState(false);
    const [showPersonalForm, setShowPersonalForm] = useState(false);
    const [editUser, setEditUser] = useState<Post | null>(null);

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
    const currentDatePosts = postsByDate[currentPage - 1]?.[1] || [];

    const handleEdit = (post: Post) => {
        setEditUser(post);
        setShowMainForm(true);
    };

    const handleButtonClick = () => {
        setShowPersonalForm(true);
    };

    const closePersonalForm = () => {
        setShowPersonalForm(false);
    };

    return (
        <div className="bg-white col-span-3">
            {/* View and Controls */}
            <div className="mb-2 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                <div className="flex flex-wrap gap-2 text-[10px] justify-center md:justify-start">
                    <button onClick={() => setView("table")}
                        className={`flex items-center gap-1 px-3 py-1 rounded ${view === "table" ? "bg-blue-400 text-white" : "bg-gray-100"
                            }`}>
                        <FaTable size={12} />
                        Table
                    </button>

                    <button onClick={() => setView("grid")}
                        className={`flex items-center gap-1 px-3 py-1 rounded ${view === "grid" ? "bg-blue-400 text-white" : "bg-gray-100"
                            }`}>
                        <FaTasks size={12} />
                        Logs
                    </button>

                    <button onClick={() => setView("card")}
                        className={`flex items-center gap-1 px-3 py-1 rounded ${view === "card" ? "bg-blue-400 text-white" : "bg-gray-100"
                            }`}>
                        <FaCalendarAlt size={12} />
                        Calendar
                    </button>

                    <button
                        className="flex items-center gap-1 border bg-white text-black text-[10px] px-4 py-2 shadow-sm rounded hover:bg-orange-400 hover:text-white transition"
                        onClick={() => setShowMainForm(true)}>
                        <CiSquarePlus size={15} /> Create Activity
                    </button>

                    <button
                        className="flex items-center gap-1 border bg-white text-black text-[10px] px-4 py-2 shadow-sm rounded hover:bg-blue-400 hover:text-white transition"
                        onClick={handleButtonClick}>
                        <PiHandTapThin size={15} /> Tap
                    </button>
                </div>

                <div className="flex items-center justify-center md:justify-end gap-2 text-[10px] text-gray-600">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Forms */}
            {showMainForm ? (
                <Form
                    onCancel={() => {
                        setShowMainForm(false);
                        setEditUser(null);
                    }}
                    refreshPosts={fetchAccount}
                    userDetails={{
                        id: editUser ? editUser.id : userDetails.UserId,
                        referenceid: editUser
                            ? (editUser as any).referenceid
                            : userDetails.ReferenceID,
                        manager: editUser ? (editUser as any).manager : userDetails.Manager,
                        tsm: editUser ? (editUser as any).tsm : userDetails.TSM,
                        targetquota: editUser
                            ? (editUser as any).targetquota
                            : userDetails.TargetQuota,
                    }}
                    editUser={editUser}
                />
            ) : (
                <>
                    {view === "table" && (
                        <TableView
                            posts={currentDatePosts}
                            handleEdit={handleEdit}
                            refreshPosts={fetchAccount}
                        />
                    )}
                    {view === "grid" && (
                        <GridView posts={currentDatePosts} handleEdit={handleEdit} />
                    )}
                    {view === "card" && (
                        <CardView posts={posts} handleEdit={handleEdit} />
                    )}
                </>
            )}

            {/* Personal Tap Form */}
            {showPersonalForm && (
                <PersonalModalForm
                    onClose={closePersonalForm}
                    userDetails={{
                        referenceid: userDetails.ReferenceID,
                        manager: userDetails.Manager,
                        tsm: userDetails.TSM,
                    }}
                />
            )}

        </div>
    );
};

export default MainCardTable;
