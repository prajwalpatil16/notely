import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import logoLockup from '../assets/notely-logo-lockup.svg';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email address is required.");
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccessMessage("If that email is registered, we have sent a reset link to it. Check your terminal log/console if running locally.");
    } catch (err) {
      setEmailError(err.response?.data?.detail || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6 text-dark font-sans select-none">
      <div className="w-full max-w-sm border border-[#E5E3DF] px-5 py-8 sm:p-8 rounded-xl bg-white shadow-sm flex flex-col items-center">
        {/* Logo */}
        <img src={logoLockup} alt="Notely Logo" className="h-12 mb-6 select-none" />

        <h3 className="text-xl font-bold text-center mb-1 text-dark tracking-tight">Reset your password</h3>
        <p className="text-[11px] text-slate-400 font-semibold text-center mb-8">
          Enter your email to receive a temporary recovery link
        </p>

        {successMessage ? (
          <div className="w-full space-y-6 text-center">
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-lg leading-relaxed">
              {successMessage}
            </div>
            <Link 
              to="/login" 
              className="text-xs font-bold text-primary hover:underline block"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                onBlur={validateEmail}
                className="input-field bg-white"
                placeholder="hello@notely.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
              {emailError && (
                <p className="text-[10px] font-bold text-red-500 ml-0.5 animate-in fade-in duration-150">
                  {emailError}
                </p>
              )}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !!emailError}
              className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer py-3 rounded-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <Link 
              to="/login" 
              className="text-xs font-bold text-slate-400 hover:text-dark block text-center mt-4 transition-colors"
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
