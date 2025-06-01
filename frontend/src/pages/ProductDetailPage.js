// ========================================
// FRONTEND - src/pages/ProductDetailPage.js
// ========================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useApp } from '../contexts/AppContext';
import { productsAPI } from '../services/api';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useApp();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Load product data
  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsAPI.getProduct(slug);
      setProduct(response.product);
      
      // Track product view
      await productsAPI.trackView(response.product.id);
      
      // Load related products
      if (response.product.category) {
        loadRelatedProducts(response.product.category, response.product.id);
      }
      
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to load product details');
      }
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (categoryId, currentProductId) => {
    try {
      const response = await productsAPI.getProducts({ 
        category: categoryId, 
        limit: 4 
      });
      
      // Filter out current product
      const filtered = response.products.filter(p => p.id !== currentProductId);
      setRelatedProducts(filtered.slice(0, 3));
    } catch (err) {
      console.error('Error loading related products:', err);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, selectedQuantity);
    
    // Show success message with action
    toast.success(
      <div>
        Added to cart! 
        <button 
          onClick={() => navigate('/cart')}
          style={{ marginLeft: '10px', textDecoration: 'underline' }}
        >
          View Cart
        </button>
      </div>,
      { duration: 4000 }
    );
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    addToCart(product, selectedQuantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="container">
          <LoadingSpinner size="large" />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <div className="container">
          <div className="error-content">
            <h1>Product Not Found</h1>
            <p>{error || 'The product you\'re looking for doesn\'t exist.'}</p>
            <div className="error-actions">
              <Link to="/products" className="btn-primary">
                Browse Products
              </Link>
              <Link to="/" className="btn-secondary">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <SEO
        title={`${product.name} - ChecklistPro`}
        description={product.description}
        keywords={product.tags?.join(', ') || ''}
        image={product.images?.[0]?.url}
        type="product"
        structured={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": product.images?.[0]?.url,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": product.rating?.average > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating.average,
            "reviewCount": product.rating.count
          } : undefined
        }}
      />

      <div className="product-detail-page">
        {/* Breadcrumbs */}
        <Breadcrumbs product={product} />

        <div className="container">
          <div className="product-detail-layout">
            {/* Product Images */}
            <ProductImages product={product} />

            {/* Product Info */}
            <ProductInfo 
              product={product}
              discount={discount}
              selectedQuantity={selectedQuantity}
              onQuantityChange={setSelectedQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>

          {/* Product Details Tabs */}
          <ProductTabs 
            product={product}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </div>
      </div>
    </>
  );
};

// Breadcrumbs Component
const Breadcrumbs = ({ product }) => {
  return (
    <nav className="breadcrumbs">
      <div className="container">
        <ol className="breadcrumb-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          {product.category && (
            <li>
              <Link to={`/products?category=${product.category.id}`}>
                {product.category.name}
              </Link>
            </li>
          )}
          <li className="current">{product.name}</li>
        </ol>
      </div>
    </nav>
  );
};

// Product Images Component
const ProductImages = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: '/images/placeholder-product.jpg', alt: product.name }];

  return (
    <div className="product-images">
      <div className="main-image">
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="image-container"
        >
          {images[selectedImage]?.url ? (
            <img 
              src={images[selectedImage].url} 
              alt={images[selectedImage].alt || product.name}
            />
          ) : (
            <div className="placeholder-image">
              <span className="placeholder-icon">📋</span>
              <span className="placeholder-text">{product.name}</span>
            </div>
          )}
        </motion.div>

        {/* Image badges */}
        <div className="image-badges">
          {product.isPopular && (
            <span className="badge popular">Popular</span>
          )}
          {product.isNew && (
            <span className="badge new">New</span>
          )}
        </div>
      </div>

      {/* Thumbnail images */}
      {images.length > 1 && (
        <div className="thumbnail-images">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={image.url} alt={image.alt || `${product.name} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Product Info Component
const ProductInfo = ({ 
  product, 
  discount, 
  selectedQuantity, 
  onQuantityChange, 
  onAddToCart, 
  onBuyNow 
}) => {
  return (
    <div className="product-info">
      <div className="product-header">
        <h1>{product.name}</h1>
        
        {/* Rating */}
        {product.rating?.average > 0 && (
          <div className="product-rating">
            <div className="stars">
              {'★'.repeat(Math.floor(product.rating.average))}
              {'☆'.repeat(5 - Math.floor(product.rating.average))}
            </div>
            <span className="rating-text">
              {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
            </span>
          </div>
        )}

        {/* Download count */}
        {product.downloads > 0 && (
          <div className="download-count">
            {product.downloads.toLocaleString()} downloads
          </div>
        )}
      </div>

      {/* Description */}
      <div className="product-description">
        <p>{product.description}</p>
        {product.longDescription && (
          <div className="long-description">
            <p>{product.longDescription}</p>
          </div>
        )}
      </div>

      {/* Key Features */}
      {product.features && product.features.length > 0 && (
        <div className="key-features">
          <h3>What's Included:</h3>
          <ul>
            {product.features.map((feature, index) => (
              <li key={index}>
                <span className="feature-icon">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pricing */}
      <div className="product-pricing">
        <div className="price-display">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">${product.originalPrice}</span>
          )}
          <span className="current-price">${product.price}</span>
          {discount > 0 && (
            <span className="discount-badge">Save {discount}%</span>
          )}
        </div>
        
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="savings">
            You save ${(product.originalPrice - product.price).toFixed(2)}
          </div>
        )}
      </div>

      {/* Purchase Options */}
      <div className="purchase-options">
        <div className="quantity-selector">
          <label>Quantity:</label>
          <div className="quantity-controls">
            <button 
              onClick={() => onQuantityChange(Math.max(1, selectedQuantity - 1))}
              disabled={selectedQuantity <= 1}
            >
              -
            </button>
            <span className="quantity-value">{selectedQuantity}</span>
            <button 
              onClick={() => onQuantityChange(selectedQuantity + 1)}
              disabled={selectedQuantity >= 10}
            >
              +
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={onAddToCart}
            className="btn-secondary add-to-cart"
          >
            Add to Cart
          </button>
          <button 
            onClick={onBuyNow}
            className="btn-primary buy-now"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Product guarantees */}
      <div className="product-guarantees">
        <div className="guarantee">
          <span className="guarantee-icon">⬇️</span>
          <span>Instant Download</span>
        </div>
        <div className="guarantee">
          <span className="guarantee-icon">🔄</span>
          <span>Lifetime Updates</span>
        </div>
        <div className="guarantee">
          <span className="guarantee-icon">🛡️</span>
          <span>30-Day Guarantee</span>
        </div>
        <div className="guarantee">
          <span className="guarantee-icon">💬</span>
          <span>Email Support</span>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="product-tags">
          <h4>Tags:</h4>
          <div className="tags-list">
            {product.tags.map((tag, index) => (
              <Link 
                key={index} 
                to={`/products?search=${tag}`}
                className="tag"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Product Tabs Component
const ProductTabs = ({ product, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${product.rating?.count || 0})` }
  ];

  return (
    <div className="product-tabs">
      <div className="tab-headers">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-header ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <OverviewTab product={product} />}
          {activeTab === 'features' && <FeaturesTab product={product} />}
          {activeTab === 'specifications' && <SpecificationsTab product={product} />}
          {activeTab === 'reviews' && <ReviewsTab product={product} />}
        </motion.div>
      </div>
    </div>
  );
};

