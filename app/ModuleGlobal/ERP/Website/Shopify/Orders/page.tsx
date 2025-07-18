"use client";
import React, { useState, useEffect, useMemo } from "react";
import ParentLayout from "../../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../../components/Session/SessionChecker";
import UserFetcher from "../../../../components/User/UserFetcher";
import Table from "../../../../components/Website/Shopify/Orders/Table";
import Filters from "../../../../components/Website/Shopify/Orders/Filters";
import Pagination from "../../../../components/Website/Shopify/Orders/Pagination";
import { ToastContainer, toast } from "react-toastify";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";

interface ShopifyOrder {
    id: number;
    name: string;
    created_at: string;
    financial_status: string;
    fulfillment_status: string | null;
    current_total_price: string;
    customer?: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<ShopifyOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [page, setPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/Data/Applications/Shopify/FetchOrder");
                const json = await res.json();
                if (!json.success) throw new Error(json.error);
                setOrders(json.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load Shopify orders");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        let list = orders;
        if (startDate)
            list = list.filter((o) => new Date(o.created_at) >= new Date(startDate));
        if (endDate)
            list = list.filter((o) => new Date(o.created_at) <= new Date(endDate));
        if (query) {
            const q = query.toLowerCase();
            list = list.filter((o) => {
                const full = o.customer
                    ? `${o.customer.first_name} ${o.customer.last_name}`.toLowerCase()
                    : "";
                return (
                    o.name.toLowerCase().includes(q) ||
                    full.includes(q) ||
                    o.customer?.email?.toLowerCase().includes(q)
                );
            });
        }
        return list;
    }, [orders, query, startDate, endDate]);

    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

    // Export to Excel function
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Shopify Orders");

        // Define columns
        worksheet.columns = [
            { header: "Order #", key: "name", width: 15 },
            { header: "Date", key: "created_at", width: 20 },
            { header: "Customer", key: "customer_name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Total", key: "total", width: 15 },
            { header: "Financial Status", key: "financial_status", width: 20 },
            { header: "Fulfillment Status", key: "fulfillment_status", width: 20 },
        ];

        // Add rows
        pagedData.forEach((o) => {
            worksheet.addRow({
                name: o.name,
                created_at: new Date(o.created_at).toLocaleString(),
                customer_name: o.customer
                    ? `${o.customer.first_name} ${o.customer.last_name}`
                    : "Guest",
                email: o.customer?.email ?? "—",
                total: Number(o.current_total_price).toFixed(2),
                financial_status: o.financial_status,
                fulfillment_status: o.fulfillment_status ?? "Unfulfilled",
            });
        });

        // Styling header row bold
        worksheet.getRow(1).font = { bold: true };

        // Generate buffer and save file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `ShopifyOrders_Page${page}.xlsx`);
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                <div className="mb-4 p-4 bg-white border shadow-md rounded-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-bold">Shopify Orders</h2>
                                        <button
                                            onClick={exportToExcel}
                                            className="border text-black px-4 py-2 rounded text-xs flex"
                                            disabled={loading || pagedData.length === 0}
                                            title="Export current page to Excel">
                                            Export to Excel
                                        </button>
                                    </div>

                                    {/* Filters component */}
                                    <Filters
                                        query={query}
                                        setQuery={setQuery}
                                        startDate={startDate}
                                        setStartDate={setStartDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                        resetPage={() => setPage(1)}
                                    />

                                    {loading ? (
                                        <p className="text-sm text-gray-500">Loading orders…</p>
                                    ) : filtered.length === 0 ? (
                                        <p className="text-sm text-gray-500">No orders found.</p>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <Table orders={pagedData} loading={false} />
                                            </div>

                                            <Pagination
                                                currentPage={page}
                                                totalPages={totalPages}
                                                onPageChange={setPage}
                                                showingCount={pagedData.length}
                                                totalCount={filtered.length}
                                            />
                                        </>
                                    )}
                                </div>
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
