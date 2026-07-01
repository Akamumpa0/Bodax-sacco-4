import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import DataTable from '../../components/DataTable.jsx';
import { Panel } from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import LoadingSpinner, { ErrorState } from '../../components/LoadingSpinner.jsx';
import api from '../../api/client.js';
import { money, shortDate } from '../../utils/format.js';

export default function ConfirmLoans() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [modal, setModal] = useState(null); // { row, action }

  async function load() {
    setLoading(true);
    setFetchError('');
    try {
      const params = filter ? `?status=${filter}` : '';
      const { data } = await api.get(`/loans/requests${params}`);
      setRequests(data);
    } catch {
      setFetchError('Failed to load loan requests. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filter]);

  function promptReview(row, action) {
    setModal({ row, action });
  }

  async function confirmReview() {
    const { row, action } = modal;
    setModal(null);
    await api.patch(`/loans/requests/${row.id}/review`, { action });
    load();
  }

  const modalRow = modal?.row;
  const modalAction = modal?.action;

  return (
    <div className="page-stack">
      <h1>Confirm loans</h1>
      <Panel title="Loan requests">
        <div className="row-actions" style={{ marginBottom: '16px' }}>
          {['pending', 'approved', 'rejected', ''].map((status) => (
            <Button
              key={status || 'all'}
              variant={filter === status ? 'primary' : 'secondary'}
              onClick={() => setFilter(status)}
            >
              {status || 'All'}
            </Button>
          ))}
        </div>

        {loading && <LoadingSpinner text="Loading loan requests..." />}
        {fetchError && <ErrorState message={fetchError} onRetry={load} />}

        {!loading && !fetchError && (
          <>
            {/* ── Side-by-side loan review for pending requests ── */}
            {filter === 'pending' && requests.length > 0 && (
              <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                {requests.map((row) => (
                  <div key={row.id} style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '20px', background: '#fff' }}>
                    <div className="loan-review-grid" style={{ marginBottom: '16px' }}>
                      <dl className="loan-review-card">
                        <dt>Member name</dt>
                        <dd>{row.full_name || '—'}</dd>
                      </dl>
                      <dl className="loan-review-card">
                        <dt>Member number</dt>
                        <dd>{row.member_number || '—'}</dd>
                      </dl>
                      <dl className="loan-review-card">
                        <dt>Requested amount</dt>
                        <dd>{money(row.requested_amount)}</dd>
                      </dl>
                      <dl className="loan-review-card" style={{ background: row.eligibility_status === 'eligible' ? 'var(--success-light)' : 'var(--danger-light)', borderColor: row.eligibility_status === 'eligible' ? '#a7f3d0' : '#fecaca' }}>
                        <dt>Confirmed savings</dt>
                        <dd>{money(row.total_savings || 0)}</dd>
                      </dl>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <StatusBadge status={row.eligibility_status} />
                      {row.eligibility_reason && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{row.eligibility_reason}</span>
                      )}
                      <div className="row-actions" style={{ marginLeft: 'auto' }}>
                        <Button
                          variant="secondary"
                          disabled={row.eligibility_status !== 'eligible'}
                          onClick={() => promptReview(row, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button variant="danger" onClick={() => promptReview(row, 'reject')}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Standard table for non-pending filters ── */}
            {filter !== 'pending' && (
              <DataTable
                rows={requests}
                columns={[
                  { key: 'full_name', label: 'Member' },
                  { key: 'member_number', label: 'Member No.' },
                  { key: 'requested_amount', label: 'Amount', render: (row) => money(row.requested_amount) },
                  { key: 'purpose', label: 'Purpose', render: (row) => row.purpose || '-' },
                  { key: 'due_date', label: 'Due date', render: (row) => shortDate(row.due_date) },
                  {
                    key: 'eligibility_status',
                    label: 'Eligibility',
                    render: (row) => (
                      <span title={row.eligibility_reason}>
                        <StatusBadge status={row.eligibility_status} />
                      </span>
                    ),
                  },
                  { key: 'requested_at', label: 'Requested', render: (row) => shortDate(row.requested_at) },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
                ]}
              />
            )}

            {filter === 'pending' && requests.length === 0 && (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>No pending loan requests.</p>
            )}
          </>
        )}
      </Panel>

      <ConfirmModal
        open={!!modal}
        title={`Confirm: ${modalAction === 'approve' ? 'Approve' : 'Reject'} Loan Request`}
        rows={[
          { label: 'Member name', value: modalRow?.full_name },
          { label: 'Member number', value: modalRow?.member_number },
          { label: 'Requested amount', value: modalRow ? money(modalRow.requested_amount) : '' },
          { label: 'Action', value: modalAction === 'approve' ? 'Approve loan request' : 'Reject loan request' },
        ]}
        confirmLabel={modalAction === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={modalAction === 'approve' ? 'primary' : 'danger'}
        onConfirm={confirmReview}
        onCancel={() => setModal(null)}
      />
    </div>
  );
}
