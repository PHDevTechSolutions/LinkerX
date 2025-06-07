import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FilterTop50 from "./Filters/FilterTop50";
import FilterNext30 from "./Filters/FilterNext30";
import FilterBalance20 from "./Filters/FilterBalance20";
import FilterCSRClient from "./Filters/FilterCSRClient";
import FilterTSAClient from "./Filters/FilterTSAClient";

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
  posts: Post[];
  fetchAccount: () => void;
}

const STORAGE_KEY = "expandedFiltersState";

const MainCardTable: React.FC<MainCardTableProps> = ({ userDetails }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Load expandedFilters from localStorage or fallback to defaults
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // Invalid JSON fallback
          return {
            top50: true,
            next30: false,
            balance20: false,
            csr: false,
            tsa: false,
          };
        }
      }
    }
    return {
      top50: true,
      next30: false,
      balance20: false,
      csr: false,
      tsa: false,
    };
  });

  // Save to localStorage whenever expandedFilters change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedFilters));
    }
  }, [expandedFilters]);

  const toggleFilter = (key: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allExpanded = Object.values(expandedFilters).every(Boolean);

  const toggleAll = () => {
    if (allExpanded) {
      // Collapse all
      setExpandedFilters({
        top50: false,
        next30: false,
        balance20: false,
        csr: false,
        tsa: false,
      });
    } else {
      // Expand all
      setExpandedFilters({
        top50: true,
        next30: true,
        balance20: true,
        csr: true,
        tsa: true,
      });
    }
  };

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

  const referenceID = userDetails?.ReferenceID;
  const role = userDetails?.Role;

  const filteredSortedAccounts = posts
    .filter((post) => {
      const isAllowed =
        role === "Super Admin" ||
        role === "Special Access" ||
        (["Territory Sales Associate", "Territory Sales Manager"].includes(role) &&
          post.referenceid === referenceID);

      const hasValidDate =
        post.date_updated !== null && !isNaN(new Date(post.date_updated).getTime());

      return isAllowed && hasValidDate;
    })
    .sort((a, b) => new Date(a.date_updated!).getTime() - new Date(b.date_updated!).getTime());

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

  const handleSubmit = async (post: Post) => {
    if (!post.id) {
      toast.error("Missing ID for status update.");
      return;
    }

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
      targetquota: userDetails.TargetQuota,
      ticketreferencenumber: post.ticketreferencenumber || "",
      typeclient: post.typeclient,
      activitystatus: "Cold",
      activitynumber,
    };

    try {
      const res = await fetch("/api/ModuleSales/Task/ScheduleTask/PostData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const statusUpdateRes = await fetch("/api/ModuleSales/Task/DailyActivity/UpdateCompanyStatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: post.id, status: "Used" }),
        });

        if (statusUpdateRes.ok) {
          toast.success("Activity added and status updated!");
          fetchData();
        } else {
          const updateErr = await statusUpdateRes.json();
          toast.warn(`Activity added, but failed to update status: ${updateErr.message}`);
        }
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message || "Failed to add activity."}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 col-span-3 space-y-4">
      <div className="flex justify-end">
        <button
          onClick={toggleAll}
          className="bg-blue-400 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <Section title="Top 50 Accounts" open={expandedFilters.top50} onToggle={() => toggleFilter("top50")}>
        <FilterTop50
          userDetails={userDetails}
          posts={filteredSortedAccounts}
          handleSubmit={handleSubmit}
          expandedIds={expandedIds}
          setExpandedIds={setExpandedIds}
        />
      </Section>

      <Section title="Next 30 Accounts" open={expandedFilters.next30} onToggle={() => toggleFilter("next30")}>
        <FilterNext30
          userDetails={userDetails}
          posts={filteredSortedAccounts}
          handleSubmit={handleSubmit}
          expandedIds={expandedIds}
          setExpandedIds={setExpandedIds}
        />
      </Section>

      <Section title="Balance 20 Accounts" open={expandedFilters.balance20} onToggle={() => toggleFilter("balance20")}>
        <FilterBalance20
          userDetails={userDetails}
          posts={filteredSortedAccounts}
          handleSubmit={handleSubmit}
          expandedIds={expandedIds}
          setExpandedIds={setExpandedIds}
        />
      </Section>

      <Section title="CSR Clients" open={expandedFilters.csr} onToggle={() => toggleFilter("csr")}>
        <FilterCSRClient
          userDetails={userDetails}
          posts={filteredSortedAccounts}
          handleSubmit={handleSubmit}
          expandedIds={expandedIds}
          setExpandedIds={setExpandedIds}
        />
      </Section>

      <Section title="TSA Clients" open={expandedFilters.tsa} onToggle={() => toggleFilter("tsa")}>
        <FilterTSAClient
          userDetails={userDetails}
          posts={filteredSortedAccounts}
          handleSubmit={handleSubmit}
          expandedIds={expandedIds}
          setExpandedIds={setExpandedIds}
        />
      </Section>
    </div>
  );
};

// Reusable expandable section wrapper
const Section: React.FC<{
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, open, onToggle, children }) => (
  <div className="shadow-sm">
    <div
      className="cursor-pointer px-2 py-2 hover:bg-gray-200 flex justify-between items-center"
      onClick={onToggle}
    >
      <span className="font-medium text-[10px] uppercase">{title}</span>
      <span className="text-[10px] text-gray-500">{open ? "Collapse ▲" : "Expand ▼"}</span>
    </div>
    {open && <div>{children}</div>}
  </div>
);

export default MainCardTable;
