"use client";
import React, { useState, useEffect, useMemo } from "react";
import ParentLayout from "../../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../../components/Session/SessionChecker";
import UserFetcher from "../../../../components/User/UserFetcher";
import EditModal from "../../../../components/Website/Shopify/Products/Form";
import Table from "../../../../components/Website/Shopify/Products/Table";
import Filter from "../../../../components/Website/Shopify/Products/Filters";
import Pagination from "../../../../components/Website/Shopify/Products/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Variant {
    price: string;
    inventory_quantity?: number;
}

interface ShopifyProduct {
    id: number;
    title: string;
    product_type: string;
    vendor: string;
    status: string;
    variants: Variant[];
    created_at: string;
}

const pageSize = 20;

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Pagination state
    const [page, setPage] = useState(1);

    const [editing, setEditing] = useState<ShopifyProduct | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/Data/Applications/Shopify/FetchProduct");
                const json = await res.json();
                if (!json.success) throw new Error(json.error);
                setProducts(json.data);
            } catch (err: any) {
                console.error(err);
                setError("Failed to fetch products");
                toast.error("Failed to load Shopify products");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Filter products based on search and date range
    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (startDate) {
            filtered = filtered.filter(
                (p) => new Date(p.created_at) >= new Date(startDate)
            );
        }
        if (endDate) {
            filtered = filtered.filter(
                (p) => new Date(p.created_at) <= new Date(endDate)
            );
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.vendor.toLowerCase().includes(q) ||
                    (p.product_type?.toLowerCase().includes(q) ?? false)
            );
        }

        return filtered;
    }, [products, searchQuery, startDate, endDate]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
    const pagedProducts = filteredProducts.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [searchQuery, startDate, endDate]);

    // Export to Excel handler
    const exportToExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Shopify Products");

            // Define columns
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 },
                { header: "Title", key: "title", width: 30 },
                { header: "Type", key: "product_type", width: 20 },
                { header: "Vendor", key: "vendor", width: 20 },
                { header: "Price", key: "price", width: 12 },
                { header: "Stock", key: "stock", width: 10 },
                { header: "Status", key: "status", width: 12 },
                { header: "Created", key: "created_at", width: 15 },
            ];

            // Add rows
            filteredProducts.forEach((p) => {
                const totalStock = p.variants.reduce(
                    (sum, v) => sum + (v.inventory_quantity ?? 0),
                    0
                );
                const price = p.variants?.[0]?.price ?? "0.00";

                worksheet.addRow({
                    id: p.id,
                    title: p.title,
                    product_type: p.product_type || "—",
                    vendor: p.vendor,
                    price: price,
                    stock: totalStock,
                    status: p.status,
                    created_at: new Date(p.created_at).toLocaleDateString(),
                });
            });

            // Style header row
            worksheet.getRow(1).font = { bold: true };

            // Generate buffer
            const buffer = await workbook.xlsx.writeBuffer();

            // Save as file
            const blob = new Blob([buffer], {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "shopify-products.xlsx");
        } catch (error) {
            console.error("Excel export failed", error);
            toast.error("Failed to export Excel file");
        }
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
                                        <h2 className="text-lg font-bold mb-4">Shopify Products</h2>
                                        <button
                                            onClick={exportToExcel}
                                            className="border text-black px-4 py-2 rounded text-xs flex"
                                            disabled={loading || filteredProducts.length === 0}
                                        >
                                            Export to Excel
                                        </button>
                                    </div>

                                    {/* Use Filter component */}
                                    <Filter
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        startDate={startDate}
                                        setStartDate={setStartDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                    />

                                    {loading || error || filteredProducts.length === 0 ? (
                                        loading ? (
                                            <p className="text-xs text-gray-500">Loading…</p>
                                        ) : error ? (
                                            <p className="text-xs text-red-500">{error}</p>
                                        ) : (
                                            <p className="text-xs text-gray-500">No products found.</p>
                                        )
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <Table
                                                    products={pagedProducts}
                                                    loading={loading}
                                                    handleEdit={(p) => setEditing(p)} />
                                            </div>

                                            {editing && (
                                                <EditModal
                                                    product={editing}
                                                    onClose={() => setEditing(null)}
                                                    onSaved={async () => {
                                                        // re‑fetch list
                                                        const res = await fetch("/api/Data/Applications/Shopify/FetchProduct");
                                                        const json = await res.json();
                                                        if (json.success) setProducts(json.data);
                                                    }}
                                                />
                                            )}

                                            {/* Use Pagination component */}
                                            <Pagination
                                                currentPage={page}
                                                totalPages={totalPages}
                                                onPageChange={setPage}
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

export default ProductsPage;
