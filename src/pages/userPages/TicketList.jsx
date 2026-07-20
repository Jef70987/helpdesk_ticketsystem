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

  const getPriorityBadge = (priority) => {
    const colors = {
      1: 'bg-[#fee2e2] text-[#000000] border-[#c6c6cd]',
      2: 'bg-[#ffedd5] text-[#000000] border-[#c6c6cd]',
      3: 'bg-[#dce9ff] text-[#000000] border-[#c6c6cd]',
      4: 'bg-[#f1f5f9] text-[#000000] border-[#c6c6cd]',
    };
    return colors[priority] || 'bg-[#f1f5f9] text-[#000000] border-[#c6c6cd]';
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
        <div className="w-8 h-8 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8f9ff]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h2 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] font-['Inter'] text-[#000000]">
            My Tickets
          </h2>
          <p className="text-[14px] font-normal leading-[20px] font-['Inter'] text-[#45464d] mt-0.5">
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button 
          onClick={handleCreateTicket}
          className="w-full sm:w-auto px-5 py-2 bg-[#000000] hover:bg-[#131b2e] text-[#ffffff] text-[14px] font-medium leading-[20px] font-['Inter'] rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
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
          className={`flex-shrink-0 px-3 py-1.5 text-[12px] font-medium leading-[16px] font-['Inter'] rounded-lg transition-colors whitespace-nowrap ${
            !statusFilter ? 'bg-[#000000] text-[#ffffff]' : 'bg-[#f1f5f9] text-[#000000] hover:bg-[#e2e8f0]'
          }`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex-shrink-0 px-3 py-1.5 text-[12px] font-medium leading-[16px] font-['Inter'] rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === status ? 'bg-[#000000] text-[#ffffff]' : 'bg-[#f1f5f9] text-[#000000] hover:bg-[#e2e8f0]'
            }`}
          >
            {formatStatusLabel(status)}
          </button>
        ))}
      </div>

      {tickets.length === 0 ? (
        <div className="bg-[#ffffff] rounded-lg border border-[#c6c6cd] p-8 md:p-12 text-center shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
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
            className="mt-4 px-6 py-2 bg-[#000000] hover:bg-[#131b2e] text-[#ffffff] text-[14px] font-medium leading-[20px] font-['Inter'] rounded-lg transition-colors shadow-sm"
          >
            Create Your First Ticket
          </button>
        </div>
      ) : (
        <div className="bg-[#ffffff] rounded-lg border border-[#c6c6cd] shadow-[0px_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
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
                    Priority
                  </th>
                  <th className="hidden md:table-cell px-5 py-2.5 text-left text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#45464d]">
                    Created
                  </th>
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#45464d]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c6c6cd]">
                {tickets.map((ticket) => {
                  const statusKey = ticket.status || 'new';
                  const statusDisplay = ticket.status_label || formatStatusLabel(statusKey);
                  
                  return (
                    <tr key={ticket.id} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="px-5 py-2.5 font-medium text-[#000000] text-[12px] font-['JetBrains_Mono']">
                        {ticket.ticket_id}
                      </td>
                      <td className="px-5 py-2.5 text-[#000000] text-[14px] font-medium leading-[20px] font-['Inter'] truncate max-w-[120px]">
                        {ticket.title}
                      </td>
                      <td className="px-5 py-2.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[12px] font-medium leading-[16px] font-['JetBrains_Mono'] border rounded ${getStatusBadge(statusKey)}`}>
                          {statusDisplay}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-5 py-2.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[12px] font-medium leading-[16px] font-['JetBrains_Mono'] border rounded ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority_label || getPriorityLabel(ticket.priority)}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-5 py-2.5 text-[#45464d] text-[14px] font-normal leading-[20px] font-['Inter']">
                        {new Date(ticket.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-2.5">
                        <Link to={`/user/tickets/${ticket.id}`}>
                          <button className="px-3 py-1 bg-[#000000] hover:bg-[#131b2e] text-[#ffffff] text-[12px] font-medium leading-[16px] font-['Inter'] rounded transition-colors shadow-sm whitespace-nowrap">
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