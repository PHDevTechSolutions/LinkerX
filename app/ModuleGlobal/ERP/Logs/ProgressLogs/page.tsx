"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../../ModuleSales/components/User/UserFetcher";

import SearchFilters from "../../../../ModuleSales/components/Logs/ActivityLogs/SearchFilters";
import OutboundTable from "../../../../ModuleSales/components/Logs/ProgressLogs/ProgressTable";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OutboundCallPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0); // Total count from API
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientType, setSelectedClientType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://ecoshiftcorp.com.ph/progress_api.php` // No limit here
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data || []);  // Set posts data
        setTotalRecords(data.length); // Total records (adjust as needed)
      } catch (error) {
        console.error("Error fetching data:", error);
        setPosts([]);
        setTotalRecords(0);
      }
    };

    fetchData();
  }, []);

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(userName) => (
            <div className="container mx-auto p-4">
              <h2 className="text-lg font-bold mb-2">Progress Logs</h2>
              <p className="text-xs mb-2">
                This section displays details about outbound calls made to clients. It includes a search and filter functionality to refine call records based on client type, date range, and other criteria.
              </p>

              {/* Display total entries */}
              <div className="mb-4 text-xs">
                Total Entries: {totalRecords}
              </div>

              <div className="mb-4 p-4 bg-white border-4 border-gray-900 shadow-md rounded-lg text-gray-900">
                <SearchFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedClientType={selectedClientType}
                  setSelectedClientType={setSelectedClientType}
                  postsPerPage={postsPerPage}
                  setPostsPerPage={setPostsPerPage}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                />
                <OutboundTable posts={posts} />
              </div>
              <ToastContainer />
            </div>
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default OutboundCallPage;
