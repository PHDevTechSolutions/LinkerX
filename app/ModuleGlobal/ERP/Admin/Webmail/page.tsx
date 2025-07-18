"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
import Filters from "../../../components/Admin/Webmail/Filters";
import Table from "../../../components/Admin/Webmail/Table";
import AccessModal from "../../../components/Admin/Webmail/AccessModal";
import Pagination from "../../../components/Admin/Webmail/Pagination";
import ViewModal from "../../../components/Admin/Webmail/ViewModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEMS_PER_PAGE = 10;

const ListofUser: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string>("");
  const [imapInputPass, setImapInputPass] = useState<string>("");
  const [showPasswordModal, setShowPasswordModal] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [userDetails, setUserDetails] = useState({
    UserId: "",
    ReferenceID: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Role: "",
    Department: "",
    Company: "",
    ImapHost: "",
  });

  useEffect(() => {
    const cached = sessionStorage.getItem("cachedSummaryEmails");
    const cachedDate = sessionStorage.getItem("cachedLastSync");

    if (cached) {
      setPosts(JSON.parse(cached));
      setLastSync(cachedDate || "");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, startDate, endDate]);

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
      const data = await response.json();

      setUserDetails({
        UserId: data._id,
        ReferenceID: data.ReferenceID,
        Firstname: data.Firstname || "",
        Lastname: data.Lastname || "",
        Email: data.Email || "",
        Role: data.Role || "",
        Department: data.Department || "",
        Company: data.Company || "",
        ImapHost: data.ImapHost || "",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.from?.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((email) => {
        const emailDate = new Date(email.date);
        return emailDate >= start && emailDate <= end;
      });
    }

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const fetchEmails = async () => {
    const { Email, ImapHost } = userDetails;

    if (!Email || !ImapHost || !imapInputPass) {
      toast.error("Missing IMAP credentials.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/Data/Applications/Webmail/Fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: Email,
          imapHost: ImapHost,
          imapPass: imapInputPass,
          imapPort: 993,
          secure: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch emails");

      // 🧠 Save only summaries for cache (no full body or attachments)
      const summaryData = data.map((email: any) => ({
        from: email.from,
        subject: email.subject,
        date: email.date,
        body: "", // Skip body to reduce size
      }));

      setPosts(data);
      const now = new Date().toLocaleString();
      setLastSync(now);

      sessionStorage.setItem("cachedSummaryEmails", JSON.stringify(summaryData));
      sessionStorage.setItem("cachedLastSync", now);
    } catch (error: any) {
      console.error("❌ Fetch error:", error.message);
      toast.error(error.message || "Error fetching emails.");
      setError(error.message || "Failed to fetch emails");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (!imapInputPass) {
      toast.warning("Please enter your webmail password.");
      return;
    }
    setShowPasswordModal(false);
    fetchEmails();
  };

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => (
            <div className="container mx-auto p-4 text-gray-900">
              <AccessModal
                isVisible={showPasswordModal}
                password={imapInputPass}
                onChangePassword={(e) => setImapInputPass(e.target.value)}
                onSubmit={handlePasswordSubmit}
              />

              <ViewModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                email={selectedEmail}
              />

              <div className="grid grid-cols-1">
                <div className="mb-4 p-4 bg-white border shadow-md rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold mb-4">📥 Webmail Inbox</h2>
                    <div className="flex space-x-2">
                      <button
                        className="border text-black px-4 py-2 rounded text-xs flex"
                        onClick={fetchEmails}
                        disabled={loading}
                      >
                        🔄 Refresh
                      </button>
                      <button
                        className="border text-black px-4 py-2 rounded text-xs"
                        onClick={() => {
                          sessionStorage.removeItem("cachedSummaryEmails");
                          sessionStorage.removeItem("cachedLastSync");
                          setPosts([]);
                          setFilteredPosts([]);
                          toast.success("Cache cleared!");
                        }}
                      >
                        🧹 Clear Cache
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xs mb-2 text-gray-600">
                    Logged in as: <span className="font-medium">{userDetails.Email}</span>
                  </h3>

                  <Filters
                    searchTerm={searchTerm}
                    startDate={startDate}
                    endDate={endDate}
                    setSearchTerm={setSearchTerm}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                  />

                  {loading ? (
                    <p className="text-gray-600 text-xs">Loading emails...</p>
                  ) : error ? (
                    <p className="text-red-500 text-xs">{error}</p>
                  ) : (
                    <Table
                      emails={paginatedPosts}
                      onView={(email) => {
                        setSelectedEmail(email);
                        setIsViewOpen(true);
                      }}
                    />
                  )}

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    lastSync={lastSync}
                  />
                </div>
              </div>

              <ToastContainer className="text-xs" autoClose={1000} />
            </div>
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default ListofUser;
