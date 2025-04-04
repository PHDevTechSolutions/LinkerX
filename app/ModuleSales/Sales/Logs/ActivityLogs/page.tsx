"use client"; // This should be at the top if you're using Next.js 13 or later with the app directory.

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

import SearchFilters from "../../../components/Logs/ActivityLogs/SearchFilters";
import OutboundTable from "../../../components/Logs/ActivityLogs/ActivityTable";
import Pagination from "../../../components/Logs/ActivityLogs/Pagination";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from 'exceljs';
import { CiExport } from "react-icons/ci";

// Main Page Component
const OutboundCallPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientType, setSelectedClientType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://ecoshiftcorp.com.ph/activity_api.php");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        if (!text) {
          setPosts([]);
          return;
        }

        const data = JSON.parse(text);
        const postsWithId = data.map((post: any) => ({
          ...post,
          _id: post.progr_id || post.id || `_${Math.random().toString(36).substr(2, 9)}`,
        }));

        setPosts(postsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPosts([]);
      }
    };

    fetchData();
  }, []);

  // Filter posts based on search and selected client type
  const filteredPosts = posts.filter((post) => {
    const accountName = post.account_name ? post.account_name.toLowerCase() : '';

    const matchesSearch = accountName.includes(searchTerm.toLowerCase()) 

    const matchesClientType = selectedClientType ? post.type_of_client === selectedClientType : true;

    // Date range filtering
    const postStartDate = post.start_date ? new Date(post.start_date) : null;
    const postEndDate = post.end_date ? new Date(post.end_date) : null;
    const isWithinDateRange = (!startDate || (postStartDate && postStartDate >= new Date(startDate))) &&
      (!endDate || (postEndDate && postEndDate <= new Date(endDate)));

    return matchesSearch && matchesClientType && isWithinDateRange;
  });


  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(userName) => (
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                <h2 className="text-lg font-bold mb-2">Activity Logs</h2>
                <p className="text-xs mb-2">
                  This section displays details about outbound calls made to clients. It includes a search and filter functionality to refine call records based on client type, date range, and other criteria. The total number of entries is shown to provide an overview of recorded outbound calls.
                </p>

                {/* Display total entries */}
                <div className="mb-4 text-xs">
                  Total Entries: {filteredPosts.length}
                </div>

                <div className="mb-4 p-4 bg-white shadow-md rounded-md text-gray-900">
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
                  <OutboundTable posts={filteredPosts} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
                <ToastContainer />
              </div>
            </div>
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default OutboundCallPage;
