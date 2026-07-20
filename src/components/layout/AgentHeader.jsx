import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatTime, formatDate } from '../../plugins/dateTime';

const AgentHeader = () => {
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

  const userInitial = user?.full_name 
    ? user.full_name.charAt(0).toUpperCase() 
    : user?.username 
      ? user.username.charAt(0).toUpperCase() 
      : 'U';

  return (
    <header className="h-16 bg-[#ffffff] border-b border-[#e2e8f0] flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Left - Greeting */}
      <div className="flex items-center gap-3">
        <h2 className="text-[14px] md:text-[16px] font-semibold leading-[20px] font-['Inter'] text-[#000000]">
          Good {getGreeting()}
        </h2>
        <span className="hidden sm:inline-block w-px h-5 bg-[#e2e8f0]"></span>
        <span className="text-[12px] md:text-[14px] font-medium leading-[20px] font-['Inter'] text-[#000000]">
          {user?.full_name || user?.username || 'User'}
        </span>
      </div>

      {/* Right - Time & User */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[12px] md:text-[14px] font-medium leading-[20px] font-['Inter'] text-[#000000]">
            {formatTime(currentTime)}
          </p>
          <p className="text-[10px] md:text-[12px] font-medium leading-[16px] font-['JetBrains_Mono'] tracking-[0.05em] text-[#76777d]">
            {formatDate(currentTime)}
          </p>
        </div>
        <div className="w-px h-8 bg-[#e2e8f0]"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center border border-[#e2e8f0]">
            <span className="text-[14px] font-semibold leading-[20px] font-['Inter'] text-[#000000]">
              {userInitial}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AgentHeader;