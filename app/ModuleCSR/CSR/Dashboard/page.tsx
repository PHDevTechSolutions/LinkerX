"use client";
import React, { useState } from "react";
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

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
                {activeTable === "barchart" && <BarChart startDate={startDate} endDate={endDate} />}
                {activeTable === "metrictable" && <MetricTable />}
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
                {activeTab === "gender" && <GenderPieChart startDate={startDate} endDate={endDate} />}
                {activeTab === "customer" && <CustomerChart startDate={startDate} endDate={endDate} />}
                {activeTab === "customerType" && <CustomerTypeChart startDate={startDate} endDate={endDate} />}
              </div>
            </div>

            {/* Card 3: Customer Source (70% width) */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-[70%]">
              <div className="flex border-b mb-4 text-xs font-bold">
                <button className={`p-2 flex-1 ${activeSource === "source" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("source")}>Source</button>
                <button className={`p-2 flex-1 ${activeSource === "wrapup" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveSource("wrapup")}>Wrap Up</button>
              </div>
              <div className="p-4">
                {activeSource === "source" && <CustomerSource startDate={startDate} endDate={endDate} />}
                {activeSource === "wrapup" && <Wrapup startDate={startDate} endDate={endDate} />}
              </div>
            </div>
          </div>

          {/* Card 4: Tables */}
          <div className="flex gap-4 mt-4 mb-4">
            <div className="bg-white shadow-md rounded-lg p-4 w-full">
              <div className="flex border-b mb-4 text-xs font-bold">
                <button className={`p-2 flex-1 ${activeTableConversion === "agentbarchart" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTableConversion("agentbarchart")}>Bar Chart</button>
                <button className={`p-2 flex-1 ${activeTableConversion === "agentsalesconversion" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setactiveTableConversion("agentsalesconversion")}>Traffic to Sales Conversion</button>
              </div>
              <div className="p-4">
                {activeTableConversion === "agentbarchart" && <AgentBarChart />}
                {activeTableConversion === "agentsalesconversion" && <AgentSalesConversion />}
              </div>
            </div>
          </div>

          {/* Card 4: Tables */}
          <div className="flex gap-4 mt-4 mb-4">
            <div className="bg-white shadow-md rounded-lg p-4 w-full">
              <h3 className="text-sm font-bold mb-2">TSA Traffic to Sales Conversion</h3>
              <div className="flex border-b mb-4 text-xs font-bold">
              <TSASalesConversion />
              </div>
            </div>
          </div>

        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
