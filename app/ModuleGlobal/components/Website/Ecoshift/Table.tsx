"use client";
import React, { useState, useMemo } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface OrderTableProps {
    orders: any[];
    loading: boolean;
    error: string | null;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, loading, error }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const rowsPerPage = 10;

    // Filter orders by date range
    const filteredOrders = useMemo(() => {
        if (!startDate && !endDate) return orders;

        return orders.filter(order => {
            const orderDate = new Date(order.date_created).setHours(0, 0, 0, 0);
            const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
            const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

            if (start && end) {
                return orderDate >= start && orderDate <= end;
            } else if (start) {
                return orderDate >= start;
            } else if (end) {
                return orderDate <= end;
            }
            return true;
        });
    }, [orders, startDate, endDate]);

    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("WooCommerce Orders");

        // Columns header
        worksheet.columns = [
            { header: "Order ID", key: "id", width: 15 },
            { header: "Date", key: "date", width: 15 },
            { header: "Customer", key: "customer", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Status", key: "status", width: 15 },
            { header: "Payment Method", key: "payment_method", width: 25 },
            { header: "Shipping Method", key: "shipping_method", width: 25 },
            { header: "Total", key: "total", width: 15 },
        ];

        // Add rows
        filteredOrders.forEach(order => {
            worksheet.addRow({
                id: order.id,
                date: new Date(order.date_created).toLocaleDateString(),
                customer: `${order.billing.first_name} ${order.billing.last_name}`,
                email: order.billing.email,
                status: order.status,
                payment_method: order.payment_method_title,
                shipping_method: order.shipping_lines?.length > 0
                    ? order.shipping_lines[0].method_title
                    : "N/A",
                total: parseFloat(order.total).toFixed(2),
            });
        });

        // Generate buffer and save
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, "WooCommerceOrders.xlsx");
    };

    if (loading) return <p className="text-xs text-gray-500">Loading orders...</p>;
    if (error) return <p className="text-xs text-red-500">{error}</p>;
    if (orders.length === 0) return <p className="text-xs text-gray-500">No orders found.</p>;

    const statusColors: { [key: string]: string } = {
        processing: 'bg-green-800',
    };

    return (
        <div>
            {/* Date Range Filters */}
            <div className="flex gap-4 mb-4 items-center">
                <label className="text-xs">
                    Start Date:{" "}
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setCurrentPage(1); // reset page
                        }}
                        className="px-3 py-2 border-b bg-white text-xs"
                    />
                </label>
                <label className="text-xs">
                    End Date:{" "}
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setCurrentPage(1); // reset page
                        }}
                        className="px-3 py-2 border-b bg-white text-xs"
                    />
                </label>
                <button
                    onClick={exportToExcel}
                    className="border text-black px-4 py-2 rounded text-xs flex"
                >
                    Export to Excel
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                            <th className="px-6 py-4 font-semibold text-gray-700">Order ID</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Payment Method</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Shipping Method</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order: any) => (
                            <tr key={order.id} className="border-b whitespace-nowrap hover:bg-gray-100 cursor-pointer">
                                <td className="px-6 py-4 text-xs capitalize">{order.id}</td>
                                <td className="px-6 py-4 text-xs capitalize">{new Date(order.date_created).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-xs capitalize">{order.billing.first_name} {order.billing.last_name}</td>
                                <td className="px-6 py-4 text-xs">{order.billing.email}</td>
                                <td className="px-6 py-4 text-xs capitalize">
                                    <span className={`badge text-white shadow-md text-[8px] px-2 py-1 mr-2 rounded-xl ${statusColors[order.status] || 'bg-gray-400'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs capitalize">{order.payment_method_title}</td>
                                <td className="px-6 py-4 text-xs capitalize">
                                    {order.shipping_lines?.length > 0 ? order.shipping_lines[0].method_title : "N/A"}
                                </td>
                                <td className="px-6 py-4 text-xs capitalize">₱{parseFloat(order.total).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="bg-gray-200 text-xs px-4 py-2 rounded"
                >
                    Prev
                </button>
                <span className="text-xs">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-gray-200 text-xs px-4 py-2 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderTable;
