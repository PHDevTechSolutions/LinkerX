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
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [touchbaseData, setTouchbaseData] = useState<Record<string, number>>({});
  const [timeMotionData, setTimeMotionData] = useState<Record<string, number>>({});
  const [callData, setCallSummary] = useState<Record<string, number>>({});

  const [activityData, setActivityData] = useState<Record<string, number>>({
    outbound: 0,
    inbound: 0,
    otherActivities: 0,
  });

  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentYear = new Date().getFullYear().toString();

  const chartData = {
    labels: ["Outbound Call", "Client Engagement", "Other Activities"],
    datasets: [
      {
        data: [activityData.outbound, activityData.inbound, activityData.otherActivities], // Updated dataset
        backgroundColor: ["#990000", "#000068", "#1C3B0E"], // Colors for the segments
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
      },
      datalabels: {
        color: "#FFFFFF", // Dark text color
        font: {
          weight: "bold" as "bold", // Ensure type compatibility
          size: 14,
        },
        formatter: (value: number) => value, // Ensures values are displayed as is
      },
    },
  };
  
  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  useEffect(() => {
    fetchProgressData();
  }, [startdate, enddate]);

  // Function to open modal and set user
  const handleViewModal = (post: any) => {
    setSelectedUser(post);
    setIsModalOpen(true);
    fetchProgressData();
  };
  
  const fetchProgressData = async () => {
    try {
      const response = await fetch(
        `/api/ModuleSales/Agents/SalesAssociateActivity/FetchProgress?tsm=${encodeURIComponent(userDetails.ReferenceID)}`
      );
      const data = await response.json();

      if (!data.success) {
        console.error("Failed to fetch progress data:", data.error);
        return;
      }

      processFetchedData(data.data);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  };

  const processFetchedData = (data: any[]) => {
    let totalActualSales = 0;
    let monthToDateSales = 0;
    let yearToDateSales = 0;

    const countData = { outbound: 0, inbound: 0, otherActivities: 0 };

    const filteredData = data.filter((item) => {
      const itemDate = item.date_created.split("T")[0];
      return (!startdate || itemDate >= startdate) && (!enddate || itemDate <= enddate);
    });

    filteredData.forEach((item) => {
      if (item.typeactivity === "Outbound Call") {
        countData.outbound += 1;
      } else if (
        [
          "Inbound Call",
          "Assisting Other Agents Client",
          "Preparation: Bidding Preparation",
          "Client Meeting",
          "Site Visit",
          "Coordination of Pick-Up / Delivery to Client",
          "Email and Viber Checking",
          "Email Blast",
          "Email, SMS & Viber Replies",
          "Inbound Call - Existing",
          "Payment Follow-Up",
          "Quotation Follow-Up",
          "Preparation: Preparation of Quote: Existing Client",
          "Preparation: Preparation of Quote: New Client",
          "Preparation: Preparation of Report",
          "Walk-In Client",
        ].includes(item.typeactivity)
      ) {
        countData.inbound += 1;
      } else if (
        [
          "Account Development",
          "Accounting: Accounts Receivable and Payment",
          "Accounting: Billing Concern",
          "Accounting: Refund Request",
          "Accounting: Sales Order Concern",
          "Accounting: TPC Request",
          "Admin Concern: Coordination of Payment Terms Request",
          "CSR Inquiries",
          "Coordination With CS (Email Acknowledgement)",
          "Marketing Concern",
          "Logistic Concern: Shipping Cost Estimation",
          "Preparation: Preparation of SPF",
          "Preparation: Sales Order Preparation",
          "Technical: Dialux Simulation Request",
          "Technical: Drawing Request",
          "Technical: Inquiry",
          "Technical: Site Visit Request",
          "Technical: TDS Request",
          "Warehouse: Coordination to Billing",
          "Warehouse: Coordination to Dispatch",
          "Warehouse: Coordination to Inventory",
          "Warehouse: Delivery / Helper Concern",
          "Warehouse: Replacement Request / Concern",
          "Warehouse: Sample Request / Concern",
          "Warehouse: SO Status Follow Up",
        ].includes(item.typeactivity)
      ) {
        countData.otherActivities += 1;
      }
    });

    const activityCounts = countActivities(filteredData);
    const touchBaseCounts = countTouchBase(filteredData);
    const timeData = computeTimeSpent(filteredData);
    const callSummary = computeCallSummary(filteredData);

    data.forEach((item) => {
      const itemDate = item.date_created.split("T")[0];
      const itemMonth = item.date_created.slice(0, 7);
      const itemYear = item.date_created.slice(0, 4);

      totalActualSales += item.actualsales || 0;
      if (itemMonth === currentMonth) monthToDateSales += item.actualsales || 0;
      if (itemYear === currentYear) yearToDateSales += item.actualsales || 0;
    });

    setActivityData({
      MonthToDateSales: monthToDateSales,
      YearToDateSales: yearToDateSales,
      TotalActualSales: totalActualSales,
      ...activityCounts,
    });

    setTouchbaseData(touchBaseCounts);
    setTimeMotionData(timeData);
    setCallSummary(callSummary);
    setActivityData((prevData) => ({
      ...prevData,
      outbound: countData.outbound,
      inbound: countData.inbound,
      otherActivities: countData.otherActivities,
    }));
  };

  const countActivities = (data: any[]) =>
    data.reduce((acc: Record<string, number>, item) => {
      if (["Account Development", "Preparation: Preparation of Quote: Existing Client"].includes(item.typeactivity)) {
        acc[item.typeactivity] = (acc[item.typeactivity] || 0) + 1;
      }
      return acc;
    }, {});

  const countTouchBase = (data: any[]) =>
    data.reduce((acc: Record<string, number>, item) => {
      if (item.typecall === "Touch Base") {
        const key = `${item.typeclient}-${item.typecall}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});

  const computeCallSummary = (data: any[]) =>
    data.reduce(
      (acc: Record<string, number>, item) => {
        const itemDate = item.date_created.split("T")[0];
        const itemMonth = item.date_created.slice(0, 7);

        if (itemDate === today) {
          if (item.typeactivity === "Inbound Call") {
            acc["dailyInbound"] = (acc["dailyInbound"] || 0) + 1;
          }
          if (item.typeactivity === "Outbound Call") {
            acc["dailyOutbound"] = (acc["dailyOutbound"] || 0) + 1;
          }

          if (item.callstatus === "Successful") {
            acc["dailySuccessful"] = (acc["dailySuccessful"] || 0) + 1;
          } else if (item.callstatus === "Unsuccessful") {
            acc["dailyUnsuccessful"] = (acc["dailyUnsuccessful"] || 0) + 1;
          }

          // Total Outbound Calls = Successful + Unsuccessful
          acc["dailyOutbound"] = acc["dailySuccessful"] + acc["dailyUnsuccessful"];
        }

        if (itemMonth === currentMonth) {
          if (item.typeactivity === "Inbound Call") {
            acc["mtdInbound"] = (acc["mtdInbound"] || 0) + 1;
          }
          if (item.typeactivity === "Outbound Call") {
            acc["mtdOutbound"] = (acc["mtdOutbound"] || 0) + 1;
          }

          if (item.callstatus === "Successful") {
            acc["mtdSuccessful"] = (acc["mtdSuccessful"] || 0) + 1;
          } else if (item.callstatus === "Unsuccessful") {
            acc["mtdUnsuccessful"] = (acc["mtdUnsuccessful"] || 0) + 1;
          }

          // Total Outbound Calls = Successful + Unsuccessful
          acc["mtdOutbound"] = acc["mtdSuccessful"] + acc["mtdUnsuccessful"];
        }

        return acc;
      },
      {
        dailyInbound: 0,
        dailyOutbound: 0,
        dailySuccessful: 0,
        dailyUnsuccessful: 0,
        mtdInbound: 0,
        mtdOutbound: 0,
        mtdSuccessful: 0,
        mtdUnsuccessful: 0,
      }
    );

  const computeTimeSpent = (data: any[]) =>
    data.reduce(
      (acc: Record<string, number>, item) => {
        if (item.startdate && item.enddate) {
          const duration = (new Date(item.enddate).getTime() - new Date(item.startdate).getTime()) / 1000;

          // Existing logic
          if (INBOUND_ACTIVITIES.includes(item.typeactivity)) {
            acc["inbound"] = (acc["inbound"] || 0) + duration;
          } else if (item.typeactivity === "Outbound Call") {
            acc["outbound"] = (acc["outbound"] || 0) + duration;
          } else {
            acc["others"] = (acc["others"] || 0) + duration;
          }

          // Additional computation for specific activities
          if ([
            "Account Development",
            "Accounting: Accounts Receivable and Payment",
            "Accounting: Billing Concern",
            "Accounting: Refund Request",
            "Accounting: Sales Order Concern",
            "Accounting: TPC Request",
            "Admin Concern: Coordination of Payment Terms Request",
            "CSR Inquiries",
            "Coordination of Pick-Up / Delivery to Client",
            "Coordination With CS (Email Acknowledgement)",
            "Marketing Concern",
            "Email and Viber Checking",
            "Email Blast",
            "Email, SMS & Viber Replies",
            "Inbound Call",
            "Payment Follow-Up",
            "Quotation Follow-Up",
            "Logistic Concern: Shipping Cost Estimation",
            "Outbound Call",
            "Preparation: Bidding Preparation",
            "Preparation: Preparation of Report",
            "Preparation: Preparation of SPF",
            "Preparation: Preparation of Quote: New Client",
            "Preparation: Preparation of Quote: Existing Client",
            "Preparation: Sales Order Preparation",
            "Technical: Dialux Simulation Request",
            "Technical: Drawing Request",
            "Technical: Inquiry",
            "Technical: Site Visit Request",
            "Technical: TDS Request",
            "Walk-In Client",
            "Warehouse: Coordination to Billing",
            "Warehouse: Coordination to Dispatch",
            "Warehouse: Coordination to Inventory",
            "Warehouse: Delivery / Helper Concern",
            "Warehouse: Replacement Request / Concern",
            "Warehouse: Sample Request / Concern",
            "Warehouse: SO Status Follow Up",
          ].includes(item.typeactivity)) {
            acc[item.typeactivity] = (acc[item.typeactivity] || 0) + duration;
          }
        }
        return acc;
      },
      { inbound: 0, outbound: 0, others: 0 }
    );

  const INBOUND_ACTIVITIES = [
    "Inbound Call",
    "Assisting Other Agents Client",
    "Preparation: Bidding Preparation",
    "Client Meeting",
    "Site Visit",
    "Coordination of Pick-Up / Delivery to Client",
    "Email and Viber Checking",
    "Email Blast",
    "Email, SMS & Viber Replies",
    "Inbound Call - Existing",
    "Payment Follow-Up",
    "Quotation Follow-Up",
    "Preparation: Preparation of Quote: Existing Client",
    "Preparation: Preparation of Quote: New Client",
    "Preparation: Preparation of Report",
    "Walk-In Client",
  ];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours}h ${minutes}m ${secs}s`;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setTouchbaseData({});
  };

  const statusColors: { [key: string]: string } = {
    Active: "bg-green-800",
    Inactive: "bg-red-500",
    Resigned: "bg-red-700",
    Terminated: "bg-yellow-600",
    Locked: "bg-gray-500",
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
                    <button className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleEdit(post)}>Edit</button>
                    <button className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleViewModal(post)}>View Activities</button>
                  </Menu.Items>
                </Menu>
              </div>
              <div className="mt-auto border-t pt-2 text-xs text-gray-900">
                <p><strong>Department:</strong> {post.Department}</p>
                <p><strong>Location:</strong> {post.Location}</p>
                <p className="mt-2">
                  <span className={`badge text-white px-2 py-1 rounded-xl ${statusColors[post.Status] || "bg-gray-400"}`}>
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

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white p-6 rounded-lg w-full max-w-7xl max-h-[80vh] overflow-y-auto relative">
            <h2 className="text-lg font-semibold mb-4">
              {selectedUser.Firstname} {selectedUser.Lastname}'s Activities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <p className="text-xs px-3 py-2 border rounded bg-gray-50">
                <strong>Email:</strong> {selectedUser.Email}
              </p>
              <p className="text-xs px-3 py-2 border rounded bg-gray-50">
                <strong>Role:</strong> {selectedUser.Role}
              </p>
              <p className="text-xs px-3 py-2 border rounded bg-gray-50">
                <strong>Department:</strong> {selectedUser.Department}
              </p>
              <p className="text-xs px-3 py-2 border rounded bg-gray-50">
                <strong>Status:</strong> {selectedUser.Status}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
              <input
                type="date"
                value={startdate}
                onChange={(e) => setStartdate(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs bg-gray-50"
              />
              <input
                type="date"
                value={enddate}
                onChange={(e) => setEnddate(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs bg-gray-50"
              />
            </div>


            {/* Grid for Activity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {/* Chart Doughnut */}
              <div className="bg-gray-100 p-4 rounded-md shadow-md text-xs">
                <h3 className="font-semibold text-sm">Chart</h3>
                <Doughnut data={chartData} options={chartOptions} />
              </div>

              {/* Touchbase with Table */}
              <div className="bg-gray-100 p-4 rounded-md shadow-md text-xs">
                <h3 className="font-semibold text-sm">Touchbase</h3>
                <p className="text-gray-600 mt-1 mb-2">Summary of Touchbase Counts</p>
                <table className="w-full text-xs border-collapse border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="border border-gray-300 px-2 py-1">Type of Client</th>
                      <th className="border border-gray-300 px-2 py-1">Counts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(touchbaseData).map(([key, count], index) => {
                      const [typeclient, typecall] = key.split("-");
                      return (
                        <tr key={index}>
                          <td className="border border-gray-300 px-2 py-1">{typeclient}</td>
                          <td className="border border-gray-300 px-2 py-1">{count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Time Motion */}
              <div className="bg-gray-100 p-4 rounded-md shadow-md text-xs">
                <h3 className="font-semibold text-sm">Time and Motion Daily Summary</h3>
                <p className="text-gray-600 mt-1 mb-2">Summary of Time and Motion</p>
                <table className="w-full text-xs border-collapse border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="border border-gray-300 px-2 py-1">Client Engagement</th>
                      <th className="border border-gray-300 px-2 py-1">Outbound Calls</th>
                      <th className="border border-gray-300 px-2 py-1">Other Activities</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1">
                        {formatDuration(timeMotionData.inbound)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formatDuration(timeMotionData.outbound)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {formatDuration(timeMotionData.others)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Daily Productivity */}
              <div className="bg-gray-100 p-4 rounded-md shadow-md text-xs">
                <h3 className="font-semibold text-sm">Daily Productivity</h3>
                <p className="text-gray-600 mt-1 mb-2">Details about Activity 4...</p>
                <table className="w-full text-xs border-collapse border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="border border-gray-300 px-2 py-1">Call Productivity</th>
                      <th className="border border-gray-300 px-2 py-1">Daily</th>
                      <th className="border border-gray-300 px-2 py-1">MTD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Total Outbound Calls</td>
                      <td className="border border-gray-300 px-2 py-1 font-semibold">{callData.dailyOutbound || 0}</td>
                      <td className="border border-gray-300 px-2 py-1 font-semibold">{callData.mtdOutbound || 0}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border border-gray-300 px-2 py-1">Successful Calls</td>
                      <td className="border border-gray-300 px-2 py-1">{callData.dailySuccessful || 0}</td>
                      <td className="border border-gray-300 px-2 py-1">{callData.mtdSuccessful || 0}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Unsuccessful Calls</td>
                      <td className="border border-gray-300 px-2 py-1">{callData.dailyUnsuccessful || 0}</td>
                      <td className="border border-gray-300 px-2 py-1">{callData.mtdUnsuccessful || 0}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border border-gray-300 px-2 py-1">Total Inbound Calls</td>
                      <td className="border border-gray-300 px-2 py-1">{callData.dailyInbound || 0}</td>
                      <td className="border border-gray-300 px-2 py-1">{callData.mtdInbound || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Quote Productivity */}
              <div className="bg-gray-100 p-4 rounded-md shadow-md text-xs">
                <h3 className="font-semibold text-sm">Quote Productivity</h3>
                <p className="text-gray-600 mt-1 mb-2">Details about Activity 5...</p>
                <table className="w-full text-xs border-collapse border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="border border-gray-300 px-2 py-1">Quotation Productivity</th>
                      <th className="border border-gray-300 px-2 py-1">Daily</th>
                      <th className="border border-gray-300 px-2 py-1">MTD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">New Account Development</td>
                      <td className="border border-gray-300 px-2 py-1">{activityData["Account Development"] || 0}</td>
                      <td className="border border-gray-300 px-2 py-1">{activityData["Account Development"] || 0}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border border-gray-300 px-2 py-1">Existing Client</td>
                      <td className="border border-gray-300 px-2 py-1">{activityData["Preparation: Preparation of Quote: Existing Client"] || 0}</td>
                      <td className="border border-gray-300 px-2 py-1">{activityData["Preparation: Preparation of Quote: Existing Client"] || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Performance */}
              <div className="bg-gray-100 p-4 rounded-md shadow-md text-xs">
                <h3 className="font-semibold text-sm">Performance</h3>
                <p className="text-gray-600 mt-1 mb-2">Sales Performance Overview</p>
                <table className="w-full text-xs border-collapse border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="border border-gray-300 px-2 py-1">Sales Performance</th>
                      <th className="border border-gray-300 px-2 py-1">SO to DR (Actual Sales)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Month to Date</td>
                      <td className="border border-gray-300 px-2 py-1">{activityData["MonthToDateSales"] || 0}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border border-gray-300 px-2 py-1">Year to Date</td>
                      <td className="border border-gray-300 px-2 py-1">{activityData["YearToDateSales"] || 0}</td>
                    </tr>
                    <tr className="bg-white font-semibold">
                      <td className="border border-gray-300 px-2 py-1">Total Actual Sales</td>
                      <td className="border border-gray-300 px-2 py-1">{activityData["TotalActualSales"] || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 mt-4">
              {/* Daily Activities */}
              <div className="bg-gray-100 p-4 rounded-md shadow-md text-xs">
                <h3 className="font-semibold text-sm">Daily Activities</h3>
                <p className="text-gray-600 mt-1 mb-2">Details about Activity 7...</p>
                <table className="w-full text-xs border-collapse border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="border border-gray-300 px-2 py-1">Daily Activities Breakdown</th>
                      <th className="border border-gray-300 px-2 py-1">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Account Development</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Account Development"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Accounting: Accounts Receivable And Payment</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Accounting: Accounts Receivable and Payment"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Accounting: Billing Concern</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Accounting: Billing Concern"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Accounting: Refund Request</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Accounting: Refund Request"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Accounting: Sales Order Concern</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Accounting: Sales Order Concern"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Accounting: TPC Request</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Accounting: TPC Request"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Admin Concern: Coordination of Payment Terms Request</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Admin Concern: Coordination of Payment Terms Request"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">CSR Inquiries</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["CSR Inquiries"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Coordination of Pick-Up / Delivery to Client</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Coordination of Pick-Up / Delivery to Client"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Coordination With CS (Email Acknowledgement)</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Coordination With CS (Email Acknowledgement)"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Marketing Concern</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Marketing Concern"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Email and Viber Checking</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Email and Viber Checking"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Email Blast</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Email Blast"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Email, SMS & Viber Replies</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Email, SMS & Viber Replies"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Inbound Call</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Inbound Call"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Payment Follow-Up</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Payment Follow-Up"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Quotation Follow-Up</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Quotation Follow-Up"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Logistic Concern: Shipping Cost Estimation</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Logistic Concern: Shipping Cost Estimation"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Outbound Call</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Outbound Call"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Preparation: Bidding Preparation</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Preparation: Bidding Preparation"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Preparation: Preparation of Report</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Preparation: Preparation of Report"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Preparation: Preparation of SPF</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Preparation: Preparation of SPF"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Preparation: Preparation of Quote: New Client</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Preparation: Preparation of Quote: New Client"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Preparation: Preparation of Quote: Existing Client</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Preparation: Preparation of Quote: Existing Client"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Preparation: Sales Order Preparation</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Preparation: Sales Order Preparation"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Technical: Dialux Simulation Request</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Technical: Dialux Simulation Request"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Technical: Drawing Request</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Technical: Drawing Request"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Technical: Site Visit Request</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Technical: Site Visit Request"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Technical: TDS Request</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Technical: TDS Request"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Walk-In Client</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Walk-In Client"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Warehouse: Coordination to Billing</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Warehouse: Coordination to Billing"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Warehouse: Coordination to Dispatch</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Warehouse: Coordination to Dispatch"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Warehouse: Coordination to Inventory</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Warehouse: Coordination to Inventory"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Warehouse: Delivery / Helper Concern</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Warehouse: Delivery / Helper Concern"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Warehouse: Replacement Request / Concern</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Warehouse: Replacement Request / Concern"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Warehouse: Sample Request / Concern</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Warehouse: Sample Request / Concern"] || 0)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 px-2 py-1">Warehouse: SO Status Follow Up</td>
                      <td className="border border-gray-300 px-2 py-1">{formatDuration(timeMotionData["Warehouse: SO Status Follow Up"] || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersCard;