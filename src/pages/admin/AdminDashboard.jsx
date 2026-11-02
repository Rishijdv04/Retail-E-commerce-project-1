import { Link } from 'react-router';
import { useAuth } from '../../store/authStore';
import { products } from '../../data/products';
import { ArrowLeft, ArrowUpRight, Box, ClipboardList, ShieldCheck, Users } from 'lucide-react';

const money = (value) => `₹${value.toLocaleString('en-IN')}`;

export default function AdminDashboard() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const stats = [
    { label: 'Gross sales', value: '₹1,28,450', note: '+12.8% this month', icon: ArrowUpRight },
    { label: 'Orders', value: '248', note: '18 awaiting dispatch', icon: ClipboardList },
    { label: 'Active products', value: String(products.length), note: 'Across independent makers', icon: Box },
    { label: 'Customers', value: '1,840', note: '+8.4% this month', icon: Users },
  ];

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <Link className="brand" to="/"><span className="brand-mark">↗</span> swift<span>cart</span></Link>
          <div className="admin-header-right"><span>Admin · {user?.name || 'Store manager'}</span><button onClick={logout}>Sign out</button></div>
        </header>
        <section className="admin-intro">
          <div><p className="admin-kicker">SWIFTCART · MARKETPLACE CONTROL</p><h1>Good morning, Admin.</h1><p>Here’s what’s happening across your marketplace today.</p></div>
          <Link className="admin-back" to="/"><ArrowLeft size={16}/> Back to storefront</Link>
        </section>
        <section className="admin-stat-grid">{stats.map(({label,value,note,icon:Icon}) => <article className="admin-stat-card" key={label}><span className="admin-stat-icon"><Icon size={19}/></span><p>{label}</p><strong>{value}</strong><small>{note}</small></article>)}</section>
        <section className="admin-lower-grid">
          <article className="admin-panel"><div className="admin-panel-heading"><div><h2>Featured product catalogue</h2><p>Professional product photography from your storefront collection.</p></div><span className="admin-live-tag"><ShieldCheck size={13}/> Catalogue preview</span></div>
            <div className="admin-product-list">{products.slice(0, 7).map((product) => <div className="admin-product-row" key={product.id}><img src={product.image} alt={product.name} loading="lazy"/><div className="admin-product-copy"><strong>{product.name}</strong><span>{product.vendor} · {product.category}</span></div><b>{money(product.price)}</b></div>)}</div>
          </article>
          <aside className="admin-panel admin-quick-panel"><h2>Quick actions</h2><p>Common marketplace management areas.</p><button><span>＋</span><div><b>Add a product</b><small>Create a new marketplace listing</small></div></button><button><span>▤</span><div><b>Manage orders</b><small>Review fulfilment and dispatch</small></div></button><button><span>♧</span><div><b>Seller approvals</b><small>Review new seller applications</small></div></button><button><span>↗</span><div><b>View analytics</b><small>Track marketplace performance</small></div></button><div className="admin-note">Dashboard preview · Connect admin APIs to manage live marketplace data.</div></aside>
        </section>
      </div>
    </main>
  );
}
