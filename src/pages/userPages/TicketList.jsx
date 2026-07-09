import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TicketList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const statuses = ['new', 'open', 'in_progress', 'pending_customer', 'pending_third_party', 'resolved', 'closed', 'canceled'];

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await api.get(`/tickets/${params}`);
      setTickets(response.results || response);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = () => {
    navigate('/user/create');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">My Tickets</h2>
          <p className="text-sm text-gray-500 mt-0.5">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found</p>
        </div>
        <button 
          onClick={handleCreateTicket}
          className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Ticket
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-1.5 mb-4 overflow-x-auto pb-2">
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

      {tickets.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 md:p-12 text-center shadow-sm">
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
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
          >
            Create Your First Ticket
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="hidden sm:table-cell px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                  <th className="hidden md:table-cell px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const statusKey = ticket.status || 'new';
                  const statusDisplay = ticket.status_label || formatStatusLabel(statusKey);
                  
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-2.5 font-medium text-gray-900 text-xs">{ticket.ticket_id}</td>
                      <td className="px-5 py-2.5 text-gray-700 font-medium text-xs truncate max-w-[120px]">{ticket.title}</td>
                      <td className="px-5 py-2.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${getStatusBadge(statusKey)}`}>
                          {statusDisplay}
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
                        <Link to={`/user/tickets/${ticket.id}`}>
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm whitespace-nowrap">
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
        </div>
      )}
    </div>
  );
};

export default TicketList;