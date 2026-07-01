import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import FormField from '../../components/FormField.jsx';
import { Panel } from '../../components/Card.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { money, shortDate } from '../../utils/format.js';

/** Strip commas so "50,000" and "50000" both pass validation */
function stripCommas(value) {
  return String(value).replace(/,/g, '');
}

export default function RecordSavings() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    member_id: '',
    amount: '',
    transaction_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(false);
  const [receipt, setReceipt] = useState(null); // holds last successful transaction for receipt screen

  useEffect(() => {
    api.get('/members?limit=100').then(({ data }) => setMembers(data.data));
  }, []);

  const selectedMember = members.find((m) => String(m.id) === String(form.member_id));

  function validate() {
    const errs = {};
    if (!form.member_id) errs.member_id = 'Select a member before continuing.';
    const cleanAmount = stripCommas(form.amount);
    if (!cleanAmount || isNaN(Number(cleanAmount)) || Number(cleanAmount) <= 0) {
      errs.amount = 'Enter a valid savings amount in UGX, e.g. 50000 or 50,000.';
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
    await api.post('/savings', { ...form, amount: cleanAmount });
    // Show receipt screen
    setReceipt({
      memberName: selectedMember?.full_name,
      memberNumber: selectedMember?.member_number,
      amount: cleanAmount,
      date: form.transaction_date,
      treasurerName: user?.full_name || user?.email,
    });
    setForm((current) => ({ ...current, amount: '', notes: '', member_id: '' }));
  }

  if (receipt) {
    return (
      <div className="page-stack">
        <h1>Record Savings</h1>
        <div className="receipt-screen">
          <div className="receipt-icon">✅</div>
          <h2 className="receipt-title">Savings Recorded Successfully</h2>
          <p className="receipt-amount">{money(receipt.amount)}</p>
          <dl className="receipt-details">
            <div className="receipt-row">
              <dt>Member name</dt>
              <dd>{receipt.memberName}</dd>
            </div>
            <div className="receipt-row">
              <dt>Member number</dt>
              <dd>{receipt.memberNumber}</dd>
            </div>
            <div className="receipt-row">
              <dt>Amount saved</dt>
              <dd>{money(receipt.amount)}</dd>
            </div>
            <div className="receipt-row">
              <dt>Date</dt>
              <dd>{shortDate(receipt.date)}</dd>
            </div>
            <div className="receipt-row">
              <dt>Recorded by</dt>
              <dd>{receipt.treasurerName}</dd>
            </div>
          </dl>
          <p className="receipt-footer">Bodax SACCO – Mbarara Boda Boda</p>
          <div className="receipt-actions">
            <Button variant="secondary" onClick={() => window.print()}>Print receipt</Button>
            <Button onClick={() => setReceipt(null)}>Record another</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <h1>Record Savings</h1>
      <Panel title="New savings transaction">
        <form className="form-grid" onSubmit={openModal}>
          <label className="field">
            <span>Member</span>
            <select
              id="savings-member"
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
              id="savings-amount"
              label="Amount Saved (UGX)"
              type="text"
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 50,000"
              required
            />
            {errors.amount && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.amount}</small>}
          </div>
          <div>
            <FormField
              id="savings-date"
              label="Date"
              type="date"
              value={form.transaction_date}
              onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
            />
            {errors.transaction_date && <small style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.transaction_date}</small>}
          </div>
          <FormField
            id="savings-notes"
            label="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Button id="savings-submit">Record savings</Button>
        </form>
      </Panel>

      <ConfirmModal
        open={modal}
        title="Confirm: Record Savings"
        rows={[
          { label: 'Member name', value: selectedMember?.full_name },
          { label: 'Member number', value: selectedMember?.member_number },
          { label: 'Amount saved', value: money(stripCommas(form.amount)) },
          { label: 'Date', value: shortDate(form.transaction_date) },
          { label: 'Action', value: 'Record savings deposit' },
        ]}
        confirmLabel="Record savings"
        onConfirm={confirmSubmit}
        onCancel={() => setModal(false)}
      />
    </div>
  );
}
