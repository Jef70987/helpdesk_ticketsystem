import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Filler,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    totalHardware: 0,
    availableHardware: 0,
    assignedHardware: 0,
    maintenanceHardware: 0,
    slaBreached: 0,
    pendingTickets: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [ticketTrend, setTicketTrend] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [hardwareStatusData, setHardwareStatusData] = useState([]);
  const [agentPerformance, setAgentPerformance] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/dashboard/');
      
      setStats({
        totalUsers: response.stats?.total_users || 0,
        totalTickets: response.stats?.total_tickets || 0,
        openTickets: response.stats?.open_tickets || 0,
        resolvedTickets: response.stats?.resolved_tickets || 0,
        totalHardware: response.stats?.total_hardware || 0,
        availableHardware: response.stats?.available_hardware || 0,
        assignedHardware: response.stats?.assigned_hardware || 0,
        maintenanceHardware: response.stats?.maintenance_hardware || 0,
        slaBreached: response.stats?.sla_breached || 0,
        pendingTickets: response.stats?.pending_tickets || 0,
      });

      setRecentTickets(response.recent_tickets || []);
      setTicketTrend(response.ticket_trend || []);
      setCategoryData(response.category_breakdown || []);
      setStatusData(response.status_breakdown || []);
      setHardwareStatusData(response.hardware_status_breakdown || []);
      setAgentPerformance(response.agent_performance || []);
      setDepartmentData(response.department_breakdown || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/admin/tickets/${ticketId}`);
  };

  const handleViewAllTickets = () => {
    navigate('/admin/tickets');
  };

  const handleViewUsers = () => {
    navigate('/admin/users');
  };

  const handleViewHardware = () => {
    navigate('/admin/hardware');
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      onClick: handleViewUsers,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'bg-white',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      label: 'Total Tickets',
      value: stats.totalTickets,
      onClick: handleViewAllTickets,
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bgColor: 'bg-white',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700'
    },
    {
      label: 'Open Tickets',
      value: stats.openTickets,
      onClick: handleViewAllTickets,
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-white',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700'
    },
    {
      label: 'SLA Breached',
      value: stats.slaBreached,
      onClick: handleViewAllTickets,
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700'
    },
    {
      label: 'Total Hardware',
      value: stats.totalHardware,
      onClick: handleViewHardware,
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-white',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    {
      label: 'Available Hardware',
      value: stats.availableHardware,
      onClick: handleViewHardware,
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700'
    },
    {
      label: 'Assigned Hardware',
      value: stats.assignedHardware,
      onClick: handleViewHardware,
      icon: (
        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700'
    },
    {
      label: 'Hardware Maintenance',
      value: stats.maintenanceHardware,
      onClick: handleViewHardware,
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700'
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

  const getHardwareStatusLabel = (status) => {
    const labels = {
      'available': 'Available',
      'assigned': 'Assigned',
      'maintenance': 'Maintenance',
      'repair': 'Repair',
      'retired': 'Retired',
      'lost': 'Lost',
    };
    return labels[status] || status || 'Unknown';
  };

  const lineChartData = {
    labels: ticketTrend.map(item => item.day || item.date || item.label || ''),
    datasets: [
      {
        label: 'Tickets Created',
        data: ticketTrend.map(item => item.count || 0),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const lineChartOptions = {
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

  const barChartData = {
    labels: categoryData.map(item => item.name || 'Uncategorized'),
    datasets: [
      {
        label: 'Tickets by Category',
        data: categoryData.map(item => item.count || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(217, 70, 239, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(244, 63, 94, 0.8)',
        ],
        borderColor: [
          '#3b82f6',
          '#6366f1',
          '#8b5cf6',
          '#a855f7',
          '#d946ef',
          '#ec4899',
          '#f43f5e',
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
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

  const doughnutData = {
    labels: statusData.map(item => formatStatusLabel(item.name) || 'Unknown'),
    datasets: [
      {
        data: statusData.map(item => item.count || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.85)',
          'rgba(99, 102, 241, 0.85)',
          'rgba(139, 92, 246, 0.85)',
          'rgba(168, 85, 247, 0.85)',
          'rgba(217, 70, 239, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(107, 114, 128, 0.85)',
          'rgba(239, 68, 68, 0.85)',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 11,
          },
          color: '#64748b',
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
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
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  const hardwareDoughnutData = {
    labels: hardwareStatusData.map(item => getHardwareStatusLabel(item.name) || 'Unknown'),
    datasets: [
      {
        data: hardwareStatusData.map(item => item.count || 0),
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)',
          'rgba(6, 182, 212, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(239, 68, 68, 0.85)',
          'rgba(107, 114, 128, 0.85)',
          'rgba(239, 68, 68, 0.85)',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const hardwareDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 11,
          },
          color: '#64748b',
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
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
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded border border-gray-200">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 p-6 text-center rounded">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchAdminData}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time system overview and performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            onClick={stat.onClick}
            className={`${stat.bgColor} p-4 border ${stat.borderColor} shadow-sm hover:shadow transition-all duration-200 cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</span>
              <div className="p-1.5 bg-gray-50 rounded">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1.5 font-medium uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Ticket Volume Trend</h3>
          <div className="h-56">
            {ticketTrend.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No trend data available</p>
            ) : (
              <Line data={lineChartData} options={lineChartOptions} />
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Tickets by Category</h3>
          <div className="h-56">
            {categoryData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No category data available</p>
            ) : (
              <Bar data={barChartData} options={barChartOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Ticket Status Distribution</h3>
          <div className="h-56">
            {statusData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No status data available</p>
            ) : (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Hardware Status Distribution</h3>
          <div className="h-56">
            {hardwareStatusData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No hardware data available</p>
            ) : (
              <Doughnut data={hardwareDoughnutData} options={hardwareDoughnutOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Agent Performance Table */}
      {agentPerformance.length > 0 && (
        <div className="bg-white border border-gray-200 shadow-sm mb-6">
          <div className="px-5 py-3.5 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Agent Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Agent</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Resolved</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Open</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agentPerformance.map((agent, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5 font-medium text-gray-900">{agent.name}</td>
                    <td className="px-5 py-2.5 text-gray-600">{agent.assigned}</td>
                    <td className="px-5 py-2.5 text-gray-600">{agent.resolved}</td>
                    <td className="px-5 py-2.5 text-gray-600">{agent.open}</td>
                    <td className="px-5 py-2.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded ${
                        agent.completion_rate >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        agent.completion_rate >= 50 ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agent.completion_rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Tickets */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-900">Recent Tickets</h3>
          </div>
          <button 
            onClick={handleViewAllTickets}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View All →
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-gray-400 text-sm">No tickets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requestor</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="hidden sm:table-cell px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5 font-medium text-gray-900 text-xs">#{ticket.ticket_id}</td>
                    <td className="px-5 py-2.5 text-gray-700 text-xs truncate max-w-[100px]">{ticket.title}</td>
                    <td className="px-5 py-2.5 text-gray-600 text-xs truncate max-w-[80px]">{ticket.requestor_name || 'Unknown'}</td>
                    <td className="px-5 py-2.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${getStatusBadge(ticket.status)}`}>
                        {formatStatusLabel(ticket.status)}
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
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;