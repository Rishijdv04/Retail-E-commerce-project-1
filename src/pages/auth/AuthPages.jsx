import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../store/authStore';

function AuthShell({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-brand" to="/">
          <span className="brand-mark">↗</span> swift<span>cart</span>
        </Link>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
        <Link className="back-home" to="/">
          <ArrowLeft size={15} /> Back to shopping
        </Link>
      </section>
    </main>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login({ email, password });
      toast.success(`Welcome back, ${u.name}!`);
      navigate(location.state?.from || (u.role === 'admin' ? '/admin' : '/account'), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to your SwiftCart account.">
      <form className="auth-form" onSubmit={submit}>
        <label>
          Email address
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </label>
        <div className="auth-row">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="auth-submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="auth-switch">
        New to SwiftCart? <Link to="/signup">Create an account</Link>
      </p>
      <div className="demo-credentials">
        <b>Demo Credentials</b><br />
        Admin: <code>admin@swiftcart.com</code> / <code>Admin@12345</code><br />
        Customer: <code>customer@swiftcart.com</code> / <code>Customer@123</code>
      </div>
    </AuthShell>
  );
}

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const signup = useAuth((s) => s.signup);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error('Use at least 8 characters for the password.');
    if (password !== confirm) return toast.error('Passwords do not match.');
    setBusy(true);
    try {
      const u = await signup({ name, email, password });
      toast.success(`Welcome to SwiftCart, ${u.name}!`);
      navigate('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Join SwiftCart and keep all your favourite finds together.">
      <form className="auth-form" onSubmit={submit}>
        <label>
          Full name
          <input
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter password"
          />
        </label>
        <button className="auth-submit" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="auth-switch">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const requestReset = useAuth((s) => s.requestReset);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (requestReset) await requestReset(email);
      setSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Request failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Reset password" subtitle="Enter your email to receive password reset instructions.">
      {sent ? (
        <div className="demo-credentials">
          Instructions sent to <b>{email}</b>. Please check your inbox.
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <button className="auth-submit" disabled={busy}>
            {busy ? 'Sending link…' : 'Send reset link'}
          </button>
        </form>
      )}
      <Link className="auth-submit" style={{ marginTop: '14px', background: '#263c28' }} to="/login">
        Return to sign in
      </Link>
    </AuthShell>
  );
}

export function AdminLoginPage() {
  const [email, setEmail] = useState('admin@swiftcart.com');
  const [password, setPassword] = useState('Admin@12345');
  const [busy, setBusy] = useState(false);
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login({ email, password, adminOnly: true });
      toast.success(`Welcome back, ${u.name}!`);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Admin login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Admin Portal" subtitle="Sign in with your SwiftCart administrator credentials.">
      <form className="auth-form" onSubmit={submit}>
        <label>
          Admin Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="auth-submit" disabled={busy}>
          {busy ? 'Authenticating…' : 'Enter Admin Console'}
        </button>
      </form>
      <div className="demo-credentials">
        <b>Default Platform Administrator</b><br />
        Email: <code>admin@swiftcart.com</code><br />
        Password: <code>Admin@12345</code>
      </div>
    </AuthShell>
  );
}
