// ========================================
// FRONTEND - src/pages/AccountPage.js
// ========================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import AccountSidebar from '../components/Account/AccountSidebar';
import AccountDashboard from '../components/Account/AccountDashboard';
import AccountProfile from '../components/Account/AccountProfile';
import AccountOrders from '../components/Account/AccountOrders';
import AccountDownloads from '../components/Account/AccountDownloads';
import AccountSettings from '../components/Account/AccountSettings';

const AccountPage = () => {
  return (
    <>
      <SEO
        title="My Account - ChecklistPro"
        description="Manage your ChecklistPro account, view your orders, and access your downloaded checklists."
        noIndex={true}
      />

      <div className="account-page">
        <div className="container">
          <div className="account-layout">
            <AccountSidebar />
            
            <div className="account-content">
              <Routes>
                <Route index element={<AccountDashboard />} />
                <Route path="profile" element={<AccountProfile />} />
                <Route path="orders" element={<AccountOrders />} />
                <Route path="downloads" element={<AccountDownloads />} />
                <Route path="settings" element={<AccountSettings />} />
                <Route path="*" element={<Navigate to="/account" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
