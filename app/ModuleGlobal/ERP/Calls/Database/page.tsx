"use client"; // This should be at the top if you're using Next.js 13 or later with the app directory.

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../../ModuleCSR/components/User/UserFetcher";

import SearchFilters from "../../../../ModuleCSR/components/Database/SearchFilters";
import OutboundTable from "../../../../ModuleCSR/components/Database/DatabaseTable";
import Pagination from "../../../../ModuleCSR/components/Database/Pagination";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from 'exceljs';
import { CiExport } from "react-icons/ci";
import { saveAs } from "file-saver";

// Main Page Component
const OutboundCallPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTSA, setselectedTSA] = useState("");
  const [selectedClientType, setSelectedClientType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://ecoshiftcorp.com.ph/db_api.php");
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
    const accountName = post.account_name?.toLowerCase() || '';
    const fullname = post.fullname?.toLowerCase() || '';
    
    const matchesSearch =
      accountName.includes(searchTerm.toLowerCase()) ||
      fullname.includes(searchTerm.toLowerCase());
  
    const matchesClientType = selectedClientType
      ? post.type_of_client === selectedClientType
      : true;
  
    let matchesStatus = true;
    if (selectedStatus) {
      const postStatus = post.status?.toLowerCase() || '';
  
      if (selectedStatus === 'null') {
        matchesStatus = !post.status || post.status.trim() === '';
      } else if (selectedStatus === 'active and inactive') {
        matchesStatus = postStatus === 'active' || postStatus === 'inactive';
      } else {
        matchesStatus = postStatus === selectedStatus.toLowerCase();
      }
    }
  
    const matchesTsa = selectedTSA ? post.fullname === selectedTSA : true;
  
    // Date range filtering
    const postStartDate = post.start_date ? new Date(post.start_date) : null;
    const postEndDate = post.end_date ? new Date(post.end_date) : null;
    const isWithinDateRange =
      (!startDate || (postStartDate && postStartDate >= new Date(startDate))) &&
      (!endDate || (postEndDate && postEndDate <= new Date(endDate)));
  
    return matchesSearch && matchesClientType && matchesStatus && matchesTsa && isWithinDateRange;
  });

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Database Account");

    // Set column headers
    worksheet.columns = [
      { header: 'TSA Fullname', key: 'fullname', width: 20 },
      { header: 'Company Name', key: 'account_name', width: 20 },
      { header: 'Contact Person', key: 'contact_person', width: 20 },
      { header: 'Contact No', key: 'contact_number', width: 20 },
      { header: 'Email.', key: 'email', width: 20 },
      { header: 'Type of Client', key: 'type_of_client', width: 20 },
      { header: 'Address', key: 'address', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    // Loop through all filtered posts to ensure the full set of data is exported
    filteredPosts.forEach((post) => {
      worksheet.addRow({
        fullname: post.fullname,
        account_name: post.account_name,
        contact_person: post.contact_person,
        contact_number: post.contact_number,
        email: post.email,
        type_of_client: post.type_of_client,
        address: post.address,
        status: post.status,
      });
    });

    // Save to file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
    
      // Dito mo muna i-edit ang filename bago i-save
      const fileName = prompt("Enter file name:", "Company Accounts - .xlsx");
    
      if (fileName) {
        saveAs(blob, fileName);
      }
    });
  };

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(userName) => (
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                <h2 className="text-lg font-bold mb-2">Account Records Management</h2>
                <p className="text-xs mb-2">
                  This section displays the Account Management Database, which serves as a central hub for storing and managing account-related records. It provides an organized way to track and update account details efficiently.
                </p>

                {/* Display total entries */}
                <div className="mb-4 text-xs">
                  Total Entries: {filteredPosts.length}
                </div>

                <div className="mb-4 p-4 border-4 border-gray-900 bg-white shadow-md rounded-lg text-gray-900">
                  <SearchFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedTSA={selectedTSA}
                    setselectedTSA={setselectedTSA}
                    selectedClientType={selectedClientType}
                    setSelectedClientType={setSelectedClientType}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
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
