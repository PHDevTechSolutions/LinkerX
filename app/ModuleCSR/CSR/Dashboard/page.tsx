"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { CiCalendar } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Charts and Tables
import BarChart from "../../components/Dashboard/BarChart";
import MetricTable from "../../components/Dashboard/MetricTable";
import InboundTrafficTable from "../../components/Dashboard/InboundTrafficTable";
import GenderPieChart from "../../components/Dashboard/GenderPieChart";
import CustomerChart from "../../components/Dashboard/CustomerChart";
import CustomerTypeChart from "../../components/Dashboard/CustomerTypeChart";
import CustomerSource from "../../components/Dashboard/CustomerSource";
import Wrapup from "../../components/Dashboard/Wrapup";
import WrapupTable from "../../components/Dashboard/WrapupTable";
import AgentSalesConversionChart from "../../components/Dashboard/AgentSalesConversionChart";
import AgentSalesConversion from "../../components/Dashboard/AgentSalesConversionTable";
import AgentSalesConversionWeekly from "../../components/Dashboard/AgentSalesConversionWeeklyTable";
import TSASalesConversion from "../../components/Dashboard/TSASalesConversion";

const getToday = () => new Date().toISOString().split("T")[0];
const get7DaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split("T")[0];
};

const DashboardPage: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(true);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState("");
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

    // Load saved filter from localStorage
    const savedStart = localStorage.getItem("dashboardStartDate");
    const savedEnd = localStorage.getItem("dashboardEndDate");
    if (savedStart && savedEnd) {
      setStartDate(savedStart);
      setEndDate(savedEnd);
      fetchData(savedStart, savedEnd);
      setShowFilterModal(false);
      setHasFiltered(true);
    }
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!hasFiltered) return;
    const interval = setInterval(() => {
      fetchData(startDate, endDate);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate, hasFiltered]);

  const fetchData = async (start?: string, end?: string) => {
    try {
      setIsFiltering(true);
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);
      await fetch(`/api/dashboard?${params.toString()}`);
      localStorage.setItem("dashboardStartDate", start || "");
      localStorage.setItem("dashboardEndDate", end || "");
      setHasFiltered(true);
      toast.success("Data filtered successfully!");
    } catch (err) {
      toast.error("Error fetching data.");
      console.error(err);
    } finally {
      setIsFiltering(false);
    }
  };

  const clearFilter = () => {
    const defaultStart = get7DaysAgo();
    const defaultEnd = getToday();
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    localStorage.removeItem("dashboardStartDate");
    localStorage.removeItem("dashboardEndDate");
    toast("Filters cleared.");
    setShowFilterModal(false);
    fetchData(defaultStart, defaultEnd);
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

          {showFilterModal && (
            <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-sm font-bold mb-4 text-gray-800">Filter by Date</h2>

                <div className="flex flex-wrap gap-2 text-xs mb-4">
                  <button
                    onClick={() => {
                      const today = getToday();
                      setStartDate(today);
                      setEndDate(today);
                    }}
                    className="bg-blue-100 px-2 py-1 rounded"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      setStartDate(get7DaysAgo());
                      setEndDate(getToday());
                    }}
                    className="bg-blue-100 px-2 py-1 rounded"
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => {
                      const now = new Date();
                      const start = new Date(now.getFullYear(), now.getMonth(), 1)
                        .toISOString()
                        .split("T")[0];
                      const end = getToday();
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    className="bg-blue-100 px-2 py-1 rounded"
                  >
                    This Month
                  </button>
                </div>

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
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

                <div className="flex justify-between gap-2">
                  <button
                    onClick={clearFilter}
                    className="bg-red-200 text-red-800 px-3 py-1 rounded text-xs"
                  >
                    Clear Filter
                  </button>
                  <div className="flex gap-2">
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
                      {isFiltering ? "Filtering..." : "Filter Data"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showFilterModal && (
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
        <ToastContainer position="top-right" className="text-xs" autoClose={3000} hideProgressBar={false} />
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
