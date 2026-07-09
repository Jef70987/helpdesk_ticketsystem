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
      <div className="bg-white border border-emerald-200 p-8 md:p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Ticket Created Successfully</h3>
        <p className="text-gray-500 mt-2">Redirecting to your ticket...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <Link to="/user/tickets" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Tickets
        </Link>
      </div>

      <div className="bg-white border border-gray-200 p-6 md:p-8 w-full shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Create New Ticket
        </h2>
        <p className="text-gray-500 text-sm mb-6">Fill in the details below and our team will assist you.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief summary of your issue"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about your issue..."
              required
              disabled={loading}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-y placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {!formData.category && (
                <p className="text-xs text-red-500 mt-1">Category is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ticket Type</label>
              <select
                name="ticket_type"
                value={formData.ticket_type}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                {ticketTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="urgency"
                checked={formData.urgency}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                This is urgent (my work is completely blocked)
              </span>
            </label>
            <p className="text-xs text-gray-400 ml-6">Only check this if you cannot continue working.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              <button className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors border border-gray-300">
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