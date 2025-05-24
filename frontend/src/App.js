// ========================================
// FRONTEND - src/App.js
// ========================================

import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';
import CookieConsent from './components/CookieConsent';

// Pages (lazy loaded for better performance)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const AccountPage = React.lazy(() => import('./pages/AccountPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('./pages/VerifyEmailPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Hooks
import { useApp } from './contexts/AppContext';

// Styles
import './App.css';

// Page transition animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

// Loading component for Suspense
const PageLoader = () => (
  <div className="page-loader">
    <LoadingSpinner size="large" />
    <p>Loading...</p>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-fallback">
    <div className="error-content">
      <h2>Oops! Something went wrong</h2>
      <p>We're sorry, but something unexpected happened.</p>
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      <div className="error-actions">
        <button onClick={resetErrorBoundary} className="btn-primary">
          Try again
        </button>
        <button onClick={() => window.location.href = '/'} className="btn-secondary">
          Go home
        </button>
      </div>
    </div>
  </div>
);

function App() {
  const location = useLocation();
  const { user, initializeApp } = useApp();

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Analytics tracking (Google Analytics, etc.)
  useEffect(() => {
    // Track page views
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <div className="App">
        {/* Global SEO */}
        <SEO
          title="ChecklistPro - Professional Industry Checklists"
          description="Save time, avoid costly mistakes, and ensure thoroughness with our expert-level checklist packages designed for niche industries."
          keywords="business checklists, industry guides, professional templates, startup resources, business planning"
          image="/images/og-image.jpg"
        />

        {/* Scroll to top on route change */}
        <ScrollToTop />

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="main-content" role="main">
          <ErrorBoundary fallback={ErrorFallback}>
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait" initial={false}>
                <Routes location={location} key={location.pathname}>
                  {/* Public Routes */}
                  <Route 
                    path="/" 
                    element={
                      <div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                      >
                        <HomePage />
                      </div>
                    } 
                  />
                  
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* Auth Routes */}
                  <Route 
                    path="/login" 
                    element={
                      user ? <Navigate to="/account" replace /> : <LoginPage />
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      user ? <Navigate to="/account" replace /> : <RegisterPage />
                    } 
                  />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/account/*"
                    element={
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <Footer />

        {/* Cookie Consent */}
        <CookieConsent />

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName="toast-container"
          containerStyle={{}}
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '14px',
              maxWidth: '500px',
            },
            
            // Success toasts
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
              style: {
                background: '#059669',
              },
            },
            
            // Error toasts
            error: {
              duration: 6000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                background: '#dc2626',
              },
            },
            
            // Loading toasts
            loading: {
              duration: Infinity,
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#fff',
              },
              style: {
                background: '#2563eb',
              },
            },
          }}
        />

        {/* Service Worker Registration */}
        {process.env.NODE_ENV === 'production' && (
          <ServiceWorkerRegistration />
        )}
      </div>
    </ErrorBoundary>
  );
}

// Service Worker Registration Component
const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return null;
};

export default App;