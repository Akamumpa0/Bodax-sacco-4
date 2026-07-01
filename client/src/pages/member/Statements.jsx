import { useState } from 'react';
import Button from '../../components/Button.jsx';
import DataTable from '../../components/DataTable.jsx';
import { Panel } from '../../components/Card.jsx';
import LoadingSpinner, { ErrorState } from '../../components/LoadingSpinner.jsx';
import api from '../../api/client.js';
import { money, shortDate } from '../../utils/format.js';

function defaultFrom() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().slice(0, 10);
}

/**
 * Normalise transaction type to a readable label.
 * Covers savings, loan_repayment, withdrawal variants.
 */
function typeLabel(type) {
  if (!type) return '—';
  const map = {
    savings: 'Savings',
    loan_repayment: 'Loan repayment',
    loan_repayments: 'Loan repayment',
    withdrawal: 'Withdrawal',
    withdrawals: 'Withdrawal',
  };
  return map[type.toLowerCase()] ?? type;
}

export default function MemberStatements() {
  const [from, setFrom] = useState(defaultFrom());
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadStatement(event) {
    event?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/savings/statement?from=${from}&to=${to}`);
      setRows(data);
    } catch (err) {
      setError('Failed to load statement. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function printStatement() {
    window.print();
  }

  return (
    <div className="page-stack">
      <h1>Statements</h1>
      <Panel title="Statement period">
        <form className="inline-form" onSubmit={loadStatement}>
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          <Button id="stmt-view-btn">View</Button>
          <Button type="button" variant="secondary" onClick={printStatement}>
            Print / PDF
          </Button>
        </form>
      </Panel>
      <Panel title="Statement">
        {loading && <LoadingSpinner text="Loading statement..." />}
        {error && <ErrorState message={error} onRetry={loadStatement} />}
        {!loading && !error && (
          <>
            {/* ── Desktop / tablet: standard table ── */}
            <div className="stmt-table-wrap">
              <DataTable
                rows={rows}
                columns={[
                  { key: 'type', label: 'Type', render: (row) => typeLabel(row.type) },
                  { key: 'date', label: 'Date', render: (row) => shortDate(row.date) },
                  { key: 'amount', label: 'Amount', render: (row) => money(row.amount) },
                  { key: 'notes', label: 'Notes', render: (row) => row.notes || '—' },
                ]}
              />
            </div>

            {/* ── Mobile (<480px): stacked cards, no horizontal scroll ── */}
            <div className="stmt-cards">
              {rows.length ? (
                rows.map((row, i) => (
                  <div key={row.id || i} className="stmt-card">
                    <div className="stmt-card-header">
                      <span className="stmt-card-type">{typeLabel(row.type)}</span>
                      <span className="stmt-card-amount">{money(row.amount)}</span>
                    </div>
                    <span className="stmt-card-date">{shortDate(row.date)}</span>
                    {row.notes && <span className="stmt-card-date">{row.notes}</span>}
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>
                  No transactions in this period.
                </p>
              )}
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
