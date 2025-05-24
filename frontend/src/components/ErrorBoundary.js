// ========================================
// FRONTEND - src/components/ErrorBoundary.js
// ========================================

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In production, send error to logging service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, () => this.setState({ hasError: false, error: null }));
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Oops! Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <details>
              <summary>Error details</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
            <div className="error-actions">
              <button 
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn-primary"
              >
                Try again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;