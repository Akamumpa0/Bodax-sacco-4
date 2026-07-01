import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import DataTable from '../../components/DataTable.jsx';
import { Panel } from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import LoadingSpinner, { ErrorState } from '../../components/LoadingSpinner.jsx';
import api from '../../api/client.js';
import { money, shortDate } from '../../utils/format.js';

export default function Withdrawals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [modal, setModal] = useState(null); // { row, action }

  async function load() {
    setLoading(true);
    setFetchError('');
    try {
      const { data } = await api.get('/withdrawals/requests');
      setRequests(data);
    } catch {
      setFetchError('Failed to load withdrawal requests. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function promptReview(row, action) {
    setModal({ row, action });
  }

  async function confirmReview() {
    const { row, action } = modal;
    setModal(null);
    await api.patch(`/withdrawals/requests/${row.id}/review`, { action });
    load();
  }

  const modalRow = modal?.row;
  const modalAction = modal?.action;

  return (
    <div className="page-stack">
      <h1>Withdrawals</h1>
      <Panel title="Withdrawal requests">
        {loading && <LoadingSpinner text="Loading withdrawal requests..." />}
        {fetchError && <ErrorState message={fetchError} onRetry={load} />}
        {!loading && !fetchError && (
          <DataTable
            rows={requests}
            columns={[
              { key: 'full_name', label: 'Member' },
              { key: 'member_number', label: 'Member No.' },
              { key: 'amount', label: 'Amount', render: (row) => money(row.amount) },
              { key: 'requested_at', label: 'Requested', render: (row) => shortDate(row.requested_at) },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
              {
                key: 'actions',
                label: 'Action',
                render: (row) =>
                  row.status === 'pending' ? (
                    <div className="row-actions">
                      <Button variant="secondary" onClick={() => promptReview(row, 'approve')}>Approve</Button>
                      <Button variant="danger" onClick={() => promptReview(row, 'reject')}>Reject</Button>
                    </div>
                  ) : '-',
              },
            ]}
          />
        )}
      </Panel>

      <ConfirmModal
        open={!!modal}
        title={`Confirm: ${modalAction === 'approve' ? 'Approve' : 'Reject'} Withdrawal`}
        rows={[
          { label: 'Member name', value: modalRow?.full_name },
          { label: 'Member number', value: modalRow?.member_number },
          { label: 'Requested amount', value: modalRow ? money(modalRow.amount) : '' },
          { label: 'Action', value: modalAction === 'approve' ? 'Approve withdrawal' : 'Reject withdrawal' },
        ]}
        confirmLabel={modalAction === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={modalAction === 'approve' ? 'primary' : 'danger'}
        onConfirm={confirmReview}
        onCancel={() => setModal(null)}
      />
    </div>
  );
}
