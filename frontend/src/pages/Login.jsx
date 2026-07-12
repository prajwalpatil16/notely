import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';
import logoLockup from '../assets/notely-logo-lockup.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation & Loading States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const setAuth = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  // Intelligently redirect to originally requested route
  const from = location.state?.from?.pathname || "/dashboard";

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
          document.getElementById("googleSignInDiv"),
          { 
            theme: "outline", 
            size: "large", 
            width: "290", 
            text: "signin_with",
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
      navigate(from, { replace: true });
    } catch (err) {
      setEmailError(err.response?.data?.detail || "Google authentication failed. Please try again.");
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
    if (!password) {
      setPasswordError("Password is required.");
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
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.access_token, res.data.refresh_token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail || '';
      if (detail.includes("registered") || detail.includes("sign up")) {
        setEmailError(detail);
      } else if (detail.includes("password") || detail.includes("Incorrect")) {
        setPasswordError(detail);
      } else {
        setEmailError(detail || "Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6 text-dark font-sans select-none">
      <div className="w-full max-w-sm border border-[#E5E3DF] px-5 py-8 sm:p-8 rounded-xl bg-white shadow-sm flex flex-col items-center">
        
        {/* Logo */}
        <img src={logoLockup} alt="Notely Logo" className="h-12 mb-6 select-none" />

        <h3 className="text-xl font-bold text-center mb-8 text-dark tracking-tight">Log in to Notely</h3>

        {/* Google SSO Button */}
        <div className="w-full flex justify-center mb-4 min-h-[44px]">
          <div id="googleSignInDiv" className="w-full"></div>
        </div>

        <div className="w-full flex items-center justify-between gap-4 my-4">
          <div className="flex-1 h-[1px] bg-slate-100" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-[1px] bg-slate-100" />
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          
          {/* Email input */}
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
              autoComplete="username"
            />
            {emailError && (
              <p className="text-[10px] font-bold text-red-500 ml-0.5 animate-in fade-in duration-150">
                {emailError}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-0.5">
              <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase">Password</label>
              <Link to="/forgot-password" className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">Forgot?</Link>
            </div>
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
                autoComplete="current-password"
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
                <span>Logging in...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>

          <p className="text-center text-slate-500 font-medium text-xs mt-8">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline ml-1">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
