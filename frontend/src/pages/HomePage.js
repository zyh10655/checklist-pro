// ========================================
// FRONTEND - src/pages/HomePage.js
// ========================================

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { useApp } from '../contexts/AppContext';

const HomePage = () => {
  const { featuredProducts, loadFeaturedProducts } = useApp();

  useEffect(() => {
    loadFeaturedProducts();
  }, [loadFeaturedProducts]);

  return (
    <>
      <SEO
        title="Professional Industry Checklists - ChecklistPro"
        description="Save time, avoid costly mistakes, and ensure thoroughness with our expert-level checklist packages designed for niche industries."
        keywords="business checklists, industry guides, professional templates, startup resources"
      />

      <div className="homepage">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Featured Products */}
        <FeaturedProductsSection products={featuredProducts} />
        
        {/* How It Works */}
        <HowItWorksSection />
        
        {/* Testimonials */}
        <TestimonialsSection />
        
        {/* CTA Section */}
        <CTASection />
      </div>
    </>
  );
};

// Hero Section Component
const HeroSection = () => {
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-pattern"></div>
      </div>
      
      <div className="container">
        <motion.div 
          className="hero-content"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="hero-title">
            Professional Industry
            <span className="highlight"> Checklists</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="hero-description">
            Save time, avoid costly mistakes, and ensure thoroughness with our 
            expert-level checklist packages designed for niche industries
          </motion.p>
          
          <motion.div variants={itemVariants} className="hero-stats">
            <div className="stat">
              <span className="stat-number">20+</span>
              <span className="stat-label">Hours Saved</span>
            </div>
            <div className="stat">
              <span className="stat-number">97%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="hero-actions">
            <Link to="/products" className="btn-primary hero-cta">
              Browse Checklists
            </Link>
            <button className="btn-secondary" onClick={() => {
              document.getElementById('how-it-works').scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}>
              How It Works
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: '⏰',
      title: 'Save 20+ Hours',
      description: 'Skip the research phase with our comprehensive, ready-to-use checklists created by industry experts'
    },
    {
      icon: '🛡️',
      title: 'Avoid Costly Mistakes',
      description: 'Our expert-reviewed checklists help you sidestep the 7 most expensive errors in your industry'
    },
    {
      icon: '👨‍💼',
      title: 'Expert Guidance',
      description: 'Created and reviewed by industry professionals with years of real-world experience'
    },
    {
      icon: '🚀',
      title: 'Start Immediately',
      description: 'Download and start using today with included templates, tools, and step-by-step guidance'
    },
    {
      icon: '📋',
      title: 'Comprehensive Coverage',
      description: 'Every critical step covered from initial planning to successful completion'
    },
    {
      icon: '🔄',
      title: 'Regular Updates',
      description: 'Stay current with industry changes through our quarterly checklist updates'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose ChecklistPro?</h2>
          <p>Everything you need to succeed in your industry</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Products Section
const FeaturedProductsSection = ({ products = [] }) => {
  return (
    <section className="featured-products">
      <div className="container">
        <div className="section-header">
          <h2>Popular Checklist Packages</h2>
          <p>Start with our most downloaded and highest-rated checklists</p>
        </div>
        
        {products.length > 0 ? (
          <div className="products-grid">
            {products.slice(0, 3).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="products-placeholder">
            <div className="placeholder-card"></div>
            <div className="placeholder-card"></div>
            <div className="placeholder-card"></div>
          </div>
        )}
        
        <div className="section-footer">
          <Link to="/products" className="btn-primary">
            View All Checklists
          </Link>
        </div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product, index }) => {
  const { addToCart } = useApp();

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="product-image">
        <span className="product-icon">📋</span>
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
      </div>
      
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-meta">
          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.floor(product.rating || 5))}</span>
            <span className="rating-count">({product.reviewCount || 0})</span>
          </div>
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice}</span>
            )}
            <span className="current-price">${product.price}</span>
          </div>
          
          <button
            className="btn-primary"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Choose Your Industry',
      description: 'Browse our curated collection of professional checklists organized by industry and business type'
    },
    {
      number: '2',
      title: 'Purchase & Download',
      description: 'Secure checkout with instant access. Download your complete checklist package immediately'
    },
    {
      number: '3',
      title: 'Follow the Steps',
      description: 'Work through each item systematically with included templates, tools, and expert guidance'
    },
    {
      number: '4',
      title: 'Achieve Success',
      description: 'Complete your project confidently, knowing you\'ve covered every critical detail'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in minutes with our simple 4-step process</p>
        </div>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Food Truck Owner',
      content: 'The food truck checklist saved me months of research and helped me avoid costly permit mistakes. Worth every penny!',
      rating: 5,
      image: '/images/testimonials/sarah.jpg'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Therapy Practice Owner',
      content: 'Incredibly thorough and professional. The therapy practice checklist covered everything I needed to know and more.',
      rating: 5,
      image: '/images/testimonials/michael.jpg'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Podcast Producer',
      content: 'As a beginner, this checklist gave me the confidence to start my podcast professionally from day one.',
      rating: 5,
      image: '/images/testimonials/lisa.jpg'
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p>Join thousands of successful entrepreneurs who trust ChecklistPro</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p>"{testimonial.content}"</p>
              </div>
              
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Start Your Success Story?</h2>
          <p>
            Join thousands of entrepreneurs who have transformed their businesses 
            with our professional checklist packages
          </p>
          
          <div className="cta-actions">
            <Link to="/products" className="btn-primary large">
              Browse All Checklists
            </Link>
            <Link to="/about" className="btn-secondary large">
              Learn More
            </Link>
          </div>
          
          <div className="cta-guarantee">
            <span className="guarantee-icon">🛡️</span>
            <span>30-day money-back guarantee</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePage;