import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import DataTable from '../../components/DataTable.jsx';
import FormField from '../../components/FormField.jsx';
import { Panel } from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/client.js';
import { money, shortDate } from '../../utils/format.js';

export default function TreasurerLoans() {
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loanForm, setLoanForm] = useState({ member_id: '', principal: '', interest_rate: 10, installment_count: 4, due_date: '' });
  const [repayment, setRepayment] = useState({ loan_id: '', amount: '' });

  async function load() {
    const [memberResult, loanResult] = await Promise.all([api.get('/members?limit=100'), api.get('/loans')]);
    setMembers(memberResult.data.data);
    setLoans(loanResult.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function issue(event) {
    event.preventDefault();
    await api.post('/loans', loanForm);
    setLoanForm({ member_id: '', principal: '', interest_rate: 10, installment_count: 4, due_date: '' });
    load();
  }

  async function pay(event) {
    event.preventDefault();
    await api.post('/loans/repayments', repayment);
    setRepayment({ loan_id: '', amount: '' });
    load();
  }

  return (
    <div className="page-stack">
      <h1>Loans</h1>
      <Panel title="Issue loan">
        <form className="form-grid" onSubmit={issue}>
          <SelectMember members={members} value={loanForm.member_id} onChange={(value) => setLoanForm({ ...loanForm, member_id: value })} />
          <FormField label="Principal (UGX)" type="number" value={loanForm.principal} onChange={(e) => setLoanForm({ ...loanForm, principal: e.target.value })} required />
          <FormField label="Interest %" type="number" value={loanForm.interest_rate} onChange={(e) => setLoanForm({ ...loanForm, interest_rate: e.target.value })} />
          <FormField label="Installments" type="number" value={loanForm.installment_count} onChange={(e) => setLoanForm({ ...loanForm, installment_count: e.target.value })} />
          <FormField label="Due date" type="date" value={loanForm.due_date} onChange={(e) => setLoanForm({ ...loanForm, due_date: e.target.value })} required />
          <Button>Issue loan</Button>
        </form>
      </Panel>
      <Panel title="Record repayment">
        <form className="form-grid" onSubmit={pay}>
          <label className="field">
            <span>Loan</span>
            <select value={repayment.loan_id} onChange={(e) => setRepayment({ ...repayment, loan_id: e.target.value })} required>
              <option value="">Select loan</option>
              {loans.filter((loan) => loan.status !== 'completed').map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.full_name} - balance {money(loan.remaining_balance)}
                </option>
              ))}
            </select>
          </label>
          <FormField label="Amount (UGX)" type="number" value={repayment.amount} onChange={(e) => setRepayment({ ...repayment, amount: e.target.value })} required />
          <Button>Record repayment</Button>
        </form>
      </Panel>
      <Panel title="Loan book">
        <DataTable
          rows={loans}
          columns={[
            { key: 'full_name', label: 'Member' },
            { key: 'principal', label: 'Principal', render: (row) => money(row.principal) },
            { key: 'remaining_balance', label: 'Balance', render: (row) => money(row.remaining_balance) },
            { key: 'installment_amount', label: 'Installment', render: (row) => money(row.installment_amount) },
            { key: 'due_date', label: 'Due', render: (row) => shortDate(row.due_date) },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
        />
      </Panel>
    </div>
  );
}

function SelectMember({ members, value, onChange }) {
  return (
    <label className="field">
      <span>Member</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="">Select member</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.full_name} - {member.member_number}
          </option>
        ))}
      </select>
    </label>
  );
}
