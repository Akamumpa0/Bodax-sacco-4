/**
 * LoadingSpinner – displayed when a data fetch takes longer than 1 second.
 * Pass size="sm" for inline use, default is full-panel.
 */
export default function LoadingSpinner({ text = 'Loading...', size = 'default' }) {
  return (
    <div className={`spinner-wrap ${size === 'sm' ? 'spinner-sm' : ''}`}>
      <div className="spinner" aria-label="Loading" role="status" />
      <span className="spinner-text">{text}</span>
    </div>
  );
}

/**
 * ErrorState – displayed when a request fails. Shows a Retry button.
 */
export function ErrorState({ message = 'Failed to load data.', onRetry }) {
  return (
    <div className="error-state">
      <span className="error-state-icon">⚠️</span>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry} type="button">
          Retry
        </button>
      )}
    </div>
  );
}
