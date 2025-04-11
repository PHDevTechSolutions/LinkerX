"use client";  // If you're using Next.js, ensure this is at the top of the file

import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";

// Charts
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

// Icons
import { BsBuildings } from "react-icons/bs";
import { CiTimer, CiInboxIn, CiInboxOut, CiMoneyBill, CiReceipt, CiWallet, CiStopwatch, CiSquareChevLeft, CiSquareChevRight, CiPlay1, CiSaveDown1 } from "react-icons/ci";
import { BsRecord } from "react-icons/bs";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Maps
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
// Import Leaflet components dynamically to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

type Activity = {
  date_created: string; // or Date if it's a Date object
  typeactivity: string;
  remarks: string;
  activitystatus: string;
  companyname: string;
  activityremarks: string;
};

interface Post {
  referenceid?: string;  // ReferenceID in PostgreSQL
  ReferenceID?: string; // ReferenceID in MongoDB
  date_created?: string;  // Date of creation (ISO format)
}

interface ChartData {
  labels: string[]; // Labels should be an array of strings (dates)
  datasets: {
    label: string;
    data: number[]; // Data should be an array of numbers (sales)
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  }[];
}

interface ActivityPayload {
  activitystatus: string;
  startdate: string;  // Assuming both startdate and enddate are strings (ISO 8601 datetime format)
  enddate: string;
  activityremarks: string;
  referenceid: string;
  manager: string;
  tsm: string;
}

