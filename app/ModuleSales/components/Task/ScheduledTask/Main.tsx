import React from "react";
import MainCardTable from "./MainCardTable";
import Automation from "./Automation";

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
  
    <div className="grid grid-cols-4 gap-4">
      <MainCardTable posts={posts} userDetails={userDetails} fetchAccount={fetchAccount} />
      <div className="col-span-1">
      <Automation posts={posts} userDetails={userDetails} fetchAccount={fetchAccount} />
      </div>
    </div>
  );
};

export default Main;
