import React, { useMemo, useState } from "react";
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
  status: string;
}

interface FilterCardProps {
  userDetails: any;
  posts: Post[];
  handleSubmit: (post: Post) => void;
  expandedIds: string[];
  setExpandedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterNewClient: React.FC<FilterCardProps> = ({
  userDetails,
  posts,
  handleSubmit,
  expandedIds,
  setExpandedIds,
}) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const filteredAccounts = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);

    return posts
      .filter((post) => post.status === "New Client")
      .filter(
        (post) =>
          post.date_updated !== null &&
          !isNaN(new Date(post.date_updated).getTime())
      )
      .filter((post) => {
        const postDateStr = new Date(post.date_updated!).toISOString().slice(0, 10);
        return postDateStr === todayStr;
      })
      .sort(
        (a, b) =>
          new Date(a.date_updated!).getTime() - new Date(b.date_updated!).getTime()
      );
  }, [posts]);

  const handleAdd = (post: Post) => {
    if (window.confirm(`Do you want to add ${post.companyname}?`)) {
      handleSubmit(post);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid">
        {filteredAccounts.length === 0 && (
          <p className="text-xs text-center text-gray-500">
            No callbacks today.
          </p>
        )}

        {filteredAccounts.map((post) => {
          const isExpanded = expandedIds.includes(post.id);

          return (
            <div
              key={post.id}
              className="p-4 hover:rounded-xl hover:shadow-lg border-b transition duration-300"
            >
              <input
                type="hidden"
                name="referenceid"
                value={userDetails.ReferenceID}
              />
              <input type="hidden" name="tsm" value={userDetails.TSM} />
              <input type="hidden" name="manager" value={userDetails.Manager} />

              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setExpandedIds((prev) =>
                    prev.includes(post.id)
                      ? prev.filter((id) => id !== post.id)
                      : [...prev, post.id]
                  )
                }
              >
                <p
                  className="text-[10px] font-bold text-gray-800 uppercase"
                  style={{
                    maxWidth: "calc(100% - 60px)",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {post.companyname}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(post);
                  }}
                  className="flex items-center gap-1 bg-blue-400 hover:bg-blue-700 text-white text-[10px] px-3 py-1 rounded-full shadow"
                >
                  <FaPlusCircle size={10} />
                  Add
                </button>
              </div>

              {isExpanded && (
                <div className="mt-3 space-y-1 text-xs text-gray-700">
                  <p className="text-[10px] text-blue-600 font-semibold uppercase">
                    {post.typeclient}
                  </p>
                  <div className="flex items-center gap-2">
                    <FcBusinessman size={16} />
                    <span className="font-medium capitalize">
                      {post.contactperson}
                    </span>
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
                    <span className="font-medium capitalize truncate">
                      {post.address}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterNewClient;
