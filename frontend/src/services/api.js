// ========================================
// FRONTEND - src/services/api.js
// ========================================

import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  (error) => {
    // Calculate request duration
    const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0;
    
    // Log failed requests
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${duration}ms`, error.response?.data || error.message);
    
    // Handle specific error status codes
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expired or invalid
          localStorage.removeItem('authToken');
          if (window.location.pathname !== '/login') {
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
          }
          break;
          
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
          
        case 404:
          if (!error.config.url.includes('/products/')) {
            toast.error('Resource not found.');
          }
          break;
          
        case 429:
          toast.error('Too many requests. Please slow down and try again later.');
          break;
          
        case 500:
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          if (data?.error && !error.config.skipErrorToast) {
            toast.error(data.error);
          }
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection and try again.');
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);

// Generic request wrapper with retry logic
const makeRequest = async (requestFn, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === retries || error.response?.status < 500) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// ========================================
// AUTH API
// ========================================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await makeRequest(() => 
      api.post('/auth/register', userData)
    );
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await makeRequest(() => 
      api.post('/auth/login', credentials)
    );
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password, confirmPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
      confirmPassword
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await makeRequest(() => api.get('/auth/me'));
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/me', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword, confirmNewPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword
    });
    return response.data;
  }
};

// ========================================
// PRODUCTS API
// ========================================

export const productsAPI = {
  // Get all products with filtering and pagination
  getProducts: async (params = {}) => {
    const response = await makeRequest(() => 
      api.get('/products', { params })
    );
    return response.data;
  },

  // Get single product by slug
  getProduct: async (slug) => {
    const response = await makeRequest(() => 
      api.get(`/products/${slug}`, { skipErrorToast: true })
    );
    return response.data;
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    const response = await makeRequest(() => 
      api.get('/products', { 
        params: { search: query, ...filters } 
      })
    );
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 6) => {
    const response = await makeRequest(() => 
      api.get('/products', { 
        params: { featured: true, limit } 
      })
    );
    return response.data;
  },

  // Get popular products
  getPopularProducts: async (limit = 10) => {
    const response = await makeRequest(() => 
      api.get('/products', { 
        params: { sort: 'popular', limit } 
      })
    );
    return response.data;
  },

  // Create product (Admin only)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (Admin only)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (Admin only)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Track product view
  trackView: async (productId) => {
    try {
      await api.post(`/products/${productId}/view`);
    } catch (error) {
      // Silently fail for analytics
      console.warn('Failed to track product view:', error);
    }
  }
};

// ========================================
// CATEGORIES API
// ========================================

export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await makeRequest(() => api.get('/categories'));
    return response.data;
  },

  // Get category by slug
  getCategory: async (slug) => {
    const response = await makeRequest(() => 
      api.get(`/categories/${slug}`)
    );
    return response.data;
  },

  // Create category (Admin only)
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category (Admin only)
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category (Admin only)
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

// ========================================
// ORDERS API
// ========================================

export const ordersAPI = {
  // Get user orders
  getOrders: async (params = {}) => {
    const response = await makeRequest(() => 
      api.get('/orders', { params })
    );
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await makeRequest(() => 
      api.get(`/orders/${id}`)
    );
    return response.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Update order status (Admin only)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Get order download links
  getDownloadLinks: async (orderId) => {
    const response = await makeRequest(() => 
      api.get(`/orders/${orderId}/downloads`)
    );
    return response.data;
  }
};

// ========================================
// PAYMENTS API
// ========================================

export const paymentsAPI = {
  // Create payment intent
  createPaymentIntent: async (amount, currency = 'usd') => {
    const response = await api.post('/payments/create-intent', {
      amount,
      currency
    });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    const response = await api.post('/payments/confirm', {
      paymentIntentId,
      paymentMethodId
    });
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await makeRequest(() => 
      api.get('/payments/methods')
    );
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (paymentMethodData) => {
    const response = await api.post('/payments/methods', paymentMethodData);
    return response.data;
  },

  // Remove payment method
  removePaymentMethod: async (paymentMethodId) => {
    const response = await api.delete(`/payments/methods/${paymentMethodId}`);
    return response.data;
  }
};

// ========================================
// ANALYTICS API
// ========================================

export const analyticsAPI = {
  // Get dashboard analytics (Admin only)
  getDashboardAnalytics: async () => {
    const response = await makeRequest(() => 
      api.get('/analytics')
    );
    return response.data;
  },

  // Get revenue analytics (Admin only)
  getRevenueAnalytics: async (params = {}) => {
    const response = await makeRequest(() => 
      api.get('/analytics/revenue', { params })
    );
    return response.data;
  },

  // Get product analytics (Admin only)
  getProductAnalytics: async (params = {}) => {
    const response = await makeRequest(() => 
      api.get('/analytics/products', { params })
    );
    return response.data;
  },

  // Get user analytics (Admin only)
  getUserAnalytics: async (params = {}) => {
    const response = await makeRequest(() => 
      api.get('/analytics/users', { params })
    );
    return response.data;
  },

  // Track custom event
  trackEvent: async (eventName, eventData = {}) => {
    try {
      await api.post('/analytics/events', {
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silently fail for analytics
      console.warn('Failed to track event:', error);
    }
  }
};

// ========================================
// FILE UPLOAD API
// ========================================

export const uploadAPI = {
  // Upload single file
  uploadFile: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options.onProgress
    });
    
    return response.data;
  },

  // Upload multiple files
  uploadFiles: async (files, options = {}) => {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    const response = await api.post('/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options.onProgress
    });
    
    return response.data;
  },

  // Delete file
  deleteFile: async (fileId) => {
    const response = await api.delete(`/uploads/${fileId}`);
    return response.data;
  }
};

// ========================================
// CONTACT/SUPPORT API
// ========================================

export const supportAPI = {
  // Send contact form
  sendContactForm: async (formData) => {
    const response = await api.post('/contact', formData);
    return response.data;
  },

  // Submit support ticket
  createSupportTicket: async (ticketData) => {
    const response = await api.post('/support/tickets', ticketData);
    return response.data;
  },

  // Get support tickets
  getSupportTickets: async () => {
    const response = await makeRequest(() => 
      api.get('/support/tickets')
    );
    return response.data;
  },

  // Reply to support ticket
  replyToTicket: async (ticketId, message) => {
    const response = await api.post(`/support/tickets/${ticketId}/reply`, {
      message
    });
    return response.data;
  },

  // Get FAQ
  getFAQ: async () => {
    const response = await makeRequest(() => api.get('/support/faq'));
    return response.data;
  }
};

// ========================================
// NEWSLETTER API
// ========================================

export const newsletterAPI = {
  // Subscribe to newsletter
  subscribe: async (email, preferences = {}) => {
    const response = await api.post('/newsletter/subscribe', {
      email,
      preferences
    });
    return response.data;
  },

  // Unsubscribe from newsletter
  unsubscribe: async (token) => {
    const response = await api.post('/newsletter/unsubscribe', { token });
    return response.data;
  },

  // Update newsletter preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/newsletter/preferences', preferences);
    return response.data;
  }
};

// ========================================
// ADMIN API
// ========================================

export const adminAPI = {
  // Get all users (Admin only)
  getUsers: async (params = {}) => {
    const response = await makeRequest(() => 
      api.get('/admin/users', { params })
    );
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Get all orders (Admin only)
  getAllOrders: async (params = {}) => {
    const response = await makeRequest(() => 
      api.get('/admin/orders', { params })
    );
    return response.data;
  },

  // Update order (Admin only)
  updateOrder: async (orderId, orderData) => {
    const response = await api.put(`/admin/orders/${orderId}`, orderData);
    return response.data;
  },

  // Get system stats (Admin only)
  getSystemStats: async () => {
    const response = await makeRequest(() => 
      api.get('/admin/stats')
    );
    return response.data;
  },

  // Export data (Admin only)
  exportData: async (type, format = 'csv') => {
    const response = await api.get(`/admin/export/${type}`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Helper function to handle file downloads
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Helper function to format error messages
export const formatErrorMessage = (error) => {
  if (error.response?.data?.details) {
    return error.response.data.details
      .map(detail => detail.message)
      .join(', ');
  }
  return error.response?.data?.error || error.message || 'An unknown error occurred';
};

// Helper function to retry failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await api.get('/health', { 
      timeout: 5000,
      skipErrorToast: true 
    });
    return response.data;
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

// Default export with all APIs
export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  orders: ordersAPI,
  payments: paymentsAPI,
  analytics: analyticsAPI,
  upload: uploadAPI,
  support: supportAPI,
  newsletter: newsletterAPI,
  admin: adminAPI,
  healthCheck
};