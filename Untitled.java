// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatTime, formatDate } from '../../plugins/dateTime';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Left - Greeting */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm md:text-base font-semibold text-gray-700">
          Good {getGreeting()}
        </h2>
        <span className="hidden sm:inline-block w-px h-5 bg-gray-300"></span>
        <span className="text-xs md:text-sm font-medium text-blue-600">
          {user?.full_name || user?.username || 'User'}
        </span>
      </div>

      {/* Right - Time & User */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs md:text-sm font-medium text-gray-700">
            {formatTime(currentTime)}
          </p>
          <p className="text-[10px] md:text-xs font-medium text-gray-400">
            {formatDate(currentTime)}
          </p>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;