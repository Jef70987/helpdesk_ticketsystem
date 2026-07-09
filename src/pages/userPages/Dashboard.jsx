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
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    { 
      label: 'Open', 
      value: stats.open, 
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    { 
      label: 'Resolved', 
      value: stats.resolved, 
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-emerald-600'
    },
    { 
      label: 'Closed', 
      value: stats.closed, 
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      color: 'text-gray-600'
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800 border-blue-300',
      'open': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'in_progress': 'bg-amber-100 text-amber-800 border-amber-300',
      'pending_customer': 'bg-purple-100 text-purple-800 border-purple-300',
      'pending_third_party': 'bg-pink-100 text-pink-800 border-pink-300',
      'resolved': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'closed': 'bg-gray-100 text-gray-700 border-gray-300',
      'canceled': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
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
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 md:pb-0">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {userName}
        </h2>
        <p className="text-gray-500 mt-1">Here's what's happening with your tickets</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 border border-gray-200 border-t-4 border-t-blue-600 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <div className="p-1.5 bg-gray-50">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1.5 font-medium uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={handleCreateTicket}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Ticket
        </button>
        <Link to="/user/tickets">
          <button className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors border border-gray-300 shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View All Tickets
          </button>
        </Link>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">Recent Tickets</h3>
        </div>

        {recentTickets.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-50">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm">No tickets created yet</p>
            <button 
              onClick={handleCreateTicket}
              className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="hidden sm:table-cell px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTickets.map((ticket) => {
                  const statusKey = ticket.status || 'new';
                  const statusDisplay = ticket.status_label || formatStatusLabel(statusKey);
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-2.5 font-medium text-gray-900 text-xs">{ticket.ticket_id}</td>
                      <td className="px-5 py-2.5 text-gray-700 text-xs truncate max-w-[120px]">{ticket.title}</td>
                      <td className="px-5 py-2.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(statusKey)}`}>
                          {statusDisplay}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-5 py-2.5 text-gray-500 text-xs">
                        {new Date(ticket.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-2.5">
                        <Link to={`/user/tickets/${ticket.id}`}>
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm">
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