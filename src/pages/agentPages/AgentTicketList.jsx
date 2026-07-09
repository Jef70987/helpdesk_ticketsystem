import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const AgentTicketList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
      
      const response = await api.get(`/agent/tickets/?${params.toString()}`);
      setTickets(response.results || response || []);
    } catch (error) {
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/agent/tickets/${ticketId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTickets();
  };

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

  const getPriorityBadge = (priority) => {
    const colors = {
      1: 'bg-red-100 text-red-800 border-red-300',
      2: 'bg-orange-100 text-orange-800 border-orange-300',
      3: 'bg-blue-100 text-blue-800 border-blue-300',
      4: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      1: 'Critical',
      2: 'High',
      3: 'Medium',
      4: 'Low',
    };
    return labels[priority] || `Priority ${priority}`;
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

  const filteredTickets = tickets.filter(ticket => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      ticket.ticket_id?.toLowerCase().includes(search) ||
      ticket.title?.toLowerCase().includes(search) ||
      ticket.requestor_name?.toLowerCase().includes(search)
    );
  });

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
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Assigned Tickets</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found</p>
        </div>
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

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-1.5 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('')}
          className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
            !statusFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {formatStatusLabel(status)}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {filteredTickets.length === 0 ? (
        <div className="bg-white border border-gray-200 p-10 md:p-12 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-50">
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
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requestor</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="hidden sm:table-cell px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                  <th className="hidden md:table-cell px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5 font-medium text-gray-900 text-xs">{ticket.ticket_id}</td>
                    <td className="px-5 py-2.5 text-gray-700 text-xs truncate max-w-[100px]">{ticket.title}</td>
                    <td className="px-5 py-2.5 text-gray-500 text-xs truncate max-w-[80px]">{ticket.requestor_name || 'Unknown'}</td>
                    <td className="px-5 py-2.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${getStatusBadge(ticket.status)}`}>
                        {formatStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-5 py-2.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority_label || getPriorityLabel(ticket.priority)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-5 py-2.5 text-gray-500 text-xs">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentTicketList;