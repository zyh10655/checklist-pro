// ========================================
// FRONTEND - src/pages/NotFoundPage.js
// ========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const NotFoundPage = () => {
  return (
    <>
      <SEO
        title="Page Not Found - ChecklistPro"
        description="The page you're looking for doesn't exist. Return to ChecklistPro home page."
        noIndex={true}
      />

      <div className="not-found-page">
        <div className="container">
          <motion.div
            className="not-found-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="not-found-animation">
              <div className="error-code">404</div>
              <div className="error-icon">📋</div>
            </div>

            <h1>Page Not Found</h1>
            <p>
              Oops! The page you're looking for seems to have wandered off. 
              Don't worry, we'll help you get back on track.
            </p>

            <div className="not-found-actions">
              <Link to="/" className="btn-primary">
                Go Home
              </Link>
              <Link to="/products" className="btn-secondary">
                Browse Checklists
              </Link>
            </div>

            <div className="helpful-links">
              <h3>Looking for something specific?</h3>
              <div className="links-grid">
                <Link to="/products">All Products</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Support</Link>
                <Link to="/help">Help Center</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;