"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import { ToastContainer, toast } from "react-toastify";
import MainContainer from "../../components/Dashboard/MainContainer";

const DashboardPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    UserId: "",
    ReferenceID: "",
    Manager: "",
    TSM: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Role: "",
    Department: "",
    Company: "",
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("/api/ModuleSales/Reports/AccountManagement/FetchSales");
      const data = await response.json();
      console.log("Fetched data:", data);
      setPosts(data.data);
    } catch (error) {
      toast.error("Error fetching users.");
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAccounts = Array.isArray(posts)
    ? posts
        .filter((post) => {
          const postDate = post.date_created ? new Date(post.date_created) : null;

          const isWithinDateRange =
            (!startDate || (postDate && postDate >= new Date(startDate))) &&
            (!endDate || (postDate && postDate <= new Date(endDate)));

          const matchesReferenceID =
            post?.referenceid === userDetails.ReferenceID ||
            post?.ReferenceID === userDetails.ReferenceID;

          return isWithinDateRange && matchesReferenceID;
        })
        .sort(
          (a, b) =>
            new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        )
    : [];

  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (!userId) return;

      try {
        const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserDetails({
          UserId: data._id,
          ReferenceID: data.ReferenceID || "",
          Manager: data.Manager || "",
          TSM: data.TSM || "",
          Firstname: data.Firstname || "",
          Lastname: data.Lastname || "",
          Email: data.Email || "",
          Role: data.Role || "",
          Department: data.Department || "",
          Company: data.Company || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, []);

  return (
    <SessionChecker>
      <ParentLayout>
        <MainContainer filteredAccounts={filteredAccounts} />
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
