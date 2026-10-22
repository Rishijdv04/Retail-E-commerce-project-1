import { useMemo, useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ArrowUpRight, Plus, Minus, SlidersHorizontal, Sparkles } from 'lucide-react';
import { products, categories } from './data/products.js';

const money = (value) => `₹${value.toLocaleString('en-IN')}`;

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('featured');
  const [cart, setCart] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSeller, setShowSeller] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [toast, setToast] = useState('');
  const [sellerForm, setSellerForm] = useState({ brand: '', email: '', category: 'Fashion' });

  const notify = (message) => { setToast(message); window.clearTimeout(window.__swiftToast); window.__swiftToast = window.setTimeout(() => setToast(''), 2400); };
  const visibleProducts = useMemo(() => {
    let list = products.filter((p) => (category === 'All' || p.category === category) && (filter === 'All' || p.status === filter));
    if (query.trim()) list = list.filter((p) => `${p.name} ${p.vendor} ${p.category}`.toLowerCase().includes(query.trim().toLowerCase()));
    if (showWishlist) list = list.filter((p) => wishlist.includes(p.id));
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, filter, query, sort, wishlist, showWishlist]);

  const cartEntries = Object.entries(cart).map(([id, qty]) => ({ product: products.find((p) => p.id === Number(id)), qty })).filter((entry) => entry.product && entry.qty > 0);
  const cartCount = cartEntries.reduce((sum, entry) => sum + entry.qty, 0);
  const subtotal = cartEntries.reduce((sum, entry) => sum + entry.product.price * entry.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;

  const addToCart = (id) => { setCart((old) => ({ ...old, [id]: (old[id] || 0) + 1 })); notify(`${products.find((p) => p.id === id)?.name} added to cart`); };
  const updateQty = (id, delta) => setCart((old) => { const next = { ...old, [id]: (old[id] || 0) + delta }; if (next[id] <= 0) delete next[id]; return next; });
  const toggleWishlist = (id) => setWishlist((old) => { const exists = old.includes(id); notify(exists ? 'Removed from wishlist' : 'Saved to your wishlist'); return exists ? old.filter((item) => item !== id) : [...old, id]; });
  const goToShop = () => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  const chooseCategory = (id) => { setCategory(id); setShowWishlist(false); goToShop(); };

  return <div className="app-root">
    <div className="topline">A little something extra: <strong>free shipping</strong> on your first order over ₹999</div>
    <header><nav className="nav" aria-label="Main navigation">
      <a className="brand" href="#home"><span className="brand-mark">↗</span>swift<span>cart</span></a>
      <div className="navlinks"><a href="#shop">Shop all</a><a href="#categories">Categories</a><a href="#seller">Sell on SwiftCart</a></div>
      <label className="search"><Search size={17}/><input value={query} onChange={(e) => { setQuery(e.target.value); setShowWishlist(false); }} placeholder="Search products, brands and more…" aria-label="Search products" /></label>
      <div className="nav-actions"><button className={`icon-btn ${showWishlist ? 'selected' : ''}`} onClick={() => { setShowWishlist((v) => !v); goToShop(); }} title="Wishlist" aria-label="Wishlist"><Heart size={18}/></button><button className="icon-btn cart-icon" onClick={() => setShowCart(true)} title="Open cart" aria-label="Open cart"><ShoppingBag size={18}/><span className="cart-count">{cartCount}</span></button><button className="sell-btn" onClick={() => setShowSeller(true)}>Become a seller <ArrowUpRight size={15}/></button><button className="icon-btn mobile-menu" onClick={() => setShowSeller(true)} aria-label="Open seller form"><Menu size={19}/></button></div>
    </nav></header>

    <main id="home">
      <section className="hero container"><div className="hero-card">
        <div className="hero-copy"><div className="eyebrow">Your marketplace, reimagined</div><h1>Good finds.<br/>Great prices.<br/><span>Zero hassle.</span></h1><p>Meet your new favourite way to shop. Discover independent brands, everyday essentials, and little things that make life better — all in one cart.</p><div className="hero-buttons"><button className="primary-btn" onClick={goToShop}>Explore the store <ArrowUpRight size={16}/></button><button className="secondary-btn" onClick={() => notify('Discover independent sellers · Add everything to one cart · Checkout in one place')}>Why SwiftCart?</button></div><div className="hero-proof"><div className="avatars"><span>☺</span><span>✦</span><span>●</span></div><span><b>Local brands, big energy</b><br/>One cart. Many sellers. Easy shopping.</span></div></div>
        <div className="hero-art" aria-label="SwiftCart shopping bag illustration"><div className="orbit"/><div className="product-stack"><div className="bag"/><div className="orb-product">◉</div><div className="shoe"/></div><div className="float-card float-one"><b>✦ Made for discovery</b>Find your next favourite</div><div className="float-card float-two"><b>🛍 One easy checkout</b>Shop across sellers</div></div>
      </div></section>

      <section className="container" id="categories"><div className="section-head"><div><h2>Shop by category</h2><p>A little bit of everything, picked for you.</p></div><button className="text-link" onClick={() => chooseCategory('All')}>View all categories <ArrowUpRight size={14}/></button></div>
        <div className="categories">{categories.map((item) => <button key={item.id} className={`category ${category === item.id && !showWishlist ? 'active' : ''}`} onClick={() => chooseCategory(item.id)}><span className="emoji">{item.emoji}</span><strong>{item.label}</strong><small>{item.detail}</small></button>)}</div>
      </section>

      <section className="container shop-section" id="shop"><div className="section-head shop-head"><div><h2>{showWishlist ? 'Your wishlist' : category === 'All' ? 'Trending right now' : `${category} picks`} <span className="spark">✳</span></h2><p>{showWishlist ? 'Your saved finds, all in one place.' : `${visibleProducts.length} handpicked finds from independent sellers and brands.`}</p></div><div className="toolbar"><button className={filter === 'All' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('All')}>All items</button><button className={filter === 'Popular' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('Popular')}>Popular</button><button className={filter === 'New' ? 'filter-btn active' : 'filter-btn'} onClick={() => setFilter('New')}>New in</button><label className="sort-wrap"><SlidersHorizontal size={14}/><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></label></div></div>
        <div className="product-grid">{visibleProducts.length ? visibleProducts.map((p) => <article className="product-card" key={p.id}><div className="product-visual" style={{ '--glow': p.glow }}><span className="product-tag">{p.tag}</span><button className={`wish ${wishlist.includes(p.id) ? 'liked' : ''}`} onClick={() => toggleWishlist(p.id)} aria-label={`Toggle wishlist for ${p.name}`}><Heart size={17} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'}/></button><div className="product-art" aria-hidden="true">{p.emoji}</div></div><div className="product-info"><div className="vendor">by {p.vendor}</div><div className="product-name" title={p.name}>{p.name}</div><div className="rating"><span>★★★★★</span> {p.rating} <span className="review-count">({p.reviews})</span></div><div className="price-row"><div className="price">{money(p.price)}<span className="old-price">{money(p.old)}</span></div><button className="add-btn" onClick={() => addToCart(p.id)} aria-label={`Add ${p.name} to cart`}><Plus size={19}/></button></div></div></article>) : <div className="empty-state"><div className="empty-icon">⌕</div><strong>{showWishlist ? 'Your wishlist is empty.' : 'No matches just yet.'}</strong><p>{showWishlist ? 'Tap the heart on any product to save it here.' : 'Try another search or clear your filters.'}</p><button className="primary-btn" onClick={() => { setCategory('All'); setFilter('All'); setQuery(''); setShowWishlist(false); }}>Show all products</button></div>}</div>
      </section>

      <section className="container" id="seller"><div className="seller-banner"><div><h2>Have something worth sharing?</h2><p>Bring your brand to SwiftCart. Set up your storefront, manage your products, and reach shoppers who love discovering something new.</p></div><button onClick={() => setShowSeller(true)}>Start selling on SwiftCart <ArrowUpRight size={15}/></button></div></section>
    </main>
    <footer><div className="container footer-inner"><a className="brand footer-brand" href="#home"><span className="brand-mark">↗</span>swift<span>cart</span></a><span>© 2026 SwiftCart Marketplace. A concept storefront for everyone.</span><div className="footer-links"><a href="#shop">Shop</a><a href="#seller">Become a seller</a><a href="#home" onClick={(e) => { e.preventDefault(); notify('Support centre preview — connect a support service later'); }}>Help & support</a></div></div></footer>

    {showCart && <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowCart(false); }}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart"><div className="drawer-head"><h2>Your cart <span>({cartCount})</span></h2><button className="close-btn" onClick={() => setShowCart(false)} aria-label="Close cart"><X size={20}/></button></div><div className="cart-items">{cartEntries.length ? cartEntries.map(({ product: p, qty }) => <div className="cart-item" key={p.id}><div className="cart-thumb">{p.emoji}</div><div className="cart-item-details"><strong>{p.name}</strong><small>{p.vendor}</small><div className="qty"><button onClick={() => updateQty(p.id, -1)} aria-label="Decrease quantity"><Minus size={12}/></button><span>{qty}</span><button onClick={() => updateQty(p.id, 1)} aria-label="Increase quantity"><Plus size={12}/></button></div></div><div className="cart-item-price">{money(p.price * qty)}</div></div>) : <div className="empty-cart"><div>🛍️</div><strong>Your cart is taking a little break.</strong><p>Find something you love and add it here.</p></div>}</div>{cartEntries.length > 0 && <div className="cart-total"><div className="total-line"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="total-line"><span>Shipping {shipping === 0 ? '· free over ₹999' : ''}</span><span>{shipping ? money(shipping) : 'FREE'}</span></div><div className="total-line grand"><span>Total</span><span>{money(subtotal + shipping)}</span></div><button className="checkout-btn" onClick={() => notify('Checkout preview only — backend integration comes next')}>Continue to checkout <ArrowUpRight size={16}/></button><p className="demo-note">Demo checkout · Payment and order processing are not connected yet.</p></div>}</aside></div>}

    {showSeller && <div className="overlay modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowSeller(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="seller-title"><div className="modal-head"><div><h2 id="seller-title">Start selling on SwiftCart</h2><p>Tell us a little about your brand. This demo form previews seller onboarding.</p></div><button className="close-btn" onClick={() => setShowSeller(false)} aria-label="Close form"><X size={20}/></button></div><form onSubmit={(e) => { e.preventDefault(); setShowSeller(false); notify(`Application preview ready for ${sellerForm.brand} — backend not connected`); setSellerForm({ brand: '', email: '', category: 'Fashion' }); }}><label htmlFor="brand">Brand / store name</label><input id="brand" required value={sellerForm.brand} onChange={(e) => setSellerForm({ ...sellerForm, brand: e.target.value })} placeholder="e.g. The Everyday Studio"/><label htmlFor="email">Business email</label><input id="email" type="email" required value={sellerForm.email} onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })} placeholder="you@yourbrand.com"/><label htmlFor="seller-category">Main product category</label><select id="seller-category" value={sellerForm.category} onChange={(e) => setSellerForm({ ...sellerForm, category: e.target.value })}><option>Fashion</option><option>Tech & gadgets</option><option>Home & living</option><option>Beauty</option><option>Lifestyle</option><option>Other</option></select><div className="modal-actions"><button type="button" className="outline-btn" onClick={() => setShowSeller(false)}>Maybe later</button><button className="primary-btn" type="submit">Preview application <ArrowUpRight size={15}/></button></div></form></section></div>}
    {toast && <div className="toast" role="status"><Sparkles size={15}/>{toast}</div>}
  </div>;
}