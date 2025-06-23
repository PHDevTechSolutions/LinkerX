import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FilterTop50 from "./Filters/FilterTop50";
import FilterNext30 from "./Filters/FilterNext30";
import FilterBalance20 from "./Filters/FilterBalance20";
import FilterNewClient from "./Filters/FilterNewClient";
import FilterInactiveClient from "./Filters/FilterInactive";
import FilterNonBuyingClient from "./Filters/FilterNonBuying";

import { GoPlus, GoDash } from "react-icons/go";

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

interface AutomationProps {
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
    posts: Post[];
    fetchAccount: () => void;
}

const STORAGE_KEY = "expandedFiltersState";

const defaultFilterState = () => ({
    top50: false,
    next30: false,
    balance20: false,
    newclient: false,
    inactive: false,
    nonbuying: false,
});

const Automation: React.FC<AutomationProps> = ({ userDetails }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEY);
            try {
                return stored ? JSON.parse(stored) : defaultFilterState();
            } catch {
                return defaultFilterState();
            }
        }
        return defaultFilterState();
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedFilters));
    }, [expandedFilters]);

    const toggleFilter = (key: string) => {
        setExpandedFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const allExpanded = Object.values(expandedFilters).every(Boolean);

    const toggleAll = () => {
        const newState = Object.fromEntries(
            Object.keys(expandedFilters).map((k) => [k, !allExpanded])
        );
        setExpandedFilters(newState);
    };

    const fetchData = async () => {
        try {
            const res = await fetch("/api/ModuleSales/UserManagement/CompanyAccounts/FetchAccount");
            const json = await res.json();
            if (json.success) setPosts(json.data || []);
            else toast.error(json.error || "Fetch failed.");
        } catch (err) {
            toast.error("Error fetching accounts.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const referenceID = userDetails?.ReferenceID;
    const role = userDetails?.Role;
    const todayStr = new Date().toISOString().slice(0, 10);

    const filteredSortedAccounts = posts
        .filter((post) => {
            const allowed =
                role === "Super Admin" ||
                role === "Special Access" ||
                (["Territory Sales Associate", "Territory Sales Manager"].includes(role) &&
                    post.referenceid === referenceID);
            return allowed && post.date_updated;
        })
        .sort((a, b) => new Date(a.date_updated!).getTime() - new Date(b.date_updated!).getTime());

    const isToday = (dateStr: string | null) =>
        dateStr?.slice(0, 10) === todayStr;

    const countFiltered = (type: string, key: "typeclient" | "status") =>
        filteredSortedAccounts.filter((p) => p[key] === type && isToday(p.date_updated)).length;

    const generateActivityNumber = (companyname: string, referenceid: string): string => {
        const firstLetter = companyname.charAt(0).toUpperCase();
        const firstTwoRef = referenceid.substring(0, 2).toUpperCase();
        const now = new Date();
        const day = now.getDate().toString().padStart(2, "0");
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const formattedDate = `${day}${month}`;
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        return `${firstLetter}-${firstTwoRef}-${formattedDate}-${randomNumber}`;
    };

    const getDateUpdated = (typeclient: string, status?: string) => {
        const now = new Date();

        if (typeclient === "Top 50") {
            now.setDate(now.getDate() + 15); // every 15 days
        } else if (["Next 30", "Balance 20"].includes(typeclient)) {
            now.setMonth(now.getMonth() + 1); // monthly
        }

        if (status === "New Client") {
            now.setMonth(now.getMonth() + 1); // once a month
        } else if (status === "Inactive" || status === "Non-Buying") {
            now.setMonth(now.getMonth() + 3); // quarterly
        }

        return now.toISOString().slice(0, 10);
    };

    const handleSubmit = async (post: Post) => {
        if (!post.id) return toast.error("Missing ID for status update.");

        const activitynumber = generateActivityNumber(post.companyname, userDetails.ReferenceID);

        const payload = {
            ...post,
            referenceid: userDetails.ReferenceID,
            tsm: userDetails.TSM,
            manager: userDetails.Manager,
            targetquota: userDetails.TargetQuota,
            activitystatus: "Cold",
            activitynumber
        };

        try {
            const res = await fetch("/api/ModuleSales/Task/ScheduleTask/PostData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                return toast.error(err.message || "Failed to add activity.");
            }

            const date_updated = getDateUpdated(post.typeclient);

            const statusUpdate = await fetch("/api/ModuleSales/Task/ScheduleTask/EditStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: post.id, date_updated }),
            });

            if (statusUpdate.ok) {
                toast.success("Activity added and status updated!");
                fetchData();
            } else {
                const updateErr = await statusUpdate.json();
                toast.warn(`Activity added, but failed to update status: ${updateErr.message}`);
            }
        } catch (err) {
            toast.error("Submission failed.");
            console.error(err);
        }
    };

    return (
        <div className="bg-white col-span-3 space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={toggleAll}
                    className="border text-[10px] px-2 py-2 rounded-full transition"
                >
                    {allExpanded ? <GoDash /> : <GoPlus />}
                </button>
            </div>

            <Section title="Top 50 Accounts" count={countFiltered("Top 50", "typeclient")} open={expandedFilters.top50} onToggle={() => toggleFilter("top50")}>
                <FilterTop50 {...{ userDetails, posts: filteredSortedAccounts, handleSubmit, expandedIds, setExpandedIds }} />
            </Section>

            <Section title="Next 30 Accounts" count={countFiltered("Next 30", "typeclient")} open={expandedFilters.next30} onToggle={() => toggleFilter("next30")}>
                <FilterNext30 {...{ userDetails, posts: filteredSortedAccounts, handleSubmit, expandedIds, setExpandedIds }} />
            </Section>

            <Section title="Balance 20 Accounts" count={countFiltered("Balance 20", "typeclient")} open={expandedFilters.balance20} onToggle={() => toggleFilter("balance20")}>
                <FilterBalance20 {...{ userDetails, posts: filteredSortedAccounts, handleSubmit, expandedIds, setExpandedIds }} />
            </Section>

            <Section title="New Clients Accounts" count={countFiltered("New Client", "status")} open={expandedFilters.newclient} onToggle={() => toggleFilter("newclient")}>
                <FilterNewClient {...{ userDetails, posts: filteredSortedAccounts, handleSubmit, expandedIds, setExpandedIds }} />
            </Section>

            <Section title="New Inactive Accounts" count={countFiltered("Inactive", "status")} open={expandedFilters.inactive} onToggle={() => toggleFilter("inactive")}>
                <FilterInactiveClient {...{ userDetails, posts: filteredSortedAccounts, handleSubmit, expandedIds, setExpandedIds }} />
            </Section>

            <Section title="Non-Buying Accounts" count={countFiltered("Non-Buying", "status")} open={expandedFilters.nonbuying} onToggle={() => toggleFilter("nonbuying")}>
                <FilterNonBuyingClient {...{ userDetails, posts: filteredSortedAccounts, handleSubmit, expandedIds, setExpandedIds }} />
            </Section>
        </div>
    );
};

const Section: React.FC<{
    title: string;
    count?: number;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}> = ({ title, count, open, onToggle, children }) => (
    <div>
        <div
            className="cursor-pointer px-2 py-2 hover:bg-gray-200 hover:text-black hover:rounded-md flex justify-between items-center"
            onClick={onToggle}
        >
            <span className="font-medium text-[10px] uppercase flex items-center gap-2">
                {title}
                {count ? (
                    <span className="bg-red-600 text-white text-[8px] px-2 py-0.5 rounded-full">
                        {count}
                    </span>
                ) : null}
            </span>
            <span className="text-[10px] text-white hover:text-black">
                {open ? "Collapse ▲" : "Expand ▼"}
            </span>
        </div>
        {open && <div>{children}</div>}
    </div>
);

export default Automation;
