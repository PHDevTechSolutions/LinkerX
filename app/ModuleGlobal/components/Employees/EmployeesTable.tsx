import React, { useEffect, useState } from "react";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
  Role: string;
  Department: string;
  TSM: string;
  fetchUsers: () => void;
}

const UsersCard: React.FC<UsersCardProps> = ({
  posts,
  handleEdit,
  handleDelete,
  fetchUsers,
}) => {
  const [updatedUser, setUpdatedUser] = useState(posts);
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  const statusColors: { [key: string]: string } = {
    Active: "bg-green-800",
    Inactive: "bg-red-500",
    Resigned: "bg-red-700",
    Terminated: "bg-yellow-600",
    Locked: "bg-gray-500",
  };

  const getDepartmentBorder = (department: string) => {
    switch (department) {
      case "CSR":
        return "border-l-4 border-blue-900";
      case "Sales":
        return "border-l-4 border-emerald-900";
      case "IT Department":
        return "border-l-4 border-black";
      case "VIP Master Developer":
        return "bg-black text-white"; // no border, full custom styling
      default:
        return "border-l-4 border-gray-200";
    }
  };

  // Filter posts based on department and status
  const filteredUsers = updatedUser.filter((post) => {
    const matchesDepartment = departmentFilter === "All" || post.Department === departmentFilter;
    const matchesStatus = statusFilter === "All" || post.Status === statusFilter;
    return matchesDepartment && matchesStatus;
  });

  return (
    <div className="mb-4">
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
          >
            <option value="All">All</option>
            <option value="CSR">CSR Department</option>
            <option value="Sales">Sales Department</option>
            <option value="IT Department">IT Department</option>
          </select>
        </div>
        <div className="flex flex-col">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Resigned">Resigned</option>
            <option value="Terminated">Terminated</option>
            <option value="Locked">Locked</option>
          </select>
        </div>
      </div>

      {/* Display filtered users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((post) => {
            const isVIP = post.Email === "phdevtechsolutions@gmail.com";

            return (
              <div
                key={post._id}
                className={`relative border rounded-md shadow-md p-4 flex flex-col ${
                  isVIP ? "bg-black text-white" : "bg-white text-gray-800"
                } ${getDepartmentBorder(post.Department)}`}
              >
                {isVIP && (
                  <div className="absolute top-0 right-0 m-2">
                    <span className="bg-yellow-400 text-black text-[8px] px-2 py-1 rounded-full font-semibold">
                      Master Developer | VIP
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <h3 className="text-xs font-semibold capitalize">
                    {post.ReferenceID} | {post.Lastname}, {post.Firstname}
                  </h3>
                </div>

                <div className="mt-4 mb-4 text-xs">
                  <p>
                    <strong>Email:</strong> {post.Email}
                  </p>
                  <p className="capitalize">
                    <strong>Contact Number: </strong> {post.ContactNumber}
                  </p>
                  <p className="capitalize">
                    <strong>Nickname:</strong> {post.userName}
                  </p>
                </div>

                <div className="mt-auto border-t pt-2 text-xs">
                  {!isVIP && (
                    <p>
                      <strong>Department:</strong> {post.Department}
                    </p>
                  )}
                  <p>
                    <strong>Role:</strong> {post.Role}
                  </p>
                  <p className="mt-2">
                    <span
                      className={`badge text-white text-[8px] px-2 py-1 mr-2 rounded-xl ${
                        statusColors[post.Status] || "bg-gray-400"
                      }`}
                    >
                      {post.Status}
                    </span>
                    {post.TSM}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-4 text-xs">
            No accounts available
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersCard;
