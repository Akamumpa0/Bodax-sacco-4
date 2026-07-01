import { useState } from 'react';
import { Panel } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import FormField from '../../components/FormField.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ current_password: '', new_password: '' });

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  async function changePassword(event) {
    event.preventDefault();
    setError('');
    if (!form.current_password) {
      setError('Enter your current password to continue.');
      return;
    }
    if (form.new_password.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    try {
      await api.patch('/auth/password', form);
      setMessage('Password updated successfully.');
      setForm({ current_password: '', new_password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Check your current password and try again.');
    }
  }

  return (
    <div className="page-stack">
      <h1>Profile</h1>

      {/* ── Prominent identity header above editable fields ── */}
      <div className="profile-header">
        <div className="profile-header-avatar">{initials}</div>
        <div className="profile-header-info">
          <strong>{user?.full_name || '—'}</strong>
          <div className="profile-header-meta">
            <span className="profile-meta-item">
              Member No: <strong>{user?.member_number || '—'}</strong>
            </span>
            <span className="profile-meta-item">
              Stage: <strong>{user?.stage || '—'}</strong>
            </span>
            <span className="profile-meta-item">
              Status:{' '}
              <strong style={{ color: user?.status === 'active' ? 'var(--success)' : 'var(--danger)' }}>
                {user?.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : '—'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      <Panel title="Member details">
        <dl className="details">
          <dt>Name</dt>
          <dd>{user?.full_name}</dd>
          <dt>Member number</dt>
          <dd>{user?.member_number}</dd>
          <dt>Email</dt>
          <dd>{user?.email || '—'}</dd>
          <dt>Phone</dt>
          <dd>{user?.phone_number || '—'}</dd>
        </dl>
      </Panel>
      <Panel title="Change login password">
        {message && <p className="success">{message}</p>}
        {error && <p className="alert">{error}</p>}
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
            label="New password (minimum 6 characters)"
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
