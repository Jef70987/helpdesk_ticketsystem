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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ flexShrink: 0, height: "100vh" }}>
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f7fafb"
      }}>
        {/* Header */}
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>
        
        {/* Scrollable Content */}
        <div style={{ 
          flex: 1,
          overflowY: "auto",
          padding: "24px 32px"
        }}>
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