import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import DataTable from '../../components/DataTable.jsx';
import FormField from '../../components/FormField.jsx';
import { Panel } from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import LoadingSpinner, { ErrorState } from '../../components/LoadingSpinner.jsx';
import api from '../../api/client.js';
import { money, shortDate } from '../../utils/format.js';

/** Strip commas and return numeric string */
function stripCommas(value) {
  return String(value).replace(/,/g, '');
}

export default function MemberLoans() {
  const [loans, setLoans] = useState([]);
  const [requests, setRequests] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [form, setForm] = useState({ requested_amount: '', purpose: '', installment_count: 4, due_date: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  async function load() {
    setLoading(true);
    setFetchError('');
    try {
      const [loanResult, requestResult, eligibilityResult] = await Promise.all([
        api.get('/loans'),
        api.get('/loans/requests'),
        api.get('/loans/eligibility'),
      ]);
      setLoans(loanResult.data);
      setRequests(requestResult.data);
      setEligibility(eligibilityResult.data);
    } catch (err) {
      setFetchError('Failed to load loan data. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function checkAmount(amount) {
    const clean = stripCommas(amount);
    if (!clean) {
      const { data } = await api.get('/loans/eligibility');
      setEligibility(data);
      return;
    }
    const { data } = await api.get(`/loans/eligibility?amount=${clean}`);
    setEligibility(data);
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    const cleanAmount = stripCommas(form.requested_amount);
    if (!cleanAmount || isNaN(Number(cleanAmount))) {
      setError('Enter a valid loan amount, e.g. 500000 or 500,000.');
      return;
    }
    if (!form.due_date) {
      setError('Select a repayment due date to continue.');
      return;
    }
    try {
      const { data } = await api.post('/loans/requests', { ...form, requested_amount: cleanAmount });
      setMessage(
        data.eligibility.eligible
          ? 'Loan request submitted. Awaiting treasurer confirmation.'
          : `Request submitted but marked ineligible: ${data.eligibility.reason}`,
      );
      setForm({ requested_amount: '', purpose: '', installment_count: 4, due_date: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit loan request. Please try again.');
    }
  }

  if (loading) return <div className="page-stack"><h1>Loans</h1><LoadingSpinner text="Loading loan data..." /></div>;
  if (fetchError) return <div className="page-stack"><h1>Loans</h1><ErrorState message={fetchError} onRetry={load} /></div>;

  return (
    <div className="page-stack">
      <h1>Loans</h1>

      <Panel title="Loan eligibility">
        {eligibility ? (
          <div className={eligibility.eligible ? 'success' : 'alert'}>
            <p>{eligibility.reason}</p>
            <p className="text-muted">
              Total savings: {money(eligibility.total_savings)} · Max eligible: {money(eligibility.max_eligible_amount)}
            </p>
          </div>
        ) : (
          <p>Checking eligibility...</p>
        )}
      </Panel>

      <Panel title="Request a loan">
        {message && <p className="success">{message}</p>}
        {error && <p className="alert">{error}</p>}
        <form className="form-grid" onSubmit={submit}>
          <FormField
            label="Amount (UGX)"
            type="text"
            inputMode="numeric"
            value={form.requested_amount}
            onChange={(e) => {
              setForm({ ...form, requested_amount: e.target.value });
              checkAmount(e.target.value);
            }}
            placeholder="e.g. 500,000"
            required
          />
          <FormField
            label="Purpose"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
          <FormField
            label="Number of payments"
            type="number"
            value={form.installment_count}
            onChange={(e) => setForm({ ...form, installment_count: e.target.value })}
          />
          <FormField
            label="Repayment due date"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            required
          />
          <Button>Submit loan request</Button>
        </form>
      </Panel>

      <Panel title="My loan requests">
        <DataTable
          rows={requests}
          columns={[
            { key: 'requested_amount', label: 'Amount', render: (row) => money(row.requested_amount) },
            { key: 'purpose', label: 'Purpose', render: (row) => row.purpose || '-' },
            { key: 'due_date', label: 'Due date', render: (row) => shortDate(row.due_date) },
            { key: 'eligibility_status', label: 'Eligibility', render: (row) => <StatusBadge status={row.eligibility_status} /> },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'requested_at', label: 'Requested', render: (row) => shortDate(row.requested_at) },
          ]}
        />
      </Panel>

      <Panel title="Current and previous loans">
        <DataTable
          rows={loans}
          columns={[
            { key: 'principal', label: 'Amount borrowed', render: (row) => money(row.principal) },
            { key: 'remaining_balance', label: 'Balance', render: (row) => money(row.remaining_balance) },
            { key: 'installment_amount', label: 'Next payment', render: (row) => money(row.installment_amount) },
            { key: 'due_date', label: 'Due', render: (row) => shortDate(row.due_date) },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
        />
      </Panel>
    </div>
  );
}
