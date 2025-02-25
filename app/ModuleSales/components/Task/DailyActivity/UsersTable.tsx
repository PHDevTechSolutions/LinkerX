import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { BiRefresh } from "react-icons/bi";
import axios from "axios";
import { format, parseISO, addDays } from "date-fns";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { BsThreeDotsVertical, BsPlus, BsDash } from "react-icons/bs";

const socketURL = "http://localhost:3001";

interface UsersCardProps {
    posts: any[];
    handleEdit: (post: any) => void;
    referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, referenceid }) => {
    const socketRef = useRef(io(socketURL));
    const [updatedUser, setUpdatedUser] = useState<any[]>([]); 
    const [currentDate, setCurrentDate] = useState(new Date());
    const [groupedByDate, setGroupedByDate] = useState<Record<string, any[]>>({});
    const [openMenu, setOpenMenu] = useState<string | null>(null); // Track which card menu is open
    const [collapsed, setCollapsed] = useState<boolean>(true); // To track which card body is collapsed

    useEffect(() => {
        setUpdatedUser(posts);
    }, [posts]);

    useEffect(() => {
        const grouped = updatedUser.reduce((acc, user) => {
            const dateKey = format(parseISO(user.date_created), "yyyy-MM-dd");
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(user);
            return acc;
        }, {} as Record<string, any[]>);
        setGroupedByDate(grouped);
    }, [updatedUser]);

    const getConsecutiveDays = (startDate: Date) => {
        const days = [startDate];
        for (let i = 1; i < 4; i++) {
            days.push(addDays(startDate, i));
        }
        return days;
    };

    const handleNext = () => {
        setCurrentDate((prevDate) => addDays(prevDate, 4));
    };

    const handlePrevious = () => {
        setCurrentDate((prevDate) => addDays(prevDate, -4));
    };

    const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
    const consecutiveDays = getConsecutiveDays(currentDate);

    return (
        <div className="mb-4">
            {/* Pagination */}
            <div className="flex justify-start items-center mb-3">
                <div className="group inline-flex">
                    <button
                        onClick={handlePrevious}
                        className="text-xs flex items-center">
                        <CiSquareChevLeft size={30} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="text-xs flex items-center mr-2">
                        <CiSquareChevRight size={30} />
                    </button>
                </div>
                <h3 className="text-xs font-semibold mr-4">
                    {format(consecutiveDays[0], "dd MMM yyyy")} - {format(consecutiveDays[3], "dd MMM yyyy")}
                </h3>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {consecutiveDays.map((day) => {
                    const formattedDay = format(day, "yyyy-MM-dd");
                    return (
                        <div key={formattedDay} className="border rounded-lg p-4 bg-white shadow-lg mb-4">
                            <h4 className="text-center font-semibold text-xs mb-2 text-gray-700">
                                {format(day, "dd")} | {format(day, "EEEE")}
                            </h4>
                            <div>
                                {groupedByDate[formattedDay]?.map((user) => (
                                    <div key={user.id} className="border rounded-lg shadow-md p-4 bg-gray-50 mb-2 transition-all hover:shadow-2xl hover:bg-gray-100">
                                        {/* Card Header - Company Name with 3-dot menu */}
                                        <div className="card-header mb-2 border-b-2 pb-2 flex justify-between items-center">
                                            <h3 className="text-xs font-semibold text-gray-800 uppercase">{user.companyname}</h3>
                                            <div className="relative">
                                            <button
                                                onClick={() => setCollapsed(collapsed === user.id ? null : user.id)}
                                                className="text-gray-500 hover:text-gray-700">
                                                {collapsed === user.id ? <BsDash size={16} /> : <BsPlus size={16} />}
                                            </button>
                                                <button
                                                    className="text-gray-500 hover:text-gray-700"
                                                    onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}>{/* Toggle the menu */}
                                                    <BsThreeDotsVertical size={16} />
                                                </button>
                                                {/* Dropdown Menu */}
                                                <div
                                                    className={`absolute right-0 mt-2 w-32 bg-white shadow-md p-2 rounded-md text-xs ${openMenu === user.id ? 'block' : 'hidden'}`}>
                                                    <ul>
                                                        <li
                                                            className="p-2 cursor-pointer hover:bg-gray-100"
                                                            onClick={() => handleEdit(user)}>Edit Details</li>
                                                        <li className="p-2 cursor-pointer hover:bg-gray-100">Callback</li>
                                                        <li className="p-2 cursor-pointer hover:bg-gray-100">Delete</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body - Contact Person, Contact Number, Product Category, Product Type */}
                                        {collapsed !== user.id && (
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs">
                                                <p><strong>Source:</strong> {user.source}</p>
                                                <p><strong>Product Category:</strong> {user.projectcategory}</p>
                                                <p><strong>Quotation Number:</strong> {user.quotationnumber}</p>
                                                <p><strong>SO Amount:</strong> {user.soamount}</p>
                                            </div>
                                            {/* Toggle Collapse */}
                                        </div>
                                        )}

                                        {/* Card Footer - Date Created */}
                                        <div className="card-footer text-xs text-left mt-2 border-t-2 pt-2">
                                            <p><strong>Date Created:</strong> {user.date_created}</p>
                                        </div>
                                    </div>
                                ))}
                                {groupedByDate[formattedDay]?.length === 0 && (
                                    <div className="text-center py-2 text-xs text-gray-500">No accounts available</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UsersCard;
