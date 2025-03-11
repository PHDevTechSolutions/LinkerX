"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { BsBuildings } from "react-icons/bs";
import { CiTimer, CiInboxIn, CiInboxOut, CiMoneyBill, CiReceipt, CiWallet, CiStopwatch, CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";


type Activity = {
  date_created: string; // or Date if it's a Date object
  typeactivity: string;
  remarks: string;
  activitystatus: string;
};

interface Post {
  referenceid?: string;  // ReferenceID in PostgreSQL
  ReferenceID?: string; // ReferenceID in MongoDB
  date_created?: string;  // Date of creation (ISO format)
}

const DashboardPage: React.FC = () => {
  const [totalHours, setTotalHours] = useState<number>(0);
  const [formattedTime, setFormattedTime] = useState<string>("");

  const [totalInbound, setTotalInbound] = useState<number>(0);
  const [totalOutbound, setTotalOutbound] = useState<number>(0);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [totalActualSales, setTotalActualSales] = useState<number>(0);
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
        const [hoursRes, callsRes, accountRes, actualSalesRes, salesOrderRes, quotationAmountRes, activityRes] = await Promise.all([
          fetch(`/api/ModuleSales/Dashboard/FetchWorkingHours?referenceID=${encodeURIComponent(userDetails.ReferenceID)}`),
          fetch(`/api/ModuleSales/Dashboard/FetchCalls?referenceID=${encodeURIComponent(userDetails.ReferenceID)}`),
          fetch(`/api/ModuleSales/Dashboard/FetchAccount?referenceID=${encodeURIComponent(userDetails.ReferenceID)}`),
          fetch(`/api/ModuleSales/Dashboard/FetchActualSales?referenceID=${encodeURIComponent(userDetails.ReferenceID)}`),
          fetch(`/api/ModuleSales/Dashboard/FetchSalesOrder?referenceID=${encodeURIComponent(userDetails.ReferenceID)}`),
          fetch(`/api/ModuleSales/Dashboard/FetchQuotationAmount?referenceID=${encodeURIComponent(userDetails.ReferenceID)}`),
          fetch(`/api/ModuleSales/Dashboard/FetchTotalActivity?referenceID=${encodeURIComponent(userDetails.ReferenceID)}`),
        ]);

        if (!hoursRes.ok || !callsRes.ok || !accountRes.ok || !actualSalesRes.ok || !salesOrderRes.ok || !quotationAmountRes.ok || !activityRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [hoursData, callsData, accountData, actualSalesData, salesOrderData, quotationAmountData, activityData] = await Promise.all([
          hoursRes.json(),
          callsRes.json(),
          accountRes.json(),
          actualSalesRes.json(),
          salesOrderRes.json(),
          quotationAmountRes.json(),
          activityRes.json()
        ]);

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
          setTotalActualSales(actualSalesData.totalActualSales); // Set total actual sales
        }

        if (salesOrderData.success) {
          setTotalSalesOrder(salesOrderData.totalSalesOrder); // Set total sales order
        }

        if (quotationAmountData.success) {
          setTotalQuotationAmount(quotationAmountData.totalQuotationAmount); // Set total sales order
        }

        if (activityData.success) {
          setTotalActivityCount(activityData.totalActivityCount);
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
  }, [userDetails.ReferenceID, currentPage]); // Trigger the effect when ReferenceID or currentPage changes

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold">My Activity Today</h3>
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
                  </div>

                  {/* Card Body */}
                  <div className="flex-grow p-0">
                    {/* Table inside the card body */}
                    <div className="overflow-x-auto"> {/* Added for horizontal scroll if table is too wide */}
                      <table className="min-w-full bg-white table-auto text-xs">
                        <thead>
                          <tr>
                            <th className="py-3 px-4 text-left">Date</th>
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
                        <p className="text-sm font-semibold">{totalActualSales.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-red-600 text-white shadow-md rounded-lg p-6 flex items-center">
                      <CiReceipt className="text-4xl mr-4" />
                      <div>
                        <h3 className="text-xs font-bold mb-1">Sales Order</h3>
                        <p className="text-sm font-semibold">{totalSalesOrder.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-500 text-white shadow-md rounded-lg p-6 flex items-center">
                      <CiWallet className="text-4xl mr-4" />
                      <div>
                        <h3 className="text-xs font-bold mb-1">Quotation Amount</h3>
                        <p className="text-sm font-semibold">{totalQuotationAmount.toLocaleString()}</p>
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

          {userDetails.Role === "Territory Sales Manager" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Empty Cards */}
              <div className="bg-gray-300 text-gray-700 shadow-md rounded-lg p-4 flex items-center justify-center h-24">
                <p className="text-sm font-semibold">Placeholder 1</p>
              </div>

              <div className="bg-gray-300 text-gray-700 shadow-md rounded-lg p-4 flex items-center justify-center h-24">
                <p className="text-sm font-semibold">Placeholder 2</p>
              </div>

              <div className="bg-gray-300 text-gray-700 shadow-md rounded-lg p-4 flex items-center justify-center h-24">
                <p className="text-sm font-semibold">Placeholder 3</p>
              </div>

              <div className="bg-gray-300 text-gray-700 shadow-md rounded-lg p-4 flex items-center justify-center h-24">
                <p className="text-sm font-semibold">Placeholder 4</p>
              </div>
            </div>
          )}
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
