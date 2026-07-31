import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SharedNote from './pages/SharedNote';
import ToastContainer from './components/ToastContainer';
import ScrollToTop from './components/ScrollToTop';

// Marketing Pages Imports
import MarketingLayout from './pages/marketing/MarketingLayout';
import Pricing from './pages/marketing/Pricing';
import About from './pages/marketing/About';
import Careers from './pages/marketing/Careers';
import Security from './pages/marketing/Security';
import Contact from './pages/marketing/Contact';
import ProductFeature from './pages/marketing/ProductFeature';
import ProductLanding from './pages/marketing/ProductLanding';
import SolutionsLanding from './pages/marketing/SolutionsLanding';
import SolutionPage from './pages/marketing/SolutionPage';
import Blog from './pages/marketing/Blog';
import BlogDetail from './pages/marketing/BlogDetail';
import Resources from './pages/marketing/Resources';
import HelpCenter from './pages/marketing/HelpCenter';
import DevDocs from './pages/marketing/DevDocs';
import LegalPage from './pages/marketing/LegalPage';
import CompanyLanding from './pages/marketing/CompanyLanding';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const token = useAuthStore(state => state.token);
  const location = useLocation();
  return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

export default function App() {
  const token = useAuthStore(state => state.token);
  const initTheme = useUIStore(state => state.initTheme);

  useEffect(() => {
    const cleanup = initTheme();
    return cleanup;
  }, [initTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <BrowserRouter>
          <ScrollToTop />
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/forgot-password" element={token ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
          <Route path="/reset-password" element={token ? <Navigate to="/dashboard" /> : <ResetPassword />} />
          
          <Route path="/shared/:token" element={<SharedNote />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Public Marketing Multi-Page Layout wrapper */}
          <Route element={token ? <Navigate to="/dashboard" /> : <MarketingLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/company" element={<CompanyLanding />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/security" element={<Security />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product" element={<ProductLanding />} />
            <Route path="/product/:slug" element={<ProductFeature />} />
            <Route path="/solutions" element={<SolutionsLanding />} />
            <Route path="/solutions/:slug" element={<SolutionPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/docs" element={<DevDocs />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
