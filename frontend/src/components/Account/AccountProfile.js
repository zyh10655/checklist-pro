// ========================================
// FRONTEND - src/components/Account/AccountProfile.js
// ========================================

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApp } from '../../contexts/AppContext';
import { authAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';

const AccountProfile = () => {
  const { user } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'US'
      }
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      await authAPI.updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="account-profile">
      <div className="profile-header">
        <h1>Profile Information</h1>
        <p>Manage your personal information and preferences</p>
      </div>

      <motion.div
        className="profile-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
          {/* Personal Information */}
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  disabled={!isEditing}
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  disabled={!isEditing}
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                disabled // Email should not be editable directly
                {...register('email')}
              />
              <small className="form-help">
                To change your email, please contact support
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                disabled={!isEditing}
                {...register('phone')}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <h2>Address Information</h2>
            
            <div className="form-group">
              <label htmlFor="address.street">Street Address</label>
              <input
                id="address.street"
                type="text"
                className="form-input"
                disabled={!isEditing}
                {...register('address.street')}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.city">City</label>
                <input
                  id="address.city"
                  type="text"
                  className="form-input"
                  disabled={!isEditing}
                  {...register('address.city')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.state">State</label>
                <input
                  id="address.state"
                  type="text"
                  className="form-input"
                  disabled={!isEditing}
                  {...register('address.state')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.zipCode">ZIP Code</label>
                <input
                  id="address.zipCode"
                  type="text"
                  className="form-input"
                  disabled={!isEditing}
                  {...register('address.zipCode')}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address.country">Country</label>
              <select
                id="address.country"
                className="form-input"
                disabled={!isEditing}
                {...register('address.country')}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AccountProfile;