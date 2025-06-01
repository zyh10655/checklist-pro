// ========================================
// FRONTEND - src/components/Account/AccountOrders.js
// ========================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import Pagination from '../UI/Pagination';

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [currentPage, filterStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const response = await ordersAPI.getOrders(params);
      setOrders(response.orders);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'pending': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="account-orders">
      <div className="orders-header">
        <h1>Order History</h1>
        <p>View and track all your orders</p>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="all">All Orders</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="orders-loading">
          <LoadingSpinner size="large" />
          <p>Loading your orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="orders-list">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="order-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                  <div className="order-actions">
                    {order.status === 'completed' && (
                      <Link 
                        to={`/account/downloads?order=${order.id}`}
                        className="btn-primary"
                      >
                        Download Files
                      </Link>
                    )}
                    <button className="btn-secondary">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h3>No Orders Found</h3>
          <p>
            {filterStatus === 'all' 
              ? "You haven't placed any orders yet."
              : `No ${filterStatus} orders found.`
            }
          </p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default AccountOrders;