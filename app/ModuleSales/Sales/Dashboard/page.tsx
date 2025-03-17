"use client";  // If you're using Next.js, ensure this is at the top of the file

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { BsBuildings } from "react-icons/bs";
import { CiTimer, CiInboxIn, CiInboxOut, CiMoneyBill, CiReceipt, CiWallet, CiStopwatch, CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

type Activity = {
  date_created: string; // or Date if it's a Date object
  typeactivity: string;
  remarks: string;
  activitystatus: string;
  companyname: string;
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
  }, [userDetails.ReferenceID]);


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
                  {/* Card Header */}
                  <div className="bg-gray-200 rounded-t-lg p-4">
                    <h3 className="text-xs font-semibold">Recent Activity</h3>
                    <p className="text-xs text-gray-600">
                      recent activities tied to the account, showing details like the date, company name, activity type, status, and remarks. The status is color-coded (Cold, Warm, Hot, Done) for quick progress assessment.
                    </p>

                  </div>

                  {/* Card Body */}
                  <div className="flex-grow p-0">
                    {/* Table inside the card body */}
                    <div className="overflow-x-auto"> {/* Added for horizontal scroll if table is too wide */}
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
                              let statusBadgeColor = '';
                              switch (activity.activitystatus) {
                                case 'Cold':
                                  statusBadgeColor = 'bg-blue-500 text-white'; // Blue for Cold
                                  break;
                                case 'Warm':
                                  statusBadgeColor = 'bg-yellow-500 text-black'; // Yellow for Warm
                                  break;
                                case 'Hot':
                                  statusBadgeColor = 'bg-red-500 text-white'; // Red for Hot
                                  break;
                                case 'Done':
                                  statusBadgeColor = 'bg-green-500 text-white'; // Green for Done
                                  break;
                                default:
                                  statusBadgeColor = 'bg-gray-300 text-black'; // Default (for unknown status)
                              }

                              return (
                                <tr key={index} className="border-t border-gray-100 capitalize">
                                  <td className="py-4 px-6">{new Date(activity.date_created).toLocaleDateString()}</td>
                                  <td className="py-4 px-6">{activity.companyname}</td>
                                  <td className="py-4 px-6">{activity.typeactivity}</td>
                                  <td className="py-4 px-6">
                                    <span className={`inline-block px-2 py-1 rounded-full text-[8px] ${statusBadgeColor}`}>
                                      {activity.activitystatus}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">{activity.remarks}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-4 px-6">No data available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>

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
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
