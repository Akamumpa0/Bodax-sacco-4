import { useState } from 'react';
import { Panel } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import FormField from '../../components/FormField.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ current_password: '', new_password: '' });

  async function changePassword(event) {
    event.preventDefault();
    await api.patch('/auth/password', form);
    setMessage('Password updated successfully.');
    setForm({ current_password: '', new_password: '' });
  }

  return (
    <div className="page-stack">
      <h1>Profile</h1>
      <Panel title="Member details">
        <dl className="details">
          <dt>Name</dt>
          <dd>{user.full_name}</dd>
          <dt>Member number</dt>
          <dd>{user.member_number}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </dl>
      </Panel>
      <Panel title="Change login password">
        {message && <p className="success">{message}</p>}
        <form className="form-grid" onSubmit={changePassword}>
          <FormField
            label="Current password"
            type="password"
            value={form.current_password}
            onChange={(e) => setForm({ ...form, current_password: e.target.value })}
            minLength="6"
            required
          />
          <FormField
            label="New password"
            type="password"
            value={form.new_password}
            onChange={(e) => setForm({ ...form, new_password: e.target.value })}
            minLength="6"
            required
          />
          <Button>Change password</Button>
        </form>
      </Panel>
    </div>
  );
}
