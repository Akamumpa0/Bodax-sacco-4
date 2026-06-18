import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import DataTable from '../../components/DataTable.jsx';
import { Panel } from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/client.js';
import { money, shortDate } from '../../utils/format.js';

export default function Withdrawals() {
  const [requests, setRequests] = useState([]);

  async function load() {
    const { data } = await api.get('/withdrawals/requests');
    setRequests(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function review(id, action) {
    await api.patch(`/withdrawals/requests/${id}/review`, { action });
    load();
  }

  return (
    <div className="page-stack">
      <h1>Withdrawals</h1>
      <Panel title="Withdrawal requests">
        <DataTable
          rows={requests}
          columns={[
            { key: 'full_name', label: 'Member' },
            { key: 'amount', label: 'Amount', render: (row) => money(row.amount) },
            { key: 'requested_at', label: 'Requested', render: (row) => shortDate(row.requested_at) },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            {
              key: 'actions',
              label: 'Action',
              render: (row) =>
                row.status === 'pending' ? (
                  <div className="row-actions">
                    <Button variant="secondary" onClick={() => review(row.id, 'approve')}>Approve</Button>
                    <Button variant="danger" onClick={() => review(row.id, 'reject')}>Reject</Button>
                  </div>
                ) : '-',
            },
          ]}
        />
      </Panel>
    </div>
  );
}
