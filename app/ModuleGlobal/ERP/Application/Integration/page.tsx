"use client";
import React, { useState } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
import Cards from "../../../components/Applications/Integration/Cards";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersPage: React.FC = () => {
    const [loading, setLoading] = useState(true);

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="mb-4 p-4 bg-white border shadow-md rounded-lg">
                                <div className="mb-2">
                                    <h2 className="text-lg font-bold">Applications</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        This dashboard provides quick access to system-integrated applications like Taskflow, Ecodesk, Shopify, and more. Click on a module to explore its specific features.
                                    </p>
                                </div>

                                <Cards />
                            </div>

                            <ToastContainer className="text-xs" autoClose={1500} />
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default OrdersPage;
