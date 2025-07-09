import React, { useState, useMemo } from "react";

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
  editedPostId?: string;
}

const AccountsTable: React.FC<AccountsTableProps> = ({
  posts,
  handleEdit,
  handleDelete,
  Role,
  loading = false,
  editedPostId,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Post; direction: "asc" | "desc" } | null>(null);

  const filteredSortedPosts = useMemo(() => {
    let sorted = posts;
    if (sortConfig !== null) {
      sorted = posts.slice().sort((a, b) => {
        const aKey = a[sortConfig.key];
        const bKey = b[sortConfig.key];
        if (typeof aKey === "string" && typeof bKey === "string") {
          return sortConfig.direction === "asc"
            ? aKey.localeCompare(bKey)
            : bKey.localeCompare(aKey);
        }
        return 0;
      });
    }
    return sorted;
  }, [posts, sortConfig]);

  const handleSort = (key: keyof Post) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : filteredSortedPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No data found.</div>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
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
                    <span aria-hidden="true">
                      {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                    </span>
                  )}
                </th>
              ))}
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
                <td className="px-6 py-4 text-xs">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                </td>
                <td className="px-6 py-4 text-xs uppercase">{post.CompanyName}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.CustomerName}</td>
                <td className="px-6 py-4 text-xs">{post.Gender}</td>
                <td className="px-6 py-4 text-xs">{post.ContactNumber}</td>
                <td className="px-6 py-4 text-xs">{post.Email}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.CityAddress}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerSegment || "N/A"}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountsTable;
