import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    ticket_type: 'incident',
    urgency: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/tickets/categories/');
      setCategories(response);
    } catch (error) {
      // Silent fail
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.category) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        category: parseInt(formData.category),
        ticket_type: formData.ticket_type,
        urgency: formData.urgency,
      };
      
      const response = await api.post('/tickets/create/', data);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/user/tickets/${response.id}`);
      }, 1500);
    } catch (error) {
      const message = error.message || 'Failed to create ticket. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const ticketTypes = [
    { value: 'question', label: 'Question' },
    { value: 'incident', label: 'Incident/Bug' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'task', label: 'Task' },
    { value: 'problem', label: 'Problem' },
  ];

  if (success) {
    return (
      <div className="bg-[#ffffff] rounded-lg border border-[#d1fae5] p-8 md:p-12 text-center shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
        <div className="w-16 h-16 bg-[#d1fae5] flex items-center justify-center mx-auto mb-4 rounded-lg">
          <svg className="w-8 h-8 text-[#006a61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[24px] font-semibold leading-[32px] tracking-[-0.01em] font-['Inter'] text-[#000000]">
          Ticket Created Successfully
        </h3>
        <p className="text-[14px] font-normal leading-[20px] font-['Inter'] text-[#45464d] mt-2">
          Redirecting to your ticket...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8f9ff]">
      <div className="mb-4">
        <Link 
          to="/user/tickets" 
          className="text-[#000000] hover:text-[#131b2e] text-[14px] font-medium leading-[20px] font-['Inter'] flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Tickets
        </Link>
      </div>

      <div className="bg-[#ffffff] rounded-lg border border-[#c6c6cd] p-6 md:p-8 w-full shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
        <h2 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] font-['Inter'] text-[#000000] mb-2">
          Create New Ticket
        </h2>
        <p className="text-[#45464d] text-[14px] font-normal leading-[20px] font-['Inter'] mb-6">
          Fill in the details below and our team will assist you.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#fee2e2] border border-[#fecaca] rounded-lg text-[#991b1b] text-[14px] font-medium leading-[20px] font-['Inter'] flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div>
            <label className="block text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#000000] mb-1.5">
              TITLE <span className="text-[#ba1a1a] ml-1">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief summary of your issue"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 border border-[#c6c6cd] rounded-lg bg-[#ffffff] text-[#000000] text-[14px] font-normal leading-[20px] font-['Inter'] focus:outline-none focus:border-[#000000] focus:ring-2 focus:ring-[#000000]/20 disabled:opacity-50 placeholder-[#76777d]"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#000000] mb-1.5">
              DESCRIPTION <span className="text-[#ba1a1a] ml-1">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about your issue..."
              required
              disabled={loading}
              rows={5}
              className="w-full px-4 py-2.5 border border-[#c6c6cd] rounded-lg bg-[#ffffff] text-[#000000] text-[14px] font-normal leading-[20px] font-['Inter'] focus:outline-none focus:border-[#000000] focus:ring-2 focus:ring-[#000000]/20 disabled:opacity-50 resize-y placeholder-[#76777d]"
            />
          </div>

          {/* Category & Type Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#000000] mb-1.5">
                CATEGORY <span className="text-[#ba1a1a] ml-1">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full px-4 py-2.5 border border-[#c6c6cd] rounded-lg bg-[#ffffff] text-[#000000] text-[14px] font-normal leading-[20px] font-['Inter'] focus:outline-none focus:border-[#000000] focus:ring-2 focus:ring-[#000000]/20 disabled:opacity-50"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {!formData.category && (
                <p className="text-[12px] font-medium leading-[16px] font-['Inter'] text-[#ba1a1a] mt-1">
                  Category is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#000000] mb-1.5">
                TICKET TYPE
              </label>
              <select
                name="ticket_type"
                value={formData.ticket_type}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-[#c6c6cd] rounded-lg bg-[#ffffff] text-[#000000] text-[14px] font-normal leading-[20px] font-['Inter'] focus:outline-none focus:border-[#000000] focus:ring-2 focus:ring-[#000000]/20 disabled:opacity-50"
              >
                {ticketTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Urgency Checkbox */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="urgency"
                checked={formData.urgency}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 border-[#c6c6cd] rounded text-[#000000] focus:ring-2 focus:ring-[#000000]/20"
              />
              <span className="text-[14px] font-medium leading-[20px] font-['Inter'] text-[#000000]">
                This is urgent (my work is completely blocked)
              </span>
            </label>
            <p className="text-[12px] font-normal leading-[16px] font-['Inter'] text-[#76777d] ml-6">
              Only check this if you cannot continue working.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#c6c6cd]">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-[#000000] hover:bg-[#131b2e] text-[#ffffff] font-medium text-[14px] leading-[20px] font-['Inter'] rounded-lg transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-[#ffffff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Ticket'
              )}
            </button>
            <Link to="/user/tickets" className="flex-1">
              <button className="w-full py-2.5 px-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#000000] font-medium text-[14px] leading-[20px] font-['Inter'] rounded-lg transition-colors border border-[#c6c6cd]">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;