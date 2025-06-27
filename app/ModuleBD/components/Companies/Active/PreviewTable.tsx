import React, { useState, useMemo } from "react";

interface PreviewTableProps {
    data: any[];
}

const fields = [
    "companyname",
    "contactperson",
    "contactnumber",
    "emailaddress",
    "typeclient",
    "address",
    "deliveryaddress",
    "area",
];

// Helper functions for formatting
const toUpperCase = (str: string) => str.toUpperCase();

const capitalize = (str: string) =>
    str.length === 0 ? "" : str[0].toUpperCase() + str.slice(1).toLowerCase();

const toLowerCase = (str: string) => str.toLowerCase();

const formatValue = (field: string, val: string) => {
    if (!val) return val;
    switch (field) {
        case "companyname":
            return toUpperCase(val);
        case "contactperson":
        case "contactnumber":
            return capitalize(val);
        case "emailaddress":
            return toLowerCase(val);
        case "address":
        case "deliveryaddress":
        case "area":
            return capitalize(val);
        default:
            return val;
    }
};

const PreviewTable: React.FC<PreviewTableProps> = ({ data }) => {
    const [tableData, setTableData] = useState(data);
    const [sortConfig, setSortConfig] = useState<
        { key: string; direction: "asc" | "desc" } | null
    >(null);

    // For modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalField, setModalField] = useState<null | string>(null);
    const [modalValue, setModalValue] = useState<null | string>(null);

    const sortedData = useMemo(() => {
        if (!sortConfig) return tableData;
        return [...tableData].sort((a, b) => {
            const aVal = (a[sortConfig.key] != null ? String(a[sortConfig.key]) : "")
                .toLowerCase();
            const bVal = (b[sortConfig.key] != null ? String(b[sortConfig.key]) : "")
                .toLowerCase();
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [tableData, sortConfig]);

    const toggleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const handleEdit = (index: number, key: string, value: string) => {
        const updated = [...tableData];
        updated[index][key] = value;
        setTableData(updated);
    };

    const getDuplicates = (field: string) => {
        const seen = new Set<string>();
        const duplicates = new Set<string>();
        for (const item of tableData) {
            const val = String(item[field] || "").trim().toLowerCase();
            if (!val) continue;
            if (seen.has(val)) duplicates.add(val);
            else seen.add(val);
        }
        return duplicates;
    };

    const duplicateEmails = getDuplicates("emailaddress");
    const duplicateNumbers = getDuplicates("contactnumber");

    const summary = {
        total: tableData.length,
        validEmail: tableData.filter((i) => {
            const v = i.emailaddress != null ? String(i.emailaddress) : "";
            return v.trim().length > 0;
        }).length,
        validNumber: tableData.filter((i) => {
            const v = i.contactnumber != null ? String(i.contactnumber) : "";
            return v.trim().length > 0;
        }).length,
    };

    // Open modal with duplicates for a given field and value
    const openDuplicateModal = (field: string, value: string) => {
        setModalField(field);
        setModalValue(value.toLowerCase());
        setModalOpen(true);
    };

    // Get all rows matching the duplicate value in the modal
    const modalRows =
        modalField && modalValue
            ? tableData.filter(
                (item) =>
                    (item[modalField] != null
                        ? String(item[modalField]).toLowerCase()
                        : "") === modalValue
            )
            : [];

    return (
        <div className="mt-4">
            <h3 className="text-sm font-bold mb-2">
                Preview Data ({summary.total} records)
            </h3>
            <p className="text-xs text-gray-600 mb-2">
                ✅ {summary.validEmail} emails | 📞 {summary.validNumber} contacts | 🔁
                duplicates: {duplicateEmails.size + duplicateNumbers.size}
            </p>

            <div className="overflow-auto max-h-64 border rounded-md">
                <table className="min-w-full table-auto text-xs">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="text-left border-l-4 border-orange-400">
                            {fields.map((field) => (
                                <th
                                    key={field}
                                    className="px-4 py-2 font-semibold text-gray-700 cursor-pointer whitespace-nowrap select-none"
                                    onClick={() => toggleSort(field)}
                                >
                                    {field
                                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                                        .replace(/_/g, " ")
                                        .toUpperCase()}{" "}
                                    {sortConfig?.key === field
                                        ? sortConfig.direction === "asc"
                                            ? "▲"
                                            : "▼"
                                        : ""}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item, index) => {
                            return (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    {fields.map((field) => {
                                        const rawVal =
                                            item[field] != null ? String(item[field]) : "";
                                        const val = formatValue(field, rawVal);
                                        const isEmpty = !rawVal.trim();
                                        const valLower = rawVal.toLowerCase();
                                        const isDuplicate =
                                            (field === "emailaddress" &&
                                                duplicateEmails.has(valLower)) ||
                                            (field === "contactnumber" &&
                                                duplicateNumbers.has(valLower));

                                        return (
                                            <td
                                                key={field}
                                                className={`px-4 py-2 truncate max-w-[200px] ${isEmpty ? "bg-red-100" : ""
                                                    } ${isDuplicate ? "bg-yellow-100 cursor-pointer" : ""}`}
                                                title={rawVal || "(empty)"}
                                                onClick={() => isDuplicate && openDuplicateModal(field, rawVal)}
                                            >
                                                <input
                                                    className="w-full bg-transparent outline-none"
                                                    value={rawVal}
                                                    onChange={(e) =>
                                                        handleEdit(index, field, e.target.value)
                                                    }
                                                />
                                                {isEmpty ? "❌" : "✅"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal for showing duplicates */}
            {modalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white rounded p-6 w-[90vw] max-w-[1200px] max-h-[90vh] shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                        style={{ overflow: "visible" }} // prevent scrolling inside modal container
                    >
                        <h4 className="font-bold mb-4 text-lg">
                            Duplicates for {modalField}: "{modalValue}"
                        </h4>
                        <div className="overflow-x-auto max-h-[75vh]"> {/* Allow horizontal scroll on table if needed */}
                            <table className="min-w-full text-xs border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        {fields.map((field) => (
                                            <th
                                                key={field}
                                                className="border px-3 py-2 text-left whitespace-nowrap"
                                            >
                                                {field
                                                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                                                    .replace(/_/g, " ")
                                                    .toUpperCase()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalRows.map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            {fields.map((field) => (
                                                <td
                                                    key={field}
                                                    className="border px-3 py-2 truncate max-w-[200px]"
                                                    title={row[field]}
                                                >
                                                    {row[field] || "(empty)"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button
                            className="mt-4 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            onClick={() => setModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PreviewTable;
