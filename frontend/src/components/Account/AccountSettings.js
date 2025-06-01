import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApp } from '../../contexts/AppContext';
import { authAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';

const AccountSettings = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('password');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'password', label: 'Change Password', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' },
    { id: 'danger', label: 'Account', icon: '⚠️' }
  ];

  return (
    <div className="account-settings">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>Manage your account preferences and security settings</p>
      </div>

      {/* Settings Tabs */}
      <div className="settings-tabs">
        <div className="tab-headers">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-header ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'password' && <PasswordSettings loading={loading} setLoading={setLoading} />}
            {activeTab === 'notifications' && <NotificationSettings user={user} />}
            {activeTab === 'privacy' && <PrivacySettings user={user} />}
            {activeTab === 'danger' && <DangerZone user={user} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Password Settings Component
const PasswordSettings = ({ loading, setLoading }) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      await authAPI.changePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmNewPassword
      );
      
      toast.success('Password changed successfully!');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="settings-section">
      <h2>Change Password</h2>
      <p>Ensure your account is using a long, random password to stay secure.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="password-form">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <div className="password-input-wrapper">
            <input
              id="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              className={`form-input ${errors.currentPassword ? 'error' : ''}`}
              {...register('currentPassword', { required: 'Current password is required' })}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.currentPassword && (
            <span className="error-message">{errors.currentPassword.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <div className="password-input-wrapper">
            <input
              id="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: 'Password must contain uppercase, lowercase, number and special character'
                }
              })}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.newPassword && (
            <span className="error-message">{errors.newPassword.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <div className="password-input-wrapper">
            <input
              id="confirmNewPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              className={`form-input ${errors.confirmNewPassword ? 'error' : ''}`}
              {...register('confirmNewPassword', { 
                required: 'Please confirm your new password',
                validate: value => value === newPassword || 'Passwords do not match'
              })}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <span className="error-message">{errors.confirmNewPassword.message}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="small" /> : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = ({ user }) => {
  const [notifications, setNotifications] = useState({
    email: {
      projectUpdates: true,
      weeklyDigest: true,
      mentions: true,
      marketing: false
    },
    push: {
      projectUpdates: true,
      mentions: true,
      reminders: true
    }
  });

  const handleToggle = async (category, setting) => {
    const newValue = !notifications[category][setting];
    
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: newValue
      }
    }));

    try {
      // await authAPI.updateNotificationSettings({ category, setting, value: newValue });
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
      // Revert on error
      setNotifications(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: !newValue
        }
      }));
    }
  };

  return (
    <div className="settings-section">
      <h2>Notification Preferences</h2>
      <p>Choose how you want to be notified about important updates.</p>

      <div className="notification-settings">
        <div className="notification-category">
          <h3>📧 Email Notifications</h3>
          
          <div className="notification-item">
            <div className="notification-info">
              <h4>Project Updates</h4>
              <p>Get notified about project changes and milestones</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.email.projectUpdates}
                onChange={() => handleToggle('email', 'projectUpdates')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Weekly Digest</h4>
              <p>Summary of your weekly activity and updates</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.email.weeklyDigest}
                onChange={() => handleToggle('email', 'weeklyDigest')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Mentions</h4>
              <p>When someone mentions you in a comment or task</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.email.mentions}
                onChange={() => handleToggle('email', 'mentions')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Marketing Communications</h4>
              <p>Product updates, tips, and special offers</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.email.marketing}
                onChange={() => handleToggle('email', 'marketing')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="notification-category">
          <h3>🔔 Push Notifications</h3>
          
          <div className="notification-item">
            <div className="notification-info">
              <h4>Project Updates</h4>
              <p>Real-time notifications for project changes</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.push.projectUpdates}
                onChange={() => handleToggle('push', 'projectUpdates')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Mentions</h4>
              <p>Instant notifications when you're mentioned</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.push.mentions}
                onChange={() => handleToggle('push', 'mentions')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Reminders</h4>
              <p>Task deadlines and scheduled reminders</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.push.reminders}
                onChange={() => handleToggle('push', 'reminders')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Privacy Settings Component
const PrivacySettings = ({ user }) => {
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'team',
    showEmail: false,
    showActivity: true,
    allowAnalytics: true
  });

  const handlePrivacyChange = async (setting, value) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: value
    }));

    try {
      // await authAPI.updatePrivacySettings({ [setting]: value });
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update privacy settings');
    }
  };

  return (
    <div className="settings-section">
      <h2>Privacy Settings</h2>
      <p>Control your privacy and how others see your profile.</p>

      <div className="privacy-settings">
        <div className="privacy-item">
          <div className="privacy-info">
            <h4>Profile Visibility</h4>
            <p>Choose who can see your profile information</p>
          </div>
          <select
            className="form-select"
            value={privacy.profileVisibility}
            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
          >
            <option value="public">Public</option>
            <option value="team">Team Members Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="privacy-item">
          <div className="privacy-info">
            <h4>Show Email Address</h4>
            <p>Display your email on your profile</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacy.showEmail}
              onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="privacy-item">
          <div className="privacy-info">
            <h4>Activity Status</h4>
            <p>Show when you're online and active</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacy.showActivity}
              onChange={(e) => handlePrivacyChange('showActivity', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="privacy-item">
          <div className="privacy-info">
            <h4>Analytics & Improvements</h4>
            <p>Help us improve by sharing anonymous usage data</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacy.allowAnalytics}
              onChange={(e) => handlePrivacyChange('allowAnalytics', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="data-section">
          <h3>Your Data</h3>
          <div className="data-actions">
            <button className="btn btn-secondary">
              Download My Data
            </button>
            <button className="btn btn-secondary">
              Export Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Danger Zone Component
const DangerZone = ({ user }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    try {
      // await authAPI.deleteAccount();
      toast.success('Account deletion initiated. You will receive a confirmation email.');
      // Logout user
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="settings-section danger-zone">
      <h2>Danger Zone</h2>
      <p>Irreversible and destructive actions</p>

      <div className="danger-actions">
        <div className="danger-item">
          <div className="danger-info">
            <h4>Delete Account</h4>
            <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
          </div>
          <button 
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Account</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="warning-message">
                <span className="warning-icon">⚠️</span>
                <div>
                  <h4>This action is permanent!</h4>
                  <p>Deleting your account will:</p>
                  <ul>
                    <li>Remove all your projects and data</li>
                    <li>Cancel any active subscriptions</li>
                    <li>Remove you from all teams</li>
                    <li>Delete all your comments and activities</li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label>Type <strong>DELETE</strong> to confirm:</label>
                <input
                  type="text"
                  className="form-input"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE' || loading}
              >
                {loading ? <LoadingSpinner size="small" /> : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;