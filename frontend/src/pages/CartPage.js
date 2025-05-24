// ========================================
// FRONTEND - src/pages/CartPage.js
// ========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { useApp } from '../contexts/AppContext';

const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    getCartTotal, 
    clearCart 
  } = useApp();

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <SEO
        title="Shopping Cart - ChecklistPro"
        description="Review your selected checklists and proceed to checkout."
        noIndex={true}
      />

      <div className="cart-page">
        <div className="container">
          <div className="page-header">
            <h1>Shopping Cart</h1>
            <p>Review your items and proceed to checkout</p>
          </div>

          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-header">
                <h2>Your Items ({cart.length})</h2>
                <button onClick={clearCart} className="clear-cart-btn">
                  Clear All
                </button>
              </div>

              {cart.map((item, index) => (
                <CartItem
                  key={item.id}
                  item={item}
                  index={index}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateCartQuantity}
                />
              ))}
            </div>

            <CartSummary total={getCartTotal()} />
          </div>
        </div>
      </div>
    </>
  );
};

const CartItem = ({ item, index, onRemove, onUpdateQuantity }) => {
  return (
    <motion.div
      className="cart-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="item-image">
        <span className="item-icon">📋</span>
      </div>

      <div className="item-details">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        
        {item.features && (
          <div className="item-features">
            <span>Includes: {item.features.slice(0, 2).join(', ')}</span>
            {item.features.length > 2 && (
              <span> and {item.features.length - 2} more</span>
            )}
          </div>
        )}
      </div>

      <div className="item-actions">
        <div className="quantity-controls">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="quantity-btn"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="quantity">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="quantity-btn"
          >
            +
          </button>
        </div>

        <div className="item-price">
          <span className="price">${item.price}</span>
          {item.quantity > 1 && (
            <span className="total">
              Total: ${(item.price * item.quantity).toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="remove-btn"
          aria-label="Remove item"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  );
};

const CartSummary = ({ total }) => {
  const tax = total * 0.08; // 8% tax
  const finalTotal = total + tax;

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      
      <div className="summary-row">
        <span>Subtotal:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      <div className="summary-row">
        <span>Tax:</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      
      <div className="summary-row total">
        <span>Total:</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>

      <Link to="/checkout" className="btn-primary checkout-btn">
        Proceed to Checkout
      </Link>

      <div className="summary-benefits">
        <div className="benefit">
          <span className="benefit-icon">⬇️</span>
          <span>Instant Download</span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">🔄</span>
          <span>Lifetime Updates</span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">💬</span>
          <span>Email Support</span>
        </div>
      </div>

      <div className="continue-shopping">
        <Link to="/products" className="continue-link">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

const EmptyCart = () => {
  return (
    <>
      <SEO
        title="Empty Cart - ChecklistPro"
        description="Your cart is empty. Browse our professional checklists to get started."
        noIndex={true}
      />

      <div className="empty-cart-page">
        <div className="container">
          <motion.div
            className="empty-cart-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="empty-cart-icon">🛒</div>
            <h1>Your cart is empty</h1>
            <p>Start building your business success with our professional checklists</p>
            
            <div className="empty-cart-actions">
              <Link to="/products" className="btn-primary">
                Browse Checklists
              </Link>
              <Link to="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>

            <div className="popular-suggestions">
              <h3>Popular Checklists</h3>
              <div className="suggestions-grid">
                <Link to="/products/food-truck-startup" className="suggestion-card">
                  <span className="suggestion-icon">🚚</span>
                  <span className="suggestion-name">Food Truck Startup</span>
                  <span className="suggestion-price">$97</span>
                </Link>
                <Link to="/products/therapy-practice" className="suggestion-card">
                  <span className="suggestion-icon">🏥</span>
                  <span className="suggestion-name">Therapy Practice</span>
                  <span className="suggestion-price">$147</span>
                </Link>
                <Link to="/products/podcast-production" className="suggestion-card">
                  <span className="suggestion-icon">🎙️</span>
                  <span className="suggestion-name">Podcast Production</span>
                  <span className="suggestion-price">$67</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
