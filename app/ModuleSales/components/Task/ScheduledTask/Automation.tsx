import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
}

interface MainCardTableProps {
    posts: any[];
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

const MainCardTable: React.FC<MainCardTableProps> = ({ userDetails }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTypeClient, setSelectedTypeClient] = useState<string>("All");
    const postsPerPage = 35;

    const typeClientOptions = ["All", "Top 50", "Next 30", "Balance 20", "CSR Client", "TSA Client"];

    const fetchData = async () => {
        try {
            const response = await fetch(
                "/api/ModuleSales/UserManagement/CompanyAccounts/FetchAccount"
            );
            const data = await response.json();
            setPosts(data.data || []);
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getSortedByTypeClient = (accounts: Post[]) => {
        const priority = ["Top 50", "Next 30", "Balance 20", "CSR Client", "TSA Client"];
        const sorted: Post[] = [];

        for (const type of priority) {
            sorted.push(...accounts.filter((post) => post.typeclient === type));
        }

        return sorted;
    };

    const filteredAccounts = Array.isArray(posts)
        ? getSortedByTypeClient(
            posts.filter((post) => {
                const referenceID = userDetails.ReferenceID;
                const role = userDetails.Role;

                const isAllowed =
                    role === "Super Admin" ||
                    role === "Special Access" ||
                    (["Territory Sales Associate", "Territory Sales Manager"].includes(role) &&
                        post.referenceid === referenceID);

                const typeMatch = selectedTypeClient === "All" || post.typeclient === selectedTypeClient;

                return isAllowed && typeMatch;
            })
        )
        : [];

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    // Helper function to generate activity number
    const generateActivityNumber = (companyname: string, referenceid: string): string => {
        const firstLetter = companyname.charAt(0).toUpperCase();
        const firstTwoRef = referenceid.substring(0, 2).toUpperCase();

        const now = new Date();
        // Format date as DDMM without slashes
        const day = now.getDate().toString().padStart(2, "0");
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const formattedDate = `${day}${month}`;

        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();

        return `${firstLetter}-${firstTwoRef}-${formattedDate}-${randomNumber}`;
    };

    const handleSubmit = async (post: Post) => {
        const activitynumber = generateActivityNumber(post.companyname, userDetails.ReferenceID);

        const payload = {
            companyname: post.companyname,
            contactperson: post.contactperson,
            contactnumber: post.contactnumber,
            emailaddress: post.emailaddress,
            address: post.address,
            referenceid: userDetails.ReferenceID,
            tsm: userDetails.TSM,
            manager: userDetails.Manager,
            ticketreferencenumber: post.ticketreferencenumber || "",
            typeclient: post.typeclient,
            activitystatus: "Cold",
            activitynumber,  // use the generated number here
        };

        try {
            const res = await fetch("/api/ModuleSales/Task/DailyActivity/CreateUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Added successfully!");
            } else {
                const err = await res.json();
                toast.error(`Error: ${err.message || "Failed to add."}`);
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Something went wrong!");
        }
    };


    return (
        <div className="bg-white rounded-xl shadow-lg p-6 col-span-3">
            <div className="flex justify-end mb-4">
                <select
                    className="border px-3 py-2 rounded text-xs"
                    value={selectedTypeClient}
                    onChange={(e) => {
                        setSelectedTypeClient(e.target.value);
                        setCurrentPage(1); // reset to page 1
                    }}
                >
                    {typeClientOptions.map((option) => (
                        <option key={option} value={option}>
                            {option === "All" ? "All Clients" : option}
                        </option>
                    ))}
                </select>
            </div>

            {filteredAccounts.length === 0 ? (
                <p className="text-center text-xs text-gray-500">No records found.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        {currentPosts.map((post) => (
                            <div
                                key={post.id}
                                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition duration-300 bg-gray-50"
                            >
                                {/* Hidden Fields */}
                                <input type="hidden" name="referenceid" value={userDetails.ReferenceID} />
                                <input type="hidden" name="tsm" value={userDetails.TSM} />
                                <input type="hidden" name="manager" value={userDetails.Manager} />

                                <div className="mb-2">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase truncate">
                                        {post.companyname}
                                    </h3>
                                    <p className="text-xs text-blue-600 font-semibold">{post.typeclient}</p>
                                </div>

                                <div className="relative space-y-1 mt-3 text-xs text-gray-700 pb-10">
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

                                    {/* Add Button fixed at bottom right of this section */}
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Do you want to add ${post.companyname}?`)) {
                                                handleSubmit(post);
                                            }
                                        }}
                                        className="absolute bottom-1 right-1 flex items-center gap-1 bg-blue-400 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow"
                                    >
                                        <FaPlusCircle size={12} />
                                        Add
                                    </button>
                                </div>

                            </div>
                        ))}

                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-8">
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-xs border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-xs text-gray-600">
                            Page <strong>{currentPage}</strong> of {totalPages}
                        </span>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-xs border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MainCardTable;
