import { ErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';

/**
 * Fallback component for ErrorBoundary
 */
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="card" style={{ padding: '20px', border: '1px solid var(--error)', background: '#FEF2F2' }}>
      <h3 style={{ color: '#991B1B', margin: '0 0 8px 0' }}>Something went wrong</h3>
      <p style={{ fontSize: '13px', color: '#B91C1C', marginBottom: '16px' }}>{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="btn-primary"
        style={{ background: '#DC2626' }}
      >
        Try again
      </button>
    </div>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired
};

/**
 * Higher Order Component to wrap sections with an ErrorBoundary
 */
export const withErrorBoundary = (Component, sectionName) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset state of your app so the error doesn't happen again
        console.log(`Resetting ${sectionName}`);
      }}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
  WrappedComponent.displayName = `WithErrorBoundary(${sectionName})`;
  return WrappedComponent;
};
