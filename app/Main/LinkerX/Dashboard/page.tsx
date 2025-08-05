'use client';

import React, { useState, useEffect } from 'react';
import ParentLayout from '../../components/Layouts/ParentLayout';
import SessionChecker from '../../components/Session/SessionChecker';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage: React.FC = () => {
  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <h3 className="text-lg font-semibold mb-4">Dashboard</h3>

          {/* First row of 4 cards */}
          <ToastContainer className="text-xs" />
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
