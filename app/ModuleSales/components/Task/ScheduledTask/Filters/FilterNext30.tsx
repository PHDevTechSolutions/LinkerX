import React, { useMemo, useEffect, useState } from "react";
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

const FilterNext30: React.FC<FilterCardProps> = ({
  userDetails,
  posts,
  handleSubmit,
  expandedIds,
  setExpandedIds,
}) => {
  const pageSize = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [addCount, setAddCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Load add count from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("next30_add_tracker");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      if (parsed.date === today) {
        setAddCount(parsed.count);
        setIsLimitReached(parsed.count >= pageSize);
      } else {
        // Reset for new day
        localStorage.setItem(
          "next30_add_tracker",
          JSON.stringify({ date: today, count: 0 })
        );
      }
    } else {
      localStorage.setItem(
        "next30_add_tracker",
        JSON.stringify({ date: today, count: 0 })
      );
    }
  }, [today]);

  // Filter posts
  const filteredAccounts = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10); // Get YYYY-MM-DD for today

    return posts
      .filter((post) => post.typeclient === "Next 30")
      .filter(
        (post) =>
          post.date_updated !== null &&
          !isNaN(new Date(post.date_updated).getTime())
      )
      // New filter: date_updated is today
      .filter((post) => {
        const postDateStr = new Date(post.date_updated!).toISOString().slice(0, 10);
        return postDateStr === todayStr;
      })
      .sort(
        (a, b) =>
          new Date(a.date_updated!).getTime() - new Date(b.date_updated!).getTime()
      );
  }, [posts]);

  const totalFilteredPages = Math.ceil(filteredAccounts.length / pageSize);

  useEffect(() => {
    if (currentPage > totalFilteredPages) {
      setCurrentPage(1);
    }
  }, [totalFilteredPages, currentPage]);

  const currentPosts = filteredAccounts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalFilteredPages));

  const handleAdd = (post: Post) => {
    if (window.confirm(`Do you want to add ${post.companyname}?`)) {
      const newCount = addCount + 1;
      setAddCount(newCount);
      setIsLimitReached(newCount >= pageSize);

      localStorage.setItem(
        "next30_add_tracker",
        JSON.stringify({ date: today, count: newCount })
      );

      handleSubmit(post);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid">
        {isLimitReached && (
          <p className="text-red-500 text-xs text-center font-medium">
            Daily limit reached. You can add again tomorrow.
          </p>
        )}

        {currentPosts.length === 0 && (
          <p className="text-xs text-center text-gray-500">
            No Next 30 accounts to display.
          </p>
        )}

        {!isLimitReached &&
          currentPosts.map((post) => {
            const isExpanded = expandedIds.includes(post.id);

            return (
              <div
                key={post.id}
                className="border-b border-gray-200 p-4 hover:rounded-xl hover:shadow-lg transition duration-300"
              >
                <input
                  type="hidden"
                  name="referenceid"
                  value={userDetails.ReferenceID}
                />
                <input type="hidden" name="tsm" value={userDetails.TSM} />
                <input
                  type="hidden"
                  name="manager"
                  value={userDetails.Manager}
                />

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
                    className="flex items-center gap-1 bg-blue-400 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow"
                  >
                    <FaPlusCircle size={12} />
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

export default FilterNext30;
