import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

// Hardware image mapping based on category or name
const getHardwareImage = (item) => {
  if (!item) return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format';
  
  const name = item.name?.toLowerCase() || '';
  const category = item.category_name?.toLowerCase() || '';
  const brand = item.brand?.toLowerCase() || '';
  
  // Laptops
  if (name.includes('laptop') || name.includes('notebook') || category.includes('laptop')) {
    return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format';
  }
  // MacBooks
  if (brand.includes('apple') || brand.includes('macbook')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format';
  }
  // Dell
  if (brand.includes('dell')) {
    return 'https://images.unsplash.com/photo-1593642632824-8a42bf893f08?w=400&h=400&fit=crop&auto=format';
  }
  // HP
  if (brand.includes('hp')) {
    return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format';
  }
  // Lenovo
  if (brand.includes('lenovo') || brand.includes('thinkpad')) {
    return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format';
  }
  // Desktop PCs
  if (name.includes('desktop') || name.includes('pc') || category.includes('desktop')) {
    return 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=400&fit=crop&auto=format';
  }
  // Monitors
  if (name.includes('monitor') || name.includes('screen') || category.includes('monitor')) {
    return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format';
  }
  // Keyboards
  if (name.includes('keyboard')) {
    return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop&auto=format';
  }
  // Mouse
  if (name.includes('mouse')) {
    return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&auto=format';
  }
  // Printers
  if (name.includes('printer')) {
    return 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop&auto=format';
  }
  // Servers
  if (name.includes('server')) {
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop&auto=format';
  }
  // Network equipment
  if (name.includes('switch') || name.includes('router') || name.includes('access point')) {
    return 'https://images.unsplash.com/photo-1563770551460-df51b9f0f0be?w=400&h=400&fit=crop&auto=format';
  }
  // Default
  return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format';
};

// Fallback image on error
const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format';
};

const AdminHardwareDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItem();
    fetchUsers();
    fetchCategories();
  }, [id]);

  const fetchItem = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/hardware/${id}/`);
      setItem(response);
      setFormData(response);
    } catch (error) {
      console.error('Failed to fetch item:', error);
      if (error.status === 404) {
        navigate('/admin/hardware');
      } else {
        setError('Failed to load hardware item. Please try again.');
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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/hardware/categories/');
      setCategories(response || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setUpdating(true);
    setError('');
    try {
      await api.patch(`/admin/hardware/${id}/`, formData);
      setEditing(false);
      fetchItem();
    } catch (error) {
      setError('Failed to update hardware item. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this hardware item? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/hardware/${id}/`);
      navigate('/admin/hardware');
    } catch (error) {
      setError('Failed to delete hardware item. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'available': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'assigned': 'bg-blue-100 text-blue-800 border-blue-200',
      'maintenance': 'bg-amber-100 text-amber-800 border-amber-200',
      'repair': 'bg-orange-100 text-orange-800 border-orange-200',
      'retired': 'bg-gray-100 text-gray-700 border-gray-200',
      'lost': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatStatus = (status) => {
    const labels = {
      'available': 'Available',
      'assigned': 'Assigned',
      'maintenance': 'Maintenance',
      'repair': 'Repair',
      'retired': 'Retired',
      'lost': 'Lost',
    };
    return labels[status] || status || 'Unknown';
  };

  const formatCondition = (condition) => {
    const labels = {
      'new': 'New',
      'good': 'Good',
      'fair': 'Fair',
      'poor': 'Poor',
      'repair_needed': 'Repair Needed',
    };
    return labels[condition] || condition || 'Unknown';
  };

  const renderSpecification = (spec) => {
    if (!spec) return <span className="text-gray-500">No specifications available</span>;
    if (typeof spec === 'string') return <span className="text-gray-800">{spec}</span>;
    if (typeof spec === 'object') {
      return Object.entries(spec).map(([key, value]) => (
        <div key={key} className="flex py-1.5 border-b border-gray-100 last:border-0">
          <span className="text-gray-600 font-medium w-36 capitalize">{key.replace(/_/g, ' ')}:</span>
          <span className="text-gray-800 font-medium">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
        </div>
      ));
    }
    return <span className="text-gray-800">{String(spec)}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-white border border-gray-200 rounded p-10 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-50 rounded-full">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-500">Hardware item not found</p>
        <button 
          onClick={() => navigate('/admin/hardware')}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
        >
          Back to Hardware
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button 
          onClick={() => navigate('/admin/hardware')}
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Hardware
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={handleDelete}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Image & Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            {/* Image */}
            <div className="relative w-full aspect-square bg-gray-50">
              <img
                src={getHardwareImage(item)}
                alt={item.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded-full ${getStatusBadge(item.status)}`}>
                  {formatStatus(item.status)}
                </span>
              </div>
            </div>
            
            {/* Item Info */}
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{item.brand} {item.model}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full ${getStatusBadge(item.status)}`}>
                  {formatStatus(item.status)}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full bg-gray-100 text-gray-700 border-gray-200">
                  {formatCondition(item.condition)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white border border-gray-200 rounded shadow-sm p-5 mt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Serial Number</span>
                <span className="text-sm text-gray-900 font-mono font-medium">{item.serial_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Category</span>
                <span className="text-sm text-gray-900 font-medium">{item.category_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Assigned To</span>
                <span className="text-sm text-gray-900 font-medium">{item.assigned_to_name || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Location</span>
                <span className="text-sm text-gray-900 font-medium">{item.location || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
              <h4 className="text-lg font-bold text-gray-900">Hardware Details</h4>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
            </div>
            
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                    <input
                      type="text"
                      name="serial_number"
                      value={formData.serial_number || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status || 'available'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="available">Available</option>
                      <option value="assigned">Assigned</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="repair">Repair</option>
                      <option value="retired">Retired</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <select
                      name="condition"
                      value={formData.condition || 'good'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                      <option value="repair_needed">Repair Needed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    name="assigned_to"
                    value={formData.assigned_to || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.full_name || u.username}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={updating}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {updating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Item Name</p>
                    <p className="text-base text-gray-900 font-semibold mt-1">{item.name}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Serial Number</p>
                    <p className="text-base text-gray-900 font-mono font-semibold mt-1">{item.serial_number || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Brand</p>
                    <p className="text-base text-gray-900 font-semibold mt-1">{item.brand || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Model</p>
                    <p className="text-base text-gray-900 font-semibold mt-1">{item.model || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</p>
                    <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium border rounded-full ${getStatusBadge(item.status)}`}>
                      {formatStatus(item.status)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Condition</p>
                    <span className="inline-block mt-1 px-3 py-1 text-xs font-medium border rounded-full bg-gray-100 text-gray-700 border-gray-200">
                      {formatCondition(item.condition)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Category</p>
                    <p className="text-base text-gray-900 font-semibold mt-1">{item.category_name || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Assigned To</p>
                    <p className="text-base text-gray-900 font-semibold mt-1">{item.assigned_to_name || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Purchase Date</p>
                    <p className="text-base text-gray-900 font-semibold mt-1">
                      {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Purchase Price</p>
                    <p className="text-base text-gray-900 font-semibold mt-1">
                      {item.purchase_price ? `$${parseFloat(item.purchase_price).toFixed(2)}` : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Warranty Expiry</p>
                    <p className="text-base text-gray-900 font-semibold mt-1">
                      {item.warranty_expiry ? new Date(item.warranty_expiry).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Location</p>
                    <p className="text-base text-gray-900 font-semibold mt-1">{item.location || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Specifications</p>
                  <div className="space-y-1">
                    {renderSpecification(item.specification)}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-base text-gray-800 whitespace-pre-wrap">{item.notes || 'No notes available'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHardwareDetail;