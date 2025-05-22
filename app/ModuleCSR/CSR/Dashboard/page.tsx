"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { CiCalendar } from "react-icons/ci";

// Route for Bar Chart
import BarChart from "../../components/Dashboard/BarChart";
// Route for Metric Table
import MetricTable from "../../components/Dashboard/MetricTable";
// Route for InboundTraffic Table
import InboundTrafficTable from "../../components/Dashboard/InboundTrafficTable";
// Route for Gender Traffic Chart
import GenderPieChart from "../../components/Dashboard/GenderPieChart";
// Route for Customer Chart
import CustomerChart from "../../components/Dashboard/CustomerChart";
// Route for Customer Type Chart
import CustomerTypeChart from "../../components/Dashboard/CustomerTypeChart";
// Route for Customer Source
import CustomerSource from "../../components/Dashboard/CustomerSource";
// Route for Wrapup
import Wrapup from "../../components/Dashboard/Wrapup";
// Route for Wrapup Table
import WrapupTable from "../../components/Dashboard/WrapupTable";
// Route for Agent Sales Conversion Chart
import AgentSalesConversionChart from "../../components/Dashboard/AgentSalesConversionChart";
// Route for Agent Sales Conversion Table
import AgentSalesConversion from "../../components/Dashboard/AgentSalesConversionTable";
// Route for Agent Sales Conversion Weekly
import AgentSalesConversionWeekly from "../../components/Dashboard/AgentSalesConversionWeeklyTable";
// Route for TSA Sales Conversion
import TSASalesConversion from "../../components/Dashboard/TSASalesConversion";

const DashboardPage: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(true); // default true
  const [userDetails, setUserDetails] = useState({
    UserId: "",
    ReferenceID: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Role: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (!userId) return;

      try {
        const res = await fetch(`/api/user?id=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserDetails({
          UserId: data._id,
          ReferenceID: data.ReferenceID || "",
          Firstname: data.Firstname || "",
          Lastname: data.Lastname || "",
          Email: data.Email || "",
          Role: data.Role || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const fetchData = async (start?: string, end?: string) => {
    try {
      setIsFiltering(true);
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);
      await fetch(`/api/dashboard?${params.toString()}`);
    } catch (err) {
      console.error("Error fetching filtered data:", err);
    } finally {
      setIsFiltering(false);
    }
  };

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4 text-gray-900">
          <div className="mb-4">
            <button
              onClick={() => setShowFilterModal(true)}
              className="bg-white border text-black px-4 py-2 rounded shadow-md transition text-xs flex gap-1"
            >
              <CiCalendar size={15} /> Filter Data
            </button>
          </div>

          {/* Filter Modal */}
          {showFilterModal && (
            <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-sm font-bold mb-4 text-gray-800">Filter by Date</h2>
                <div className="flex flex-col gap-3 mb-4">
                  <label className="text-xs">
                    Start Date:
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </label>
                  <label className="text-xs">
                    End Date:
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await fetchData(startDate, endDate);
                      setShowFilterModal(false);
                    }}
                    disabled={isFiltering}
                    className={`bg-blue-600 text-white px-4 py-2 rounded text-xs ${isFiltering ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {isFiltering ? "Filtering..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Only render data if dates are selected */}
          {startDate && endDate && (
            <>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                  <BarChart {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                  <MetricTable {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <InboundTrafficTable {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                  <GenderPieChart {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <CustomerChart {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <CustomerTypeChart {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                  <CustomerSource {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <Wrapup {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <WrapupTable {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <AgentSalesConversionChart {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <AgentSalesConversion {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <AgentSalesConversionWeekly {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <TSASalesConversion {...userDetails} startDate={startDate} endDate={endDate} />
                </div>
              </div>
            </>
          )}
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
