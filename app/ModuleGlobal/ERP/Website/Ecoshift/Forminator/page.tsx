"use client";
import React, { useEffect, useState } from "react";
import ParentLayout from "../../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../../components/Session/SessionChecker";
import UserFetcher from "../../../../components/User/UserFetcher";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListofUser: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch("/api/forminator/submissions");
        if (!res.ok) throw new Error("Failed to fetch submissions");
        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        console.error("Error:", err);
        toast.error("Failed to load submissions.");
        setError("Failed to fetch Forminator submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => (
            <div className="container mx-auto p-4 text-gray-900">
              <div className="mb-4 p-4 bg-white border shadow-md rounded-lg">
                <h2 className="text-lg font-bold mb-2">Forminator Submissions</h2>

                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-2 py-1">ID</th>
                          <th className="border px-2 py-1">Date</th>
                          <th className="border px-2 py-1">Fields</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((item, idx) => (
                          <tr key={idx}>
                            <td className="border px-2 py-1">{item.id}</td>
                            <td className="border px-2 py-1">{item.date_created}</td>
                            <td className="border px-2 py-1">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(item.fields, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
