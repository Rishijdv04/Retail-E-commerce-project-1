import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../store/authStore';

function AuthShell({ title, subtitle, children }) {
  return <main className="auth-page"><section className="auth-card"><Link className="auth-brand" to="/"><span className="brand-mark">↗</span> swift<span>cart</span></Link><h1>{title}</h1><p className="auth-subtitle">{subtitle}</p>{children}<Link className="back-home" to="/"><ArrowLeft size={15}/> Back to shopping</Link></section></main>;
}
export function LoginPage() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const login=useAuth(s=>s.login); const navigate=useNavigate(); const location=useLocation();
  const submit=async (e)=>{e.preventDefault();try{await login({email,password});toast.success('Welcome back!');navigate(location.state?.from || '/account',{replace:true});}catch(err){toast.error(err.message);}};
  return <AuthShell title="Welcome back" subtitle="Sign in to continue to your SwiftCart account."><form className="auth-form" onSubmit={submit}><label>Email address<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"/></label><div className="auth-row"><Link to="/forgot-password">Forgot password?</Link></div><button className="auth-submit">Sign in</button></form><p className="auth-switch">New to SwiftCart? <Link to="/signup">Create an account</Link></p><div className="demo-credentials"><b>Frontend demo admin</b><br/>admin@swiftcart.demo / Admin@123</div></AuthShell>;
}
export function SignupPage(){
 const [name,setName]=useState('');const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [confirm,setConfirm]=useState('');const signup=useAuth(s=>s.signup);const navigate=useNavigate();
 const submit=async e=>{e.preventDefault();if(password.length<8)return toast.error('Use at least 8 characters for the password.');if(password!==confirm)return toast.error('Passwords do not match.');try{await signup({name,email,password});toast.success('Account created!');navigate('/account');}catch(err){toast.error(err.message);}};
 return <AuthShell title="Create your account" subtitle="Join SwiftCart and keep all your favourite finds together."><form className="auth-form" onSubmit={submit}><label>Full name<input required minLength="2" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" required minLength="8" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/></label><label>Confirm password<input type="password" required value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Re-enter password"/></label><button className="auth-submit">Create account</button></form><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></AuthShell>;
}
export function ForgotPasswordPage(){return <AuthShell title="Reset password" subtitle="Password reset is a backend feature and is not enabled in this frontend demo."><div className="demo-credentials">Connect an email service and secure reset-token API to enable password recovery.</div><Link className="auth-submit auth-submit-link" to="/login">Return to sign in</Link></AuthShell>}
export function AdminLoginPage(){return <LoginPage/>}
