import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./hooks/protectedAuth";
import DefaultLayout from "./layout/DefaultLayout";
import AgentLayout from "./layout/AgentLayout";
import AdminLayout from "./layout/AdminLayout";
import Login from "./pages/authPages/Login";
import Logout from "./pages/authPages/Logout";
import ForgotPassword from "./pages/authPages/ForgotPassword";

function App() {
  return (
    
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/authPages/login" element={<Login />} />
          <Route path="/authPages/forgot-password" element={<ForgotPassword />} />
          <Route path="/authPages/logout" element={<Logout />} />
          
          <Route path="/user/*" element={
            <ProtectedRoute>
              <DefaultLayout />
            </ProtectedRoute>
          } />
          <Route path="/agent/*" element={
            <ProtectedRoute>
              <AgentLayout/>
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout/>
            </ProtectedRoute>
          } />  
          
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;