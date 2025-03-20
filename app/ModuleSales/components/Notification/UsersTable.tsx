import React, { useEffect, useState } from "react";

interface UsersCardProps {
  posts: any[];
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  return (
    <div className="mb-4">
      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Date Created</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Callback</th>
              <th className="p-2 border">Type</th>
            </tr>
          </thead>
          <tbody>
            {updatedUser.length > 0 ? (
              updatedUser.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {new Date(post.date_created).toLocaleString()}
                  </td>
                  <td className="p-2 border">{post.message || "N/A"}</td>
                  <td className="p-2 border">
                    {post.callback ? (
                      <span className="text-blue-500">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="p-2 border">{post.type || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersCard;
