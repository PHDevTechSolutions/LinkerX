import React from "react";

interface OverviewProps {
  post: {
    companyname: string;
    contactperson: string;
    contactnumber: string;
    emailaddress: string;
    address: string;
    area: string;
    companygroup: string;
    typeclient: string;
  };
}

const Overview: React.FC<OverviewProps> = ({ post }) => {
  return (
    <div className="space-y-6 text-xs text-gray-700 font-sans border rounded-md p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          ["Company Name", post.companyname],
          ["Contact Person", post.contactperson],
          ["Contact Number", post.contactnumber],
          ["Email Address", post.emailaddress],
          ["Address", post.address],
          ["Area", post.area],
          ["Company Group", post.companygroup],
          ["Type Client", post.typeclient],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <span className="font-semibold text-gray-800">{label}:</span>
            <span className="truncate">{value || "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
