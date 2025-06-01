// ========================================
// FRONTEND - src/pages/ForgotPasswordPage.js
// ========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { authAPI } from '../services/api';

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      await authAPI.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Forgot Password - ChecklistPro"
        description="Reset your ChecklistPro account password securely."
        noIndex={true}
      />

      <div className="auth-page">
        <div className="auth-container">
          <motion.div
            className="auth-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="auth-header">
              <Link to="/" className="auth-logo">
                <h2>ChecklistPro</h2>
              </Link>
              {!isSubmitted ? (
                <>
                  <h1>Forgot Password?</h1>
                  <p>Enter your email address and we'll send you a link to reset your password</p>
                </>
              ) : (
                <>
                  <h1>Check Your Email</h1>
                  <p>We've sent a password reset link to {getValues('email')}</p>
                </>
              )}
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary auth-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="small" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            ) : (
              <div className="success-content">
                <div className="success-icon">📧</div>
                <p>
                  If an account with that email exists, we've sent you a password 
                  reset link. Please check your inbox and spam folder.
                </p>
                <p className="resend-info">
                  Didn't receive the email? 
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="btn-link"
                  >
                    Try again
                  </button>
                </p>
              </div>
            )}

            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/login" className="auth-link">
                  Back to login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;