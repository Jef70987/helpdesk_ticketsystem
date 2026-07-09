// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/send-otp/', { email });
      if (response.success) {
        setStep(2);
        setSuccess('OTP sent successfully to your email');
        setResendTimer(60);
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.message || 'Email not found. Please check and try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp/', { email, otp });
      if (response.success) {
        setStep(3);
        setSuccess('OTP verified successfully');
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password/', { 
        email, 
        otp, 
        new_password: newPassword 
      });
      if (response.success) {
        setSuccess('Password reset successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await api.post('/auth/send-otp/', { email });
      if (response.success) {
        setSuccess('New OTP sent successfully');
        setResendTimer(60);
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const goToStep1 = () => {
    setStep(1);
    setError('');
    setSuccess('');
    setOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 && 'Enter your email to receive a verification code'}
              {step === 2 && 'Enter the 6-digit code sent to your email'}
              {step === 3 && 'Create a new password for your account'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                disabled={loading}
              />
              <Button type="submit" variant="primary" isLoading={loading} className="w-full">
                Send Verification Code
              </Button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">We sent a code to</p>
                <p className="text-sm font-semibold text-gray-900">{email}</p>
              </div>

              <Input
                label="Verification Code"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                disabled={loading}
                maxLength={6}
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className={`text-sm font-medium ${
                    resendTimer > 0 || loading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
                <button
                  type="button"
                  onClick={goToStep1}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Change Email
                </button>
              </div>

              <Button type="submit" variant="primary" isLoading={loading} className="w-full">
                Verify Code
              </Button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                disabled={loading}
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                disabled={loading}
              />
              <div className="text-xs text-gray-400">
                Password must be at least 8 characters
              </div>
              <Button type="submit" variant="primary" isLoading={loading} className="w-full">
                Reset Password
              </Button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;