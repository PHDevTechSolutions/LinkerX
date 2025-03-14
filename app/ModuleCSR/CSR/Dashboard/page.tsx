"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import GenderPieChart from "../../components/Dashboard/GenderPieChart";
import CustomerChart from "../../components/Dashboard/CustomerChart";
import CustomerTypeChart from "../../components/Dashboard/CustomerTypeChart";
import CustomerSource from "../../components/Dashboard/CustomerSource";

//Tables
import MetricTable from "../../components/Dashboard/MetricTable";
import BarChart from "../../components/Dashboard/BarChart";
import Wrapup from "../../components/Dashboard/Wrapup";

import AgentSalesConversion from "../../components/Dashboard/AgentSalesConversionTable";
import AgentBarChart from "../../components/Dashboard/AgentBarChart";

import TSASalesConversion from "../../components/Dashboard/TSASalesConversion";


const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("gender");
  const [activeTable, setactiveTable] = useState("barchart");
  const [activeSource, setactiveSource] = useState("source");
  const [activeTableConversion, setactiveTableConversion] = useState("agentbarchart");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [userDetails, setUserDetails] = useState({
    UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

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
            UserId: data._id, // Set the user's id here
            ReferenceID: data.ReferenceID || "",  // <-- Siguraduhin na ito ay may value
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
        <div className="container mx-auto p-4">
          {/* Date Range Picker */}
          <div className="flex gap-4 mb-4">
            <div className="bg-white shadow-md rounded-lg p-4 w-full">
              <div className="flex gap-2">
                <input type="date" value={startDate} onChange={(e) => handleDateChange(e, "start")} className="p-2 border rounded text-xs" />
                <input type="date" value={endDate} onChange={(e) => handleDateChange(e, "end")} className="p-2 border rounded text-xs" />
              </div>
            </div>
          </div>

          {/* Card 1: Bar Charts */}
          <div className="flex gap-4 mb-4">
            <div className="bg-white shadow-md rounded-lg p-4 w-full">

              <div className="flex border-b mb-4 text-xs font-bold">
                <button className={`p-2 flex-1 ${activeTable === "barchart" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTable("barchart")}>Bar Chart</button>
                <button className={`p-2 flex-1 ${activeTable === "metrictable" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTable("metrictable")}>Metrics</button>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-600 mb-4">
                  This chart tracks the traffic count from various sources such as <strong>Google Maps</strong>, <strong>Website</strong>, <strong>Facebook Main</strong>, <strong>Facebook Home</strong>, <strong>Viber</strong>, and other channels. It visualizes the volume of traffic coming from each source, providing insights into where your audience is engaging from. This data helps in understanding the reach and effectiveness of your various online platforms.
                </p>
                {activeTable === "barchart" && <BarChart
                  startDate={startDate}
                  endDate={endDate}
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                />}
                {activeTable === "metrictable" && <MetricTable
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                />}
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
                {activeTab === "gender" && <GenderPieChart
                  startDate={startDate}
                  endDate={endDate}
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                />}
                {activeTab === "customer" && <CustomerChart
                  startDate={startDate}
                  endDate={endDate}
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                />}
                {activeTab === "customerType" && <CustomerTypeChart
                  startDate={startDate}
                  endDate={endDate}
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                />}
              </div>
            </div>

            {/* Card 3: Customer Source (70% width) */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-[70%]">
              <div className="flex border-b mb-4 text-xs font-bold">
                <button className={`p-2 flex-1 ${activeSource === "source" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("source")}>Source</button>
                <button className={`p-2 flex-1 ${activeSource === "wrapup" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("wrapup")}>Wrap Up</button>
              </div>
              <div className="p-4">
                {activeSource === "source" && <CustomerSource
                  startDate={startDate}
                  endDate={endDate}
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role}
                />}
                {activeSource === "wrapup" && <Wrapup
                  startDate={startDate}
                  endDate={endDate}
                  ReferenceID={userDetails.ReferenceID}
                  Role={userDetails.Role} />}
              </div>
            </div>
          </div>

          {/* Card 4: Tables */}
          {userDetails.Role !== "Staff" && (
            <div className="flex gap-4 mt-4 mb-4">
              <div className="bg-white shadow-md rounded-lg p-2 w-full">
                <div className="border-b mb-4 text-xs font-bold">
                  <button className="p-2 flex-1 border-b-2 border-blue-500">
                    Traffic to Sales Conversion
                  </button>
                </div>
                <div className="p-4">
                  <AgentSalesConversion
                    ReferenceID={userDetails.ReferenceID}
                    Role={userDetails.Role} />
                </div>
              </div>
            </div>
          )}

          {/* Card 5: Tables */}
          {userDetails.Role !== "Staff" && (
            <div className="flex gap-4 mt-4 mb-4">
              <div className="bg-white shadow-md rounded-lg p-4 w-full">
                <h3 className="text-sm font-bold mb-2">TSA Traffic to Sales Conversion</h3>
                <div className="flex border-b mb-4 text-xs font-bold">
                  <TSASalesConversion />
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
