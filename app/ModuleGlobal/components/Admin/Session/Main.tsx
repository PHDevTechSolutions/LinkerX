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

  // Date range states (format: YYYY-MM-DD)
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    // Filter posts by date range if set
    let filteredPosts = posts;

    if (startDate) {
      const start = new Date(startDate);
      filteredPosts = filteredPosts.filter(
        (post) => new Date(post.timestamp) >= start
      );
    }
    if (endDate) {
      // To include the entire endDate day, set time to 23:59:59
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filteredPosts = filteredPosts.filter(
        (post) => new Date(post.timestamp) <= end
      );
    }

    setUpdatedUser(filteredPosts);

    generateLoginLogoutCount(filteredPosts);
    generateLoginDuration(filteredPosts);
    generatePeakLoginTime(filteredPosts);
    generateDeptLoginFrequency(filteredPosts);
    generateTopActiveUsers(filteredPosts);
  }, [posts, startDate, endDate]);

  // Existing generate functions, no changes needed

  const generateLoginLogoutCount = (data: any[]) => {
    const grouped: Record<string, { login: number; logout: number }> = {};

    data.forEach((post) => {
      const date = new Date(post.timestamp).toLocaleDateString();
      const status = post.status?.toLowerCase();

      if (!grouped[date]) {
        grouped[date] = { login: 0, logout: 0 };
      }

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
        const durationMinutes = (end - start) / (1000 * 60); // minutes

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

    // Sort by duration descending and take top 5
    const sortedTop = Object.entries(sessions)
      .map(([email, minutes]) => ({
        email,
        hours: parseFloat((minutes / 60).toFixed(2)),
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);

    setTopUsersData(sortedTop);
  };

  return (
    <div className="mt-4">
      {/* Date Range Filters */}
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
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b text-xs">
        <button
          onClick={() => setActiveTab("table")}
          className={`px-4 py-2 border-b-2 ${
            activeTab === "table"
              ? "border-blue-500 text-blue-600 font-semibold"
              : "border-transparent text-gray-500"
          }`}
        >
          Table
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`px-4 py-2 border-b-2 ${
            activeTab === "report"
              ? "border-blue-500 text-blue-600 font-semibold"
              : "border-transparent text-gray-500"
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === "table" && (
        <TableXchire
          data={updatedUser}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          Role={Role}
          Department={Department}
        />
      )}

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
