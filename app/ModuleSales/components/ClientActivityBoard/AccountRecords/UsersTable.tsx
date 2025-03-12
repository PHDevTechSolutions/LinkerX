import React, { useEffect, useState } from "react";
import { CiRead, CiCircleRemove } from "react-icons/ci";
import { AiOutlineCheckCircle, AiOutlineFire, AiOutlineSun, AiOutlineQuestionCircle  } from "react-icons/ai";
import { FaRegSnowflake } from "react-icons/fa";


interface UsersCardProps {
    posts: any[];
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
    const [groupedUsers, setGroupedUsers] = useState<{ [key: string]: any[] }>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [sortedUsers, setSortedUsers] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);


    useEffect(() => {
        const grouped = posts.reduce((acc, post) => {
            (acc[post.companyname] = acc[post.companyname] || []).push(post);
            return acc;
        }, {} as { [key: string]: any[] });
        setGroupedUsers(grouped);
    }, [posts]);

    const openModal = (companyName: string) => {
        setSelectedCompany(companyName);

        // Sort users by date_created in descending order
        const sortedData = [...groupedUsers[companyName]].sort(
            (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        );

        setSortedUsers(sortedData);
        setModalOpen(true);
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "done":
                return <AiOutlineCheckCircle className="text-green-500 animate-pulse" size={20} />;
            case "cold":
                return <FaRegSnowflake className="text-blue-500 animate-spin" size={20} />;
            case "hot":
                return <AiOutlineFire className="text-red-500 animate-bounce" size={20} />;
            case "warm":
                return <AiOutlineSun className="text-orange-500 animate-ping" size={20} />;
            default:
                return <AiOutlineQuestionCircle className="text-gray-500" size={20} />;
        }
    };
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-xs">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-4 border">Company Name</th>
                        <th className="py-2 px-4 border">Agent Name</th>
                        <th className="py-2 px-4 border">Type of Client</th>
                        <th className="py-2 px-4 border text-center">Number of Records</th>
                        <th className="py-2 px-4 border text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(groupedUsers).length > 0 ? (
                        Object.keys(groupedUsers).map((companyName) => (
                            <tr key={companyName} className="border-t">
                                <td className="py-2 px-4 border capitalize">{companyName}</td>
                                <td className="py-2 px-4 border capitalize">
                                    {groupedUsers[companyName][0]?.AgentFirstname} {groupedUsers[companyName][0]?.AgentLastname}
                                    <br />
                                    <span className="text-gray-900 text-[8px]">
                                        ({groupedUsers[companyName][0]?.referenceid})
                                    </span>
                                </td>
                                <td className="py-2 px-4 border capitalize">
                                    {groupedUsers[companyName][0]?.typeclient}
                                </td>
                                <td className="py-2 px-4 border text-center">
                                    {groupedUsers[companyName].length}
                                </td>
                                <td className="py-2 px-4 border text-center">
                                    <div className="flex justify-center items-center">
                                        <button
                                            onClick={() => openModal(companyName)}
                                            className="px-4 py-2 text-gray-700"
                                        >
                                            <CiRead size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center py-4 border">
                                No accounts available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {modalOpen && selectedCompany && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-md font-bold">{selectedCompany} - Timeline</h2>
                <span className="text-xs text-gray-600">{sortedUsers.length} Events</span>
            </div>
            {/* Modal Body: Interactive Timeline */}
            <div className="p-6 overflow-y-auto flex-1">
                <div className="relative border-l-4 border-gray-300 pl-4">
                    {sortedUsers.map((user, index) => (
                        <div
                            key={index}
                            className={`relative mb-6 cursor-pointer group transition-all duration-300 ${selectedEvent === index ? "bg-blue-100 p-3 rounded-lg" : ""}`}
                            onClick={() => setSelectedEvent(index)}
                        >
                            {/* Timeline Dot with Status Icon */}
                            <div className="absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md">
                                {getStatusIcon(user.activitystatus)}
                            </div>
                            {/* Event Info */}
                            <div className="text-xs">
                                <p className="text-gray-600 font-semibold">
                                    {user.startdate ? new Date(user.startdate).toLocaleString() : "N/A"} -
                                    {user.enddate ? new Date(user.enddate).toLocaleString() : "N/A"}
                                </p>
                                <p className="capitalize"><strong>Agent:</strong> {user.AgentFirstname} {user.AgentLastname} ({user.referenceid})</p>
                                <p><strong>Type of Call:</strong> {user.typecall}</p>
                                <p><strong>Status:</strong> {user.activitystatus}</p>
                                {/* Details (Visible on Click) */}
                                {selectedEvent === index && (
                                    <div className="mt-2 text-xs">
                                        <p className="capitalize"><strong>Contact Person:</strong> {user.contactperson}</p>
                                        <p><strong>Email:</strong> {user.emailaddress}</p>
                                        <p className="capitalize"><strong>Address:</strong> {user.address}</p>
                                        <p className="capitalize"><strong>Area:</strong> {user.area}</p>
                                        <p><strong>Actual Sales:</strong> {user.actualsales}</p>
                                        <p><strong>SO Amount:</strong> {user.soamount}</p>
                                        <p><strong>Type of Activity:</strong> {user.typeactivity}</p>
                                        <p><strong>SO Number:</strong> {user.sonumber}</p>
                                        <p className="capitalize"><strong>Remarks:</strong> {user.remarks}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-100 border-t flex justify-end">
                <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white text-xs rounded hover:bg-red-600 flex items-center gap-1"
                >
                    <CiCircleRemove size={20} /> Close
                </button>
            </div>
        </div>
    </div>
)}


        </div>
    );
};

export default UsersCard;
