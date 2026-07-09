import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    overdue: 0,
    atRisk: 0,
    breached: 0,
    inSla: 0,
    slaMet: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyTrend, setDailyTrend] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/agent/dashboard/');
      
      // Use backend data directly - field names match backend response
      setStats({
        assigned: response.stats?.total || 0,
        inProgress: response.stats?.in_progress || 0,
        resolved: response.stats?.resolved || 0,
        overdue: response.stats?.overdue || 0,
        atRisk: response.stats?.at_risk || 0,
        breached: response.stats?.breached || 0,
        inSla: response.stats?.in_sla || 0,
        slaMet: response.stats?.sla_met || 0,
      });

      setRecentTickets(response.recent_tickets || []);
      setCategoryData(response.category_breakdown || []);
      setDailyTrend(response.daily_trend || []);
    } catch (error) {
      
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/agent/tickets/${ticketId}`);
  };

  const statCards = [
    {
      label: 'Assigned',
      value: stats.assigned,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-amber-600'
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
      label: 'SLA Breached',
      value: stats.breached,
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'text-red-600'
    },
  ];

  const getStatusBadge = (status) => {
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

  // SLA status from backend - uses sla_breached field
  const getSlaStatus = (ticket) => {
    // Use sla_breached from backend
    if (ticket.sla_breached === true) {
      return { label: 'Breached', color: 'bg-red-100 text-red-800 border-red-300' };
    }
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      return { label: 'Met', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    // Check if ticket is at risk based on created_at
    if (ticket.created_at) {
      const now = new Date();
      const created = new Date(ticket.created_at);
      const hoursDiff = (now - created) / (1000 * 60 * 60);
      if (hoursDiff > 48) {
        return { label: 'At Risk', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      }
    }
    return { label: 'In SLA', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  };

  const chartData = {
    labels: dailyTrend.map(item => item.day || item.date || item.label || ''),
    datasets: [
      {
        label: 'Tickets Created',
        data: dailyTrend.map(item => item.count || 0),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} tickets`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
          },
          color: '#64748b',
        },
        grid: {
          color: 'rgba(100, 116, 139, 0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
          color: '#64748b',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-white border border-red-200 p-6 text-center shadow-sm">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchAgentData}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // SLA Overview calculations
  const slaTotal = stats.inSla + stats.atRisk + stats.breached + stats.slaMet;
  const inSlaPercent = slaTotal > 0 ? Math.round((stats.inSla / slaTotal) * 100) : 0;
  const atRiskPercent = slaTotal > 0 ? Math.round((stats.atRisk / slaTotal) * 100) : 0;
  const breachedPercent = slaTotal > 0 ? Math.round((stats.breached / slaTotal) * 100) : 0;
  const slaMetPercent = slaTotal > 0 ? Math.round((stats.slaMet / slaTotal) * 100) : 0;
  const complianceRate = slaTotal > 0 ? Math.round(((slaTotal - stats.breached) / slaTotal) * 100) : 100;

  return (
    <div className="w-full pb-20 md:pb-0">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Agent Dashboard</h2>
        <p className="text-gray-500 mt-1">Manage tickets assigned to you</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">Assigned Tickets</h3>
              </div>
              <Link to="/agentPages/tickets">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </Link>
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
                <p className="text-gray-500 text-sm">No tickets assigned to you yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SLA</th>
                      <th className="hidden sm:table-cell px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTickets.map((ticket) => {
                      const slaStatus = getSlaStatus(ticket);
                      return (
                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-2.5 font-medium text-gray-900 text-xs">{ticket.ticket_id}</td>
                          <td className="px-5 py-2.5 text-gray-700 text-xs truncate max-w-[100px]">{ticket.title}</td>
                          <td className="px-5 py-2.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${getStatusBadge(ticket.status)}`}>
                              {formatStatusLabel(ticket.status)}
                            </span>
                          </td>
                          <td className="px-5 py-2.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${slaStatus.color}`}>
                              {slaStatus.label}
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
                            <button 
                              onClick={() => handleViewTicket(ticket.id)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm"
                            >
                              View
                            </button>
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

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Category Breakdown */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">Category Breakdown</h3>
              </div>
            </div>
            <div className="p-4">
              {categoryData.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No data available</p>
              ) : (
                <div className="space-y-3">
                  {categoryData.map((cat, index) => {
                    const colors = ['#3B82F6', '#6366F1', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4'];
                    const color = colors[index % colors.length];
                    const percentage = stats.assigned > 0 ? Math.round((cat.count / stats.assigned) * 100) : 0;
                    
                    return (
                      <div key={cat.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 font-medium truncate">{cat.name}</span>
                          <span className="text-gray-500 font-medium">{cat.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5">
                          <div 
                            className="h-1.5 transition-all duration-500"
                            style={{ 
                              width: `${percentage}%`, 
                              backgroundColor: color 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Daily Ticket Trend */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">Daily Ticket Trend</h3>
              </div>
            </div>
            <div className="p-4">
              {dailyTrend.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No trend data available</p>
              ) : (
                <div className="h-48">
                  <Line data={chartData} options={chartOptions} />
                </div>
              )}
            </div>
          </div>

          {/* SLA Overview */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">SLA Overview</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">In SLA</span>
                    <span className="text-blue-600 font-bold">{stats.inSla}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 transition-all duration-500"
                      style={{ width: `${inSlaPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">At Risk</span>
                    <span className="text-amber-600 font-bold">{stats.atRisk}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5">
                    <div 
                      className="bg-amber-500 h-1.5 transition-all duration-500"
                      style={{ width: `${atRiskPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">Breached</span>
                    <span className="text-red-600 font-bold">{stats.breached}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5">
                    <div 
                      className="bg-red-500 h-1.5 transition-all duration-500"
                      style={{ width: `${breachedPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">SLA Met</span>
                    <span className="text-emerald-600 font-bold">{stats.slaMet}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5">
                    <div 
                      className="bg-emerald-500 h-1.5 transition-all duration-500"
                      style={{ width: `${slaMetPercent}%` }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SLA Compliance Rate</span>
                    <span className={`font-bold ${complianceRate >= 80 ? 'text-emerald-600' : complianceRate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {complianceRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 mt-1">
                    <div 
                      className={`h-1.5 transition-all duration-500 ${complianceRate >= 80 ? 'bg-emerald-500' : complianceRate >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${complianceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;