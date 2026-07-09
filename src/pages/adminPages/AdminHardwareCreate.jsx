import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const AdminHardwareCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    serial_number: '',
    brand: '',
    model: '',
    category: '',
    status: 'available',
    condition: 'good',
    assigned_to: '',
    purchase_date: '',
    purchase_price: '',
    warranty_expiry: '',
    supplier: '',
    invoice_number: '',
    location: '',
    notes: '',
    specification: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/hardware/categories/');
      setCategories(response || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        purchase_price: parseFloat(formData.purchase_price) || 0,
      };
      await api.post('/admin/hardware/create/', data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/hardware');
      }, 1500);
    } catch (error) {
      console.error('Failed to create hardware:', error);
      setError(error.message || 'Failed to create hardware. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-gray-200 rounded p-8 md:p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4 rounded-full">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Hardware Item Created Successfully</h3>
        <p className="text-gray-500 mt-2">Redirecting to hardware list...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/admin/hardware')}
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Hardware
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Add New Hardware</h2>
          <p className="text-gray-500 text-sm mt-1">Fill in the details below to add a new hardware item</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Information */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded"></span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter item name"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Serial Number</label>
                <input
                  type="text"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  placeholder="Enter serial number"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Enter model"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Classification */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded"></span>
              Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="repair_needed">Repair Needed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Assignment */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded"></span>
              Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned To</label>
                <select
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name || u.username}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter storage location"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Purchase Details */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded"></span>
              Purchase Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Purchase Date</label>
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Purchase Price ($)</label>
                <input
                  type="number"
                  name="purchase_price"
                  value={formData.purchase_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Warranty Expiry</label>
                <input
                  type="date"
                  name="warranty_expiry"
                  value={formData.warranty_expiry}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Enter supplier name"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Invoice Number</label>
                <input
                  type="text"
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  placeholder="Enter invoice number"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Additional Information */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded"></span>
              Additional Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Specifications</label>
              <textarea
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                placeholder="Enter technical specifications (one per line or JSON format)"
                rows={3}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-y placeholder-gray-400"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about this hardware item"
                rows={3}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-y placeholder-gray-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Hardware Item'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/hardware')}
              className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHardwareCreate;