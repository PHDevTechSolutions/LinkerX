"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../../components/Session/SessionChecker";
import UserFetcher from "../../../../components/User/UserFetcher";
import Table from "../../../../components/Email/Mailjet/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListofUser: React.FC = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const res = await fetch("/api/mailjet/sent-emails");
        if (!res.ok) throw new Error("Failed to fetch sent emails");
        const data = await res.json();
        setEmails(data);
      } catch (err) {
        console.error("Error fetching emails:", err);
        toast.error("Failed to load sent emails.");
        setError("Failed to fetch sent emails.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentEmails();
  }, []);

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => (
            <div className="container mx-auto p-4 text-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                <div className="mb-4 p-4 border bg-white shadow-md rounded-lg">
                  <h2 className="text-lg font-bold mb-2">Mailjet | Sent Emails</h2>

                  <Table emails={emails} loading={loading} error={error} />
                </div>

                <ToastContainer className="text-xs" autoClose={1000} />
              </div>
            </div>
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default ListofUser;
