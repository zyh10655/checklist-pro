// ========================================
// FRONTEND - src/pages/ContactPage.js
// ========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { supportAPI } from '../services/api';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      await supportAPI.sendContactForm(data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us - ChecklistPro"
        description="Get in touch with the ChecklistPro team. We're here to help with any questions about our professional checklists."
        keywords="contact checklistpro, customer support, help, business questions"
      />

      <div className="contact-page">
        {/* Header */}
        <section className="contact-header">
          <div className="container">
            <motion.div
              className="header-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1>Contact Us</h1>
              <p>We're here to help! Get in touch with any questions or feedback.</p>
            </motion.div>
          </div>
        </section>

        <div className="container">
          <div className="contact-layout">
            {/* Contact Form */}
            <motion.div
              className="contact-form-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2>Send us a message</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      {...register('firstName', { required: 'First name is required' })}
                    />
                    {errors.firstName && (
                      <span className="error-message">{errors.firstName.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      {...register('lastName', { required: 'Last name is required' })}
                    />
                    {errors.lastName && (
                      <span className="error-message">{errors.lastName.message}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    className={`form-input ${errors.subject ? 'error' : ''}`}
                    {...register('subject', { required: 'Please select a subject' })}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Question</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="product">Product Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                  {errors.subject && (
                    <span className="error-message">{errors.subject.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    className={`form-input ${errors.message ? 'error' : ''}`}
                    placeholder="Tell us how we can help..."
                    {...register('message', { 
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters'
                      }
                    })}
                  />
                  {errors.message && (
                    <span className="error-message">{errors.message.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="small" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="contact-info-section"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2>Get in touch</h2>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">📧</div>
                  <div className="method-info">
                    <h3>Email</h3>
                    <p>support@checklistpro.com</p>
                    <span>We'll respond within 24 hours</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">💬</div>
                  <div className="method-info">
                    <h3>Live Chat</h3>
                    <p>Available 9 AM - 5 PM EST</p>
                    <span>Monday through Friday</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">📚</div>
                  <div className="method-info">
                    <h3>Help Center</h3>
                    <p>Browse our FAQ and guides</p>
                    <a href="/help">Visit Help Center →</a>
                  </div>
                </div>
              </div>

              <div className="response-time">
                <h3>Response Times</h3>
                <ul>
                  <li>General inquiries: Within 24 hours</li>
                  <li>Technical support: Within 12 hours</li>
                  <li>Billing questions: Within 6 hours</li>
                  <li>Urgent issues: Within 2 hours</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="contact-faq">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              {[
                {
                  question: "How do I download my purchased checklists?",
                  answer: "After purchase, you'll receive an email with download links. You can also access your downloads from your account dashboard."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "Yes! We offer a 30-day money-back guarantee if you're not completely satisfied with your purchase."
                },
                {
                  question: "Can I customize the checklists for my business?",
                  answer: "Absolutely! Our checklists are designed to be customizable. You can modify them to fit your specific business needs."
                },
                {
                  question: "Do you offer bulk pricing for teams?",
                  answer: "Yes, we have special pricing for teams and organizations. Contact us for a custom quote."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="faq-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4>{faq.question}</h4>
                  <p>{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