const DashboardPage: React.FC = () => {
  const [totalHours, setTotalHours] = useState<number>(0);
  const [formattedTime, setFormattedTime] = useState<string>("");

  const [totalInbound, setTotalInbound] = useState<number>(0);
  const [tsmtotalInbound, setTsmTotalInbound] = useState<number>(0);
  const [managertotalInbound, setManagerTotalInbound] = useState<number>(0);

  const [totalOutbound, setTotalOutbound] = useState<number>(0);
  const [tsmtotalOutbound, setTsmTotalOutbound] = useState<number>(0);
  const [managertotalOutbound, setManagerTotalOutbound] = useState<number>(0);

  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [tsmtotalAccounts, setTsmTotalAccounts] = useState<number>(0);
  const [managertotalAccounts, setManagerTotalAccounts] = useState<number>(0);

  const [totalActualSales, setTotalActualSales] = useState<number>(0);
  const [tsmtotalActualSales, setTsmTotalActualSales] = useState<number>(0);
  const [managertotalActualSales, setManagerTotalActualSales] = useState<number>(0);

  const [totalSalesOrder, setTotalSalesOrder] = useState<number>(0);
  const [totalQuotationAmount, setTotalQuotationAmount] = useState<number>(0);
  const [totalActivityCount, setTotalActivityCount] = useState<number>(0);

  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;  // Show 5 items per page

  const [userDetails, setUserDetails] = useState({
    UserId: "",
    ReferenceID: "",
    Manager: "",
    TSM: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Role: "",
    Department: "",
    Company: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [L, setL] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [customIcon, setCustomIcon] = useState<any>(null);
  const [address, setAddress] = useState<string>("Fetching address...");

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerStopped, setIsTimerStopped] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [currentDateTimeTimer, setCurrentDateTimeTimer] = useState("");
  const [timerDisplay, setTimerDisplay] = useState("--:--:--");

  const [activitystatus, setActivityStatus] = useState(""); // For the activity status
  const [activityremarks, setActivityRemarks] = useState<string>(''); // Initialize the state
  const [ReferenceID, setReferenceID] = useState<string>('');
  const [Manager, setManager] = useState<string>('');
  const [TSM, setTsm] = useState<string>('');
  // For the activity status
  const [startdate, setstartdate] = useState(""); // For the start date
  const [enddate, setenddate] = useState(""); // For the end date

  const [activeTab, setActiveTab] = useState("recent");
  const [month, setMonth] = useState("March");
  const [week, setWeek] = useState("Week 1");

  // New states for weekly and monthly computed totals
  const [totalSalesOrderWeek, setTotalSalesOrderWeek] = useState(0);
  const [totalSalesOrderMonth, setTotalSalesOrderMonth] = useState(0);
  const [totalActualSalesWeek, setTotalActualSalesWeek] = useState(0);
  const [totalActualSalesMonth, setTotalActualSalesMonth] = useState(0);

  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      setL(leaflet);

      // Fix for Next.js marker icon issue
      setCustomIcon(
        leaflet.divIcon({
          className: "custom-marker",
          html: `<div style="font-size: 24px; color: red;">📍</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
        })
      );
    })();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          // Fetch address from Nominatim API
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.display_name) {
                setAddress(data.display_name);
              } else {
                setAddress("Address not found");
              }
            })
            .catch(() => setAddress("Error fetching address"));
        },
        (error) => {
          // Handle different types of errors
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setAddress("Location access denied.");
              break;
            case error.POSITION_UNAVAILABLE:
              setAddress("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setAddress("The request to get location timed out.");
              break;
            default:
              setAddress("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      setAddress("Geolocation is not supported by this browser.");
    }
  }, []);

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    });
  };

  // Effect to update currentDateTime continuously unless the timer is running
  useEffect(() => {
    const now = new Date();
    const manilaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));

    // Set initial datetime when the component mounts (stays fixed)
    setCurrentDateTime(formatDateTime(manilaTime));
    setCurrentDateTimeTimer(formatDateTime(manilaTime));

    const storedTimer = localStorage.getItem("timerState");
    const storedCurrentDateTime = localStorage.getItem("currentDateTime");

    if (storedCurrentDateTime) {
      setCurrentDateTime(storedCurrentDateTime);  // Update `currentDateTime` from storage
    }

    if (storedTimer) {
      const { isRunning, startTime, elapsedTime } = JSON.parse(storedTimer);

      if (isRunning) {
        setIsTimerRunning(true);
        const updatedTime = new Date(new Date().getTime() - elapsedTime);
        setTimerDisplay(formatTime(updatedTime));
        setCurrentDateTimeTimer(formatDateTime(updatedTime)); // Timer keeps updating when running
      }
    }
  }, []);

  // Effect to handle timer running state
  useEffect(() => {
    if (isTimerRunning) return; // Don't update currentDateTime when the timer is running

    const updateCurrentTime = () => {
      const now = new Date();
      const manilaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Manila" })
      );
      setCurrentDateTime(formatDateTime(manilaTime)); // Continuously update currentDateTime
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isTimerRunning]);

  useEffect(() => {
    if (!isTimerRunning) return;

    const updateTime = () => {
      const now = new Date();
      const manilaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Manila" })
      );
      setCurrentDateTimeTimer(formatDateTime(manilaTime)); // Update timer display
      setTimerDisplay(formatTime(manilaTime)); // Display time in readable format

      localStorage.setItem(
        "timerState",
        JSON.stringify({ isRunning: true, startTime: manilaTime })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Handle Start/Stop button logic
  const handleStartStop = () => {
    if (!isTimerRunning) {
      const startTime = new Date();
      setIsTimerRunning(true);
      setIsTimerStopped(false);
      localStorage.setItem(
        "timerState",
        JSON.stringify({
          isRunning: true,
          startTime: startTime.toISOString(),
          elapsedTime: 0,
        })
      );
    } else {
      setLoading(true);
      setTimeout(() => {
        setIsTimerRunning(false);
        setIsTimerStopped(true);
        setLoading(false);
        localStorage.removeItem("timerState");
        localStorage.setItem("currentDateTime", currentDateTime); // Store current time when stopped
      }, 2000);
    }
  };

  // Handle Save button logic
  const handleSave = async () => {
    setIsTimerRunning(false);
    setIsTimerStopped(true); // Mark timer as stopped
    setTimerDisplay("--:--:--");
    setCurrentDateTimeTimer(""); // Reset the timer display

    // Set currentDateTime to the current time and resume its update
    const now = new Date();
    const newCurrentDateTime = formatDateTime(now);
    setCurrentDateTime(newCurrentDateTime); // Set currentDateTime to the new time

    // Store the new currentDateTime in localStorage
    localStorage.setItem("currentDateTime", newCurrentDateTime);

    // Restart the timer from the current time
    setCurrentDateTimeTimer(newCurrentDateTime); // Set timer display to the new time

    // Check if all required fields are filled except activityremarks (since it's hidden)
    if (!activitystatus || !currentDateTime || !currentDateTimeTimer) {
      alert("Please ensure all fields are filled before saving.");
      return; // Stop the function if any required field is missing
    }

    // Prepare the payload for submission
    const payload: ActivityPayload = {
      activitystatus,
      activityremarks: address, // Adding the remarks field (it will be included even if hidden)
      referenceid: userDetails.ReferenceID,
      manager: userDetails.Manager,
      tsm: userDetails.TSM,
      startdate: currentDateTime, // This should represent the start time
      enddate: currentDateTimeTimer, // This should represent the stop time
    };

    // Trigger handleSubmit for API submission
    await handleSubmit(payload);
  };

  const handleSubmit = async (payload: ActivityPayload) => {
    try {
      const response = await fetch('/api/ModuleSales/Task/DailyActivity/CreateActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is okay
      if (response.ok) {
        const data = await response.json();
        console.log("Activity saved:", data);
        toast.success("Activity saved successfully!"); // Show success toast
      } else {
        const errorText = await response.text(); // Get raw error message or HTML
        console.error("Error saving activity:", errorText);
        toast.error("Error saving activity: " + errorText); // Show error toast
      }
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error("An unexpected error occurred while saving activity."); // Show unexpected error toast
    }
  };

  const [chartData, setChartData] = useState<ChartData>({
    labels: [], // Initial empty array for labels
    datasets: [
      {
        label: "Total Actual Sales per Day",
        data: [], // Initial empty array for data
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "Total SO to DR per Day",
      },
    },
  };

  const [chartManagerData, setChartManagerData] = useState<ChartData>({
    labels: [], // Initial empty array for labels
    datasets: [
      {
        label: "Total Actual Sales per Day",
        data: [], // Initial empty array for data
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  });

  const fetchSalesData = async (month: string, year: string) => {
    try {
      if (!month || !year) return;

      const tsmResponse = await fetch(
        `/api/ModuleSales/Dashboard/TSM/FetchBarActualSales?tsm=${encodeURIComponent(userDetails.ReferenceID)}&month=${month}&year=${year}`
      );
      const tsmData = await tsmResponse.json();

      const managerResponse = await fetch(
        `/api/ModuleSales/Dashboard/Manager/FetchBarActualSales?manager=${encodeURIComponent(userDetails.ReferenceID)}&month=${month}&year=${year}`
      );
      const managerData = await managerResponse.json();

      const filterDataByMonthYear = (data: { date_created: string; actualsales: number }[]) => {
        return data.filter((sale) => {
          const saleDate = new Date(sale.date_created);
          const saleMonth = saleDate.getMonth() + 1; // Months are 0-based
          const saleYear = saleDate.getFullYear();
          return saleMonth === parseInt(month) && saleYear === parseInt(year);
        });
      };

      if (tsmData.success && Array.isArray(tsmData.data)) {
        const filteredTSMData = filterDataByMonthYear(tsmData.data);
        const salesByDayTSM = filteredTSMData.reduce((acc: Record<string, number>, sale) => {
          const date = sale.date_created;
          acc[date] = (acc[date] || 0) + sale.actualsales;
          return acc;
        }, {});

        const sortedDatesTSM = Object.keys(salesByDayTSM).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const sortedSalesTSM = sortedDatesTSM.map((date) => salesByDayTSM[date]);

        setChartData({
          labels: sortedDatesTSM,
          datasets: [
            {
              label: "Total Actual Sales per Day (TSM)",
              data: sortedSalesTSM,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              borderRadius: 10,
            },
          ],
        });
      }

      if (managerData.success && Array.isArray(managerData.data)) {
        const filteredManagerData = filterDataByMonthYear(managerData.data);
        const salesByDayManager = filteredManagerData.reduce((acc: Record<string, number>, sale) => {
          const date = sale.date_created;
          acc[date] = (acc[date] || 0) + sale.actualsales;
          return acc;
        }, {});

        const sortedDatesManager = Object.keys(salesByDayManager).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const sortedSalesManager = sortedDatesManager.map((date) => salesByDayManager[date]);

        setChartManagerData({
          labels: sortedDatesManager,
          datasets: [
            {
              label: "Total Actual Sales per Day (Manager)",
              data: sortedSalesManager,
              backgroundColor: "rgba(29, 168, 150, 0.6)",
              borderColor: "rgb(31, 164, 187)",
              borderWidth: 1,
              borderRadius: 10,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const handleFilterChange = (month: string, year: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Fetch data when month/year changes
  useEffect(() => {
    if (userDetails.ReferenceID && selectedMonth && selectedYear) {
      fetchSalesData(selectedMonth, selectedYear);
    }
  }, [userDetails.ReferenceID, selectedMonth, selectedYear]);

  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (!userId) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();

        setUserDetails({
          UserId: data._id,
          ReferenceID: data.ReferenceID || "",
          Manager: data.Manager || "",
          TSM: data.TSM || "",
          Firstname: data.Firstname || "",
          Lastname: data.Lastname || "",
          Email: data.Email || "",
          Role: data.Role || "",
          Department: data.Department || "",
          Company: data.Company || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userDetails.ReferenceID) return;

    const fetchDashboardData = async () => {
      try {
        const baseURL = "/api/ModuleSales/Dashboard/";
        const tsmBaseURL = "/api/ModuleSales/Dashboard/TSM/";
        const managerBaseURL = "/api/ModuleSales/Dashboard/Manager/";

        const encodeID = encodeURIComponent(userDetails.ReferenceID);

        // ✅ Fetch Sales Order and Actual Sales with date_created for filtering
        const [salesOrderMainRes, actualSalesMainRes] = await Promise.all([
          fetch(baseURL + `FetchSalesOrder?referenceID=${encodeID}`),
          fetch(baseURL + `FetchActualSales?referenceID=${encodeID}`),
        ]);

        if (!salesOrderMainRes.ok || !actualSalesMainRes.ok) {
          throw new Error("Failed to fetch sales data.");
        }

        const salesOrderMainData = await salesOrderMainRes.json();
        const actualSalesMainData = await actualSalesMainRes.json();

        if (salesOrderMainData.success) {
          setTotalSalesOrder(salesOrderMainData.totalSalesOrder);
          computeWeeklyAndMonthlyTotals(salesOrderMainData.data, "SalesOrder");
        }

        if (actualSalesMainData.success) {
          setTotalActualSales(actualSalesMainData.totalActualSales);
          computeWeeklyAndMonthlyTotals(actualSalesMainData.data, "ActualSales");
        }

        // Common API calls
        const commonEndpoints = [
          `FetchWorkingHours?referenceID=${encodeID}`,
          `FetchCalls?referenceID=${encodeID}`,
          `FetchAccount?referenceID=${encodeID}`,
          `FetchActualSales?referenceID=${encodeID}`,
          `FetchSalesOrder?referenceID=${encodeID}`,
          `FetchQuotationAmount?referenceID=${encodeID}`,
          `FetchTotalActivity?referenceID=${encodeID}`,
        ].map((endpoint) => fetch(baseURL + endpoint));

        // TSM API calls
        const tsmEndpoints = [
          `FetchCalls?tsm=${encodeID}`,
          `FetchAccount?tsm=${encodeID}`,
          `FetchActualSales?tsm=${encodeID}`,
        ].map((endpoint) => fetch(tsmBaseURL + endpoint));

        // Manager API calls
        const managerEndpoints = [
          `FetchCalls?manager=${encodeID}`,
          `FetchAccount?manager=${encodeID}`,
          `FetchActualSales?manager=${encodeID}`,
        ].map((endpoint) => fetch(managerBaseURL + endpoint));

        // Fetch all data concurrently
        const [commonRes, tsmRes, managerRes] = await Promise.all([
          Promise.all(commonEndpoints),
          Promise.all(tsmEndpoints),
          Promise.all(managerEndpoints),
        ]);

        // Extract responses
        const [hoursRes, callsRes, accountRes, actualSalesRes, salesOrderRes, quotationAmountRes, activityRes] = commonRes;
        const [tsmCallsRes, tsmAccountRes, tsmActualSalesRes] = tsmRes;
        const [managerCallsRes, managerAccountRes, managerActualSalesRes] = managerRes;

        // Validate all responses
        const allCommonResponses = [hoursRes, callsRes, accountRes, actualSalesRes, salesOrderRes, quotationAmountRes, activityRes];
        if (!allCommonResponses.every((res) => res.ok)) {
          throw new Error("Failed to fetch common dashboard data");
        }

        // Convert responses to JSON
        const [hoursData, callsData, accountData, actualSalesData, salesOrderData, quotationAmountData, activityData] = await Promise.all(
          allCommonResponses.map((res) => res.json())
        );

        // Update state for common data
        if (hoursData.success) {
          setTotalHours(hoursData.totalHours);
          convertToHMS(hoursData.totalHours);
        }

        if (callsData.success) {
          setTotalInbound(callsData.totalInbound);
          setTotalOutbound(callsData.totalOutbound);
        }

        if (accountData.success) {
          setTotalAccounts(accountData.totalAccounts);
        }

        if (actualSalesData.success) {
          setTotalActualSales(actualSalesData.totalActualSales);
        }

        if (salesOrderData.success) {
          setTotalSalesOrder(salesOrderData.totalSalesOrder);
        }

        if (quotationAmountData.success) {
          setTotalQuotationAmount(quotationAmountData.totalQuotationAmount);
        }

        if (activityData.success) {
          setTotalActivityCount(activityData.totalActivityCount);
        }

        // Fetch and update TSM data
        if (tsmRes.every((res) => res.ok)) {
          const [tsmCallsData, tsmAccountData, tsmActualSalesData] = await Promise.all(tsmRes.map((res) => res.json()));

          if (tsmCallsData.success) {
            setTsmTotalInbound(tsmCallsData.totalInbound);
            setTsmTotalOutbound(tsmCallsData.totalOutbound);
          }

          if (tsmAccountData.success) {
            setTsmTotalAccounts(tsmAccountData.totalAccounts);
          }

          if (tsmActualSalesData.success) {
            setTsmTotalActualSales(tsmActualSalesData.totalActualSales);
          }
        }

        // Fetch and update Manager data
        if (managerRes.every((res) => res.ok)) {
          const [managerCallsData, managerAccountData, managerActualSalesData] = await Promise.all(managerRes.map((res) => res.json()));

          if (managerCallsData.success) {
            setManagerTotalInbound(managerCallsData.totalInbound);
            setManagerTotalOutbound(managerCallsData.totalOutbound);
          }

          if (managerAccountData.success) {
            setManagerTotalAccounts(managerAccountData.totalAccounts);
          }

          if (managerActualSalesData.success) {
            setManagerTotalActualSales(managerActualSalesData.totalActualSales);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [userDetails.ReferenceID, month, week]);

  const computeWeeklyAndMonthlyTotals = (
    data: any[] | undefined,
    type: "SalesOrder" | "ActualSales"
  ) => {
    // ✅ Check if data is valid
    if (!data || !Array.isArray(data)) {
      console.warn(`No data available for ${type}`);
      return;
    }

    const filteredData = data.filter((item) => {
      const createdDate = new Date(item.date_created);
      return (
        createdDate.toLocaleString("default", { month: "long" }) === month
      );
    });

    let weeklyTotal = 0;
    let monthlyTotal = 0;

    filteredData.forEach((item) => {
      const createdDate = new Date(item.date_created);
      const weekNumber = getWeekNumber(createdDate);

      // ✅ Compute weekly sales
      if (week === `Week ${weekNumber}`) {
        weeklyTotal += item.amount || 0;
      }

      // ✅ Compute monthly sales
      monthlyTotal += item.amount || 0;
    });

    if (type === "SalesOrder") {
      setTotalSalesOrderWeek(weeklyTotal);
      setTotalSalesOrderMonth(monthlyTotal);
    } else if (type === "ActualSales") {
      setTotalActualSalesWeek(weeklyTotal);
      setTotalActualSalesMonth(monthlyTotal);
    }
  };

  // ✅ Function to calculate week number from date
  const getWeekNumber = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const diff = date.getDate() + startOfMonth.getDay() - 1;
    return Math.floor(diff / 7) + 1;
  };

  const convertToHMS = (hours: number) => {
    const totalSeconds = Math.floor(hours * 3600);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    setFormattedTime(`${hrs} hrs ${mins} mins ${secs} secs`);
  };

  useEffect(() => {
    if (userDetails.ReferenceID) { // Ensure ReferenceID is available
      fetch(`/api/ModuleSales/Dashboard/FetchRecentActivity?referenceID=${userDetails.ReferenceID}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.data)) {
            const filteredData = data.data
              .filter((post: Post) => {
                const postDate = post?.date_created ? new Date(post.date_created) : null;
                const matchesReferenceID =
                  post?.referenceid === userDetails.ReferenceID || post?.ReferenceID === userDetails.ReferenceID;
                return matchesReferenceID;
              })
              .sort((a: Post, b: Post) => new Date(b.date_created!).getTime() - new Date(a.date_created!).getTime()); // Sort by date_created (newest first)

            // Paginate the filtered data
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

            setActivityList(paginatedData); // Set the paginated data
          } else {
            setActivityList([]); // If no data, set an empty list
          }
        })
        .catch(() => setActivityList([])); // Catch any errors and reset the activity list
    }
  }, [userDetails.ReferenceID, currentPage]);

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-xs font-semibold whitespace-nowrap">My Activity Today</h3>
          </div>

          {userDetails.Role === "Territory Sales Associate" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Total Work Hours */}
                <div className="bg-blue-900 text-white shadow-md rounded-lg p-6 flex items-center">
                  <CiTimer className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Work Hours</h3>
                    <p className="text-sm font-semibold">{formattedTime}</p>
                  </div>
                </div>

                {/* Total Inbound Calls */}
                <div className="bg-green-900 text-white shadow-md rounded-lg p-6 flex items-center">
                  <CiInboxIn className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Inbound Calls</h3>
                    <p className="text-sm font-semibold">{totalInbound}</p>
                  </div>
                </div>

                {/* Total Outbound Calls */}
                <div className="bg-yellow-600 text-white shadow-md rounded-lg p-6 flex items-center">
                  <CiInboxOut className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Outbound Calls</h3>
                    <p className="text-sm font-semibold">{totalOutbound}</p>
                  </div>
                </div>

                {/* Total Company Accounts */}
                <div className="bg-red-700 text-white shadow-md rounded-lg p-6 flex items-center">
                  <BsBuildings className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Company Accounts</h3>
                    <p className="text-sm font-semibold">{totalAccounts ?? 0}</p>
                  </div>
                </div>
              </div>

              {/* Large Cards Below */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-100 text-gray-900 shadow-md rounded-lg p-2 flex flex-col lg:col-span-3">
                  {/* Card Body */}
                  <div className="flex-grow p-0">
                    <div className="flex mb-4 border-b">
                      <button
                        className={`py-2 px-4 text-xs ${activeTab === "recent" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                          }`}
                        onClick={() => setActiveTab("recent")}
                      >
                        Recently
                      </button>
                      <button
                        className={`py-2 px-4 text-xs ${activeTab === "progress" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                          }`}
                        onClick={() => setActiveTab("progress")}
                      >
                        Activity Progress
                      </button>
                    </div>
                    {/* Table inside the card body */}
                    <div className="">
                      {activeTab === "recent" && (
                        <>
                          <div className="bg-gray-200 rounded-t-lg p-4">
                            <h3 className="text-xs font-semibold">Recent Activity</h3>
                            <p className="text-xs text-gray-600">
                              recent activities tied to the account, showing details like the date, company name, activity type, status, and remarks. The status is color-coded (Cold, Warm, Hot, Done) for quick progress assessment.
                            </p>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full bg-white table-auto text-xs">
                              <thead>
                                <tr>
                                  <th className="py-3 px-4 text-left">Date</th>
                                  <th className="py-3 px-4 text-left">Company Name</th>
                                  <th className="py-3 px-4 text-left">Type of Activity</th>
                                  <th className="py-3 px-4 text-left">Status</th>
                                  <th className="py-3 px-4 text-left">Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activityList && activityList.length > 0 ? (
                                  activityList.map((activity, index) => {
                                    // Define the badge color based on activity status
                                    let statusBadgeColor = "";
                                    switch (activity.activitystatus) {
                                      case "Cold":
                                        statusBadgeColor = "bg-blue-500 text-white";
                                        break;
                                      case "Warm":
                                        statusBadgeColor = "bg-yellow-500 text-black";
                                        break;
                                      case "Hot":
                                        statusBadgeColor = "bg-red-500 text-white";
                                        break;
                                      case "Done":
                                        statusBadgeColor = "bg-green-500 text-white";
                                        break;
                                      default:
                                        statusBadgeColor = "bg-gray-300 text-black";
                                    }

                                    return (
                                      <tr key={index} className="border-t border-gray-100 capitalize">
                                        <td className="py-4 px-6">
                                          {new Date(activity.date_created).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">{activity.companyname}</td>
                                        <td className="py-4 px-6">{activity.typeactivity}</td>
                                        <td className="py-4 px-6">
                                          <span
                                            className={`inline-block px-2 py-1 rounded-full text-[8px] ${statusBadgeColor}`}
                                          >
                                            {activity.activitystatus}
                                          </span>
                                        </td>
                                        <td className="py-4 px-6">
                                          {activity.remarks ? activity.remarks : activity.activityremarks}
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="text-center py-4 px-6">
                                      No data available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                        </>
                      )}

                      {/* Activity Progress Table */}
                      {activeTab === "progress" && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {/* Date Range Inputs */}
                          <div className="flex items-center space-x-2 md:col-span-2">
                            <select
                              value={month}
                              onChange={(e) => setMonth(e.target.value)}
                              className="border border-gray-300 rounded-lg p-2 text-xs w-full md:w-1/2"
                            >
                              <option value="January">January</option>
                              <option value="February">February</option>
                              <option value="March">March</option>
                              <option value="April">April</option>
                              <option value="May">May</option>
                              <option value="June">June</option>
                              <option value="July">July</option>
                              <option value="August">August</option>
                              <option value="September">September</option>
                              <option value="October">October</option>
                              <option value="November">November</option>
                              <option value="December">December</option>
                            </select>
                            <select
                              value={week}
                              onChange={(e) => setWeek(e.target.value)}
                              className="border border-gray-300 rounded-lg p-2 text-xs w-full md:w-1/2"
                            >
                              <option value="Week 1">Week 1</option>
                              <option value="Week 2">Week 2</option>
                              <option value="Week 3">Week 3</option>
                              <option value="Week 4">Week 4</option>
                            </select>
                          </div>

                          {/* Sales Order Card */}
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            <h3 className="text-sm font-bold text-blue-700 mb-2">📈 Sales Order Today</h3>
                            <p className="text-md font-extrabold text-blue-900">
                              ₱{Number(totalSalesOrder).toLocaleString("en-PH")}
                            </p>

                            <h3 className="text-sm font-bold text-blue-700 mb-1 mt-2">📅 Sales Order Week</h3>
                            <p className="text-md font-semibold text-blue-800">
                              ₱{Number(totalSalesOrderWeek).toLocaleString("en-PH")}
                            </p>

                            <h3 className="text-sm font-bold text-blue-700 mb-1 mt-2">🗓️ Sales Order Month</h3>
                            <p className="text-md font-extrabold text-blue-800">
                              ₱{Number(totalSalesOrderMonth).toLocaleString("en-PH")}
                            </p>
                          </div>

                          {/* Actual Sales Card */}
                          <div className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            <h3 className="text-sm font-bold text-green-700 mb-2">💰 Actual Sales Today</h3>
                            <p className="text-lg font-extrabold text-green-900">
                              ₱{Number(totalActualSales).toLocaleString("en-PH")}
                            </p>

                            <h3 className="text-sm font-bold text-green-700 mb-1 mt-2">📅 Actual Sales Week</h3>
                            <p className="text-md font-semibold text-green-800">
                              ₱{Number(totalActualSalesWeek).toLocaleString("en-PH")}
                            </p>

                            <h3 className="text-sm font-bold text-green-700 mb-1 mt-2">🗓️ Actual Sales Month</h3>
                            <p className="text-md font-extrabold text-green-800">
                              ₱{Number(totalActualSalesMonth).toLocaleString("en-PH")}
                            </p>
                          </div>

                        </div>
                      )}

                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-gray-200 text-gray-800 rounded-b-lg p-4 flex justify-between">
                    <button onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))} className="text-xs"><CiSquareChevLeft size={30} /></button>
                    <span className="text-xs">{currentPage}</span>
                    <button onClick={() => setCurrentPage(prevPage => prevPage + 1)} className="text-xs"><CiSquareChevRight size={30} /></button>
                  </div>
                </div>

                <div className="rounded-lg flex flex-col gap-4 lg:col-span-1">
                  {/* Cards inside Placeholder 2 */}
                  <div className="grid gap-4 w-full">
                    <div className="bg-green-700 text-white shadow-md rounded-lg p-6 flex items-center">
                      <CiMoneyBill className="text-4xl mr-4" />
                      <div>
                        <h3 className="text-xs font-bold mb-1">Actual Sales</h3>
                        <p className="text-sm font-semibold">₱{Number(totalActualSales).toLocaleString("en-PH")}</p>
                      </div>
                    </div>

                    <div className="bg-red-600 text-white shadow-md rounded-lg p-6 flex items-center">
                      <CiReceipt className="text-4xl mr-4" />
                      <div>
                        <h3 className="text-xs font-bold mb-1">Sales Order</h3>
                        <p className="text-sm font-semibold">₱{Number(totalSalesOrder).toLocaleString("en-PH")}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-500 text-white shadow-md rounded-lg p-6 flex items-center">
                      <CiWallet className="text-4xl mr-4" />
                      <div>
                        <h3 className="text-xs font-bold mb-1">Quotation Amount</h3>
                        <p className="text-sm font-semibold">₱{Number(totalQuotationAmount).toLocaleString("en-PH")}</p>
                      </div>
                    </div>

                    <div className="bg-blue-900 text-white shadow-md rounded-lg p-6 flex items-center">
                      <CiStopwatch className="text-4xl mr-4" />
                      <div>
                        <h3 className="text-xs font-bold mb-1">Total Activities</h3>
                        <p className="text-sm font-semibold">{totalActivityCount.toLocaleString()}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 flex items-center gap-4 mb-4">
                <h3 className="text-xs font-semibold">Time Log</h3>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                  <div className="flex flex-col items-center">
                    <select value={activitystatus} onChange={(e) => setActivityStatus(e.target.value)}
                      className="text-xs text-gray-900 px-3 py-2 border rounded w-full"
                      required
                    >
                      <option>Select Activity</option>
                      <option value="Client Visit">Client Visit</option>
                      <option value="On Site">On Site</option>
                      <option value="On Field">On Field</option>
                    </select>
                    <input type="hidden" value={address} onChange={(e) => setActivityRemarks(e.target.value)} className="text-xs text-gray-900 px-3 py-2 border rounded w-full" />
                    <input type="hidden" value={userDetails.ReferenceID} onChange={(e) => setReferenceID(e.target.value)} className="text-xs text-gray-900 px-3 py-2 border rounded w-full" />
                    <input type="hidden" value={userDetails.TSM} onChange={(e) => setTsm(e.target.value)} className="text-xs text-gray-900 px-3 py-2 border rounded w-full" />
                    <input type="hidden" value={userDetails.Manager} onChange={(e) => setManager(e.target.value)} className="text-xs text-gray-900 px-3 py-2 border rounded w-full" />

                  </div>

                  <div className="flex flex-col items-center">
                    <input
                      type="datetime-local"
                      value={currentDateTime} onChange={(e) => setstartdate(e.target.value)}
                      readOnly
                      className="text-xs text-gray-900 px-3 py-2 border rounded w-full"
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <input
                      type="datetime-local"
                      value={currentDateTimeTimer} onChange={(e) => setenddate(e.target.value)}
                      readOnly
                      className="text-xs text-gray-900 px-3 py-2 border rounded w-full"
                    />
                  </div>

                  {/* Timer and Buttons */}
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                    {!isTimerStopped ? (
                      <button
                        onClick={handleStartStop}
                        className={`flex items-center justify-center gap-2 text-xs text-white px-4 py-2 rounded w-full
                          ${isTimerRunning ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                        disabled={loading}
                      >
                        {!isTimerRunning ? (
                          <CiPlay1 size={20} />
                        ) : (
                          <>
                            <BsRecord size={20} />
                            {loading && (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            )}
                          </>
                        )}
                        {isTimerRunning ? "Stop" : "Start"}
                      </button>
                    ) : (
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 text-xs text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600 w-full"
                      >
                        <CiSaveDown1 size={20} />
                        Save
                      </button>
                    )}
                  </div>

                  {/* Timer Display */}
                  <div className="flex items-center text-xs font-medium text-center w-full">
                    Timer: {timerDisplay || "--:--:--"}
                  </div>
                </div>
              </div>
            </>
          )}

          {userDetails.Role === "Manager" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Total Inbound Calls */}
                <div className="bg-green-900 text-white shadow-md rounded-lg p-6 flex items-center">
                  <CiInboxIn className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Inbound Calls</h3>
                    <p className="text-sm font-semibold">{managertotalInbound}</p>
                  </div>
                </div>

                <div className="bg-yellow-600 text-white shadow-md rounded-lg p-6 flex items-center">
                  <CiInboxOut className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Outbound Calls</h3>
                    <p className="text-sm font-semibold">{managertotalOutbound}</p>
                  </div>
                </div>

                <div className="bg-red-700 text-white shadow-md rounded-lg p-6 flex items-center">
                  <BsBuildings className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Company Accounts</h3>
                    <p className="text-sm font-semibold">{managertotalAccounts ?? 0}</p>
                  </div>
                </div>

                <div className="bg-orange-500 text-white shadow-md rounded-lg p-6 flex items-center">
                  <CiMoneyBill className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Actual Sales</h3>
                    <p className="text-sm font-semibold">{managertotalActualSales.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Large Charts Below */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col lg:col-span-4">
                  {/* Card Header */}
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-800">Daily Sales Order to Delivery Summary</h3>
                    <p className="text-xs text-gray-600">An overview of the daily sales orders successfully converted into deliveries.</p>
                  </div>

                  {/* Chart Container */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
                      <select
                        className="px-3 py-2 border rounded text-xs text-gray-900 capitalize bg-gray-100 max-w-[150px]"
                        value={selectedMonth}
                        onChange={(e) => handleFilterChange(e.target.value, selectedYear)}
                      >
                        <option value="">Select Month</option>
                        {[
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ].map((month, index) => (
                          <option key={month} value={index + 1}>{month}</option>
                        ))}
                      </select>

                      <select
                        className="px-3 py-2 border rounded text-xs text-gray-900 capitalize bg-gray-100 max-w-[150px]"
                        value={selectedYear}
                        onChange={(e) => handleFilterChange(selectedMonth, e.target.value)}
                      >
                        <option value="">Select Year</option>
                        {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <Bar data={chartManagerData} options={options} />
                  </div>
                </div>
              </div>
            </>
          )}

          {userDetails.Role === "Territory Sales Manager" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Total Inbound Calls */}
                <div className="bg-green-900 text-white shadow-md rounded-lg p-6 flex items-center">
                  <CiInboxIn className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Inbound Calls</h3>
                    <p className="text-sm font-semibold">{tsmtotalInbound}</p>
                  </div>
                </div>

                <div className="bg-yellow-600 text-white shadow-md rounded-lg p-6 flex items-center">
                  <CiInboxOut className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Outbound Calls</h3>
                    <p className="text-sm font-semibold">{tsmtotalOutbound}</p>
                  </div>
                </div>

                <div className="bg-red-700 text-white shadow-md rounded-lg p-6 flex items-center">
                  <BsBuildings className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Total Company Accounts</h3>
                    <p className="text-sm font-semibold">{tsmtotalAccounts ?? 0}</p>
                  </div>
                </div>

                <div className="bg-orange-500 text-white shadow-md rounded-lg p-6 flex items-center">
                  <CiMoneyBill className="text-4xl mr-4" />
                  <div>
                    <h3 className="text-xs font-bold mb-1">Actual Sales</h3>
                    <p className="text-sm font-semibold">{tsmtotalActualSales.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Large Charts Below */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col lg:col-span-4">
                  {/* Card Header */}
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-800">Daily Sales Order to Delivery Summary</h3>
                    <p className="text-xs text-gray-600">An overview of the daily sales orders successfully converted into deliveries.</p>
                  </div>

                  {/* Chart Container */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
                      <select
                        className="px-3 py-2 border rounded text-xs text-gray-900 capitalize bg-gray-100 max-w-[150px]"
                        value={selectedMonth}
                        onChange={(e) => handleFilterChange(e.target.value, selectedYear)}
                      >
                        <option value="">Select Month</option>
                        {[
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ].map((month, index) => (
                          <option key={month} value={index + 1}>{month}</option>
                        ))}
                      </select>

                      <select
                        className="px-3 py-2 border rounded text-xs text-gray-900 capitalize bg-gray-100 max-w-[150px]"
                        value={selectedYear}
                        onChange={(e) => handleFilterChange(selectedMonth, e.target.value)}
                      >
                        <option value="">Select Year</option>
                        {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <Bar data={chartData} options={options} />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="bg-white text-white shadow-md border-4 border-gray-900 rounded-lg p-2 flex items-center w-full" style={{ height: "80vh" }}>
            {location ? (
              <MapContainer center={[location.lat, location.lng]} zoom={13} className="w-full h-full rounded-lg">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[location.lat, location.lng]} icon={customIcon}>
                  <Popup>You are here</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p>Loading map...</p>
            )}
          </div>

          {/* Display Address Here */}
          <p className="text-xs mt-2 font-semibold">📍 {address}</p>

          <ToastContainer className="text-xs" />
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
