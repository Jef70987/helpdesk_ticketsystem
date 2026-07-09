import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const AdminTickets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    breached: 0,
  });

  const statuses = ['new', 'open', 'in_progress', 'pending_customer', 'pending_third_party', 'resolved', 'closed', 'canceled'];

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await api.get(`/admin/tickets/?${params.toString()}`);
      const ticketData = response.results || response || [];
      setTickets(ticketData);
      
      // Calculate stats from backend data
      const total = ticketData.length;
      const open = ticketData.filter(t => {
        const status = t.status;
        return status && ['new', 'open', 'in_progress', 'pending_customer', 'pending_third_party'].includes(status);
      }).length;
      const resolved = ticketData.filter(t => {
        const status = t.status;
        return status && ['resolved', 'closed'].includes(status);
      }).length;
      const breached = ticketData.filter(t => t.sla_breached === true).length;
      
      setStats({ total, open, resolved, breached });
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/admin/tickets/${ticketId}`);
  };

  const handleCreateTicket = () => {
    navigate('/admin/tickets/create');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const getStatusBadge = (statusType) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800 border-blue-200',
      'open': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'in_progress': 'bg-amber-100 text-amber-800 border-amber-200',
      'pending_customer': 'bg-purple-100 text-purple-800 border-purple-200',
      'pending_third_party': 'bg-pink-100 text-pink-800 border-pink-200',
      'resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'closed': 'bg-gray-100 text-gray-700 border-gray-200',
      'canceled': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[statusType] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityBadge = (priorityLevel) => {
    const colors = {
      1: 'bg-red-100 text-red-800 border-red-200',
      2: 'bg-orange-100 text-orange-800 border-orange-200',
      3: 'bg-blue-100 text-blue-800 border-blue-200',
      4: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[priorityLevel] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityLabel = (priorityLabel) => {
    return priorityLabel || 'Medium';
  };

  const getStatusLabel = (statusLabel) => {
    return statusLabel || 'Unknown';
  };

  // SLA status mapping based on Django admin display
  const getSlaBadge = (slaBreached, statusType) => {
    if (slaBreached) {
      return { label: 'Breached', color: 'bg-red-100 text-red-800' };
    }
    if (statusType === 'resolved' || statusType === 'closed') {
      return { label: 'Met', color: 'bg-emerald-100 text-emerald-800' };
    }
    // Tickets that are still open and not breached are "At Risk"
    return { label: 'At Risk', color: 'bg-amber-100 text-amber-800' };
  };

  const statCards = [
    {
      label: 'Total Tickets',
      value: stats.total,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'text-blue-700'
    },
    {
      label: 'Open Tickets',
      value: stats.open,
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-amber-700'
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-emerald-700'
    },
    {
      label: 'SLA Breached',
      value: stats.breached,
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'text-red-700'
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
          <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all support tickets</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              <div className="p-1.5 bg-gray-50 rounded">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1.5 font-medium uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, title, or requestor..."
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

      {/* Status Filters */}
      <div className="flex flex-wrap gap-1.5 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('')}
          className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
            !statusFilter ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
              statusFilter === status ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-10 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-gray-500">No tickets found</p>
          {statusFilter && (
            <button 
              onClick={() => setStatusFilter('')}
              className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requestor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SLA</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const sla = getSlaBadge(ticket.sla_breached, ticket.status);
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 text-xs">#{ticket.ticket_id}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs truncate max-w-[120px]">{ticket.title}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[80px]">{ticket.requestor_name || 'Unknown'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${getStatusBadge(ticket.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            ticket.status === 'closed' || ticket.status === 'resolved' ? 'bg-emerald-500' :
                            ticket.status === 'canceled' ? 'bg-red-500' :
                            'bg-blue-500 animate-pulse'
                          }`}></span>
                          {getStatusLabel(ticket.status_label)}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${getPriorityBadge(ticket.priority)}`}>
                          {getPriorityLabel(ticket.priority_label)}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${sla.color}`}>
                          {sla.label}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-gray-500 text-xs">
                        {new Date(ticket.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleViewTicket(ticket.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
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
        </div>
      )}
    </div>
  );
};

export default AdminTickets;