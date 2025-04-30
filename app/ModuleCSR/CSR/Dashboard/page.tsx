"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import GenderPieChart from "../../components/Dashboard/GenderPieChart";
import CustomerChart from "../../components/Dashboard/CustomerChart";
import CustomerTypeChart from "../../components/Dashboard/CustomerTypeChart";
import CustomerSource from "../../components/Dashboard/CustomerSource";

// Tables
import MetricTable from "../../components/Dashboard/MetricTable";
import InboundTrafficTable from "../../components/Dashboard/InboundTrafficTable";
import BarChart from "../../components/Dashboard/BarChart";
import Wrapup from "../../components/Dashboard/Wrapup";
import WrapupTable from "../../components/Dashboard/WrapupTable";
import AgentSalesConversion from "../../components/Dashboard/AgentSalesConversionTable";
import AgentSalesConversionWeekly from "../../components/Dashboard/AgentSalesConversionWeeklyTable";
import AgentSalesConversionChart from "../../components/Dashboard/AgentSalesConversionChart";
import TSASalesConversion from "../../components/Dashboard/TSASalesConversion";

const DashboardPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    `${new Date().getMonth() + 1}`
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    `${new Date().getFullYear()}`
  );
  const [userDetails, setUserDetails] = useState({
    UserId: "",
    ReferenceID: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Role: "",
  });

  interface MyDataType {
    createdAt: string;
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("gender");
  const [activeTable, setactiveTable] = useState("metrictable");
  const [activeSource, setactiveSource] = useState("source");
  const [activeTableTraffic, setactiveTableTraffic] = useState("saleschart");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<MyDataType[]>([]);
  const [showAccessModal, setShowAccessModal] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (userId) {
        try {
          const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data = await response.json();
          setUserDetails({
            UserId: data._id,
            ReferenceID: data.ReferenceID || "",
            Firstname: data.Firstname || "",
            Lastname: data.Lastname || "",
            Email: data.Email || "",
            Role: data.Role || "",
          });
        } catch (err: unknown) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("User ID is missing.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filteredData = data.filter((item: MyDataType) => {
    const createdAtDate = new Date(item.createdAt);
    return (
      (!startDate || createdAtDate >= new Date(startDate)) &&
      (!endDate || createdAtDate <= new Date(endDate))
    );
  });

  const isAllowedUser = userDetails?.Role === "Staff" ||
    (userDetails?.Role === "Staff" && userDetails?.ReferenceID === "LR-CSR-654001");

  const isRestrictedUser = !isAllowedUser;

  // Automatically show modal if the user is restricted
  useEffect(() => {
    setShowAccessModal(isRestrictedUser);
  }, [isRestrictedUser]);

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4 text-gray-900">
          {/* Month and Year Filters */}
          <div className="flex gap-4 mb-4">
            <div className="bg-white shadow-md rounded-lg p-4 w-full">
              <div className="flex gap-2">
                {/* Start Date */}
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded text-xs bg-white"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded text-xs bg-white"
                />

                {/* Render filtered data */}
                <ul>
                  {filteredData.map((item, index) => (
                    <li key={index}>{item.createdAt}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex flex-col justify-between h-full">
                <BarChart
                  ReferenceID={userDetails.ReferenceID}
                  month={Number(selectedMonth)}
                  year={Number(selectedYear)}
                  Role={userDetails.Role}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex border-b mb-4 text-xs font-bold">
                <button className={`p-2 flex-1 ${activeTable === "metrictable" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTable("metrictable")}>Metrics</button>
                <button className={`p-2 flex-1 ${activeTable === "inboundtraffic" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTable("inboundtraffic")}>Weekly Inbound Traffic Per Channel</button>
              </div>
              <div>
                {activeTable === "metrictable" && (
                  <MetricTable
                    ReferenceID={userDetails.ReferenceID}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                    Role={userDetails.Role}
                    startDate={startDate}
                    endDate={endDate}
                  />
                )}
                {activeTable === "inboundtraffic" && (
                  <InboundTrafficTable
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                    startDate={startDate}
                    endDate={endDate}
                  />
                )}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex flex-col justify-between h-full">
                <GenderPieChart
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                  month={Number(selectedMonth)}
                  year={Number(selectedYear)}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex flex-col justify-between h-full">
                <CustomerChart
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                  month={Number(selectedMonth)}
                  year={Number(selectedYear)}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex flex-col justify-between h-full">
                <CustomerTypeChart
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                  month={Number(selectedMonth)}
                  year={Number(selectedYear)}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-1 gap-4 mt-4">
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="flex border-b mb-4 text-xs font-bold">
                <button className={`p-2 flex-1 ${activeSource === "source" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("source")}>Source</button>
                <button className={`p-2 flex-1 ${activeSource === "wrapup" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("wrapup")}>Wrap Up</button>
                <button className={`p-2 flex-1 ${activeSource === "wraptable" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("wraptable")}>Table</button>
              </div>
              <div>
                {activeSource === "source" && (
                  <CustomerSource
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                    startDate={startDate}
                    endDate={endDate}
                  />
                )}
                {activeSource === "wrapup" && (
                  <Wrapup
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                    startDate={startDate}
                    endDate={endDate}
                  />
                )}
                {activeSource === "wraptable" && (
                  <WrapupTable
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                    startDate={startDate}
                    endDate={endDate}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-4 mb-4">
              <div className="bg-white shadow-md rounded-lg p-2 w-full">
                <div className="border-b mb-4 text-xs font-bold">
                  <button className={`p-2 flex-1 ${activeTableTraffic === "saleschart" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTableTraffic("saleschart")}>Chart</button>
                  <button className={`p-2 flex-1 ${activeTableTraffic === "salesconversion" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTableTraffic("salesconversion")}>Traffic to Sales Conversion</button>
                  <button className={`p-2 flex-1 ${activeTableTraffic === "salesweekly" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTableTraffic("salesweekly")}>Traffic to Sales Conversion ( Weekly )</button>
                </div>
                <div className="p-4">
                  {activeTableTraffic === "saleschart" && (
                    <AgentSalesConversionChart
                      ReferenceID={userDetails.ReferenceID}
                      Role={userDetails.Role}
                      month={Number(selectedMonth)}
                      year={Number(selectedYear)}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )}
                  {activeTableTraffic === "salesconversion" && (
                    <AgentSalesConversion
                      ReferenceID={userDetails.ReferenceID}
                      Role={userDetails.Role}
                      month={Number(selectedMonth)}
                      year={Number(selectedYear)}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )}
                  {activeTableTraffic === "salesweekly" && (
                    <AgentSalesConversionWeekly
                      ReferenceID={userDetails.ReferenceID}
                      Role={userDetails.Role}
                      month={Number(selectedMonth)}
                      year={Number(selectedYear)}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex flex-col justify-between h-full">
                <h3 className="text-sm font-bold mb-2">
                  TSA Traffic to Sales Conversion
                </h3>
                <TSASalesConversion
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                  month={Number(selectedMonth)}
                  year={Number(selectedYear)}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
          </div>
        </div>
        {showAccessModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 h-screen w-full">
            <div className="bg-white p-6 rounded shadow-lg w-96 max-h-full overflow-y-auto">
              <h2 className="text-lg font-bold text-red-600 mb-4">⚠️ Access Denied</h2>
              <p className="text-sm text-gray-700 mb-4">
                You do not have the necessary permissions to perform this action.
                Only <strong>IT Personnel</strong> can access this section.
              </p>
            </div>
          </div>
        )}
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
