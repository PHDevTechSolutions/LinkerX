import React, { useState } from "react";
import Overview from "./Tabs/Overview";
import Sales from "./Tabs/Sales";
import QuotationSales from "./Tabs/QuotationSales";
import CallDetails from "./Tabs/CallDetails";
import PerformanceAnalytics from "./Tabs/PerformanceAnalytics";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  emailaddress: string;
  typeclient: string;
  address: string;
  area: string;
  projectname: string;
  projectcategory: string;
  projecttype: string;
  source: string;
  activitystatus: string;
  targetquota: string;
  typeactivity: string;
  callback: string;
  callstatus: string;
  typecall: string;
  remarks: string;
  quotationnumber: string;
  quotationamount: string;
  sonumber: string;
  soamount: string;
  startdate: string;
  enddate: string;
  date_created: string;
  date_updated: string;
  ticketreferencenumber: string;
  wrapup: string;
  inquiries: string;
  csragent: string;
  activityremarks: string;
  csrremarks: string;
  deliveryaddress: string;
  companygroup: string;
  paymentterm: string;
  actualsales: string;
  dealClosed?: boolean; // add optional dealClosed if relevant
}

// Define SalesRecord interface expected by PerformanceAnalytics
interface SalesRecord {
  project: string;
  date_created: string;
  quotationamount: number;
  actualsales: number;
  targetquota: number;
  csragent: string;
  callstatus: string;
  callback: string;
  soamount: number;
  projectname: string;
}

interface MainModalProps {
  selectedPosts: Post[] | null;
  onClose: () => void;
}

const tabs = [
  "Details",
  "Sales Data",
  "Quotations & SO",
  "Call Details",
  "Performance & Analytics",
];

const transformPostsToSalesRecords = (posts: Post[]): SalesRecord[] => {
  return posts.map((post) => ({
    project: post.projectname || "Unknown",
    date_created: post.date_created,
    quotationamount: Number(post.quotationamount) || 0,
    actualsales: Number(post.actualsales) || 0,
    targetquota: Number(post.targetquota) || 0,
    csragent: post.csragent,
    callstatus: post.callstatus,
    callback: post.callback,
    projectname: post.projectname,
    soamount: Number(post.soamount) || 0,
  }));
};

const MainModal: React.FC<MainModalProps> = ({ selectedPosts, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!selectedPosts || selectedPosts.length === 0) return null;

  // Group posts by companyname
  const groupedPosts = selectedPosts.reduce((groups, post) => {
    const key = post.companyname || "Unknown";
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
    return groups;
  }, {} as Record<string, Post[]>);

  // Transform groupedPosts into SalesRecord type for PerformanceAnalytics
  const salesGroupedPosts: Record<string, SalesRecord[]> = {};
  for (const company in groupedPosts) {
    salesGroupedPosts[company] = transformPostsToSalesRecords(groupedPosts[company]);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-[999] flex items-center justify-center p-6">
      <div
        className="
          bg-white
          w-full
          max-w-7xl
          rounded-lg
          shadow-xl
          p-6
          overflow-y-auto
          max-h-[95vh]
          relative
          flex flex-col
        "
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-lg font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>
        <h2 className="text-md font-bold mb-6">
          {selectedPosts[0].companyname} - History ({selectedPosts.length} records)
        </h2>

        {/* Tabs */}
        <nav className="flex border-b border-gray-300 mb-4">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 text-xs font-medium ${
                activeTab === index
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-600 hover:text-orange-600"
              }`}
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`tab-panel-${index}`}
              id={`tab-${index}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Tab Panels */}
        <div
          id={`tab-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="overflow-auto max-h-[60vh]"
        >
          {activeTab === 0 && ( <> {Object.entries(groupedPosts).map(([companyname, posts]) => ( <div key={companyname} className="mb-4 border-b pb-4"> <Overview post={posts[0]} /> </div> ))} </> )}

          {activeTab === 1 && <Sales groupedPosts={groupedPosts} />}

          {activeTab === 2 && <QuotationSales groupedPosts={groupedPosts} />}

          {activeTab === 3 && <CallDetails groupedPosts={groupedPosts} />}

          {activeTab === 4 && <PerformanceAnalytics groupedPosts={salesGroupedPosts} />}
        </div>
      </div>
    </div>
  );
};

export default MainModal;
