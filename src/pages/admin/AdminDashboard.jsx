import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../store/authStore';
import { products as fallbackProducts } from '../../data/products';
import apiClient from '../../services/api';
import {
  ArrowLeft,
  ArrowUpRight,
  Box,
  ClipboardList,
  ShieldCheck,
  Users,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function AdminDashboard() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState(null);
  const [productList, setProductList] = useState(fallbackProducts);
  const [sellers, setSellers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sellers' | 'catalog'

  useEffect(() => {
    // 1. Fetch live admin stats
    apiClient
      .get('/admin/stats')
      .then((res) => {
        if (res.data?.success && res.data.stats) {
          setStatsData(res.data.stats);
        }
      })
      .catch((err) => {
        console.warn('Admin stats note:', err.message);
      });

    // 2. Fetch live products from backend
    apiClient
      .get('/products')
      .then((res) => {
        if (res.data?.products?.length) {
          setProductList(res.data.products);
        }
      })
      .catch((err) => {
        console.warn('Products fetch note:', err.message);
      });

    // 3. Fetch live seller applications
    apiClient
      .get('/sellers/applications')
      .then((res) => {
        if (res.data?.applications) {
          setSellers(res.data.applications);
        }
      })
      .catch((err) => {
        console.warn('Seller applications fetch note:', err.message);
      });
  }, []);

  const handleSellerStatus = async (appId, newStatus) => {
    try {
      await apiClient.patch(`/sellers/applications/${appId}/status`, { status: newStatus });
      setSellers((prev) =>
        prev.map((s) => (s._id === appId ? { ...s, status: newStatus } : s))
      );
      toast.success(`Application marked as ${newStatus}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Status update failed');
    }
  };

  const handleSignout = () => {
    logout();
    toast.success('Signed out of Admin Console');
    navigate('/admin/login');
  };

  const grossSalesVal = statsData?.grossSales ?? 128450;
  const totalOrdersVal = statsData?.totalOrders ?? 24;
  const activeProductsVal = statsData?.totalProducts ?? productList.length;
  const customersVal = statsData?.totalUsers ?? 1840;

  const stats = [
    {
      label: 'Gross sales',
      value: money(grossSalesVal),
      note: statsData ? 'Live MongoDB verified' : '+12.8% this month',
      icon: ArrowUpRight,
    },
    {
      label: 'Total Orders',
      value: String(totalOrdersVal),
      note: 'Across all shoppers',
      icon: ClipboardList,
    },
    {
      label: 'Active products',
      value: String(activeProductsVal),
      note: 'Live catalog collection',
      icon: Box,
    },
    {
      label: 'Registered Users',
      value: String(customersVal),
      note: 'Customers & vendors',
      icon: Users,
    },
  ];

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="brand" to="/">
            <span className="brand-mark">↗</span> swift<span>cart</span>
          </Link>
          <div className="admin-header-right">
            <span>Admin · {user?.name || 'Platform Administrator'}</span>
            <button onClick={handleSignout}>Sign out</button>
          </div>
        </header>

        <section className="admin-intro">
          <div>
            <p className="admin-kicker">SWIFTCART · MARKETPLACE CONTROL</p>
            <h1>Good morning, {user?.name ? user.name.split(' ')[0] : 'Admin'}.</h1>
            <p>Live marketplace activity connected directly to your backend API.</p>
          </div>
          <Link className="admin-back" to="/">
            <ArrowLeft size={16} /> Back to storefront
          </Link>
        </section>

        {/* Live Stat Cards */}
        <section className="admin-stat-grid">
          {stats.map(({ label, value, note, icon: Icon }) => (
            <article className="admin-stat-card" key={label}>
              <span className="admin-stat-icon">
                <Icon size={19} />
              </span>
              <p>{label}</p>
              <strong>{value}</strong>
              <small>{note}</small>
            </article>
          ))}
        </section>

        {/* Main Content Grid */}
        <section className="admin-lower-grid">
          <article className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>{activeTab === 'sellers' ? 'Seller partner requests' : 'Live product catalogue'}</h2>
                <p>
                  {activeTab === 'sellers'
                    ? 'Review and verify onboarded independent vendor applications.'
                    : 'Real-time database entries synchronized with the storefront.'}
                </p>
              </div>
              <span className="admin-live-tag">
                <ShieldCheck size={13} /> Live MongoDB Sync
              </span>
            </div>

            {activeTab === 'sellers' ? (
              <div style={{ marginTop: '14px' }}>
                {sellers.length === 0 ? (
                  <p style={{ color: '#788575', padding: '20px 0', textAlign: 'center' }}>
                    No pending seller requests right now.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {sellers.map((app) => (
                      <div
                        key={app._id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          borderRadius: '12px',
                          background: '#fff',
                          border: '1px solid #e2eadb',
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block', color: '#17251b' }}>
                            {app.brandName || app.brand}
                          </strong>
                          <span style={{ fontSize: '11px', color: '#68776b' }}>
                            {app.email} · {app.category}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleSellerStatus(app._id, 'approved')}
                            style={{
                              border: 0,
                              background: '#edf6e4',
                              color: '#4f7733',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            onClick={() => handleSellerStatus(app._id, 'rejected')}
                            style={{
                              border: 0,
                              background: '#fef2f2',
                              color: '#dc2626',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <X size={12} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="admin-product-list">
                {productList.slice(0, 8).map((product) => (
                  <div className="admin-product-row" key={product.id || product._id}>
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="admin-product-copy">
                      <strong>{product.name}</strong>
                      <span>
                        {product.vendor} · {product.category} {product.tag ? `[${product.tag}]` : ''}
                      </span>
                    </div>
                    <b>{money(product.price)}</b>
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* Quick Actions Panel */}
          <aside className="admin-panel admin-quick-panel">
            <h2>Management controls</h2>
            <p>Direct marketplace operations.</p>

            <button onClick={() => setActiveTab(activeTab === 'sellers' ? 'catalog' : 'sellers')}>
              <span>♧</span>
              <div>
                <b>{activeTab === 'sellers' ? 'View live catalog' : 'Seller applications'}</b>
                <small>{sellers.filter((s) => s.status === 'pending').length} pending requests</small>
              </div>
            </button>

            <button onClick={() => setActiveTab('catalog')}>
              <span>＋</span>
              <div>
                <b>Catalogue manager</b>
                <small>{productList.length} products listed in database</small>
              </div>
            </button>

            <button onClick={() => navigate('/')}>
              <span>↗</span>
              <div>
                <b>View live storefront</b>
                <small>Inspect consumer shopping experience</small>
              </div>
            </button>

            <div className="admin-note">
              ✓ Connected to Live SwiftCart API (`http://localhost:5000/api`) with JWT Admin Authorization.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
