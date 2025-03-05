import React, { useEffect, useState } from "react";
import { format, parseISO, differenceInDays, startOfMonth } from "date-fns";
import { FaPlus, FaMinus } from "react-icons/fa"; // Importing icons for plus and minus

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
    const [expandedPosts, setExpandedPosts] = useState<{ [key: number]: boolean }>({}); // Track expanded state for each post by index

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

    // Function to toggle the expanded state of a specific post
    const togglePostDetails = (postIndex: number) => {
        setExpandedPosts((prevState) => ({
            ...prevState,
            [postIndex]: !prevState[postIndex], // Toggle the state for the specific post
        }));
    };

    return (
        <div className="mb-4">
            {/* Loop through each company and display their posts */}
            {Object.keys(groupedPosts).map((company, index) => {
                const companyData = groupedPosts[company];

                return (
                    <div key={index} className="mb-6">
                        <div className="text-xs uppercase font-semibold">{company}</div>

                        {/* Create a responsive grid to display weeks in columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {/* Loop through the weeks for each company */}
                            {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, weekIndex) => {
                                const weekPosts = companyData[week] || [];

                                return (
                                    <div key={weekIndex} className="space-y-4">
                                        <h4 className="text-xs font-semibold mb-2">{week}</h4>

                                        {/* Loop through the posts for each week */}
                                        {weekPosts.map((post, postIndex) => {
                                            const postDate = parseISO(post.date_created);

                                            return (
                                                <div
                                                    key={postIndex}
                                                    className="border rounded p-2 bg-white shadow-md"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <h5 className="text-xs font-medium">Post Details</h5>
                                                        {/* Toggle icon */}
                                                        <button
                                                            onClick={() => togglePostDetails(postIndex)}
                                                            className="text-xs"
                                                        >
                                                            {expandedPosts[postIndex] ? (
                                                                <FaMinus />
                                                            ) : (
                                                                <FaPlus />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Display the collapsed or expanded content */}
                                                    <div
                                                        className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
                                                            expandedPosts[postIndex] ? "max-h-screen" : "max-h-0"
                                                        }`}
                                                    >
                                                        {expandedPosts[postIndex] && (
                                                            <div className="text-xs">
                                                                <div className="text-xs">
                                                                    Contact Person: {post.contactperson}
                                                                </div>
                                                                <div className="text-xs">
                                                                    Contact Number: {post.contactnumber}
                                                                </div>
                                                                <div className="mt-2 text-xs font-medium">
                                                                    Type of Activity: {post.typeactivity}
                                                                </div>
                                                                <div className="text-xs">
                                                                    Date Created: {format(
                                                                        postDate,
                                                                        "yyyy-MM-dd HH:mm:ss a"
                                                                    )}
                                                                </div>
                                                                <div className="mt-1 text-xs">
                                                                    Activity Remarks: {post.remarks}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <hr className="my-2" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UsersCard;
