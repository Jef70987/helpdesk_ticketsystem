import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AgentSidebar from '../components/layout/AgentSidebar';
import AgentHeader from '../components/layout/AgentHeader';

import AgentDashboard from '../pages/agentPages/AgentDashboard';
import AgentTicketList from '../pages/agentPages/AgentTicketList';
import AgentTicketDetail from '../pages/agentPages/AgentTicketDetail';
import AgentMessages from '../pages/agentPages/AgentMessages';
import AgentNotifications from '../pages/agentPages/AgentNotifications';

const AgentLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0 h-full">
        <AgentSidebar />
      </div>
      
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "white"
      }}>
        {/* Header */}
        <div style={{ flexShrink: 0 }}>
          <AgentHeader />
        </div>
        
        {/* Scrollable Content */}
        <div style={{ 
          flex: 1,
          overflowY: "auto",
          padding: "24px 32px"
        }}>
            <Routes>
              <Route path="/" element={<AgentDashboard />} />
              <Route path="/dashboard" element={<AgentDashboard />} />
              <Route path="/tickets" element={<AgentTicketList />} />
              <Route path="/tickets/:id" element={<AgentTicketDetail />} />
              <Route path="/messages" element={<AgentMessages />} />
              <Route path="/notifications" element={<AgentNotifications />} />
              <Route path="*" element={<AgentDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
  
  );
};

export default AgentLayout;