"use client";
import React, { useEffect, useState } from "react";
import Card1 from "./Form/Card1";
import Card2 from "./Form/Card2";
import Card3 from "./Form/Card3";
import Card4 from "./Form/Card4";
import Card5 from "./Form/Card5";
import Card6 from "./Form/Card6";
import Card7 from "./Form/Card7";

const Cards: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [role, setRole] = useState<string>("User");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 4;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUserId(params.get("id"));
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
                if (!response.ok) throw new Error("Failed to fetch user details");

                const data = await response.json();
                setRole(data.Role || "User");
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const allCards = [
        <Card1 key="card1" userId={userId} role={role} />,
        <Card2 key="card2" userId={userId} role={role} />,
        <Card3 key="card3" userId={userId} role={role} />,
        <Card4 key="card4" userId={userId} role={role} />,
        <Card5 key="card5" userId={userId} role={role} />,
        <Card6 key="card6" userId={userId} role={role} />,
        <Card7 key="card7" userId={userId} role={role} />,
    ];

    const cardTitles = [
        "Taskflow",
        "Ecodesk",
        "Pants-In",
        "WooCommerce",
        "Shopify",
        "Cloudinary",
        "Mailjet",
    ];

    const filteredCards = allCards.filter((_, index) =>
        cardTitles[index].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search modules..."
                    className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentCards.length > 0 ? (
                    currentCards
                ) : (
                    <p className="text-sm text-gray-500 col-span-full">No modules found.</p>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className="bg-gray-200 text-xs px-4 py-2 rounded"
                    >
                        Prev
                    </button>
                    <span className="text-xs">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className="bg-gray-200 text-xs px-4 py-2 rounded"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cards;