// Tab Content Components
const OverviewTab = ({ product }) => (
  <div className="overview-tab">
    <h3>About This Checklist</h3>
    <p>{product.longDescription || product.description}</p>
    
    {product.author && (
      <div className="author-info">
        <h4>Created By</h4>
        <div className="author-card">
          {product.author.avatar && (
            <img src={product.author.avatar} alt={product.author.name} />
          )}
          <div>
            <h5>{product.author.name}</h5>
            <p>{product.author.bio}</p>
            {product.author.credentials && (
              <div className="credentials">
                {product.author.credentials.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);

const FeaturesTab = ({ product }) => (
  <div className="features-tab">
    <h3>What You'll Get</h3>
    {product.features && product.features.length > 0 ? (
      <ul className="features-list">
        {product.features.map((feature, index) => (
          <li key={index}>
            <span className="feature-icon">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    ) : (
      <p>Feature details coming soon.</p>
    )}
  </div>
);

const SpecificationsTab = ({ product }) => (
  <div className="specifications-tab">
    <h3>Specifications</h3>
    <div className="spec-grid">
      {product.specifications?.fileFormat && (
        <div className="spec-item">
          <span className="spec-label">File Format:</span>
          <span className="spec-value">{product.specifications.fileFormat.join(', ')}</span>
        </div>
      )}
      {product.specifications?.pageCount && (
        <div className="spec-item">
          <span className="spec-label">Pages:</span>
          <span className="spec-value">{product.specifications.pageCount}</span>
        </div>
      )}
      {product.specifications?.fileSize && (
        <div className="spec-item">
          <span className="spec-label">File Size:</span>
          <span className="spec-value">{product.specifications.fileSize}</span>
        </div>
      )}
      {product.specifications?.language && (
        <div className="spec-item">
          <span className="spec-label">Language:</span>
          <span className="spec-value">{product.specifications.language}</span>
        </div>
      )}
      {product.specifications?.lastUpdated && (
        <div className="spec-item">
          <span className="spec-label">Last Updated:</span>
          <span className="spec-value">
            {new Date(product.specifications.lastUpdated).toLocaleDateString()}
          </span>
        </div>
      )}
      {product.specifications?.version && (
        <div className="spec-item">
          <span className="spec-label">Version:</span>
          <span className="spec-value">{product.specifications.version}</span>
        </div>
      )}
    </div>
  </div>
);

const ReviewsTab = ({ product }) => (
  <div className="reviews-tab">
    <h3>Customer Reviews</h3>
    {product.rating?.count > 0 ? (
      <div className="reviews-summary">
        <div className="rating-overview">
          <div className="overall-rating">
            <span className="rating-number">{product.rating.average.toFixed(1)}</span>
            <div className="stars">
              {'★'.repeat(Math.floor(product.rating.average))}
              {'☆'.repeat(5 - Math.floor(product.rating.average))}
            </div>
            <span className="review-count">
              Based on {product.rating.count} reviews
            </span>
          </div>
          
          {product.rating.distribution && (
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating}★</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ 
                        width: `${(product.rating.distribution[rating === 1 ? 'one' : rating === 2 ? 'two' : rating === 3 ? 'three' : rating === 4 ? 'four' : 'five'] / product.rating.count) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="rating-count">
                    {product.rating.distribution[rating === 1 ? 'one' : rating === 2 ? 'two' : rating === 3 ? 'three' : rating === 4 ? 'four' : 'five']}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="review-prompt">
          <p>Reviews will be displayed here once the review system is implemented.</p>
        </div>
      </div>
    ) : (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    )}
  </div>
);

// Related Products Component
const RelatedProducts = ({ products }) => {
  const { addToCart } = useApp();

  return (
    <section className="related-products">
      <h2>You Might Also Like</h2>
      <div className="related-products-grid">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="related-product-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={`/products/${product.slug}`} className="product-link">
              <div className="product-image">
                <span className="product-icon">📋</span>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-price">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="original-price">${product.originalPrice}</span>
                  )}
                  <span className="current-price">${product.price}</span>
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="btn-primary add-to-cart-btn"
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductDetailPage;