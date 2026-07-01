import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import DataTable from '../../components/DataTable.jsx';
import FormField from '../../components/FormField.jsx';
import { Panel } from '../../components/Card.jsx';
import SearchBox from '../../components/SearchBox.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/client.js';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ member_number: '', full_name: '', phone_number: '', national_id: '', stage: 'Mbarara Central Stage', next_of_kin: '', password: '' });
  const [credentials, setCredentials] = useState({ member_id: '', password: '' });
  const [credError, setCredError] = useState('');

  async function load() {
    const { data } = await api.get(`/members?search=${encodeURIComponent(search)}`);
    setMembers(data.data);
  }

  useEffect(() => {
    load();
  }, [search]);

  function validateForm() {
    const errs = {};
    if (!form.member_number.trim()) errs.member_number = 'Enter the member number, e.g. BDX-001.';
    if (!form.full_name.trim()) errs.full_name = 'Enter the member\'s full name.';
    const phonePattern = /^0[0-9]{9}$/;
    if (!form.phone_number.trim()) {
      errs.phone_number = 'Enter a valid phone number, e.g. 0772123456.';
    } else if (!phonePattern.test(form.phone_number.trim())) {
      errs.phone_number = 'Phone number must be 10 digits starting with 0, e.g. 0772123456.';
    }
    if (!form.stage.trim()) errs.stage = 'Enter the member\'s stage.';
    return errs;
  }

  async function submit(event) {
    event.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await api.post('/members', form);
      setMessage('Member saved. They can log in using their phone number.');
      setForm({ ...form, member_number: '', full_name: '', phone_number: '', national_id: '', next_of_kin: '', password: '' });
      load();
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to save member. Please check all fields and try again.' });
    }
  }

  async function saveCredentials(event) {
    event.preventDefault();
    setCredError('');
    if (!credentials.member_id) { setCredError('Select a member before updating their password.'); return; }
    if (credentials.password.length < 6) { setCredError('New password must be at least 6 characters long.'); return; }
    try {
      await api.patch(`/members/${credentials.member_id}/credentials`, { password: credentials.password });
      setMessage('Member login password updated.');
      setCredentials({ member_id: '', password: '' });
      load();
    } catch (err) {
      setCredError(err.response?.data?.message || 'Failed to update password. Please try again.');
    }
  }

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  return (
    <div className="page-stack">
      <h1>Members</h1>
      <Panel title="Register member">
        {message && <p className="success">{message}</p>}
        {errors.submit && <p className="alert">{errors.submit}</p>}
        <form className="form-grid" onSubmit={submit}>
          <FormField label="Member number" value={form.member_number} onChange={(e) => update('member_number', e.target.value)} error={errors.member_number} placeholder="e.g. BDX-001" required />
          <FormField label="Full name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} error={errors.full_name} required />
          <FormField label="Phone number" value={form.phone_number} onChange={(e) => update('phone_number', e.target.value)} error={errors.phone_number} placeholder="e.g. 0772123456" required />
          <FormField label="National ID" value={form.national_id} onChange={(e) => update('national_id', e.target.value)} />
          <FormField label="Stage" value={form.stage} onChange={(e) => update('stage', e.target.value)} error={errors.stage} required />
          <FormField label="Next of kin" value={form.next_of_kin} onChange={(e) => update('next_of_kin', e.target.value)} />
          <FormField label="Login password (min 6 characters)" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} minLength="6" />
          <Button>Save member</Button>
        </form>
      </Panel>
      <Panel title="Set member login password">
        {credError && <p className="alert">{credError}</p>}
        <form className="form-grid" onSubmit={saveCredentials}>
          <label className="field">
            <span>Member</span>
            <select value={credentials.member_id} onChange={(e) => setCredentials({ ...credentials, member_id: e.target.value })} required>
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name} – {member.phone_number}
                </option>
              ))}
            </select>
          </label>
          <FormField
            label="New login password (minimum 6 characters)"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            minLength="6"
            required
          />
          <Button>Update password</Button>
        </form>
      </Panel>
      <Panel title="Search members" action={<SearchBox value={search} onChange={setSearch} placeholder="Name, phone, number" />}>
        <DataTable
          rows={members}
          columns={[
            { key: 'member_number', label: 'Number' },
            { key: 'full_name', label: 'Name' },
            { key: 'phone_number', label: 'Phone' },
            { key: 'stage', label: 'Stage' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
        />
      </Panel>
    </div>
  );
}
