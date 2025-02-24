import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiRefresh } from "react-icons/bi";
import { Menu } from "@headlessui/react";
import axios from "axios";

const socketURL = "http://localhost:3001";

interface UsersCardProps {
    posts: any[];
    handleEdit: (post: any) => void;
    referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, referenceid }) => {
    const socketRef = useRef(io(socketURL));
    const [updatedUser, setUpdatedUser] = useState<any[]>([]);
    const [groupedCompanies, setGroupedCompanies] = useState<Map<string, any[]>>(new Map());
    const [modalData, setModalData] = useState<any[]>([]); // To store companies for modal
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        setUpdatedUser(posts);
    }, [posts]);

    useEffect(() => {
        // Group companies by companygroup and count the companies in each group
        const grouped = new Map<string, any[]>();
    
        posts.forEach((post) => {
            // Skip posts with null or empty companygroup
            if (post.companygroup) {
                if (grouped.has(post.companygroup)) {
                    grouped.get(post.companygroup)?.push(post);
                } else {
                    grouped.set(post.companygroup, [post]);
                }
            }
        });
    
        setGroupedCompanies(grouped);
    }, [posts]);
    

    const handleRefresh = async () => {
        try {
            const response = await axios.get(`/api/ModuleSales/Companies/CompanyAccounts/FetchAccount?referenceid=${referenceid}`);

            if (response.data.success) {
                setUpdatedUser(response.data.data); // Update the state with the new data
            } else {
                console.error("Failed to fetch accounts");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleViewCompanies = (companygroup: string) => {
        // Fetch the companies in the group and show the modal
        const companies = groupedCompanies.get(companygroup) || [];
        setModalData(companies);
    };

    const filteredCompanies = modalData.filter((company) =>
        company.companyname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mb-4">
            {/* Bulk Action Buttons */}
            <div className="flex gap-2 mb-3">
                <button onClick={handleRefresh} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-dark text-xs shadow-sm rounded-md hover:bg-gray-900 hover:text-white">
                    <BiRefresh size={16} />
                    Refresh
                </button>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedCompanies.size > 0 ? (
                    Array.from(groupedCompanies.keys()).map((companygroup) => {
                        const companies = groupedCompanies.get(companygroup) || [];
                        if (companies.length === 0) return null; // Skip if no companies in group
                        return (
                            <div key={companygroup} className="relative border rounded-md shadow-md p-4 flex flex-col bg-white">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xs font-semibold uppercase">{companygroup}</h3>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="mt-4 mb-4 text-xs">
                                        <p><strong>Number of Companies:</strong> {companies.length}</p>
                                    </div>
                                    <Menu as="div" className="relative inline-block text-left">
                                        <div>
                                            <Menu.Button>
                                                <BsThreeDotsVertical />
                                            </Menu.Button>
                                        </div>
                                        <Menu.Items className="absolute right-0 mt-2 min-w-[160px] bg-white shadow-md rounded-md z-10">
                                            <button
                                                className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                                                onClick={() => handleViewCompanies(companygroup)}
                                            >
                                                View Companies
                                            </button>
                                        </Menu.Items>
                                    </Menu>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-4 text-xs">No accounts available</div>
                )}
            </div>

            {/* Modal */}
            {modalData.length > 0 && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
                        <h2 className="text-lg font-semibold mb-6 text-center">Companies in Group</h2>

                        {/* Search Bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search by company name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-xs"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700">
                                        <th className="px-4 py-2 border-b whitespace-nowrap">Company Name</th>
                                        <th className="px-4 py-2 border-b whitespace-nowrap">Contact Person</th>
                                        <th className="px-4 py-2 border-b whitespace-nowrap">Contact Number</th>
                                        <th className="px-4 py-2 border-b whitespace-nowrap">Email Address</th>
                                        <th className="px-4 py-2 border-b whitespace-nowrap">Type of Client</th>
                                        <th className="px-4 py-2 border-b whitespace-nowrap">Address</th>
                                        <th className="px-4 py-2 border-b whitespace-nowrap">Area</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCompanies.map((company) => (
                                        <tr key={company.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b">{company.companyname}</td>
                                            <td className="px-4 py-2 border-b">{company.contactperson}</td>
                                            <td className="px-4 py-2 border-b">{company.contactnumber}</td>
                                            <td className="px-4 py-2 border-b">{company.emailaddress}</td>
                                            <td className="px-4 py-2 border-b">{company.typeclient}</td>
                                            <td className="px-4 py-2 border-b">{company.address}</td>
                                            <td className="px-4 py-2 border-b">{company.area}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setModalData([])}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition text-xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersCard;
