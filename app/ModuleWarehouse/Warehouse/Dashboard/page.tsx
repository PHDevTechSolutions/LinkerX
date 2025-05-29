"use client";  // If you're using Next.js, ensure this is at the top of the file

import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";

// Charts
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
