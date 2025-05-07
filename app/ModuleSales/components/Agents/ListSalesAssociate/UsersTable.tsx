import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu } from "@headlessui/react";

import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register necessary Chart.js components
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  userDetails: any;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, userDetails }) => {
  const [updatedUser, setUpdatedUser] = useState(posts);

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  const statusColors: { [key: string]: string } = {
    Active: "bg-green-500",
    Inactive: "bg-red-400",
    Resigned: "bg-red-500",
    Terminated: "bg-yellow-400",
    Locked: "bg-gray-400",
  };

  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {updatedUser.length > 0 ? (
          updatedUser.map((post) => (
            <div key={post._id} className="relative border rounded-md shadow-md p-4 flex flex-col bg-white">
              <p className="text-xs capitalize">{post.Lastname}, {post.Firstname}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="mt-4 mb-4 text-xs">
                  <p><strong>Email:</strong> {post.Email}</p>
                  <p className="capitalize"><strong>Role:</strong> {post.Role}</p>
                </div>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button><BsThreeDotsVertical /></Menu.Button>
                  </div>
                  <Menu.Items className="absolute right-0 mt-2 w-29 bg-white shadow-md rounded-md z-10">
                    <button className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleEdit(post)}>View Information</button>
                  </Menu.Items>
                </Menu>
              </div>
              <div className="mt-auto border-t pt-2 text-xs text-gray-900">
                <p><strong>Department:</strong> {post.Department}</p>
                <p><strong>Location:</strong> {post.Location}</p>
                <p className="mt-2">
                  <span className={`badge text-white text-[8px] px-2 py-1 rounded-xl ${statusColors[post.Status] || "bg-gray-400"}`}>
                    {post.Status}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-4 text-xs">No accounts available</div>
        )}
      </div>
    </div>
  );
};

export default UsersCard;