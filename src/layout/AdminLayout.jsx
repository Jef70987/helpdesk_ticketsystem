import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import AgentHeader from '../components/layout/AgentHeader';

import AdminDashboard from '../pages/adminPages/AdminDashboard';
import AdminTickets from '../pages/adminPages/AdminTickets';
import AdminTicketDetail from '../pages/adminPages/AdminTicketDetail';
import AdminUsers from '../pages/adminPages/AdminUsers';
import AdminUserDetail from '../pages/adminPages/AdminUserDetail';
import AdminHardware from '../pages/adminPages/AdminHardware';
import AdminHardwareCreate from '../pages/adminPages/AdminHardwareCreate';
import AdminHardwareDetail from '../pages/adminPages/AdminHardwareDetail';
import AdminReports from '../pages/adminPages/AdminReports';
// import AdminAuditLog from '../pages/adminPages/AdminAuditLog';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      <div className="flex-shrink-0 h-full">
        <AdminSidebar />
      </div>
      
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f8fafc"  // Changed from white to light gray
      }}>
        <div style={{ flexShrink: 0 }}>
          <AgentHeader />
        </div>
        
        <div style={{ 
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          backgroundColor: "#f8fafc"  // Light gray background
        }}>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/tickets" element={<AdminTickets />} />
            <Route path="/tickets/:id" element={<AdminTicketDetail />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/users/:id" element={<AdminUserDetail />} />
            <Route path="/hardware" element={<AdminHardware />} />
            <Route path="/hardware/create" element={<AdminHardwareCreate />} />
            <Route path="/hardware/:id" element={<AdminHardwareDetail />} />
            <Route path="/reports" element={<AdminReports />} />
            {/* <Route path="/audit-logs" element={<AdminAuditLog />} /> */}
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;