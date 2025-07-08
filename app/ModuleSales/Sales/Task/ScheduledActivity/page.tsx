"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
import Filters from "../../../components/Task/ScheduledActivity/Filters/Filters";
import Main from "../../../components/Task/ScheduledActivity/Main";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListofUser: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [userDetails, setUserDetails] = useState({
    UserId: "", Firstname: "", Lastname: "", Manager: "", TSM: "",
    Email: "", Role: "", Department: "", Company: "", TargetQuota: "", ReferenceID: "",
  });

  // Fetch user details once
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = new URLSearchParams(window.location.search).get("id");
      if (!userId) return setError("Missing User ID."), setLoading(false);

      try {
        const res = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
        if (!res.ok) throw new Error("Failed to fetch user data.");
        const data = await res.json();
        setUserDetails({
          UserId: data._id,
          Firstname: data.Firstname || "",
          Lastname: data.Lastname || "",
          Email: data.Email || "",
          Manager: data.Manager || "",
          TSM: data.TSM || "",
          Role: data.Role || "",
          Department: data.Department || "",
          Company: data.Company || "",
          TargetQuota: data.TargetQuota || "",
          ReferenceID: data.ReferenceID || "",
        });
      } catch (err) {
        console.error(err);
        setError("Error loading user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch activity posts
  const fetchAccount = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ModuleSales/Reports/AccountManagement/FetchActivity");
      const data = await res.json();
      setPosts(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching activities.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  // Efficient memoized filtering
  const filteredAccounts = useMemo(() => {
    return posts
      .filter((post) => {
        const company = post?.companyname?.toLowerCase() || "";
        const matchCompany = company.includes(searchTerm.toLowerCase());

        const postDate = post.date_created ? new Date(post.date_created) : null;
        const matchDate =
          (!startDate || (postDate && postDate >= new Date(startDate))) &&
          (!endDate || (postDate && postDate <= new Date(endDate)));

        const matchRefId =
          post?.referenceid === userDetails.ReferenceID || post?.ReferenceID === userDetails.ReferenceID;

        return matchCompany && matchDate && matchRefId;
      })
      .sort((a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
      );
  }, [posts, searchTerm, startDate, endDate, userDetails.ReferenceID]);

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => (
            <div className="container mx-auto p-4 text-gray-900">
              <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-lg font-bold mb-2">Scheduled Task</h2>
                <p className="text-xs text-gray-600 mb-4">
                  An overview of your recent and upcoming actions, including <strong>scheduled tasks</strong>, <strong>callbacks</strong>, <strong>calendar events</strong>, and <strong>inquiries</strong>—all in one place to keep you on track.
                </p>

                <Filters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                />

                <Main
                  posts={filteredAccounts}
                  userDetails={userDetails}
                  fetchAccount={fetchAccount}
                />
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
