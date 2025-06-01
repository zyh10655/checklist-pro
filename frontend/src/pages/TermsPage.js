// ========================================
// FRONTEND - src/pages/TermsPage.js
// ========================================

import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const TermsPage = () => {
  return (
    <>
      <SEO
        title="Terms of Service - ChecklistPro"
        description="Read the terms and conditions for using ChecklistPro's professional checklist services."
        keywords="terms of service, user agreement, legal terms, conditions of use"
      />

      <div className="legal-page">
        <div className="container">
          <motion.div
            className="legal-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="legal-header">
              <h1>Terms of Service</h1>
              <p className="last-updated">Last updated: January 1, 2025</p>
            </div>

            <div className="legal-sections">
              <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using ChecklistPro, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </section>

              <section>
                <h2>2. Use License</h2>
                <p>
                  Permission is granted to download one copy of ChecklistPro materials for personal, 
                  non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul>
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for commercial purposes or public display</li>
                  <li>Remove copyright or proprietary notations</li>
                  <li>Transfer materials to another person</li>
                </ul>
              </section>

              <section>
                <h2>3. Disclaimer</h2>
                <p>
                  The materials on ChecklistPro are provided on an 'as is' basis. ChecklistPro makes no warranties, 
                  expressed or implied, and hereby disclaims all other warranties including implied warranties of 
                  merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </section>

              <section>
                <h2>4. Limitations</h2>
                <p>
                  In no event shall ChecklistPro be liable for any damages arising out of the use or inability 
                  to use the materials on ChecklistPro's website.
                </p>
              </section>

              <section>
                <h2>5. Accuracy of Materials</h2>
                <p>
                  The materials appearing on ChecklistPro could include technical, typographical, or photographic errors. 
                  ChecklistPro does not warrant that any of the materials are accurate, complete, or current.
                </p>
              </section>

              <section>
                <h2>6. Modifications</h2>
                <p>
                  ChecklistPro may revise these terms of service at any time without notice. By using this site, 
                  you are agreeing to be bound by the current version of these terms.
                </p>
              </section>

              <section>
                <h2>7. Refund Policy</h2>
                <p>
                  We offer a 30-day money-back guarantee on all purchases. If you're not satisfied with your 
                  checklist package, contact us within 30 days for a full refund.
                </p>
              </section>

              <section>
                <h2>8. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at 
                  legal@checklistpro.com.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;