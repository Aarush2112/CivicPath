import React from 'react';
import PropTypes from 'prop-types';

/**
 * Root Error Boundary to catch app-wide crashes
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('CivicPath crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px', 
          fontFamily: 'var(--font-main), sans-serif', 
          textAlign: 'center',
          background: 'var(--background)',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h2 style={{ color: 'var(--primary)' }}>Something went wrong loading CivicPath</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            A runtime error occurred. Please check the details below.
          </p>
          <pre style={{
            color: 'var(--error)', 
            fontSize: '12px', 
            textAlign: 'left', 
            maxWidth: '600px', 
            margin: '20px auto',
            background: '#fff',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            overflowX: 'auto'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Reload CivicPath
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default ErrorBoundary;
