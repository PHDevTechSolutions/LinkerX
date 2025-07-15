"use client";

import React, { useState } from "react";
import Analytics from "./Charts/Analytics";

interface AssetItem {
  _id?: string;
  location: string;
  designation: string;
  brand: string;
  model: string;
  remarks: string;
  price: number;
  serialNumber: string;
  ipAddress: string;
  macAddress: string;
  type: string;
  printerName: string;
  warrantyDate: string;
  siNumber: string;
  dateOfPurchase: string;
  status?: string;
  oldUser?: string;
  newUser?: string;
  dateRelease?: string;
  dateReturn?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  accessories?: string;
  inclusions?: string;
}

interface TableProps {
  posts: AssetItem[];
  loading: boolean;
  handleEdit: (item: AssetItem) => void;
  handleDelete: (id: string) => void;
}

const Table: React.FC<TableProps> = ({ posts, loading, handleEdit, handleDelete }) => {
  const [activeTab, setActiveTab] = useState<"laptop" | "printer" | "analytics">("laptop");

  const filteredPosts = posts.filter((item) => {
    if (activeTab === "laptop") return item.type === "Laptop" || item.type === "Desktop";
    if (activeTab === "printer") return item.type === "Printer";
    return false;
  });

  return (
    <div>
      {/* Tab Buttons */}
      <div className="mb-2 flex gap-2 text-xs">
        <button
          onClick={() => setActiveTab("laptop")}
          className={`px-3 py-1 ${activeTab === "laptop" ? "border-b-2 border-black text-black" : ""}`}
        >
          Laptop/Desktop
        </button>
        <button
          onClick={() => setActiveTab("printer")}
          className={`px-3 py-1 ${activeTab === "printer" ? "border-b-2 border-black text-black" : ""}`}
        >
          Printer
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-3 py-1 ${activeTab === "analytics" ? "border-b-2 border-black text-black" : ""}`}
        >
          Analytics
        </button>
      </div>

      {/* Table or Analytics Display */}
      {activeTab === "analytics" ? (
        <Analytics data={posts} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                {activeTab === "laptop" ? (
                  <>
                    <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Designation</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Old User</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">New User</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Date Release</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Date Return</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Brand</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Model</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Processor</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">RAM</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Storage</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Accessories</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Warranty</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">SI#</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Purchase</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">SN#</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Inclusions</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Remarks</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Designation</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Brand</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Model</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Serial</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Printer Name</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">IP</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">MAC</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Warranty</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">SI#</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Purchase</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Remarks</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((item) => (
                <tr key={item._id} className="border-b whitespace-nowrap hover:bg-gray-100 capitalize">
                  <td className="px-4 py-2 text-xs">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 ml-2 text-[10px] text-white bg-blue-500 hover:bg-blue-800 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => item._id && handleDelete(item._id)}
                      className="px-3 py-1 ml-2 text-[10px] text-white bg-red-500 hover:bg-red-800 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                  {activeTab === "laptop" ? (
                    <>
                      <td className="px-4 py-2 text-xs">{item.location}</td>
                      <td className="px-4 py-2 text-xs">{item.designation}</td>
                      <td className="px-4 py-2 text-xs">{item.status}</td>
                      <td className="px-4 py-2 text-xs">{item.oldUser}</td>
                      <td className="px-4 py-2 text-xs">{item.newUser}</td>
                      <td className="px-4 py-2 text-xs">{item.dateRelease}</td>
                      <td className="px-4 py-2 text-xs">{item.dateReturn}</td>
                      <td className="px-4 py-2 text-xs">{item.brand}</td>
                      <td className="px-4 py-2 text-xs">{item.model}</td>
                      <td className="px-4 py-2 text-xs">{item.processor}</td>
                      <td className="px-4 py-2 text-xs">{item.ram}GB</td>
                      <td className="px-4 py-2 text-xs">{item.storage}</td>
                      <td className="px-4 py-2 text-xs">{item.accessories}</td>
                      <td className="px-4 py-2 text-xs">{item.warrantyDate}</td>
                      <td className="px-4 py-2 text-xs">{item.siNumber}</td>
                      <td className="px-4 py-2 text-xs">{item.dateOfPurchase}</td>
                      <td className="px-4 py-2 text-xs">{item.serialNumber}</td>
                      <td className="px-4 py-2 text-xs">{item.inclusions}</td>
                      <td className="px-4 py-2 text-xs">{item.remarks}</td>
                      <td className="px-4 py-2 text-xs">₱{item.price.toLocaleString()}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 text-xs">{item.location}</td>
                      <td className="px-4 py-2 text-xs">{item.designation}</td>
                      <td className="px-4 py-2 text-xs">{item.brand}</td>
                      <td className="px-4 py-2 text-xs">{item.model}</td>
                      <td className="px-4 py-2 text-xs">{item.serialNumber}</td>
                      <td className="px-4 py-2 text-xs">{item.printerName}</td>
                      <td className="px-4 py-2 text-xs">{item.ipAddress}</td>
                      <td className="px-4 py-2 text-xs">{item.macAddress}</td>
                      <td className="px-4 py-2 text-xs">{item.type}</td>
                      <td className="px-4 py-2 text-xs">{item.warrantyDate}</td>
                      <td className="px-4 py-2 text-xs">{item.siNumber}</td>
                      <td className="px-4 py-2 text-xs">{item.dateOfPurchase}</td>
                      <td className="px-4 py-2 text-xs">{item.remarks}</td>
                      <td className="px-4 py-2 text-xs">₱{item.price.toLocaleString()}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;
