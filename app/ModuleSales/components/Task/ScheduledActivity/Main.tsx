import React from "react";
import MainCardTable from "./MainCardTable";
import Automation from "./Automation";
import Inquiries from "./Inquiries";
import { formatDistanceToNow } from "date-fns";
import { CiLocationArrow1 } from "react-icons/ci";

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

interface UsersTableProps {
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

const Main: React.FC<UsersTableProps> = ({ posts, userDetails, fetchAccount }) => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        
        {/* Main Table Section */}
        <section className="lg:col-span-3 bg-white rounded-xl">
          <MainCardTable posts={posts} userDetails={userDetails} fetchAccount={fetchAccount} />
        </section>

        {/* Sidebar Section */}
        <aside className="lg:col-span-1 flex flex-col space-y-2">
          
          {/* Scheduled Task */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Callbacks</h2>
            <Automation posts={posts} userDetails={userDetails} fetchAccount={fetchAccount} />
          </div>

          {/* CSR Inquiries */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">CSR Inquiries</h2>
            <Inquiries
              activeTab="endorsed"
              formatDistanceToNow={formatDistanceToNow}
              CiLocationArrow1={CiLocationArrow1}
              fetchAccount={fetchAccount}
              TargetQuota={userDetails.TargetQuota}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Main;
