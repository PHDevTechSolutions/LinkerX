import React, { useEffect, useState } from "react";
import { format, parseISO, differenceInDays, startOfMonth, getMonth, getYear } from "date-fns";

interface Post {
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeactivity: string;
  date_created: string;
  remarks: string;
}

interface UsersCardProps {
  posts: Post[];
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
  const [updatedUser, setUpdatedUser] = useState<Post[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    filterAndSetPosts();
  }, [posts, selectedMonth, selectedYear]);

  const filterAndSetPosts = () => {
    let filteredPosts = posts;

    if (selectedMonth || selectedYear) {
      filteredPosts = posts.filter((post) => {
        const postDate = parseISO(post.date_created);
        const postMonth = getMonth(postDate) + 1; // getMonth returns 0-11
        const postYear = getYear(postDate);

        const monthMatch = selectedMonth ? parseInt(selectedMonth) === postMonth : true;
        const yearMatch = selectedYear ? parseInt(selectedYear) === postYear : true;

        return monthMatch && yearMatch;
      });
    }

    setUpdatedUser(filteredPosts);
    setCurrentPage(1);
  };

  const getWeekOfMonth = (postDate: Date) => {
    const startOfMonthDate = startOfMonth(postDate);
    const daysIntoMonth = differenceInDays(postDate, startOfMonthDate) + 1;

    if (daysIntoMonth <= 7) return `Week 1`;
    if (daysIntoMonth <= 14) return `Week 2`;
    if (daysIntoMonth <= 21) return `Week 3`;
    return `Week 4`;
  };

  const groupByCompanyAndWeek = (posts: Post[]) => {
    const grouped: { [key: string]: { [key: string]: Post[] } } = {};

    posts.forEach((post) => {
      const postDate = parseISO(post.date_created);
      const week = getWeekOfMonth(postDate);

      if (!grouped[post.companyname]) {
        grouped[post.companyname] = {};
      }

      if (!grouped[post.companyname][week]) {
        grouped[post.companyname][week] = [];
      }

      grouped[post.companyname][week].push(post);
    });

    return grouped;
  };

  const groupedPosts = groupByCompanyAndWeek(
    updatedUser.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  );

  const totalPages = Math.ceil(updatedUser.length / itemsPerPage);

  return (
    <div className="mb-4">
      {/* Month and Year Filter */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 text-xs rounded"
        >
          <option value="">Select Month</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <option key={index + 1} value={index + 1}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 text-xs rounded"
        >
          <option value="">Select Year</option>
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Grouped Company Data */}
      {Object.keys(groupedPosts).map((company, index) => {
        const companyData = groupedPosts[company];

        return (
          <div key={index} className="mb-6">
            <div className="text-xs uppercase font-semibold">{company}</div>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-200 text-xs text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Week</th>
                    <th className="p-2 border">Contact Person</th>
                    <th className="p-2 border">Contact Number</th>
                    <th className="p-2 border">Type of Activity</th>
                    <th className="p-2 border">Date Created</th>
                    <th className="p-2 border">Activity Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, weekIndex) => {
                    const weekPosts = companyData[week] || [];
                    return (
                      <React.Fragment key={weekIndex}>
                        {weekPosts.length > 0 && (
                          <tr>
                            <td colSpan={6} className="bg-gray-200 text-sm p-2 font-semibold">
                              {week}
                            </td>
                          </tr>
                        )}
                        {weekPosts.map((post, postIndex) => {
                          const postDate = parseISO(post.date_created);
                          return (
                            <tr key={postIndex} className="hover:bg-gray-50 capitalize transition-all duration-200 ease-in-out transform hover:scale-[1.02]">
                              <td className="p-2 border">-</td>
                              <td className="p-2 border">{post.contactperson}</td>
                              <td className="p-2 border">{post.contactnumber}</td>
                              <td className="p-2 border">{post.typeactivity}</td>
                              <td className="p-2 border">
                                {format(postDate, "yyyy-MM-dd HH:mm:ss a")}
                              </td>
                              <td className="p-2 border">{post.remarks}</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded text-xs"
        >
          Previous
        </button>
        <div className="text-xs">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded text-xs"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersCard;
