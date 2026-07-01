/**
 * ConfirmModal – reusable confirmation modal for financial actions.
 * Shows member name, member number, amount, and the action to be taken.
 * Caller provides onConfirm and onCancel callbacks.
 */
export default function ConfirmModal({ open, title, rows, onConfirm, onCancel, confirmLabel = 'Confirm', confirmVariant = 'primary' }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <h2 id="modal-title" className="modal-title">{title}</h2>
        <dl className="modal-details">
          {rows.map(({ label, value }) => (
            value != null && value !== '' ? (
              <div key={label} className="modal-detail-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ) : null
          ))}
        </dl>
        <p className="modal-warning">Please review the details above before confirming. This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className={`btn btn-${confirmVariant}`} onClick={onConfirm} type="button">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
