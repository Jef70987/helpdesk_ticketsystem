import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [isAgentAssigned, setIsAgentAssigned] = useState(false);
  const [agentName, setAgentName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/ai/chat/history/');
      if (response && response.messages) {
        setMessages(response.messages);
        if (response.ticket_id) {
          setTicketId(response.ticket_id);
        }
        if (response.agent_assigned) {
          setIsAgentAssigned(true);
          setAgentName(response.agent_name);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { 
      content: userMessage, 
      sender: 'user', 
      timestamp: new Date().toISOString() 
    }]);
    setIsLoading(true);
    setIsProcessing(true);

    try {
      const response = await api.post('/ai/chat/', {
        message: userMessage,
        user_id: user?.id,
        email: user?.email,
        username: user?.username,
      });

      const data = response;

      if (data.ticket_id) {
        setTicketId(data.ticket_id);
      }

      if (data.agent_assigned) {
        setIsAgentAssigned(true);
        setAgentName(data.agent_name || 'Support Agent');
      }

      if (data.reply) {
        setMessages(prev => [...prev, {
          content: data.reply,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          isStepByStep: data.is_step_by_step || false,
          steps: data.steps || [],
        }]);
      }

      if (data.escalated) {
        setMessages(prev => [...prev, {
          content: `This issue has been escalated to ${data.agent_name || 'a support agent'}. They will assist you shortly.`,
          sender: 'system',
          timestamp: new Date().toISOString(),
          isSystem: true,
        }]);
      }

      if (!data.reply && !data.escalated) {
        setMessages(prev => [...prev, {
          content: 'I understand you need assistance. Let me create a ticket for you and assign the right support agent.',
          sender: 'ai',
          timestamp: new Date().toISOString(),
        }]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again or contact support directly.';
      
      if (error.status === 403) {
        errorMessage = 'You need to be logged in to use the AI support assistant.';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessages(prev => [...prev, {
        content: errorMessage,
        sender: 'system',
        timestamp: new Date().toISOString(),
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const quickActions = [
    { label: 'Login Issue', value: 'I am having trouble logging into my account.' },
    { label: 'Hardware Problem', value: 'My computer is not working properly. I need technical support.' },
    { label: 'Software Issue', value: 'I am experiencing a software issue with my application.' },
    { label: 'Network Problem', value: 'I cannot connect to the network. Please help.' },
  ];

  const handleQuickAction = (message) => {
    setInputMessage(message);
    const inputElement = document.querySelector('input[type="text"]');
    if (inputElement) {
      inputElement.focus();
    }
  };

  return (
    <div className="w-full h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] max-h-[700px] mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">AI Support Assistant</h2>

      <div className="flex flex-col h-full bg-navy-800 rounded-xl border border-navy-700 shadow-sm overflow-hidden max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="p-3 md:p-4 border-b border-navy-700 bg-navy-700/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm md:text-base font-bold text-white truncate">AI Support Assistant</p>
              <p className="text-[10px] md:text-xs text-white/60 truncate">
                {isAgentAssigned 
                  ? `Assigned to: ${agentName}` 
                  : 'Online - Ready to help'}
              </p>
            </div>
          </div>
          {ticketId && (
            <div className="text-[10px] md:text-xs bg-navy-700 px-2 md:px-3 py-1 rounded-l text-white/70 border border-navy-600 flex-shrink-0">
              Ticket: {ticketId}
            </div>
          )}
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-navy-900/50">
          {messages.length === 0 && (
            <div className="text-center text-white/50 py-6 md:py-8">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-white/30 mb-2 md:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-xs md:text-sm font-medium text-white/70">How can I help you today?</p>
              <p className="text-[10px] md:text-xs text-white/40 mt-1">I will create a ticket for you and provide step-by-step guidance.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 md:gap-2 mb-0.5">
                <span className={`text-[10px] md:text-xs font-bold ${
                  msg.sender === 'user' ? 'text-orange-400' : 
                  msg.sender === 'system' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {msg.sender === 'user' ? 'You' : 
                   msg.sender === 'system' ? 'System' : 'AI Assistant'}
                </span>
                <span className="text-[10px] md:text-xs text-white/50">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div
                className={`max-w-[85%] md:max-w-[75%] px-3 md:px-4 py-2 md:py-2.5 rounded-xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-orange-600 text-white'
                    : msg.sender === 'system'
                    ? 'bg-navy-700 border border-navy-600 text-yellow-300'
                    : msg.isStepByStep
                    ? 'bg-navy-700 border border-emerald-600 text-white'
                    : 'bg-navy-700 text-white border border-navy-600'
                }`}
              >
                {msg.isStepByStep && msg.steps && msg.steps.length > 0 ? (
                  <div className="space-y-1.5 md:space-y-2">
                    <p className="text-xs md:text-sm font-semibold text-emerald-400 mb-1 md:mb-2">Step-by-Step Guide</p>
                    {msg.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-1.5 md:gap-2 text-xs md:text-sm">
                        <span className="text-emerald-400 font-bold min-w-[18px] md:min-w-[24px]">{i + 1}.</span>
                        <span className="text-white/90">{step}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs md:text-sm whitespace-pre-wrap ${
                    msg.isError ? 'text-red-400' : 
                    msg.sender === 'system' ? 'text-yellow-300' : 'text-white'
                  }`}>
                    {msg.content}
                  </p>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-start gap-2">
              <div className="bg-navy-700 px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-navy-600">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse delay-100"></span>
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse delay-200"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length < 2 && (
          <div className="px-3 md:px-4 py-2 border-b border-navy-700 bg-navy-800 flex-shrink-0">
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.value)}
                  className="px-2 md:px-3 py-1 md:py-1.5 bg-navy-700 hover:bg-navy-600 text-white text-[10px] md:text-xs font-medium rounded-xl transition-colors border border-navy-600 whitespace-nowrap"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-2 md:p-3 border-t border-navy-700 bg-navy-800 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isProcessing ? "Processing your request..." : "Describe your issue..."}
              disabled={isLoading || isProcessing}
              className="flex-1 px-3 md:px-4 py-1.5 md:py-2 border border-navy-600 bg-navy-700 text-white rounded-xl text-xs md:text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 disabled:opacity-50 placeholder-white/50 min-w-0"
            />
            <button
              type="submit"
              disabled={isLoading || isProcessing || !inputMessage.trim()}
              className="px-3 md:px-5 py-1.5 md:py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md flex items-center gap-1 md:gap-2 whitespace-nowrap flex-shrink-0"
            >
              {isLoading || isProcessing ? (
                <>
                  <svg className="animate-spin h-3 w-3 md:h-4 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden xs:inline">Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span className="hidden xs:inline">Send</span>
                  <span className="xs:hidden">Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;