import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

interface Post {
  _id: string;
  CompanyName: string;
  CustomerName: string;
  Gender: string;
  ContactNumber: string;
  Email: string;
  CityAddress: string;
  CustomerSegment?: string;
  CustomerType?: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  Role: string;
  loading?: boolean;
  editedPostId?: string; // to highlight edited row
}

const AccountsTable: React.FC<AccountsTableProps> = ({
  posts,
  handleEdit,
  handleDelete,
  Role,
  loading = false,
  editedPostId,
}) => {
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Removed filter state and inputs

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: keyof Post; direction: "asc" | "desc" } | null>(null);

  // Sorting posts only (no filtering)
  const filteredSortedPosts = useMemo(() => {
    let sorted = posts;
    if (sortConfig !== null) {
      sorted = posts.slice().sort((a, b) => {
        const aKey = a[sortConfig.key];
        const bKey = b[sortConfig.key];
        if (typeof aKey === "string" && typeof bKey === "string") {
          if (sortConfig.direction === "asc") {
            return aKey.localeCompare(bKey);
          } else {
            return bKey.localeCompare(aKey);
          }
        }
        return 0;
      });
    }
    return sorted;
  }, [posts, sortConfig]);

  // Close menu on outside click
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuPostId(null);
      }
    },
    [setOpenMenuPostId]
  );

  useEffect(() => {
    if (openMenuPostId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenuPostId, handleClickOutside]);

  // Keyboard accessibility for menu button and menu (escape key to close menu)
  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, postId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenMenuPostId((prev) => (prev === postId ? null : postId));
    }
    if (event.key === "Escape") {
      setOpenMenuPostId(null);
    }
  };

  const onMenuDivKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setOpenMenuPostId(null);
    }
  };

  // Confirmation dialog on delete
  const onDeleteClick = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      handleDelete(postId);
      setOpenMenuPostId(null);
    }
  };

  // Sorting helper UI
  const handleSort = (key: keyof Post) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto">
      {/* Removed filter inputs */}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : filteredSortedPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No data found.</div>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              {[
                { key: "CompanyName", label: "Company Name" },
                { key: "CustomerName", label: "Customer Name" },
                { key: "Gender", label: "Gender" },
                { key: "ContactNumber", label: "Contact Number" },
                { key: "Email", label: "Email" },
                { key: "CityAddress", label: "City Address" },
                { key: "CustomerSegment", label: "Segment" },
                { key: "CustomerType", label: "Customer Type" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-4 font-semibold text-gray-700 cursor-pointer select-none"
                  onClick={() => handleSort(key as keyof Post)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSort(key as keyof Post);
                    }
                  }}
                  aria-sort={
                    sortConfig?.key === key
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  role="columnheader"
                  scope="col"
                >
                  {label}
                  {sortConfig?.key === key && (
                    <span aria-hidden="true">{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
              ))}
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSortedPosts.map((post) => (
              <tr
                key={post._id}
                className={`border-b whitespace-nowrap ${
                  editedPostId === post._id ? "bg-emerald-100" : ""
                }`}
              >
                <td className="px-6 py-4 text-xs uppercase">{post.CompanyName}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.CustomerName}</td>
                <td className="px-6 py-4 text-xs">{post.Gender}</td>
                <td className="px-6 py-4 text-xs">{post.ContactNumber}</td>
                <td className="px-6 py-4 text-xs">{post.Email}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.CityAddress}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerSegment || "N/A"}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerType}</td>
                <td className="px-6 py-4 text-xs relative">
                  <button
                    onClick={() =>
                      setOpenMenuPostId((prev) => (prev === post._id ? null : post._id))
                    }
                    onKeyDown={(e) => onMenuKeyDown(e, post._id)}
                    aria-haspopup="true"
                    aria-expanded={openMenuPostId === post._id}
                    aria-controls={`menu-${post._id}`}
                    className="text-gray-500 hover:text-gray-800 focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded"
                    tabIndex={0}
                    title="Actions menu"
                  >
                    <BsThreeDotsVertical size={14} />
                  </button>

                  {openMenuPostId === post._id && (
                    <div
                      ref={menuRef}
                      id={`menu-${post._id}`}
                      role="menu"
                      aria-label="Actions"
                      tabIndex={-1}
                      onKeyDown={onMenuDivKeyDown}
                      className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border w-36 z-10 text-xs"
                    >
                      <button
                        onClick={() => {
                          handleEdit(post);
                          setOpenMenuPostId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-200"
                        role="menuitem"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => onDeleteClick(post._id)}
                        className="border-t w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200"
                        role="menuitem"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountsTable;
