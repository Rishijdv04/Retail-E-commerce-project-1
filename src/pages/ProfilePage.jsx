import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { MapPin, Pencil, Trash2, Plus, Package } from 'lucide-react';
import apiClient from '../services/api';
import Field from '../components/auth/Field';
import { useAuth } from '../store/authStore';
import { profileSchema, passwordChangeSchema, addressSchema } from './auth/schemas';

const guard = (fn) => async (d) => { try { await fn(d); } catch (e) { toast.error(e.message); } };

function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(profileSchema), defaultValues: { name: user.name, phone: user.phone },
  });
  return (
    <form onSubmit={handleSubmit(guard(async (d) => { await updateProfile(d); toast.success('Profile saved'); }))} noValidate>
      <Field label="Full name" error={errors.name?.message} {...register('name')} />
      <Field label="Email" value={user.email} disabled readOnly hint="Email cannot be changed here" />
      <Field label="Mobile number" inputMode="tel" error={errors.phone?.message} {...register('phone')} />
      <button className="scx-btn" disabled={!isDirty}>Save changes</button>
    </form>
  );
}

function PasswordTab() {
  const { changePassword } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(passwordChangeSchema) });
  return (
    <form onSubmit={handleSubmit(guard(async (d) => { await changePassword(d.current, d.password); reset(); toast.success('Password changed'); }))} noValidate>
      <Field label="Current password" type="password" autoComplete="current-password" error={errors.current?.message} {...register('current')} />
      <Field label="New password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
      <Field label="Confirm new password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register('confirm')} />
      <button className="scx-btn">Update password</button>
    </form>
  );
}

function AddressForm({ initial, onDone }) {
  const { saveAddress } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema), defaultValues: initial || { label: 'Home', isDefault: false },
  });
  const f = (name, label, extra) => <Field label={label} error={errors[name]?.message} {...extra} {...register(name)} />;
  return (
    <form className="scx-addrform" onSubmit={handleSubmit(guard(async (d) => {
      await saveAddress({ ...d, id: initial?.id }); toast.success('Address saved'); onDone();
    }))} noValidate>
      {f('label', 'Address name (Home, Office…)')}
      {f('fullName', 'Recipient name')}
      {f('phone', 'Mobile number', { inputMode: 'tel' })}
      {f('line1', 'Street address')}
      {f('city', 'City')}
      {f('state', 'State')}
      {f('pincode', 'PIN code', { inputMode: 'numeric', maxLength: 6 })}
      <label className="scx-check"><input type="checkbox" {...register('isDefault')} /> Use as my default address</label>
      <div className="scx-actions">
        <button className="scx-btn">Save address</button>
        <button type="button" className="scx-btn scx-ghost" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}

function AddressTab() {
  const { user, removeAddress } = useAuth();
  const [editing, setEditing] = useState(null); // null | 'new' | address
  if (editing) return <AddressForm initial={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />;
  const list = user.addresses || [];
  return (
    <div>
      {!list.length && <p className="scx-empty">No saved addresses yet. Add one to check out faster.</p>}
      <ul className="scx-addrs">
        {list.map((a) => (
          <li key={a.id}>
            <MapPin size={18} />
            <div>
              <b>{a.label}</b>{a.isDefault && <span className="scx-pill">Default</span>}
              <p>{a.fullName}, {a.phone}<br />{a.line1}, {a.city}, {a.state} {a.pincode}</p>
            </div>
            <button className="scx-icon" aria-label={`Edit ${a.label}`} onClick={() => setEditing(a)}><Pencil size={16} /></button>
            <button className="scx-icon" aria-label={`Delete ${a.label}`} onClick={() => window.confirm('Delete this address?') && removeAddress(a.id)}><Trash2 size={16} /></button>
          </li>
        ))}
      </ul>
      <button className="scx-btn" onClick={() => setEditing('new')}><Plus size={16} /> Add address</button>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/orders/my-orders')
      .then((res) => {
        setOrders(res.data?.orders || []);
      })
      .catch((err) => {
        console.warn('Orders fetch error:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="scx-loading"><p>Loading your orders…</p></div>;
  }

  if (!orders.length) {
    return (
      <div className="scx-empty">
        <Package size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
        <p>No orders placed yet.</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--mute)' }}>
          Items you purchase will appear here with live tracking.
        </p>
        <Link to="/" className="scx-btn" style={{ marginTop: 12, display: 'inline-flex', width: 'auto' }}>
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '14px' }}>
      {orders.map((order) => (
        <div key={order.id || order._id} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <b style={{ fontSize: '1.05rem' }}>Order #{order.orderNumber}</b>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--mute)' }}>
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="scx-pill" style={{ textTransform: 'capitalize' }}>{order.status || 'Processing'}</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10, display: 'grid', gap: 8 }}>
            {order.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{item.emoji || '🛍️'}</span>
                  <span>{item.name} <span style={{ color: 'var(--mute)' }}>× {item.quantity}</span></span>
                </span>
                <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('orders');
  const tabs = [['orders', 'My orders'], ['profile', 'Profile'], ['addresses', 'Saved addresses'], ['security', 'Password']];
  return (
    <main className="scx-page scx-wide">
      <section className="scx-card scx-card-wide">
        <header className="scx-head">
          <div>
            <h1>Hi, {user.name.split(' ')[0]}</h1>
            <p className="scx-sub">{user.email}</p>
          </div>
          <div className="scx-actions">
            <Link className="scx-btn scx-ghost" to="/">Continue shopping</Link>
            <button className="scx-btn scx-ghost" onClick={() => { logout(); toast.success('Signed out'); nav('/'); }}>Sign out</button>
          </div>
        </header>
        <div className="scx-tabs" role="tablist">
          {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
        </div>
        {tab === 'orders' && <OrdersTab />}
        {tab === 'profile' && <ProfileTab />}
        {tab === 'addresses' && <AddressTab />}
        {tab === 'security' && <PasswordTab />}
      </section>
    </main>
  );
}
