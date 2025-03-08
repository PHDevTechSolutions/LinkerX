import React, { useEffect, useState } from "react";
import { format, parseISO, differenceInDays, startOfMonth } from "date-fns";

// Define the Post type to eliminate the 'any' type warning
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

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  // Function to determine the week of the month (1 to 4) considering days 29, 30, 31.
  const getWeekOfMonth = (postDate: Date) => {
    const startOfMonthDate = startOfMonth(postDate);
    const daysIntoMonth = differenceInDays(postDate, startOfMonthDate) + 1; // 1-based day count

    // Adjust for months with 29, 30, 31 days.
    if (daysIntoMonth <= 7) return `Week 1`;
    if (daysIntoMonth <= 14) return `Week 2`;
    if (daysIntoMonth <= 21) return `Week 3`;
    return `Week 4`; // Week 4 for days 22 and onwards (handles 29, 30, 31 as well)
  };

  // Group posts by company name and week within the month
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

  // Group the posts by company and week within the month
  const groupedPosts = groupByCompanyAndWeek(updatedUser);

  return (
    <div className="mb-4">
      {/* Loop through each company and display their posts */}
      {Object.keys(groupedPosts).map((company, index) => {
        const companyData = groupedPosts[company];

        return (
          <div key={index} className="mb-6">
            <div className="text-xs uppercase font-semibold">{company}</div>

            {/* Table for each company's posts */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-200 text-xs">
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
                  {/* Loop through the weeks for each company */}
                  {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, weekIndex) => {
                    const weekPosts = companyData[week] || [];

                    return (
                      <React.Fragment key={weekIndex}>
                        {/* Display the week name */}
                        <tr>
                          <td colSpan={6} className="bg-gray-200 text-sm p-2 font-semibold">
                            {week}
                          </td>
                        </tr>

                        {/* Loop through the posts for each week */}
                        {weekPosts.map((post, postIndex) => {
                          const postDate = parseISO(post.date_created);

                          return (
                            <tr key={postIndex} className="hover:bg-gray-50">
                              <td className="p-2 border"></td> {/* Empty cell for "Week" column */}
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
    </div>
  );
};

export default UsersCard;
