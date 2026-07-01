import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import DataTable from '../../components/DataTable.jsx';
import FormField from '../../components/FormField.jsx';
import { Panel } from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import LoadingSpinner, { ErrorState } from '../../components/LoadingSpinner.jsx';
import api from '../../api/client.js';
import { money, shortDate } from '../../utils/format.js';

function stripCommas(value) {
  return String(value).replace(/,/g, '');
}

export default function TreasurerLoans() {
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Issue loan form
  const [loanForm, setLoanForm] = useState({
    member_id: '',
    principal: '',
    interest_rate: 10,
    installment_count: 4,
    due_date: '',
  });
  const [loanErrors, setLoanErrors] = useState({});
  const [issueModal, setIssueModal] = useState(false);

  // Repayment form
  const [repayment, setRepayment] = useState({ loan_id: '', amount: '' });
  const [repayErrors, setRepayErrors] = useState({});
  const [repayModal, setRepayModal] = useState(false);

  async function load() {
    setLoading(true);
    setFetchError('');
    try {
      const [memberResult, loanResult] = await Promise.all([
        api.get('/members?limit=100'),
        api.get('/loans'),
      ]);
      setMembers(memberResult.data.data);
      setLoans(loanResult.data);
    } catch {
      setFetchError('Failed to load data. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Pre-fill repayment amount when a loan is selected
  function handleLoanSelect(loanId) {
    const selected = loans.find((l) => String(l.id) === String(loanId));
    setRepayment({
      loan_id: loanId,
      amount: selected ? String(selected.remaining_balance) : '',
    });
    setRepayErrors({});
  }

  // ─── Issue loan ───────────────────────────────────────────────────────────
  function validateIssue() {
    const errs = {};
    if (!loanForm.member_id) errs.member_id = 'Select a member before continuing.';
    const cleanPrincipal = stripCommas(loanForm.principal);
    if (!cleanPrincipal || isNaN(Number(cleanPrincipal)) || Number(cleanPrincipal) <= 0) {
      errs.principal = 'Enter a valid loan amount in UGX, e.g. 500,000.';
    }
    if (!loanForm.due_date) errs.due_date = 'Select the loan due date.';
    return errs;
  }

  function openIssueModal(event) {
    event.preventDefault();
    const errs = validateIssue();
    if (Object.keys(errs).length) { setLoanErrors(errs); return; }
    setLoanErrors({});
    setIssueModal(true);
  }

  async function confirmIssue() {
    setIssueModal(false);
    const cleanPrincipal = stripCommas(loanForm.principal);
    await api.post('/loans', { ...loanForm, principal: cleanPrincipal });
    setLoanForm({ member_id: '', principal: '', interest_rate: 10, installment_count: 4, due_date: '' });
    load();
  }

  // ─── Record repayment ─────────────────────────────────────────────────────
  function validateRepay() {
    const errs = {};
    if (!repayment.loan_id) errs.loan_id = 'Select a loan before continuing.';
    const cleanAmount = stripCommas(repayment.amount);
    if (!cleanAmount || isNaN(Number(cleanAmount)) || Number(cleanAmount) <= 0) {
      errs.amount = 'Enter a valid repayment amount in UGX, e.g. 50,000.';
    }
    return errs;
  }

  function openRepayModal(event) {
    event.preventDefault();
    const errs = validateRepay();
    if (Object.keys(errs).length) { setRepayErrors(errs); return; }
    setRepayErrors({});
    setRepayModal(true);
  }

  async function confirmRepay() {
    setRepayModal(false);
    const cleanAmount = stripCommas(repayment.amount);
    await api.post('/loans/repayments', { ...repayment, amount: cleanAmount });
    setRepayment({ loan_id: '', amount: '' });
    load();
  }

  const selectedIssueMember = members.find((m) => String(m.id) === String(loanForm.member_id));
  const selectedRepayLoan = loans.find((l) => String(l.id) === String(repayment.loan_id));

  if (loading) return <div className="page-stack"><h1>Loans</h1><LoadingSpinner text="Loading loan data..." /></div>;
  if (fetchError) return <div className="page-stack"><h1>Loans</h1><ErrorState message={fetchError} onRetry={load} /></div>;

  return (
    <div className="page-stack">
      <h1>Loans</h1>

      {/* ── Issue loan ── */}
      <Panel title="Issue loan">
        <form className="form-grid" onSubmit={openIssueModal}>
          <label className="field">
            <span>Member</span>
            <select
              value={loanForm.member_id}
              onChange={(e) => setLoanForm({ ...loanForm, member_id: e.target.value })}
              required
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name} – {member.member_number}
                </option>
              ))}
            </select>
            {loanErrors.member_id && <small>{loanErrors.member_id}</small>}
          </label>
          <div>
            <FormField
              label="Amount borrowed (UGX)"
              type="text"
              inputMode="numeric"
              value={loanForm.principal}
              onChange={(e) => setLoanForm({ ...loanForm, principal: e.target.value })}
              placeholder="e.g. 500,000"
              required
            />
            {loanErrors.principal && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{loanErrors.principal}</small>}
          </div>
          <FormField
            label="Interest %"
            type="number"
            value={loanForm.interest_rate}
            onChange={(e) => setLoanForm({ ...loanForm, interest_rate: e.target.value })}
          />
          <FormField
            label="Number of payments"
            type="number"
            value={loanForm.installment_count}
            onChange={(e) => setLoanForm({ ...loanForm, installment_count: e.target.value })}
          />
          <div>
            <FormField
              label="Due date"
              type="date"
              value={loanForm.due_date}
              onChange={(e) => setLoanForm({ ...loanForm, due_date: e.target.value })}
              required
            />
            {loanErrors.due_date && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{loanErrors.due_date}</small>}
          </div>
          <Button>Issue loan</Button>
        </form>
      </Panel>

      {/* ── Record repayment ── */}
      <Panel title="Record repayment">
        <form className="form-grid" onSubmit={openRepayModal}>
          <label className="field">
            <span>Loan</span>
            <select
              value={repayment.loan_id}
              onChange={(e) => handleLoanSelect(e.target.value)}
              required
            >
              <option value="">Select loan</option>
              {loans.filter((loan) => loan.status !== 'completed').map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.full_name} – balance {money(loan.remaining_balance)} – due {shortDate(loan.due_date)}
                </option>
              ))}
            </select>
            {repayErrors.loan_id && <small>{repayErrors.loan_id}</small>}
          </label>
          <div>
            <FormField
              label="Repayment amount (UGX)"
              type="text"
              inputMode="numeric"
              value={repayment.amount}
              onChange={(e) => setRepayment({ ...repayment, amount: e.target.value })}
              placeholder="Pre-filled from remaining balance"
            />
            {repayErrors.amount && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{repayErrors.amount}</small>}
            {selectedRepayLoan && (
              <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--muted)' }}>
                Remaining balance: <strong>{money(selectedRepayLoan.remaining_balance)}</strong> · Next due: <strong>{shortDate(selectedRepayLoan.due_date)}</strong>
              </p>
            )}
          </div>
          <Button>Record repayment</Button>
        </form>
      </Panel>

      {/* ── Loan book ── */}
      <Panel title="Loan book">
        <DataTable
          rows={loans}
          columns={[
            { key: 'full_name', label: 'Member' },
            { key: 'member_number', label: 'Member No.' },
            { key: 'principal', label: 'Amount borrowed', render: (row) => money(row.principal) },
            { key: 'remaining_balance', label: 'Balance', render: (row) => money(row.remaining_balance) },
            { key: 'installment_amount', label: 'Payment', render: (row) => money(row.installment_amount) },
            { key: 'due_date', label: 'Due', render: (row) => shortDate(row.due_date) },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
        />
      </Panel>

      {/* ── Issue Loan Modal ── */}
      <ConfirmModal
        open={issueModal}
        title="Confirm: Issue Loan"
        rows={[
          { label: 'Member name', value: selectedIssueMember?.full_name },
          { label: 'Member number', value: selectedIssueMember?.member_number },
          { label: 'Amount borrowed', value: money(stripCommas(loanForm.principal)) },
          { label: 'Interest rate', value: `${loanForm.interest_rate}%` },
          { label: 'Number of payments', value: loanForm.installment_count },
          { label: 'Due date', value: shortDate(loanForm.due_date) },
          { label: 'Action', value: 'Issue loan to member' },
        ]}
        confirmLabel="Issue loan"
        onConfirm={confirmIssue}
        onCancel={() => setIssueModal(false)}
      />

      {/* ── Repayment Modal ── */}
      <ConfirmModal
        open={repayModal}
        title="Confirm: Record Repayment"
        rows={[
          { label: 'Member name', value: selectedRepayLoan?.full_name },
          { label: 'Member number', value: selectedRepayLoan?.member_number },
          { label: 'Amount', value: money(stripCommas(repayment.amount)) },
          { label: 'Remaining balance', value: selectedRepayLoan ? money(selectedRepayLoan.remaining_balance) : '' },
          { label: 'Action', value: 'Record loan repayment' },
        ]}
        confirmLabel="Record repayment"
        onConfirm={confirmRepay}
        onCancel={() => setRepayModal(false)}
      />
    </div>
  );
}
