import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/layout/sidebar";

import Dashboard from "../pages/userPages/Dashboard";
import TicketList from "../pages/userPages/TicketList";
import TicketMessage from "../pages/userPages/Ticket_message";
import CreateTicket from "../pages/userPages/create_ticket";
import Notification from "../pages/userPages/notification";
import Messages from "../pages/userPages/Messages";
import Header from "../components/layout/Header";
import AIChat from '../pages/userPages/AIChat';

const DefaultLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      {/* Sidebar - Fixed width */}
      <div className="flex-shrink-0 h-screen">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f1f5f9]">
        {/* Header - Fixed height */}
        <div className="flex-shrink-0 bg-[#ffffff] border-b border-[#e2e8f0]">
          <Header />
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f1f5f9]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/:id" element={<TicketMessage />} />
            <Route path="/create" element={<CreateTicket />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;