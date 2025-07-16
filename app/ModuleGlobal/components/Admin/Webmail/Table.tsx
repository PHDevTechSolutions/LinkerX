import React from "react";

interface Email {
    from: { text: string };
    subject: string;
    date: string;
    [key: string]: any;
}

interface TableProps {
    emails: Email[];
    onView: (email: Email) => void;
}

const Table: React.FC<TableProps> = ({ emails, onView }) => {
    if (emails.length === 0) {
        return <p className="text-gray-500 text-xs">No emails found.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                        <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">From</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Subject</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {emails.map((email, index) => (
                        <tr key={index} className="border-b whitespace-nowrap hover:bg-gray-100 cursor-pointer">
                            <td className="px-6 py-4 text-xs">
                                <button
                                    onClick={() => onView(email)}
                                    className="px-3 py-1 ml-2 text-[10px] text-white bg-blue-500 hover:bg-blue-800 hover:rounded-full rounded-md"
                                >
                                    View
                                </button>
                            </td>
                            <td className="px-6 py-4 text-xs">{email.from?.text || "Unknown"}</td>
                            <td className="px-6 py-4 text-xs">{email.subject || "No Subject"}</td>
                            <td className="px-6 py-4 text-xs">{new Date(email.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
