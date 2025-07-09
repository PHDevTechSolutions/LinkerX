"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../../components/Session/SessionChecker";
import UserFetcher from "../../../../components/User/UserFetcher";
import OrderTable from "../../../../components/Website/Ecoshift/Table";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiSquarePlus } from "react-icons/ci";

const ListofUser: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/woocommerce/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders.");
        setError("Failed to fetch orders.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => (
            <div className="container mx-auto p-4 text-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                <div className="mb-4 p-4 bg-white border shadow-md rounded-lg">
                  <h2 className="text-lg font-bold mb-2">Session Logs</h2>
                  <OrderTable orders={orders} loading={loadingOrders} error={error} />
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
