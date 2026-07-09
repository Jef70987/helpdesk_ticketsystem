import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    user_type: '',
    department: '',
    employee_id: '',
    position: '',
    phone_number: '',
    office_location: '',
    is_active: true,
  });

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/users/${id}/`);
      setUserData(response);
      setFormData({
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        email: response.email || '',
        username: response.username || '',
        user_type: response.user_type || '',
        department: response.department || '',
        employee_id: response.employee_id || '',
        position: response.position || '',
        phone_number: response.phone_number || '',
        office_location: response.office_location || '',
        is_active: response.is_active !== undefined ? response.is_active : true,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (error.status === 404) {
        navigate('/admin/users');
      } else {
        setError('Failed to load user details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setUpdating(true);
    setError('');
    try {
      await api.patch(`/admin/users/${id}/`, formData);
      setEditing(false);
      fetchUserData();
    } catch (error) {
      setError('Failed to update user. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async () => {
    setUpdating(true);
    setError('');
    try {
      await api.patch(`/admin/users/${id}/`, {
        is_active: !userData.is_active,
      });
      fetchUserData();
    } catch (error) {
      setError('Failed to update user status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/admin/users/${id}/`);
      navigate('/admin/users');
    } catch (error) {
      setError('Failed to delete user. Please try again.');
    }
  };

  const getRoleBadge = (userType) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800 border-red-200',
      'manager': 'bg-amber-100 text-amber-800 border-amber-200',
      'it_staff': 'bg-blue-100 text-blue-800 border-blue-200',
      'employee': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'end_agent': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'end_user': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[userType] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatRole = (userType) => {
    const labels = {
      'admin': 'Admin',
      'manager': 'Manager',
      'it_staff': 'IT Staff',
      'employee': 'Employee',
      'end_agent': 'Support Agent',
      'end_user': 'End User',
    };
    return labels[userType] || userType || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-white border border-gray-200 rounded p-10 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-50 rounded-full">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-500">User not found</p>
        <button 
          onClick={() => navigate('/admin/users')}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/admin/users')}
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {editing ? 'Cancel' : 'Edit User'}
          </button>
          <button
            onClick={handleDeleteUser}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
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
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded p-6 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-blue-600">
                {(userData.full_name || userData.username || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{userData.full_name || userData.username}</h2>
            <p className="text-gray-500 text-sm">{userData.email}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full ${getRoleBadge(userData.user_type)}`}>
                {formatRole(userData.user_type)}
              </span>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                userData.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {userData.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <button
              onClick={handleToggleActive}
              disabled={updating}
              className={`mt-4 px-4 py-2 text-sm font-medium rounded transition-colors w-full ${
                userData.is_active 
                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {userData.is_active ? 'Deactivate User' : 'Activate User'}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded p-5 shadow-sm mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Total Tickets</span>
                <span className="text-sm font-bold text-gray-900">{userData.ticket_count || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Open Tickets</span>
                <span className="text-sm font-bold text-amber-600">{userData.open_tickets || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Resolved Tickets</span>
                <span className="text-sm font-bold text-emerald-600">{userData.resolved_tickets || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">User Information</h4>
            
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="user_type"
                      value={formData.user_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="it_staff">IT Staff</option>
                      <option value="employee">Employee</option>
                      <option value="end_agent">Support Agent</option>
                      <option value="end_user">End User</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <input
                      type="text"
                      name="employee_id"
                      value={formData.employee_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Location</label>
                    <input
                      type="text"
                      name="office_location"
                      value={formData.office_location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-1 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={updating}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Full Name</p>
                    <p className="text-sm text-gray-900 font-medium">{userData.full_name || 'Not set'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Username</p>
                    <p className="text-sm text-gray-900 font-medium">{userData.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm text-gray-900 font-medium">{userData.email}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Role</p>
                    <p className="text-sm text-gray-900 font-medium">{formatRole(userData.user_type)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Department</p>
                    <p className="text-sm text-gray-900 font-medium">{userData.department || 'Not Assigned'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Position</p>
                    <p className="text-sm text-gray-900 font-medium">{userData.position || 'Not set'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Employee ID</p>
                    <p className="text-sm text-gray-900 font-medium">{userData.employee_id || 'Not set'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Status</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                      userData.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {userData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                    <p className="text-sm text-gray-900 font-medium">{userData.phone_number || 'Not set'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Office Location</p>
                    <p className="text-sm text-gray-900 font-medium">{userData.office_location || 'Not set'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Date Joined</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {userData.date_joined ? new Date(userData.date_joined).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Last Login</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {userData.last_login ? new Date(userData.last_login).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;