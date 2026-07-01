import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import FormField from '../../components/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    if (!identifier.trim()) {
      setError('Enter your phone number (e.g. 0772123456) or email address to continue.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your phone number or email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={submit}>
        <div>
          <strong>Bodax SACCO</strong>
          <span>Mbarara Boda Boda savings and loans</span>
        </div>
        {error && <p className="alert">{error}</p>}
        <div style={{ display: 'grid', gap: '4px' }}>
          <FormField
            id="login-identifier"
            label="Phone number or email"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
          />
          <p className="login-hint">Use your phone number (e.g. 0772123456) or email address</p>
        </div>
        <FormField
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button id="login-submit" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        <p className="secondary-action">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
