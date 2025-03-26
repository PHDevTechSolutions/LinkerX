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
import TSASalesConversion from "../../components/Dashboard/TSASalesConversion";

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("gender");
  const [activeTable, setactiveTable] = useState("barchart");
  const [activeSource, setactiveSource] = useState("source");
  const [activeTableTraffic, setactiveTableTraffic] = useState("salesconversion");
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

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4 text-gray-900">
          {/* Month and Year Filters */}
          <div className="flex gap-4 mb-4">
            <div className="bg-white shadow-md rounded-lg p-4 w-full">
              <div className="flex gap-2">
                {/* Month Filter */}
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="p-2 border rounded text-xs bg-white"
                >
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>

                {/* Year Filter */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="p-2 border rounded text-xs bg-white"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Card 1: Bar Charts */}
          <div className="flex gap-4 mb-4">
            <div className="bg-white shadow-md rounded-lg p-4 w-full">
              <div className="flex border-b mb-4 text-xs font-bold">
                <button className={`p-2 flex-1 ${activeTable === "barchart" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTable("barchart")}>Bar Chart</button>
                <button className={`p-2 flex-1 ${activeTable === "metrictable" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTable("metrictable")}>Metrics</button>
                <button className={`p-2 flex-1 ${activeTable === "inboundtraffic" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTable("inboundtraffic")}>Weekly Inbound Traffic Per Channel</button>
              </div>
              <div className="p-4">
                {activeTable === "barchart" && (
                  <BarChart
                    ReferenceID={userDetails.ReferenceID}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                  />
                )}
                {activeTable === "metrictable" && (
                  <MetricTable
                    ReferenceID={userDetails.ReferenceID}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                  />
                )}
                {activeTable === "inboundtraffic" && (
                  <InboundTrafficTable
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Card 2: Tabbed Charts (30% width) */}
            <div className="bg-white shadow-lg rounded-lg p-4 w-[30%]">
              <div className="flex border-b mb-4 text-xs font-bold">
                <button className={`p-2 flex-1 ${activeTab === "gender" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("gender")}>Gender</button>
                <button className={`p-2 flex-1 ${activeTab === "customer" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("customer")}>Customer Status</button>
                <button className={`p-2 flex-1 ${activeTab === "customerType" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("customerType")}>Customer Type</button>
              </div>
              <div className="p-4">
                {activeTab === "gender" && (
                  <GenderPieChart
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                  />
                )}
                {activeTab === "customer" && (
                  <CustomerChart
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                  />
                )}
                {activeTab === "customerType" && (
                  <CustomerTypeChart
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                  />
                )}
              </div>
            </div>

            {/* Card 3: Customer Source (70% width) */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-[70%]">
              <div className="flex border-b mb-4 text-xs font-bold">
                <button className={`p-2 flex-1 ${activeSource === "source" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("source")}>Source</button>
                <button className={`p-2 flex-1 ${activeSource === "wrapup" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("wrapup")}>Wrap Up</button>
                <button className={`p-2 flex-1 ${activeSource === "wraptable" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("wraptable")}>Table</button>
              </div>
              <div className="p-4">
                {activeSource === "source" && (
                  <CustomerSource
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                  />
                )}
                {activeSource === "wrapup" && (
                  <Wrapup
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                  />
                )}
                {activeSource === "wraptable" && (
                  <WrapupTable
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role}
                    month={Number(selectedMonth)}
                    year={Number(selectedYear)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Tables */}
          {userDetails.Role !== "Staff" && (
            <div className="flex gap-4 mt-4 mb-4">
              <div className="bg-white shadow-md rounded-lg p-2 w-full">
                <div className="border-b mb-4 text-xs font-bold">
                  <button className={`p-2 flex-1 ${activeTableTraffic === "salesconversion" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTableTraffic("salesconversion")}>Traffic to Sales Conversion</button>
                  <button className={`p-2 flex-1 ${activeTableTraffic === "salesweekly" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTableTraffic("salesweekly")}>Traffic to Sales Conversion ( Weekly )</button>
                </div>
                <div className="p-4">
                  {activeTableTraffic === "salesconversion" && (
                    <AgentSalesConversion
                      ReferenceID={userDetails.ReferenceID}
                      Role={userDetails.Role}
                      month={Number(selectedMonth)}
                      year={Number(selectedYear)}
                    />
                  )}
                  {activeTableTraffic === "salesweekly" && (
                    <AgentSalesConversionWeekly
                      ReferenceID={userDetails.ReferenceID}
                      Role={userDetails.Role}
                      month={Number(selectedMonth)}
                      year={Number(selectedYear)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Card 5: TSA Sales Conversion */}
          {userDetails.Role !== "Staff" && (
            <div className="flex gap-4 mt-4 mb-4">
              <div className="bg-white shadow-md rounded-lg p-4 w-full">
                <h3 className="text-sm font-bold mb-2">
                  TSA Traffic to Sales Conversion (ON Developing Wait for the
                  Completion of New Taskflow)
                </h3>
                <div className="flex border-b mb-4 text-xs font-bold">
                  <TSASalesConversion

                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
