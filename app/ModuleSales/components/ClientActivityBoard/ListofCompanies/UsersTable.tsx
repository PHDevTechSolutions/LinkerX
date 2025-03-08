import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu } from "@headlessui/react";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  return (
    <div className="mb-4">
      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {updatedUser.length > 0 ? (
          updatedUser.map((post) => (
            <div key={post.id} className="relative border rounded-md shadow-md p-4 flex flex-col bg-white">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase">{post.companyname}</h3>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="mt-4 mb-4 text-xs">
                  <p><strong>Contact Person:</strong> <span className="capitalize">{post.contactperson}</span></p>
                  <p><strong>Contact Number:</strong> {post.contactnumber}</p>
                  <p><strong>Email Address:</strong> {post.emailaddress}</p>
                  <div className="border-t border-gray-800 pb-4 mt-4"></div>
                  <p className="mt-2"><strong>Address:</strong><span className="capitalize">{post.address}</span></p>
                  <p><strong>Area:</strong><span className="capitalize">{post.area}</span></p>
                  <p className="mt-2"><strong>Type of Client:</strong><span className="uppercase"> {post.typeclient}</span></p>
                </div>
                <Menu as="div" className="relative inline-block text-left">
                  <div><Menu.Button><BsThreeDotsVertical /></Menu.Button></div>
                  <Menu.Items className="absolute right-0 mt-2 w-29 bg-white shadow-md rounded-md z-10">
                    <button className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleEdit(post)}>Edit</button>
                  </Menu.Items>
                </Menu>
              </div>
              <div className="mt-auto border-t pt-2 text-xs text-gray-900">
                <p><strong>TSA:</strong> {post.referenceid} | <strong>TSM:</strong> {post.tsm}</p>
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
