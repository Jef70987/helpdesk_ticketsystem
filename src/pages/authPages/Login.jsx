import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const result = await login({ username: formData.email, password: formData.password });
      if (result.success) {
        const role = result.user?.user_type;
        
        if (role === 'employee') {
          navigate('/user/dashboard');
        } else if (role === 'it_staff') {
          navigate('/agent/dashboard');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. Invalid user role.');
          await login.logout();
          return;
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Access error occurred. Contact admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#ffffff] rounded-lg border border-[#c6c6cd] shadow-[0px_1px_3px_rgba(0,0,0,0.05)] p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#eff4ff] rounded-lg mb-4">
              <svg className="w-8 h-8 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] font-['Inter'] text-[#000000]">
              HelpDesk
            </h1>
            <p className="text-[16px] font-normal leading-[24px] font-['Inter'] text-[#45464d] mt-1">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-[#ffdad6] border border-[#ba1a1a] rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#ba1a1a]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-[14px] font-normal leading-[20px] font-['Inter'] text-[#93000a]">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#000000] mb-1.5">
                EMAIL ADDRESS <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full px-4 py-2.5 bg-[#ffffff] border border-[#c6c6cd] rounded-lg text-[14px] font-normal leading-[20px] font-['Inter'] text-[#000000] placeholder-[#76777d] transition-all duration-200 focus:outline-none focus:border-[#000000] focus:ring-2 focus:ring-[#000000]/20 disabled:bg-[#eff4ff] disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-medium leading-[16px] tracking-[0.05em] font-['JetBrains_Mono'] text-[#000000]">
                  PASSWORD <span className="text-[#ba1a1a]">*</span>
                </label>
                <Link 
                  to="/authPages/forgot-password" 
                  className="text-[14px] font-medium leading-[20px] font-['Inter'] text-[#000000] hover:text-[#3f465c] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="w-full px-4 py-2.5 bg-[#ffffff] border border-[#c6c6cd] rounded-lg text-[14px] font-normal leading-[20px] font-['Inter'] text-[#000000] placeholder-[#76777d] transition-all duration-200 focus:outline-none focus:border-[#000000] focus:ring-2 focus:ring-[#000000]/20 disabled:bg-[#eff4ff] disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#000000] hover:bg-[#131b2e] text-[#ffffff] font-medium text-[14px] leading-[20px] font-['Inter'] rounded-lg transition-all duration-200 disabled:opacity-50 active:scale-[0.98] shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-[#ffffff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[#c6c6cd] text-center">
            <p className="text-[14px] font-normal leading-[20px] font-['Inter'] text-[#45464d]">
              Don't have an account?{' '}
              <Link 
                to="/authPages/Login" 
                className="text-[#000000] hover:text-[#3f465c] font-medium transition-colors"
              >
                Contact your administrator
              </Link>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Login;