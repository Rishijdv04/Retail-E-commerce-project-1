import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import Field from '../../components/auth/Field';
import { useAuth } from '../../store/authStore';
import { loginSchema, signupSchema, resetSchema, email as emailRule } from './schemas';
import { z } from 'zod';

function Shell({ title, sub, admin, children, footer }) {
  return (
    <main className={`scx-page ${admin ? 'scx-admin' : ''}`}>
      <section className="scx-card">
        <Link to="/" className="scx-brand">{admin ? <ShieldCheck size={22} /> : <ShoppingBag size={22} />} SwiftCart</Link>
        <h1>{title}</h1>
        <p className="scx-sub">{sub}</p>
        {children}
        {footer && <p className="scx-foot">{footer}</p>}
      </section>
    </main>
  );
}

const useSubmit = (fn) => {
  const [busy, setBusy] = useState(false);
  const run = async (data) => {
    setBusy(true);
    try { await fn(data); } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  return [busy, run];
};

function LoginForm({ adminOnly }) {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });
  const [busy, run] = useSubmit(async (d) => {
    const u = await login(d.email, d.password, { adminOnly });
    toast.success(`Welcome back, ${u.name.split(' ')[0]}`);
    nav(loc.state?.from || (u.role === 'admin' ? '/admin' : '/'), { replace: true });
  });
  if (user) return <Navigate to={loc.state?.from || (user.role === 'admin' ? '/admin' : '/account')} replace />;
  return (
    <form onSubmit={handleSubmit(run)} noValidate>
      
      <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Field label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
      {!adminOnly && <Link className="scx-link scx-right" to="/forgot-password">Forgot password?</Link>}
      <button className="scx-btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}

export const LoginPage = () => (
  <Shell title="Sign in" sub="Pick up your cart and saved addresses." footer={<>New to SwiftCart? <Link className="scx-link" to="/signup">Create an account</Link></>}>
    <LoginForm />
  </Shell>
);
export const AdminLoginPage = () => (
  <Shell admin title="Admin sign in" sub="For platform administrators only.">
    <LoginForm adminOnly />
  </Shell>
);

export function SignupPage() {
  const { signup, user } = useAuth();
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });
  const [busy, run] = useSubmit(async (d) => {
    await signup(d);
    toast.success('Account created');
    nav('/account', { replace: true });
  });
  if (user) return <Navigate to="/account" replace />;
  return (
    <Shell title="Create your account" sub="Shop every seller from one cart." footer={<>Already registered? <Link className="scx-link" to="/login">Sign in</Link></>}>
      <form onSubmit={handleSubmit(run)} noValidate>
        <Field label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field label="Password" type="password" autoComplete="new-password" hint="8+ characters with upper, lower and a number" error={errors.password?.message} {...register('password')} />
        <Field label="Confirm password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register('confirm')} />
        <button className="scx-btn" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
      </form>
    </Shell>
  );
}

export function ForgotPasswordPage() {
  const { requestReset, resetPassword } = useAuth();
  const nav = useNavigate();
  const [mail, setMail] = useState('');
  const [devCode, setDevCode] = useState(null);
  const [step, setStep] = useState(1);
  const a = useForm({ resolver: zodResolver(z.object({ email: emailRule })) });
  const b = useForm({ resolver: zodResolver(resetSchema) });
  const [busyA, runA] = useSubmit(async (d) => {
    const r = await requestReset(d.email);
    setMail(d.email); setDevCode(r.devCode); setStep(2);
    toast.success('If that email has an account, a reset code was created.');
  });
  const [busyB, runB] = useSubmit(async (d) => {
    await resetPassword(mail, d.code, d.password);
    toast.success('Password updated. Sign in with your new password.');
    nav('/login', { replace: true });
  });
  return (
    <Shell title="Reset password" sub={step === 1 ? 'Enter your email and we will create a reset code.' : `Enter the code for ${mail} and choose a new password.`}
      footer={<Link className="scx-link" to="/login">Back to sign in</Link>}>
      {step === 1 ? (
        <form onSubmit={a.handleSubmit(runA)} noValidate>
          <Field label="Email" type="email" error={a.formState.errors.email?.message} {...a.register('email')} />
          <button className="scx-btn" disabled={busyA}>{busyA ? 'Working…' : 'Get reset code'}</button>
        </form>
      ) : (
        <form onSubmit={b.handleSubmit(runB)} noValidate>
          {devCode && <p className="scx-demo">Demo mode: no email is sent. Your code is <b>{devCode}</b>. It expires in 10 minutes.</p>}
          <Field label="6-digit code" inputMode="numeric" maxLength={6} error={b.formState.errors.code?.message} {...b.register('code')} />
          <Field label="New password" type="password" autoComplete="new-password" error={b.formState.errors.password?.message} {...b.register('password')} />
          <Field label="Confirm new password" type="password" autoComplete="new-password" error={b.formState.errors.confirm?.message} {...b.register('confirm')} />
          <button className="scx-btn" disabled={busyB}>{busyB ? 'Saving…' : 'Save new password'}</button>
        </form>
      )}
    </Shell>
  );
}
