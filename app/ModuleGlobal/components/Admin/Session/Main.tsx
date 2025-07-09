import React, { useEffect, useState } from "react";
import TableXchire from "./TableXchire";
import Analytics from "./Charts/SessionLogs";
import LoginDurationChart from "./Charts/LoginDurationChart";
import PeakLoginTimeChart from "./Charts/PeakLoginTimeChart";
import DepartmentLoginFrequencyChart from "./Charts/DepartmentLoginFrequencyChart";
import TopActiveUsersChart from "./Charts/TopActiveUsersChart";

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
  Role: string;
  Department: string;
}

const UsersCard: React.FC<UsersCardProps> = ({
  posts,
  handleEdit,
  handleDelete,
  Role,
  Department,
}) => {
  const [updatedUser, setUpdatedUser] = useState(posts);
  const [activeTab, setActiveTab] = useState<"table" | "report">("table");
  const [reportData, setReportData] = useState<any[]>([]);
  const [durationData, setDurationData] = useState<any[]>([]);
  const [peakLoginData, setPeakLoginData] = useState<any[]>([]);
  const [deptLoginData, setDeptLoginData] = useState<any[]>([]);
  const [topUsersData, setTopUsersData] = useState<any[]>([]);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let filteredPosts = posts;

    if (startDate) {
      const start = new Date(startDate);
      filteredPosts = filteredPosts.filter(
        (post) => new Date(post.timestamp) >= start
      );
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filteredPosts = filteredPosts.filter(
        (post) => new Date(post.timestamp) <= end
      );
    }

    setUpdatedUser(filteredPosts);
    setCurrentPage(1); // Reset to page 1

    generateLoginLogoutCount(filteredPosts);
    generateLoginDuration(filteredPosts);
    generatePeakLoginTime(filteredPosts);
    generateDeptLoginFrequency(filteredPosts);
    generateTopActiveUsers(filteredPosts);
  }, [posts, startDate, endDate]);

  const generateLoginLogoutCount = (data: any[]) => {
    const grouped: Record<string, { login: number; logout: number }> = {};
    data.forEach((post) => {
      const date = new Date(post.timestamp).toLocaleDateString();
      const status = post.status?.toLowerCase();
      if (!grouped[date]) grouped[date] = { login: 0, logout: 0 };
      if (status === "login") grouped[date].login++;
      if (status === "logout") grouped[date].logout++;
    });

    const formatted = Object.entries(grouped).map(([date, counts]) => ({
      date,
      Login: counts.login,
      Logout: counts.logout,
    }));
    setReportData(formatted);
  };

  const generateLoginDuration = (data: any[]) => {
    const sessions: Record<string, number> = {};
    const sorted = [...data].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      if (
        current.email === next.email &&
        current.status?.toLowerCase() === "login" &&
        next.status?.toLowerCase() === "logout"
      ) {
        const start = new Date(current.timestamp).getTime();
        const end = new Date(next.timestamp).getTime();
        const durationMinutes = (end - start) / (1000 * 60);

        if (!sessions[current.email]) sessions[current.email] = 0;
        sessions[current.email] += durationMinutes;
      }
    }

    const formatted = Object.entries(sessions).map(([email, minutes]) => ({
      email,
      hours: parseFloat((minutes / 60).toFixed(2)),
    }));
    setDurationData(formatted);
  };

  const generatePeakLoginTime = (data: any[]) => {
    const counts: Record<number, number> = {};
    for (let i = 0; i < 24; i++) counts[i] = 0;

    data.forEach((post) => {
      if (post.status?.toLowerCase() === "login" && post.timestamp) {
        const hour = new Date(post.timestamp).getHours();
        counts[hour] = (counts[hour] || 0) + 1;
      }
    });

    const formatted = Object.entries(counts).map(([hour, logins]) => ({
      hour: hour.padStart ? hour.padStart(2, "0") : String(hour),
      logins,
    }));
    setPeakLoginData(formatted);
  };

  const generateDeptLoginFrequency = (data: any[]) => {
    const deptCounts: Record<string, number> = {};
    data.forEach((post) => {
      if (post.status?.toLowerCase() === "login") {
        const dept = post.department || "Unknown";
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      }
    });

    const formatted = Object.entries(deptCounts).map(([department, count]) => ({
      department,
      logins: count,
    }));
    setDeptLoginData(formatted);
  };

  const generateTopActiveUsers = (data: any[]) => {
    const sessions: Record<string, number> = {};
    const sorted = [...data].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      if (
        current.email === next.email &&
        current.status?.toLowerCase() === "login" &&
        next.status?.toLowerCase() === "logout"
      ) {
        const start = new Date(current.timestamp).getTime();
        const end = new Date(next.timestamp).getTime();
        const durationMinutes = (end - start) / (1000 * 60);

        if (!sessions[current.email]) sessions[current.email] = 0;
        sessions[current.email] += durationMinutes;
      }
    }

    const sortedTop = Object.entries(sessions)
      .map(([email, minutes]) => ({
        email,
        hours: parseFloat((minutes / 60).toFixed(2)),
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);

    setTopUsersData(sortedTop);
  };

  const totalPages = Math.ceil(updatedUser.length / pageSize);
  const paginatedData = updatedUser.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="mt-4">
      {/* Date Filter */}
      <div className="flex gap-4 mb-4 text-xs items-center">
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border-b bg-white text-xs"
          />
        </label>
        <label>
          End Date:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border-b bg-white text-xs"
          />
        </label>
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="ml-2 px-3 py-1 text-xs border rounded bg-gray-100 hover:bg-gray-200"
        >
          Clear
        </button>
        <div>
          <label className="mr-2">Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-xs"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b text-xs">
        <button
          onClick={() => setActiveTab("table")}
          className={`px-4 py-2 border-b-2 ${activeTab === "table"
              ? "border-blue-500 text-blue-600 font-semibold"
              : "border-transparent text-gray-500"
            }`}
        >
          Table
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`px-4 py-2 border-b-2 ${activeTab === "report"
              ? "border-blue-500 text-blue-600 font-semibold"
              : "border-transparent text-gray-500"
            }`}
        >
          Analytics
        </button>
      </div>

      {/* Table Tab */}
      {activeTab === "table" && (
        <>
          <TableXchire
            data={paginatedData}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            Role={Role}
            Department={Department}
          />

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="bg-gray-200 text-xs px-4 py-2 rounded"
              >
                Prev
              </button>
              <span className="text-xs">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="bg-gray-200 text-xs px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
        </>
      )}

      {/* Report Tab */}
      {activeTab === "report" && (
        <>
          <Analytics data={reportData} />
          <LoginDurationChart data={durationData} />
          <PeakLoginTimeChart data={peakLoginData} />
          <DepartmentLoginFrequencyChart data={deptLoginData} />
          <TopActiveUsersChart data={topUsersData} />
        </>
      )}
    </div>
  );
};

export default UsersCard;
