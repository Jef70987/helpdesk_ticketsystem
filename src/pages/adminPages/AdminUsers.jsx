import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentStats, setDepartmentStats] = useState([]);
  const [ticketStats, setTicketStats] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/users/');
      const userData = response || [];
      setUsers(userData);
      
      // Calculate department statistics
      const deptMap = {};
      const ticketMap = {};
      
      userData.forEach(u => {
        const dept = u.department || 'Unassigned';
        if (!deptMap[dept]) {
          deptMap[dept] = 0;
          ticketMap[dept] = 0;
        }
        deptMap[dept]++;
        ticketMap[dept] += (u.ticket_count || 0);
      });
      
      setDepartmentStats(Object.entries(deptMap).map(([name, count]) => ({ name, count })));
      setTicketStats(Object.entries(ticketMap).map(([name, count]) => ({ name, count })));
      
    } catch (error) {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleCreateUser = () => {
    navigate('/admin/users/create');
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const getRoleBadge = (userType) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800 border-red-200',
      'manager': 'bg-amber-100 text-amber-800 border-amber-200',
      'it_staff': 'bg-blue-100 text-blue-800 border-blue-200',
      'employee': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'end_agent': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'end_user': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[userType] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatRole = (userType) => {
    const labels = {
      'admin': 'Admin',
      'manager': 'Manager',
      'it_staff': 'IT Staff',
      'employee': 'Employee',
      'end_agent': 'Support Agent',
      'end_user': 'End User',
    };
    return labels[userType] || userType || 'Unknown';
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = searchTerm === '' || 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === '' || u.user_type === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const userRoles = ['admin', 'manager', 'it_staff', 'employee', 'end_agent', 'end_user'];

  // Chart data for users by department
  const userChartData = {
    labels: departmentStats.map(item => item.name),
    datasets: [
      {
        label: 'Users by Department',
        data: departmentStats.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Chart data for tickets by department
  const ticketChartData = {
    labels: ticketStats.map(item => item.name),
    datasets: [
      {
        label: 'Tickets by Department',
        data: ticketStats.map(item => item.count),
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
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
        padding: 10,
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

  // Stats cards
  const statsCards = [
    {
      label: 'Total Users',
      value: users.length,
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
      label: 'Active Users',
      value: users.filter(u => u.is_active).length,
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-white',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700'
    },
    {
      label: 'Departments',
      value: departmentStats.length,
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      bgColor: 'bg-white',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    {
      label: 'Total Tickets',
      value: users.reduce((sum, u) => sum + (u.ticket_count || 0), 0),
      icon: (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bgColor: 'bg-white',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system users and their permissions</p>
        </div>
       
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} p-4 border ${stat.borderColor} shadow-sm`}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Users by Department</h3>
          <div className="h-56">
            {departmentStats.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No department data available</p>
            ) : (
              <Bar data={userChartData} options={chartOptions} />
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Tickets by Department</h3>
          <div className="h-56">
            {ticketStats.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No ticket data available</p>
            ) : (
              <Bar data={ticketChartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-l text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-r border border-l-0 border-gray-300 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Role Filters */}
      <div className="flex flex-wrap gap-1.5 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setRoleFilter('')}
          className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
            !roleFilter ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Roles
        </button>
        {userRoles.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
              roleFilter === role ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {formatRole(role)}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded">
          {error}
        </div>
      )}

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-10 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tickets</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">
                            {(u.full_name || u.username || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{u.full_name || u.username}</p>
                          <p className="text-gray-400 text-xs">{u.employee_id || 'No ID'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm truncate max-w-[120px]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${getRoleBadge(u.user_type)}`}>
                        {formatRole(u.user_type)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-gray-500 text-sm">{u.department || 'Not Assigned'}</td>
                    <td className="hidden lg:table-cell px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {u.ticket_count || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleViewUser(u.id)}
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
        </div>
      )}
    </div>
  );
};

export default AdminUsers;