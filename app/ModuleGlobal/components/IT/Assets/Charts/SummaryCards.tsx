"use client";

import React from "react";
import { CiBoxes, CiLaptop, CiMoneyBill } from "react-icons/ci";
import { ImPrinter } from "react-icons/im";

interface SummaryProps {
  totalAssets: number;
  totalLaptop: number;
  totalPrinter: number;
  totalValue: number;
}

const SummaryCards: React.FC<SummaryProps> = ({
  totalAssets,
  totalLaptop,
  totalPrinter,
  totalValue,
}) => {
  const cards = [
    {
      label: "Total Assets",
      value: totalAssets,
      icon: <CiBoxes size={28} />,
      bg: "bg-blue-100",
    },
    {
      label: "Laptops",
      value: totalLaptop,
      icon: <CiLaptop size={28} />,
      bg: "bg-green-100",
    },
    {
      label: "Printers",
      value: totalPrinter,
      icon: <ImPrinter size={28} />,
      bg: "bg-yellow-100",
    },
    {
      label: "Total Value",
      value: `₱${totalValue.toLocaleString()}`,
      icon: <CiMoneyBill size={28} />,
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bg} p-4 rounded-lg flex items-center space-x-3 shadow-sm`}
        >
          <div className="text-gray-700">{card.icon}</div>
          <div className="text-sm font-semibold text-gray-800">
            <div>{card.label}</div>
            <div className="text-base font-bold">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
