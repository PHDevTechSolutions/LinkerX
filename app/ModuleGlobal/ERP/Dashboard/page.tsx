'use client';

import React, { useState, useEffect } from 'react';
import ParentLayout from '../../components/Layouts/ParentLayout';
import SessionChecker from '../../components/Session/SessionChecker';
import CountCompanies from '../../components/Dashboard/CountCompanies';
import CountNewUsers from '../../components/Dashboard/CountNewUsers';
import CountUser from '../../components/Dashboard/CountUser';
import CountActivities from '../../components/Dashboard/CountActivities';
import ActivityChart from '../../components/Dashboard/Chart/ActivityChart';
import TicketChart from '../../components/Dashboard/Chart/TicketChart';
import CountOrders from '../../components/Dashboard/Chart/CountOrders';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage: React.FC = () => {
  // userDetails & fetch logic unchanged …
  const [loading, setLoading] = useState(true);

  /* example metric, you will replace with real query later */
  const totalLinks = 123;

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <h3 className="text-lg font-semibold mb-4">Dashboard</h3>

          {/* First row of 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* Card 1 */}
            <CountCompanies />

            {/* Card 2 */}
            <CountNewUsers />

            {/* Card 3 */}
            <CountUser />

            {/* Card 4 */}
            <CountActivities />
          </div>

          <div className="mb-6"><ActivityChart /></div>
          <div className="mb-6"><TicketChart /></div>
          <div className="mb-6"><CountOrders /></div>

          <ToastContainer className="text-xs" />
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
