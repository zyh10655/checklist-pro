// ========================================
// FRONTEND - src/components/Account/AccountDashboard.js
// ========================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { ordersAPI } from '../../services/api';

const AccountDashboard = () => {
  const { user } = useApp();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalDownloads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const ordersResponse = await ordersAPI.getOrders({ limit: 3 });
      setRecentOrders(ordersResponse.orders);
      
      // Calculate stats from user data or orders
      setStats({
        totalOrders: user.totalOrders || ordersResponse.orders.length,
        totalSpent: user.totalSpent || 0,
        totalDownloads: user.purchases?.length || 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.firstName}!</h1>
        <p>Here's what's happening with your account</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalSpent.toFixed(2)}</h3>
            <p>Total Spent</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="stat-icon">📥</div>
          <div className="stat-content">
            <h3>{stats.totalDownloads}</h3>
            <p>Downloads</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/account/orders" className="view-all-link">View All</Link>
        </div>

        {loading ? (
          <div className="loading-placeholder">Loading orders...</div>
        ) : recentOrders.length > 0 ? (
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <h4>Order #{order.orderNumber}</h4>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                  <span className="order-total">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No orders yet</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/products" className="action-card">
            <div className="action-icon">🛍️</div>
            <h3>Browse Products</h3>
            <p>Discover new checklists</p>
          </Link>
          <Link to="/account/downloads" className="action-card">
            <div className="action-icon">📥</div>
            <h3>My Downloads</h3>
            <p>Access your files</p>
          </Link>
          <Link to="/account/profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3>Update Profile</h3>
            <p>Manage your account</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
