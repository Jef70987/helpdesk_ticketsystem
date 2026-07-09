import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [ticketMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/messages/');
      
      if (!response || response.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const grouped = {};
      response.forEach(msg => {
        const ticketId = msg.ticket;
        
        if (!grouped[ticketId]) {
          grouped[ticketId] = {
            ticketId: ticketId,
            messages: [],
            lastMessage: null,
            unreadCount: 0,
          };
        }
        grouped[ticketId].messages.push(msg);
        if (msg.author !== user?.id) {
          grouped[ticketId].unreadCount += 1;
        }
        if (!grouped[ticketId].lastMessage || new Date(msg.created_at) > new Date(grouped[ticketId].lastMessage.created_at)) {
          grouped[ticketId].lastMessage = msg;
        }
      });

      const conversationList = Object.values(grouped).sort((a, b) => {
        return new Date(b.lastMessage?.created_at) - new Date(a.lastMessage?.created_at);
      });

      setConversations(conversationList);
    } catch (error) {
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = async (conversation) => {
    setSelectedConversation(conversation);
    setLoadingMessages(true);
    try {
      const response = await api.get(`/tickets/${conversation.ticketId}/`);
      setTicketMessages(response.messages || []);
    } catch (error) {
      console.error('Failed to fetch ticket messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await api.post(`/tickets/${selectedConversation.ticketId}/messages/`, {
        content: newMessage,
      });
      setTicketMessages((prev) => [...prev, response]);
      setNewMessage('');
      
      setConversations((prev) => 
        prev.map(conv => {
          if (conv.ticketId === selectedConversation.ticketId) {
            return {
              ...conv,
              lastMessage: response,
              messages: [...conv.messages, response]
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
    const diffDays = Math.floor((today - msgDay) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return formatTime(date);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return msgDate.toLocaleDateString('en-US', { weekday: 'short' });
    return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSenderName = (msg) => {
    if (msg.author === user?.id) return 'You';
    return msg.author_name || msg.author?.username || 'Support';
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
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Messages</h2>
        <div className="bg-white border border-red-200 p-6 text-center shadow-sm">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchMessages}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-180px)] md:h-[calc(100vh-120px)]">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Messages</h2>

      {conversations.length === 0 ? (
        <div className="bg-white border border-gray-200 p-10 md:p-12 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-50">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-500">No messages yet</p>
        </div>
      ) : (
        <div className="flex h-full bg-white border border-gray-200 shadow-sm overflow-hidden">
          {/* Conversation List - Left Side */}
          <div className={`${isMobileView && selectedConversation ? 'hidden' : 'w-full md:w-80'} md:w-80 border-r border-gray-200 overflow-y-auto flex-shrink-0`}>
            <div className="p-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
              <h3 className="text-sm font-semibold text-gray-900">Conversations</h3>
            </div>
            <div className="overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.ticketId}
                  onClick={() => {
                    handleConversationClick(conv);
                    if (isMobileView) setIsMobileView(true);
                  }}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 transition-colors ${
                    selectedConversation?.ticketId === conv.ticketId ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conv.lastMessage ? getSenderName(conv.lastMessage) : 'Unknown'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium text-white bg-blue-600">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conv.lastMessage?.content || 'No messages'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {conv.lastMessage ? formatDate(conv.lastMessage.created_at) : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat View - Right Side */}
          <div className={`${isMobileView && !selectedConversation ? 'hidden' : 'flex-1'} flex flex-col w-full`}>
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">Select a conversation to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    {isMobileView && (
                      <button 
                        onClick={() => {
                          setSelectedConversation(null);
                          setTicketMessages([]);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </button>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedConversation.messages.length > 0 
                          ? getSenderName(selectedConversation.messages[0]) 
                          : 'Conversation'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.messages.length} messages
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : ticketMessages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <p className="text-sm">No messages in this conversation</p>
                    </div>
                  ) : (
                    ticketMessages.map((msg) => {
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
                            className={`max-w-[75%] px-4 py-2.5 border shadow-sm ${
                              isOwnMessage
                                ? 'bg-blue-600 text-white border-blue-700'
                                : 'bg-white text-gray-900 border-gray-200'
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

                {/* Reply Input */}
                <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      disabled={sending}
                      className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
                    >
                      {sending ? (
                        <span className="flex items-center gap-1">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                      ) : (
                        'Send'
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;