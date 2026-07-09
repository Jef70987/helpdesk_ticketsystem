import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const AdminTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const statuses = ['new', 'open', 'in_progress', 'pending_customer', 'pending_third_party', 'resolved', 'closed', 'canceled'];

  useEffect(() => {
    fetchTicketData();
    fetchUsers();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchTicketData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/tickets/${id}/`);
      
      setTicket(response);
      setMessages(response.messages || []);
      setSelectedStatus(response.status || '');
      setSelectedAssignee(response.assignee || '');
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
      if (error.status === 404) {
        navigate('/admin/tickets');
      } else {
        setError('Failed to load ticket. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users/');
      setUsers(response || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');

    try {
      const response = await api.post(`/admin/tickets/${id}/messages/`, {
        content: newMessage,
      });
      setMessages((prev) => [...prev, response]);
      setNewMessage('');
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === ticket.status) return;

    setUpdating(true);
    setError('');

    try {
      await api.patch(`/admin/tickets/${id}/`, {
        status: selectedStatus,
      });
      fetchTicketData();
    } catch (error) {
      setError('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssigneeUpdate = async () => {
    if (selectedAssignee === ticket.assignee) return;

    setUpdating(true);
    setError('');

    try {
      await api.patch(`/admin/tickets/${id}/`, {
        assignee: selectedAssignee,
      });
      fetchTicketData();
    } catch (error) {
      setError('Failed to update assignee. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;

    try {
      await api.delete(`/admin/tickets/${id}/`);
      navigate('/admin/tickets');
    } catch (error) {
      setError('Failed to delete ticket. Please try again.');
    }
  };

  // Using backend data directly - status_type from serializer
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

  // SLA status based on backend data - matches Django admin
  const getSlaStatus = () => {
    if (!ticket) return { label: 'Unknown', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    
    // Use backend sla_breached field
    if (ticket.sla_breached) {
      return { label: 'Breached', color: 'bg-red-100 text-red-800 border-red-200' };
    }
    
    // Check if ticket is resolved or closed
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      return { label: 'Met', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
    
    // Open tickets that are not breached are "At Risk"
    return { label: 'At Risk', color: 'bg-amber-100 text-amber-800 border-amber-200' };
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSenderName = (msg) => {
    if (msg.author === user?.id) return 'You';
    return msg.author_name || msg.author?.username || 'Customer';
  };

  const isClosed = ticket?.status === 'closed' || ticket?.status === 'canceled';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-white border border-gray-200 rounded p-10 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-50 rounded-full">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <p className="text-gray-500">Ticket not found</p>
        <button 
          onClick={() => navigate('/admin/tickets')}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  const slaStatus = getSlaStatus();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button 
          onClick={() => navigate('/admin/tickets')}
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tickets
        </button>
        <button
          onClick={handleDeleteTicket}
          className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Ticket
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ticket Header */}
          <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">Ticket #{ticket.ticket_id}</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">{ticket.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full ${getStatusBadge(ticket.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    ticket.status === 'closed' || ticket.status === 'resolved' ? 'bg-emerald-500' :
                    ticket.status === 'canceled' ? 'bg-red-500' :
                    'bg-blue-500 animate-pulse'
                  }`}></span>
                  {getStatusLabel(ticket.status_label)}
                </span>
              </div>
            </div>
          </div>

          {/* Conversation */}
          <div className="bg-white border border-gray-200 rounded shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Conversation</h3>
            </div>

            <div ref={chatContainerRef} className="p-5 max-h-[400px] overflow-y-auto space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No messages yet.</p>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.author === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${isOwnMessage ? 'text-blue-600' : 'text-gray-600'}`}>
                          {isOwnMessage ? 'You' : getSenderName(msg)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded shadow-sm ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Add a Reply</h4>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isClosed ? "This ticket is closed. No further replies allowed." : "Type your reply..."}
                required
                disabled={sending || isClosed}
                rows={3}
                className={`w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-y placeholder-gray-400 ${
                  isClosed ? 'cursor-not-allowed' : ''
                }`}
              />
              <button
                type="submit"
                disabled={sending || isClosed}
                className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-all duration-200 disabled:opacity-50 shadow-sm ${
                  isClosed ? 'cursor-not-allowed' : ''
                }`}
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  isClosed ? 'Ticket Closed' : 'Send Reply'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="lg:col-span-1 space-y-4">
          {/* Ticket Details */}
          <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Ticket Details</h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">Status</p>
                <span className={`mt-1 inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full ${getStatusBadge(ticket.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    ticket.status === 'closed' || ticket.status === 'resolved' ? 'bg-emerald-500' :
                    ticket.status === 'canceled' ? 'bg-red-500' :
                    'bg-blue-500 animate-pulse'
                  }`}></span>
                  {getStatusLabel(ticket.status_label)}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">SLA Status</p>
                <span className={`mt-1 inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full ${slaStatus.color}`}>
                  {slaStatus.label}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Priority</p>
                <span className={`mt-1 inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full ${getPriorityBadge(ticket.priority)}`}>
                  {getPriorityLabel(ticket.priority_label)}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Category</p>
                <p className="text-sm text-gray-900 font-medium">{ticket.category_name || 'Uncategorized'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Requestor</p>
                <p className="text-sm text-gray-900 font-medium">{ticket.requestor_name || 'Unknown'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Assignee</p>
                <select
                  value={selectedAssignee}
                  onChange={(e) => {
                    setSelectedAssignee(e.target.value);
                    handleAssigneeUpdate();
                  }}
                  disabled={updating || isClosed}
                  className={`mt-1 w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 ${
                    isClosed ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name || u.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Created</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(ticket.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Ticket Type</p>
                <p className="text-sm text-gray-900 font-medium capitalize">{ticket.ticket_type || 'Incident'}</p>
              </div>

              {ticket.urgency && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Urgent
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Update Status */}
          <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Update Status</h4>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  handleStatusUpdate();
                }}
                disabled={updating || isClosed}
                className={`flex-1 px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 ${
                  isClosed ? 'cursor-not-allowed' : ''
                }`}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            {updating && (
              <div className="mt-2 text-xs text-gray-500">Updating...</div>
            )}
            {isClosed && (
              <div className="mt-2 text-xs text-gray-500">This ticket is closed. Status cannot be changed.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketDetail;