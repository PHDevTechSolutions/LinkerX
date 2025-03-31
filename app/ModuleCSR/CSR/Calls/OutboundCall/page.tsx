"use client"; // This should be at the top if you're using Next.js 13 or later with the app directory.

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

import SearchFilters from "../../../components/Outbound/SearchFilters";
import OutboundTable from "../../../components/Outbound/OutboundTable";
import Pagination from "../../../components/Outbound/Pagination";

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
        const response = await fetch("https://ecoshiftcorp.com.ph/api.php");
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
          _id: post.progress_id || post.id || `_${Math.random().toString(36).substr(2, 9)}`,
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
    const agentFullname = post.agent_fullname ? post.agent_fullname.toLowerCase() : '';

    const matchesSearch = accountName.includes(searchTerm.toLowerCase()) ||
      agentFullname.includes(searchTerm.toLowerCase());

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

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Outbound Calls");

    // Set column headers
    worksheet.columns = [
      { header: 'Company Name', key: 'account_name', width: 20 },
      { header: 'Territory Sales Associates', key: 'agent_fullname', width: 20 },
      { header: 'Territory Sales Manager', key: 'tsm_fullname', width: 20 },
      { header: 'Type of Client', key: 'type_of_client', width: 20 },
      { header: 'Type of Call', key: 'type_of_call', width: 20 },
      { header: 'Call Status', key: 'call_status', width: 20 },
      { header: 'Contact Person', key: 'contact_person', width: 20 },
      { header: 'Contact No.', key: 'contact_number', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Remarks', key: 'remarks', width: 20 },
      { header: 'Call Duration', key: 'start_date_end_date', width: 30 },
      { header: 'Time Consumed', key: 'time_consumed', width: 20 }
    ];

    // Loop through all filtered posts to ensure the full set of data is exported
    filteredPosts.forEach((post) => {
      worksheet.addRow({
        account_name: post.account_name,
        agent_fullname: post.agent_fullname,
        tsm_fullname: post.tsm_fullname,
        type_of_client: post.type_of_client,
        type_of_call: post.type_of_call,
        call_status: post.call_status,
        contact_person: post.contact_person,
        contact_number: post.contact_number,
        email: post.email,
        remarks: post.remarks,
        start_date_end_date: `${post.start_date} - ${post.end_date}`,
        time_consumed: post.time_consumed
      });
    });

    // Save to file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "outbound_calls.xlsx";
      link.click();
    });
  };

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(userName) => (
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                <h2 className="text-lg font-bold mb-2">Outbound Calls</h2>
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
                  <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-gray-100 shadow-sm text-dark text-xs flex items-center gap-1 rounded"><CiExport size={20} /> Export to Excel</button>
                  <OutboundTable posts={currentPosts} />
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
