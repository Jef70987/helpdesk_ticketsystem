import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const TicketMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTicketData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tickets/${id}/`);
      setTicket(response);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
      if (error.status === 404) {
        navigate('/tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');

    try {
      const response = await api.post(`/tickets/${id}/messages/`, {
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

  if (!ticket) {
    return (
      <div className="bg-white border border-gray-200 p-10 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-50">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <p className="text-gray-500">Ticket not found</p>
        <Link to="/user/tickets" className="inline-block mt-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm">
            Back to Tickets
          </button>
        </Link>
      </div>
    );
  }

  const statusDisplay = ticket.status_label || formatStatusLabel(ticket.status);
  const isClosed = ticket.status === 'closed' || ticket.status === 'canceled';

  return (
    <div className="w-full">
      <div className="mb-4">
        <Link to="/user/tickets" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Tickets
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ticket Header */}
          <div className="bg-white border border-gray-200 p-5 shadow-sm">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">Ticket #{ticket.ticket_id}</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">{ticket.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium border ${getStatusBadge(ticket.status)}`}>
                  {statusDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Conversation */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Conversation</h3>
            </div>

            <div className="p-5 max-h-[400px] overflow-y-auto space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm">No messages yet. Start the conversation below.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.is_owner ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 border ${
                        msg.is_owner
                          ? 'bg-blue-600 text-white border-blue-700'
                          : 'bg-white text-gray-900 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-0.5">
                        <span className="text-sm font-medium">
                          {msg.sender_name || msg.sender_username || 'System'}
                        </span>
                        <span className={`text-xs ${msg.is_owner ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-white border border-gray-200 p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Add a Reply</h4>

            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isClosed ? "This ticket is closed. No further replies allowed." : "Type your message here..."}
                required
                disabled={sending || isClosed}
                rows={3}
                className={`w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-y placeholder-gray-400 ${
                  isClosed ? 'cursor-not-allowed' : ''
                }`}
              />
              <button
                type="submit"
                disabled={sending || isClosed}
                className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 shadow-sm ${
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

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Ticket Details</h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">Status</p>
                <span className={`inline-flex items-center mt-1 px-3 py-1 text-xs font-medium border ${getStatusBadge(ticket.status)}`}>
                  {statusDisplay}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Priority</p>
                <span className={`inline-flex items-center mt-1 px-3 py-1 text-xs font-medium border ${getPriorityBadge(ticket.priority)}`}>
                  {ticket.priority_label || getPriorityLabel(ticket.priority)}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Category</p>
                <p className="text-sm text-gray-900 font-medium">{ticket.category_name || 'Uncategorized'}</p>
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
                <p className="text-xs text-gray-500 font-medium">Assigned To</p>
                <p className="text-sm text-gray-900 font-medium">{ticket.assignee_name || 'Unassigned'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">Ticket Type</p>
                <p className="text-sm text-gray-900 font-medium capitalize">{ticket.ticket_type || 'Incident'}</p>
              </div>

              {ticket.urgency && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200">
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

          <div className="bg-white border border-gray-200 p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketMessage;