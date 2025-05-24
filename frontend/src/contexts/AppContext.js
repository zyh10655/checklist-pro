import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = (level = 'all') => {
    const consentData = {
      necessary: true,
      analytics: level === 'all',
      marketing: level === 'all',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setShowConsent(false);

    // Initialize analytics if accepted
    if (level === 'all' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    }
  };

  const handleReject = () => {
    const consentData = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          className="cookie-consent"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="cookie-content">
            <div className="cookie-text">
              <h4>🍪 We use cookies</h4>
              <p>
                We use cookies to enhance your experience, analyze site traffic, 
                and for marketing purposes. You can manage your preferences below.
              </p>
            </div>

            <div className="cookie-actions">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="btn-link"
              >
                Customize
              </button>
              <button
                onClick={handleReject}
                className="btn-secondary"
              >
                Necessary Only
              </button>
              <button
                onClick={() => handleAccept('all')}
                className="btn-primary"
              >
                Accept All
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                className="cookie-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cookie-categories">
                  <div className="cookie-category">
                    <div className="category-header">
                      <h5>Necessary Cookies</h5>
                      <span className="required">Required</span>
                    </div>
                    <p>Essential for the website to function properly.</p>
                  </div>

                  <div className="cookie-category">
                    <div className="category-header">
                      <h5>Analytics Cookies</h5>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Help us understand how visitors interact with our website.</p>
                  </div>

                  <div className="cookie-category">
                    <div className="category-header">
                      <h5>Marketing Cookies</h5>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <p>Used to deliver personalized advertisements.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;