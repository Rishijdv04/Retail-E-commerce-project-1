import { useEffect, useState } from 'react';
import apiClient from '../../services/api';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Trash2, Wand2 } from 'lucide-react';
import Field from '../../components/auth/Field';
import { useAuth } from '../../store/authStore';
import { newUserSchema } from '../auth/schemas';

const tryDo = async (fn) => { try { await fn(); } catch (e) { toast.error(e.message); } };
const generate = () => {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const r = crypto.getRandomValues(new Uint32Array(10));
  return Array.from(r, (n) => c[n % c.length]).join('') + 'aA7';
};

function AddUser() {
  const { createUser } = useAuth();
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(newUserSchema), defaultValues: { role: 'customer' },
  });
  return (
    <form className="scx-addrform" noValidate onSubmit={handleSubmit(async (d) => {
      try { await createUser(d); toast.success(`${d.name} added. Share the password with them securely.`); reset({ role: 'customer' }); }
      catch (e) { toast.error(e.message); }
    })}>
      <Field label="Full name" error={errors.name?.message} {...register('name')} />
      <Field label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Field label="Password" type="password" hint="Or generate a strong one" error={errors.password?.message} {...register('password')} />
      <label className="scx-field">
        <span className="scx-label">Role</span>
        <select {...register('role')}><option value="customer">Customer</option><option value="vendor">Vendor</option><option value="admin">Admin</option></select>
      </label>
      <div className="scx-actions">
        <button className="scx-btn" disabled={isSubmitting}>Add user</button>
        <button type="button" className="scx-btn scx-ghost" onClick={() => { const p = generate(); setValue('password', p, { shouldValidate: true }); navigator.clipboard?.writeText(p); toast('Password generated and copied'); }}>
          <Wand2 size={16} /> Generate password
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const { user, users, loadUsers, setRole, setStatus, removeUser, logout } = useAuth();
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadUsers();
    apiClient.get('/admin/stats').then(res => setStats(res.data?.stats)).catch(console.warn);
    apiClient.get('/orders').then(res => setOrders(res.data?.orders || [])).catch(console.warn);
    apiClient.get('/sellers/applications').then(res => setApplications(res.data?.applications || [])).catch(console.warn);
  }, [loadUsers]);
  const count = (r) => users.filter((u) => u.role === r).length;
  return (
    <main className="scx-page scx-wide scx-admin">
      <section className="scx-card scx-card-wide">
        <header className="scx-head">
          <div><h1>Admin dashboard</h1><p className="scx-sub">Signed in as {user.email}</p></div>
          <div className="scx-actions">
            <Link className="scx-btn scx-ghost" to="/">View store</Link>
            <button className="scx-btn scx-ghost" onClick={() => { logout(); nav('/admin/login'); }}>Sign out</button>
          </div>
        </header>
        <div className="scx-stats">
          <div><b>₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</b>Total revenue</div>
          <div><b>{stats?.totalOrders ?? orders.length}</b>Total orders</div>
          <div><b>{stats?.totalProducts || 12}</b>Products in catalog</div>
          <div><b>{users.length}</b>Registered users</div>
        </div>
        <h2>Add a user</h2>
        <AddUser />
        <h2>All users</h2>
        <div className="scx-table">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th><span className="scx-sr">Actions</span></th></tr></thead>
            <tbody>
              {users.map((u) => {
                const me = u.id === user.id;
                return (
                  <tr key={u.id}>
                    <td>{u.name}{me && <span className="scx-pill">You</span>}</td>
                    <td>{u.email}</td>
                    <td>
                      <select value={u.role} disabled={me} aria-label={`Role for ${u.name}`} onChange={(e) => tryDo(() => setRole(u.id, e.target.value))}>
                        <option value="customer">Customer</option><option value="vendor">Vendor</option><option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button className={`scx-switch ${u.status === 'active' ? 'on' : ''}`} disabled={me} role="switch" aria-checked={u.status === 'active'}
                        onClick={() => tryDo(() => setStatus(u.id, u.status === 'active' ? 'disabled' : 'active'))}>
                        {u.status === 'active' ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td>
                      <button className="scx-icon" disabled={me} aria-label={`Delete ${u.name}`}
                        onClick={() => window.confirm(`Delete ${u.name}? This cannot be undone.`) && tryDo(() => removeUser(u.id))}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h2>Recent marketplace orders ({orders.length})</h2>
        <div className="scx-table">
          <table>
            <thead><tr><th>Order #</th><th>Customer / Phone</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--mute)' }}>No orders placed yet.</td></tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id || o._id}>
                    <td><b>{o.orderNumber}</b></td>
                    <td>{o.shippingAddress?.fullName || 'Customer'}<br/><span style={{ fontSize: '0.75rem', color: 'var(--mute)' }}>{o.shippingAddress?.phone}</span></td>
                    <td>{o.items?.map(i => `${i.name} (${i.quantity})`).join(', ')}</td>
                    <td><b>₹{o.totalAmount?.toLocaleString('en-IN')}</b></td>
                    <td><span className="scx-pill" style={{ textTransform: 'capitalize' }}>{o.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h2>Seller onboarding applications ({applications.length})</h2>
        <div className="scx-table">
          <table>
            <thead><tr><th>Brand name</th><th>Business email</th><th>Category</th><th>Applied on</th><th>Status</th></tr></thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--mute)' }}>No seller applications yet.</td></tr>
              ) : (
                applications.map(a => (
                  <tr key={a.id || a._id}>
                    <td><b>{a.brand}</b></td>
                    <td>{a.email}</td>
                    <td>{a.category}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td><span className="scx-pill" style={{ textTransform: 'capitalize' }}>{a.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
