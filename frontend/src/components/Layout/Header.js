// ========================================
// FRONTEND - src/components/Layout/Header.js
// ========================================

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, getCartItemCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="nav">
          {/* Logo */}
          <Link to="/" className="logo">
            <h1>ChecklistPro</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-only">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
            <Link to="/products" className={location.pathname.startsWith('/products') ? 'active' : ''}>
              Products
            </Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {/* User Menu */}
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <div className="auth-buttons desktop-only">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <CartButton count={getCartItemCount()} />

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle mobile-only"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          user={user}
          onClose={() => setIsMenuOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

// User Menu Component
const UserMenu = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="user-menu">
      <button
        className="user-menu-toggle"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.firstName} />
          ) : (
            <span>{user.firstName?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <span className="user-name desktop-only">
          {user.firstName}
        </span>
        <span className="dropdown-arrow">▼</span>
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="user-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/account" className="dropdown-item">
              <span className="item-icon">👤</span>
              My Account
            </Link>
            <Link to="/account/orders" className="dropdown-item">
              <span className="item-icon">📦</span>
              My Orders
            </Link>
            <Link to="/account/downloads" className="dropdown-item">
              <span className="item-icon">📥</span>
              Downloads
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="dropdown-item">
                <span className="item-icon">⚙️</span>
                Admin Panel
              </Link>
            )}
            <hr className="dropdown-divider" />
            <button onClick={onLogout} className="dropdown-item logout">
              <span className="item-icon">🚪</span>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Cart Button Component
const CartButton = ({ count }) => {
  return (
    <Link to="/cart" className="cart-button">
      <span className="cart-icon">🛒</span>
      {count > 0 && (
        <span className="cart-count">{count}</span>
      )}
    </Link>
  );
};

// Mobile Menu Component
const MobileMenu = ({ isOpen, user, onClose, onLogout }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button onClick={onClose} className="close-btn">×</button>
            </div>

            <div className="mobile-menu-content">
              {/* Navigation Links */}
              <div className="mobile-nav-links">
                <Link to="/" onClick={onClose}>Home</Link>
                <Link to="/products" onClick={onClose}>Products</Link>
                <Link to="/about" onClick={onClose}>About</Link>
                <Link to="/contact" onClick={onClose}>Contact</Link>
              </div>

              {/* User Section */}
              {user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <div className="user-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.firstName} />
                      ) : (
                        <span>{user.firstName?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="user-name">{user.firstName} {user.lastName}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                  </div>

                  <div className="mobile-user-links">
                    <Link to="/account" onClick={onClose}>My Account</Link>
                    <Link to="/account/orders" onClick={onClose}>My Orders</Link>
                    <Link to="/account/downloads" onClick={onClose}>Downloads</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={onClose}>Admin Panel</Link>
                    )}
                  </div>

                  <button onClick={onLogout} className="mobile-logout-btn">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-section">
                  <Link to="/login" className="btn-secondary" onClick={onClose}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary" onClick={onClose}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Header;
