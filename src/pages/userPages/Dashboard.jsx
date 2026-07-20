import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    closed: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, ticketsData] = await Promise.all([
        api.get('/tickets/stats/'),
        api.get('/tickets/recent/'),
      ]);
      setStats(statsData);
      setRecentTickets(ticketsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = () => {
    navigate('/user/create');
  };

  const userName = user?.full_name || user?.username || 'User';

  const statCards = [
    { 
      label: 'Total Tickets', 
      value: stats.total, 
      icon: (
        <svg className="w-5 h-5 text-[#000000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'text-[#000000]'
    },
    { 
      label: 'Open', 
      value: stats.open, 
      icon: (
        <svg className="w-5 h-5 text-[#000000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-[#000000]'
    },
    { 
      label: 'Resolved', 
      value: stats.resolved, 
      icon: (
        <svg className="w-5 h-5 text-[#006a61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-[#006a61]'
    },
    { 
      label: 'Closed', 
      value: stats.closed, 
      icon: (
        <svg className="w-5 h-5 text-[#76777d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      color: 'text-[#76777d]'
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-[#dce9ff] text-[#000000] border-[#c6c6cd]',
      'open': 'bg-[#dce9ff] text-[#000000] border-[#c6c6cd]',
      'in_progress': 'bg-[#ffedd5] text-[#000000] border-[#c6c6cd]',
      'pending_customer': 'bg-[#f3e8ff] text-[#000000] border-[#c6c6cd]',
      'pending_third_party': 'bg-[#fce7f3] text-[#000000] border-[#c6c6cd]',
      'resolved': 'bg-[#d1fae5] text-[#000000] border-[#c6c6cd]',
      'closed': 'bg-[#f1f5f9] text-[#000000] border-[#c6c6cd]',
      'canceled': 'bg-[#fee2e2] text-[#000000] border-[#c6c6cd]',
    };
    return colors[status] || 'bg-[#f1f5f9] text-[#000000] border-[#c6c6cd]';
  };

  const formatStatusLabel = (status) => {
    const labels = {
      'new': 'New',
      'open': 'Open',
      'in_progress': 'In Progress',
      'pending_customer': 'Pending Customer',
      'pending_third_party': 'Pending Third Party',
      'resolved': 'Resolved',
      'closed': 'Closed',
      'canceled': 'Canceled',
    };
    return labels[status] || status || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 md:pb-0 bg-[#f8f9ff]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] font-['Inter'] text-[#000000]">
          Welcome back, {userName}
        </h2>
        <p className="text-[16px] font-normal leading-[24px] font-['Inter'] text-[#45464d] mt-1">
          Here's what's happening with your tickets
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#ffffff] p-4 rounded-lg border border-[#c6c6cd] shadow-[0px_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0px_4px_6px_rgba(0,0,0,0.07)] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <p className={`text-[24px] font-bold leading-[32px] font-['Inter'] ${stat.color}`}>
                {stat.value}
              </p>
              <div className="p-1.5 bg-[#f1f5f9] rounded">
                {stat.icon}
              </div>
            </div>
            <p className="text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#45464d] mt-1.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={handleCreateTicket}
          className="px-5 py-2 bg-[#000000] hover:bg-[#131b2e] text-[#ffffff] text-[14px] font-medium leading-[20px] font-['Inter'] rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Ticket
        </button>
        <Link to="/user/tickets">
          <button className="px-5 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#000000] text-[14px] font-medium leading-[20px] font-['Inter'] rounded-lg transition-colors border border-[#c6c6cd] shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-[#45464d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View All Tickets
          </button>
        </Link>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-[#ffffff] rounded-lg border border-[#c6c6cd] shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
        <div className="px-5 py-3.5 border-b border-[#c6c6cd] flex items-center gap-2 bg-[#f8f9ff] rounded-t-lg">
          <svg className="w-4 h-4 text-[#45464d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-[14px] font-semibold leading-[20px] font-['Inter'] text-[#000000]">
            Recent Tickets
          </h3>
        </div>

        {recentTickets.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-[#f8f9ff] rounded-lg">
                <svg className="w-12 h-12 text-[#76777d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-[14px] font-normal leading-[20px] font-['Inter'] text-[#45464d]">
              No tickets created yet
            </p>
            <button 
              onClick={handleCreateTicket}
              className="mt-3 px-5 py-2 bg-[#000000] hover:bg-[#131b2e] text-[#ffffff] text-[14px] font-medium leading-[20px] font-['Inter'] rounded-lg transition-colors shadow-sm"
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f9ff] border-b border-[#c6c6cd]">
                <tr>
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#45464d]">
                    ID
                  </th>
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#45464d]">
                    Title
                  </th>
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#45464d]">
                    Status
                  </th>
                  <th className="hidden sm:table-cell px-5 py-2.5 text-left text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#45464d]">
                    Created
                  </th>
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#45464d]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c6c6cd]">
                {recentTickets.map((ticket) => {
                  const statusKey = ticket.status || 'new';
                  const statusDisplay = ticket.status_label || formatStatusLabel(statusKey);
                  return (
                    <tr key={ticket.id} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="px-5 py-2.5 font-medium text-[#000000] text-[12px] font-['JetBrains_Mono']">
                        {ticket.ticket_id}
                      </td>
                      <td className="px-5 py-2.5 text-[#000000] text-[14px] font-normal leading-[20px] font-['Inter'] truncate max-w-[120px]">
                        {ticket.title}
                      </td>
                      <td className="px-5 py-2.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[12px] font-medium leading-[16px] font-['JetBrains_Mono'] border rounded ${getStatusColor(statusKey)}`}>
                          {statusDisplay}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-5 py-2.5 text-[#45464d] text-[14px] font-normal leading-[20px] font-['Inter']">
                        {new Date(ticket.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-2.5">
                        <Link to={`/user/tickets/${ticket.id}`}>
                          <button className="px-3 py-1 bg-[#000000] hover:bg-[#131b2e] text-[#ffffff] text-[12px] font-medium leading-[16px] font-['Inter'] rounded transition-colors shadow-sm">
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;