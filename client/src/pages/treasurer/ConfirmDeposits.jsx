import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import FormField from '../../components/FormField.jsx';
import { Panel } from '../../components/Card.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { money, shortDate } from '../../utils/format.js';

function stripCommas(value) {
  return String(value).replace(/,/g, '');
}

export default function ConfirmDeposits() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [receiptConfirmed, setReceiptConfirmed] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    member_id: '',
    amount: '',
    transaction_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  useEffect(() => {
    api.get('/members?limit=100').then(({ data }) => setMembers(data.data));
  }, []);

  const selectedMember = members.find((m) => String(m.id) === String(form.member_id));

  function validate() {
    const errs = {};
    if (!form.member_id) errs.member_id = 'Select a member before continuing.';
    const clean = stripCommas(form.amount);
    if (!clean || isNaN(Number(clean)) || Number(clean) <= 0) {
      errs.amount = 'Enter a valid amount in UGX, e.g. 50000 or 50,000.';
    }
    if (!form.transaction_date) errs.transaction_date = 'Select the transaction date.';
    return errs;
  }

  function openModal(event) {
    event.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setModal(true);
  }

  async function confirmSubmit() {
    setModal(false);
    const cleanAmount = stripCommas(form.amount);
    await api.post('/savings', { ...form, amount: cleanAmount, confirmed: receiptConfirmed });
    setMessage('Savings deposit confirmed and recorded successfully.');
    setForm({
      member_id: '',
      amount: '',
      transaction_date: new Date().toISOString().slice(0, 10),
      notes: '',
    });
  }

  return (
    <div className="page-stack">
      <h1>Confirm Savings Deposit</h1>
      <Panel title="Confirm savings receipt">
        {message && <p className="success">{message}</p>}
        <form className="form-grid" onSubmit={openModal}>
          <label className="field">
            <span>Member</span>
            <select
              value={form.member_id}
              onChange={(e) => setForm({ ...form, member_id: e.target.value })}
              required
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name} – {member.member_number}
                </option>
              ))}
            </select>
            {errors.member_id && <small>{errors.member_id}</small>}
          </label>
          <div>
            <FormField
              label="Amount Saved (UGX)"
              type="text"
              inputMode="numeric"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 50,000"
              required
            />
            {errors.amount && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.amount}</small>}
          </div>
          <div>
            <FormField
              label="Date"
              type="date"
              value={form.transaction_date}
              onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
              required
            />
            {errors.transaction_date && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.transaction_date}</small>}
          </div>
          <FormField
            label="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={receiptConfirmed}
              onChange={(e) => setReceiptConfirmed(e.target.checked)}
            />
            <span>Send SMS confirmation to the member</span>
          </label>
          <Button>Confirm deposit</Button>
        </form>
      </Panel>

      <ConfirmModal
        open={modal}
        title="Confirm: Record Savings Deposit"
        rows={[
          { label: 'Member name', value: selectedMember?.full_name },
          { label: 'Member number', value: selectedMember?.member_number },
          { label: 'Amount saved', value: money(stripCommas(form.amount)) },
          { label: 'Date', value: shortDate(form.transaction_date) },
          { label: 'Action', value: 'Confirm savings deposit' },
        ]}
        confirmLabel="Confirm deposit"
        onConfirm={confirmSubmit}
        onCancel={() => setModal(false)}
      />
    </div>
  );
}