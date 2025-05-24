// ========================================
// FRONTEND - src/components/Layout/Footer.js
// ========================================

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <Link to="/" className="footer-logo">
              <h3>ChecklistPro</h3>
            </Link>
            <p>
              Professional checklists for niche industries. Save time, avoid mistakes, 
              and ensure success with our expert-created guidance.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>

          {/* Products Section */}
          <div className="footer-section">
            <h4>Products</h4>
            <ul>
              <li><Link to="/products?category=food-service">Food Service</Link></li>
              <li><Link to="/products?category=healthcare">Healthcare</Link></li>
              <li><Link to="/products?category=media">Media & Content</Link></li>
              <li><Link to="/products?category=retail">Retail</Link></li>
              <li><Link to="/products?category=consulting">Consulting</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/refunds">Refund Policy</Link></li>
              <li><Link to="/support">Technical Support</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/partnerships">Partnerships</Link></li>
              <li><Link to="/affiliates">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/licenses">Licenses</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 ChecklistPro. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/sitemap">Sitemap</Link>
              <Link to="/accessibility">Accessibility</Link>
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
