import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import api from '../api/client';
import logoLockup from '../assets/notely-logo-lockup.svg';

export default function Register() {
  const addToast = useUIStore(state => state.addToast);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Loading States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const setAuth = useAuthStore(state => state.login);
  const navigate = useNavigate();

  // Google Identity Services Integration
  useEffect(() => {
    /* global google */
    if (typeof google !== 'undefined') {
      try {
        google.accounts.id.initialize({
          client_id: "dummy-google-client-id-for-notely-development.apps.googleusercontent.com",
          callback: handleGoogleResponse
        });
        google.accounts.id.renderButton(
          document.getElementById("googleSignUpDiv"),
          { 
            theme: "outline", 
            size: "large", 
            width: "290", 
            text: "signup_with",
            shape: "rectangular"
          }
        );
      } catch (err) {
        console.error("Google Identity initialization error:", err);
      }
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setIsGoogleLoading(true);
    setEmailError('');
    setPasswordError('');
    try {
      const res = await api.post('/auth/google', { credential: response.credential });
      setAuth(res.data.access_token, res.data.refresh_token, res.data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setEmailError(err.response?.data?.detail || "Google registration failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

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

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return false;
    }
    if (!/[A-Za-z]/.test(password)) {
      setPasswordError("Password must contain at least one letter.");
      return false;
    }
    if (!/\d/.test(password)) {
      setPasswordError("Password must contain at least one number.");
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail() || !validatePassword()) return;

    setIsSubmitting(true);
    setEmailError('');
    setPasswordError('');

    try {
      await api.post('/auth/register', {
        email,
        full_name: fullName,
        password
      });
      addToast("Registration successful! Please login.", "success");
      navigate('/login');
    } catch (err) {
      const detail = err.response?.data?.detail || '';
      if (detail.includes("registered") || detail.includes("already has an account")) {
        setEmailError(detail);
      } else {
        setEmailError(detail || "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = email && password && fullName && !emailError && !passwordError;

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6 text-dark font-sans select-none">
      <div className="w-full max-w-sm border border-[#E5E3DF] px-5 py-8 sm:p-8 rounded-xl bg-white shadow-sm flex flex-col items-center">
        
        {/* Logo */}
        <img src={logoLockup} alt="Notely Logo" className="h-12 mb-6 select-none" />

        <h3 className="text-xl font-bold text-center mb-8 text-dark tracking-tight">Create your account</h3>

        {/* Google SSO Button */}
        <div className="w-full flex justify-center mb-4 min-h-[44px]">
          <div id="googleSignUpDiv" className="w-full"></div>
        </div>

        <div className="w-full flex items-center justify-between gap-4 my-4">
          <div className="flex-1 h-[1px] bg-slate-100" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-[1px] bg-slate-100" />
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field bg-white"
              placeholder="Alex Note"
              disabled={isSubmitting || isGoogleLoading}
              autoComplete="name"
            />
          </div>

          {/* Email Address */}
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
              disabled={isSubmitting || isGoogleLoading}
              autoComplete="email"
            />
            {emailError && (
              <p className="text-[10px] font-bold text-red-500 ml-0.5 animate-in fade-in duration-150">
                {emailError}
              </p>
            )}
          </div>
          
          {/* Password */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                onBlur={validatePassword}
                className="input-field bg-white pr-10"
                placeholder="••••••••"
                disabled={isSubmitting || isGoogleLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-dark focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // EyeOff icon
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-[10px] font-bold text-red-500 ml-0.5 animate-in fade-in duration-150">
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button 
            type="submit"
            disabled={isSubmitting || isGoogleLoading || !isFormValid}
            className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer py-3 rounded-lg"
          >
            {isSubmitting || isGoogleLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>

          <p className="text-center text-slate-500 font-medium text-xs mt-8">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
