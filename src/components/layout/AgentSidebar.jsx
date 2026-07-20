import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import agentSidebarData from '../../utils/agentSidebarData';

const AgentSidebar = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenDropdown(null);
    }
  };

  const handleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsCollapsed(true);
      setOpenDropdown(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/authPages/login');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-[#ffffff] shadow-md z-50 lg:hidden border-b border-[#e2e8f0]">
          <div className="flex items-center justify-between px-4 py-2.5">
            <button 
              onClick={toggleSidebar}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex flex-col leading-tight">
                <h1 className="text-[#000000] font-bold text-sm leading-tight font-['Inter']">SUPPORT</h1>
                <h2 className="text-[#76777d] text-[10px] font-bold leading-tight font-['JetBrains_Mono'] tracking-[0.05em]">AGENT</h2>
              </div>
            </button>
            <button 
              onClick={handleLogout}
              className="text-[#76777d] text-xs font-semibold hover:text-[#000000] transition-colors font-['Inter']"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#ffffff] shadow-2xl z-50 lg:hidden border-t border-[#e2e8f0]">
          <div className="flex items-center h-14 px-2 overflow-x-auto">
            <div className="flex justify-around gap-1 w-full">
              {agentSidebarData.map((val, key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (val.isLogout) {
                      handleLogout();
                    } else {
                      handleNavigation(val.link);
                    }
                  }}
                  className={`
                    flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all duration-300 min-w-[56px]
                    ${window.location.pathname === val.link && !val.isLogout
                      ? 'text-[#000000] bg-[#f1f5f9]' 
                      : 'text-[#76777d] hover:text-[#000000] hover:bg-[#f8f9ff]'
                    }
                  `}
                >
                  <div className="text-base mb-0.5">{val.icon}</div>
                  <span className="text-[9px] font-semibold whitespace-nowrap font-['Inter']">{val.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={isMobile ? "pt-12 pb-14" : ""}>
        {children}
      </div>

      {/* Desktop Toggle Button */}
      {!isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 bg-[#ffffff] hover:bg-[#f1f5f9] text-[#000000] rounded-lg p-3 shadow-lg transition-all duration-300 hover:scale-105 z-50 border border-[#e2e8f0]"
          aria-label="Toggle sidebar"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`
          h-screen bg-[#ffffff] shadow-2xl border-r border-[#e2e8f0] transition-all duration-500 ease-in-out z-50
          fixed lg:relative top-0 left-0
          overflow-hidden flex flex-col
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isCollapsed && isMobile ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Top accent strip */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#000000]"></div>
        
        <div className="relative z-10">
          <div className={`
            flex items-center p-5 border-b border-[#e2e8f0]
            ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}>
            <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'space-x-4'}`}>
              {!isCollapsed ? (
                <div className="flex flex-col">
                  <h1 className="text-[#000000] font-black text-2xl leading-tight tracking-wider font-['Inter']">SUPPORT</h1>
                  <h2 className="text-[#76777d] text-xs font-bold tracking-[0.05em] font-['JetBrains_Mono']">AGENT</h2>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <h1 className="text-[#000000] font-black text-2xl leading-tight font-['Inter']">S</h1>
                </div>
              )}
            </div>

            {!isMobile && (
              <button 
                onClick={toggleSidebar}
                className={`
                  bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#000000] rounded-lg p-2
                  shadow-sm transition-all duration-300 hover:scale-110 border border-[#e2e8f0]
                  ${isCollapsed ? 'absolute -right-3 top-5' : ''}
                `}
                aria-label="Toggle sidebar"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="relative z-10 flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-[#e2e8f0] scrollbar-track-transparent">
          <ul className="space-y-1.5">
            {agentSidebarData.map((val, key) => (
              <li key={key}>
                <div
                  className={`
                    flex items-center w-full p-3 rounded-xl cursor-pointer transition-all duration-300 group
                    relative overflow-hidden
                    ${window.location.pathname === val.link && !val.isLogout 
                      ? 'bg-[#f1f5f9] shadow-sm' 
                      : 'text-[#76777d] hover:bg-[#f8f9ff] hover:text-[#000000]'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  onClick={() => {
                    if (val.subNav) {
                      handleDropdown(key);
                    } else if (val.isLogout) {
                      handleLogout();
                    } else {
                      handleNavigation(val.link);
                    }
                  }}
                >
                  {/* Left Indicator */}
                  {window.location.pathname === val.link && !val.isLogout && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#000000] rounded-r"></div>
                  )}

                  <div className="flex-shrink-0 transition-all duration-300">
                    <div className={isCollapsed ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'}>
                      {val.icon}
                    </div>
                  </div>

                  {!isCollapsed && (
                    <span className="ml-3 font-bold whitespace-nowrap text-[#000000] font-['Inter']">{val.title}</span>
                  )}

                  {!isCollapsed && val.subNav && (
                    <svg 
                      className={`w-4 h-4 ml-auto transition-all duration-300 text-[#76777d] ${openDropdown === key ? 'rotate-180 text-[#000000]' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>

                {!isCollapsed && val.subNav && openDropdown === key && (
                  <ul className="ml-8 mt-1 space-y-0.5 animate-slideDown">
                    {val.subNav.map((subVal, subKey) => (
                      <li key={subKey}>
                        <div
                          className={`
                            flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-300
                            ${window.location.pathname === subVal.link 
                              ? 'bg-[#f1f5f9] text-[#000000]' 
                              : 'text-[#76777d] hover:text-[#000000] hover:bg-[#f8f9ff]'
                            }
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigation(subVal.link);
                          }}
                        >
                          <div className="text-base text-[#76777d]">{subVal.icon}</div>
                          <span className="ml-2 text-sm font-semibold text-[#000000] font-['Inter']">{subVal.title}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`
          relative z-10 border-t border-[#e2e8f0] p-4 bg-[#ffffff]
          ${isCollapsed ? 'text-center' : ''}
        `}>
          <div className={`transition-all duration-300 text-[#000000] ${isCollapsed ? 'text-xs' : 'text-sm'}`}>
            {!isCollapsed ? (
              <div className="space-y-1">
                <p className="font-bold text-[#76777d] font-['Inter']">© {new Date().getFullYear()}</p>
                <p className="text-xs text-[#76777d] font-semibold font-['JetBrains_Mono'] tracking-[0.05em]">Support Agent Panel</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-[#76777d]">©</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(226, 232, 240, 0.5);
          border-radius: 20px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(226, 232, 240, 0.8);
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default AgentSidebar;