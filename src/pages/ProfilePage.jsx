import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { LogOut, Package, ShoppingBag, Store, UserRound, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../store/authStore';
import apiClient from '../services/api';

const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

export default function ProfilePage() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders'

  useEffect(() => {
    if (!user) return;
    apiClient
      .get('/orders/my-orders')
      .then((res) => {
        setOrders(res.data?.orders || []);
      })
      .catch((err) => {
        console.warn('Orders fetch note:', err.message);
      })
      .finally(() => setLoadingOrders(false));
  }, [user]);

  if (!user) return null;

  const signout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <main className="account-page">
      <div className="account-top">
        <Link className="brand" to="/">
          <span className="brand-mark">↗</span> swift<span>cart</span>
        </Link>
        <Link to="/" style={{ color: '#263c28', fontWeight: 700, textDecoration: 'none' }}>
          Continue shopping
        </Link>
      </div>

      <section className="account-card" style={{ maxWidth: activeTab === 'orders' ? '700px' : '480px' }}>
        <div className="account-avatar">
          <UserRound size={32} />
        </div>
        <p className="eyebrow" style={{ color: '#527c35', fontWeight: 800, fontSize: '12px' }}>
          SWIFTCART ACCOUNT
        </p>
        <h1 style={{ margin: '4px 0 6px' }}>Hello, {user.name}</h1>
        <p style={{ color: '#64748b', margin: '0 0 10px' }}>{user.email}</p>
        <span className="role-pill">Verified {user.role || 'customer'}</span>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', margin: '22px 0 16px', borderBottom: '1px solid #dce4d6', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '9px 12px',
              border: 0,
              borderRadius: '9px',
              background: activeTab === 'profile' ? '#edf6e4' : 'transparent',
              color: activeTab === 'profile' ? '#263c28' : '#64748b',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              flex: 1,
              padding: '9px 12px',
              border: 0,
              borderRadius: '9px',
              background: activeTab === 'orders' ? '#edf6e4' : 'transparent',
              color: activeTab === 'orders' ? '#263c28' : '#64748b',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <ShoppingBag size={15} /> My Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div>
            <div className="account-actions">
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  border: '1px solid #dce4d6',
                  background: '#fbfdf9',
                  borderRadius: '12px',
                  padding: '13px 10px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#263c28',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <ShoppingBag size={18} /> View Orders ({orders.length})
              </button>
              <Link to="/#seller">
                <Store size={18} /> Sell on SwiftCart
              </Link>
            </div>

            {user.addresses?.length > 0 && (
              <div style={{ textAlign: 'left', background: '#f8faf6', padding: '14px', borderRadius: '12px', border: '1px solid #e5ede0', margin: '16px 0' }}>
                <strong style={{ fontSize: '13px', color: '#263c28' }}>Primary Delivery Address:</strong>
                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>
                  {user.addresses[0].fullName} · {user.addresses[0].line1}, {user.addresses[0].city}, {user.addresses[0].pincode}
                </p>
              </div>
            )}

            <button className="auth-submit" onClick={signout} style={{ marginTop: '16px' }}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'left' }}>
            {loadingOrders ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Loading orders from backend…</p>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b' }}>
                <Package size={36} color="#8fc64a" style={{ margin: '0 auto 10px', display: 'block' }} />
                <strong style={{ color: '#17251b', display: 'block' }}>No orders placed yet</strong>
                <p style={{ fontSize: '13px', margin: '6px 0 16px' }}>Browse handpicked goods and place your first order.</p>
                <Link to="/" className="auth-submit" style={{ display: 'inline-flex', width: 'auto', padding: '10px 20px' }}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {orders.map((ord) => (
                  <article
                    key={ord._id || ord.id}
                    style={{
                      border: '1px solid #dce4d6',
                      borderRadius: '12px',
                      padding: '14px',
                      background: '#fbfdf9',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#263c28' }}>
                        Order #{String(ord._id || ord.id).slice(-6).toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '99px',
                          background: ord.orderStatus === 'delivered' ? '#edf6e4' : '#fef3c7',
                          color: ord.orderStatus === 'delivered' ? '#4f7733' : '#b45309',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {ord.orderStatus === 'delivered' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {ord.orderStatus || 'confirmed'}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                      {ord.items?.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                          <span>{it.quantity}x {it.name || it.product?.name || 'Item'}</span>
                          <span>{money(it.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eef3eb', paddingTop: '8px', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>Total Paid ({ord.paymentMethod?.toUpperCase() || 'COD'})</span>
                      <strong style={{ color: '#17251b' }}>{money(ord.totalAmount || ord.total || 0)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
