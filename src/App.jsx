import { useMemo, useState, useEffect, useRef } from 'react';
import apiClient from './services/api';
import { Link } from 'react-router';
import { useAuth } from './store/authStore';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowUpRight,
  Plus,
  Minus,
  SlidersHorizontal,
  Sparkles,
  Check
} from 'lucide-react';

import { products, categories } from './data/products.js';

const money = (value) => `₹${value.toLocaleString('en-IN')}`;

export default function App() {
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const [category, setCategory] = useState('All');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('featured');
  const [productList, setProductList] = useState(products);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmittingSeller, setIsSubmittingSeller] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState({});
  const [recentlyWishlisted, setRecentlyWishlisted] = useState({});
  const [wishlistBump, setWishlistBump] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'shipping' | 'success'
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [sellerSubmitted, setSellerSubmitted] = useState(false);
  const [submittedBrand, setSubmittedBrand] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    line1: 'Express Delivery Address',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  });

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sc_cart')) || {};
    } catch {
      return {};
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sc_wishlist')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sc_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart persist error', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sc_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Wishlist persist error', e);
    }
  }, [wishlist]);

  useEffect(() => {
    apiClient
      .get('/products')
      .then((res) => {
        if (res.data?.products?.length) {
          setProductList(res.data.products);
        }
      })
      .catch((err) => {
        console.warn('API notice: using local catalog fallback:', err.message);
      });
  }, []);
  const [showCart, setShowCart] = useState(false);
  const [showSeller, setShowSeller] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [toast, setToast] = useState('');



  // ADDED: logged-in user (null when signed out) and account link helpers
  const user = useAuth((s) => s.user);
  const accountPath = user?.role === 'admin' ? '/admin' : '/account';
  const accountLabel = user
    ? `My account (${user.name.split(' ')[0]})`
    : 'Sign in';

  const [sellerForm, setSellerForm] = useState({
    brand: '',
    email: '',
    phone: '',
    category: 'Fashion',
    description: '',
  });

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__swiftToast);

    window.__swiftToast = window.setTimeout(
      () => setToast(''),
      2400
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return productList
      .filter((p) =>
        `${p.name} ${p.vendor} ${p.category} ${p.description || ''} ${p.tag || ''}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 5);
  }, [query, productList]);

  const visibleProducts = useMemo(() => {
    let list = productList;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) =>
        `${p.name} ${p.vendor} ${p.category} ${p.description || ''} ${p.tag || ''}`
          .toLowerCase()
          .includes(q)
      );
    } else if (category !== 'All') {
      list = list.filter((p) => p.category === category);
    }

    if (filter !== 'All') {
      list = list.filter((p) => p.status === filter);
    }

    if (showWishlist) {
      list = list.filter((p) =>
        wishlist.some(
          (w) =>
            String(w) === String(p.id) ||
            String(w) === String(p.legacyId) ||
            String(w) === String(p._id)
        )
      );
    }

    if (sort === 'low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === 'high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [
    category,
    filter,
    query,
    sort,
    wishlist,
    showWishlist,
    productList
  ]);

  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => ({
      product: productList.find((p) => String(p.id) === String(id) || String(p.legacyId) === String(id) || String(p._id) === String(id)),
      qty
    }))
    .filter(
      (entry) => entry.product && entry.qty > 0
    );

  const cartCount = cartEntries.reduce(
    (sum, entry) => sum + entry.qty,
    0
  );

  const subtotal = cartEntries.reduce(
    (sum, entry) =>
      sum + entry.product.price * entry.qty,
    0
  );

  const shipping =
    subtotal === 0 || subtotal >= 999 ? 0 : 79;

  const addToCart = (id) => {
    setCart((old) => ({
      ...old,
      [id]: (old[id] || 0) + 1
    }));

    // Trigger visual pop animation on button and cart icon
    setRecentlyAdded((prev) => ({ ...prev, [id]: true }));
    setCartBump(true);
    setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [id]: false }));
      setCartBump(false);
    }, 1200);

    const item = productList.find((p) => String(p.id) === String(id) || String(p.legacyId) === String(id) || String(p._id) === String(id));
    notify(`${item?.name || 'Item'} added to cart! 🛍️`);
  };

  const updateQty = (id, delta) =>
    setCart((old) => {
      const next = {
        ...old,
        [id]: (old[id] || 0) + delta
      };

      if (next[id] <= 0) {
        delete next[id];
      }

      return next;
    });

  const toggleWishlist = (id) =>
    setWishlist((old) => {
      const exists = old.includes(id);

      notify(
        exists
          ? 'Removed from wishlist'
          : 'Saved to your wishlist'
      );

      return exists
        ? old.filter((item) => item !== id)
        : [...old, id];
    });

  const goToShop = () =>
    document
      .getElementById('shop')
      ?.scrollIntoView({ behavior: 'smooth' });

  const submitOrder = async () => {
    if (cartEntries.length === 0) {
      notify('Your cart is empty');
      setCheckoutStep('cart');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.line1) {
      notify('Please enter your full name, phone, and delivery address');
      return;
    }

    setIsCheckingOut(true);
    try {
      if (paymentMethod === 'upi') {
        notify('Authorizing UPI payment… ⚡');
        await new Promise((r) => setTimeout(r, 700));
      }

      const orderPayload = {
        items: cartEntries.map((e) => ({
          productId: e.product.id || e.product.legacyId || e.product._id,
          name: e.product.name,
          price: e.product.price,
          quantity: e.qty,
          vendor: e.product.vendor,
          image: e.product.image || '',
          emoji: e.product.emoji || '🛍️',
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          line1: shippingAddress.line1,
          city: shippingAddress.city || 'Mumbai',
          state: shippingAddress.state || 'Maharashtra',
          pincode: shippingAddress.pincode || '400001',
        },
        paymentMethod: paymentMethod, // 'cod' or 'upi'
      };

      const res = await apiClient.post('/orders', orderPayload);
      const placedOrder = res.data?.order || {
        orderNumber: `SC-${Date.now().toString().slice(-6)}-1001`,
        shippingAddress: orderPayload.shippingAddress,
        totalAmount: subtotal + shipping,
        items: orderPayload.items,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'upi' ? 'paid' : 'pending',
      };

      setConfirmedOrder(placedOrder);
      setCart({});
      setCheckoutStep('success');
      notify(`Order #${placedOrder.orderNumber} placed successfully! 🎉`);
    } catch (err) {
      notify(`Checkout error: ${err.message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = () => {
    if (cartEntries.length === 0) {
      notify('Your cart is empty');
      return;
    }
    setCheckoutStep('shipping');
  };

  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    if (!sellerForm.brand || !sellerForm.email) {
      notify('Please enter brand name and email');
      return;
    }

    setIsSubmittingSeller(true);
    try {
      const res = await apiClient.post('/sellers/apply', sellerForm);
      setSubmittedBrand(sellerForm.brand);
      setSellerSubmitted(true);
      notify(res.data?.message || `Application for ${sellerForm.brand} submitted successfully! 🎉`);
    } catch (err) {
      notify(`Application failed: ${err.message}`);
    } finally {
      setIsSubmittingSeller(false);
    }
  };

  const chooseCategory = (id) => {
    setCategory(id);
    setShowWishlist(false);
    goToShop();
  };

  const isWishlisted = (p) => wishlist.some((w) => String(w) === String(p.id) || String(w) === String(p.legacyId) || String(w) === String(p._id));

  return (
    <div className="app-root">

      {/* TOP LINE */}
      <div className="topline">
        A little something extra:{' '}
        <strong>free shipping</strong> on your first order
        over ₹999
      </div>

      {/* HEADER */}
      <header>
        <nav className="nav" aria-label="Main navigation">

          <a className="brand" href="#home">
            <span className="brand-mark">↗</span>
            swift<span>cart</span>
          </a>

          <div className="navlinks">
            <a href="#shop">Shop all</a>
            <a href="#categories">Categories</a>
            <a href="#seller">Sell on SwiftCart</a>

            {/* ADDED: account links */}
            <Link to={accountPath}>{accountLabel}</Link>
            {user?.role === 'admin' && (
              <Link to="/admin">Admin</Link>
            )}
          </div>

          <div className="search-wrap" ref={searchRef}>
            <form
              className="search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                setSearchFocused(false);
                goToShop();
              }}
            >
              <Search size={17} aria-hidden="true" />

              <input
                value={query}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowWishlist(false);
                  setSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchFocused(false);
                }}
                placeholder="Search products, brands, categories…"
                aria-label="Search products"
              />

              {query.trim().length > 0 && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setQuery('');
                    setSearchFocused(false);
                  }}
                  aria-label="Clear search query"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </form>

            {searchFocused && query.trim().length > 0 && (
              <div className="search-dropdown">
                <div className="search-dropdown-header">
                  <span>Matching Products</span>
                  <span className="search-count-badge">
                    {visibleProducts.length} {visibleProducts.length === 1 ? 'result' : 'results'}
                  </span>
                </div>

                {searchSuggestions.length > 0 ? (
                  <div className="search-dropdown-list">
                    {searchSuggestions.map((item) => (
                      <div
                        key={item.id || item._id}
                        className="search-item"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setQuery(item.name);
                          setSearchFocused(false);
                          goToShop();
                        }}
                      >
                        <div className="search-item-img">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <span className="search-item-fallback">{item.emoji}</span>
                        </div>
                        <div className="search-item-info">
                          <span className="search-item-title">{item.name}</span>
                          <span className="search-item-sub">
                            by {item.vendor} · <span className="search-item-cat">{item.category}</span>
                          </span>
                        </div>
                        <span className="search-item-price">{money(item.price)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="search-no-results">
                    <p>No products matching &ldquo;{query}&rdquo;</p>
                    <small>Try searching headphones, sneakers, mug, lamp, or serum</small>
                  </div>
                )}

                <button
                  type="button"
                  className="search-dropdown-footer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchFocused(false);
                    goToShop();
                  }}
                >
                  View all {visibleProducts.length} results in store <ArrowUpRight size={13} />
                </button>
              </div>
            )}
          </div>

          <div className="nav-actions">

            <button
              className={`icon-btn ${
                showWishlist ? 'selected' : ''
              } ${wishlistBump ? 'wishlist-bump' : ''}`}
              onClick={() => {
                setShowWishlist((v) => !v);
                goToShop();
              }}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart
                size={18}
                fill={wishlist.length > 0 ? '#ef4444' : 'none'}
                color={wishlist.length > 0 ? '#ef4444' : 'currentColor'}
              />
              {wishlist.length > 0 && (
                <span className={`wishlist-count ${wishlistBump ? 'badge-bump' : ''}`}>
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* ADDED: account icon (also visible on mobile) */}
            <Link
              className="icon-btn"
              to={user ? accountPath : '/login'}
              title={accountLabel}
              aria-label={accountLabel}
            >
              <User size={18} />
            </Link>

            <button
              className={`icon-btn cart-icon ${cartBump ? 'cart-bump' : ''}`}
              onClick={() => {
                if (checkoutStep === 'success') setCheckoutStep('cart');
                setShowCart(true);
              }}
              title="Open cart"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} />
              <span className={`cart-count ${cartBump ? 'badge-bump' : ''}`}>
                {cartCount}
              </span>
            </button>

            <button
              className="sell-btn"
              onClick={() => setShowSeller(true)}
            >
              Become a seller
              <ArrowUpRight size={15} />
            </button>

            <button
              className="icon-btn mobile-menu"
              onClick={() => setShowSeller(true)}
              aria-label="Open seller form"
            >
              <Menu size={19} />
            </button>

          </div>
        </nav>
      </header>

      <main id="home">

        {/* HERO */}
        <section className="hero container">
          <div className="hero-card">

            <div className="hero-copy">

              <div className="eyebrow">
                Your marketplace, reimagined
              </div>

              <h1>
                Good finds.
                <br />
                Great prices.
                <br />
                <span>Zero hassle.</span>
              </h1>

              <p>
                Meet your new favourite way to shop.
                Discover independent brands, everyday
                essentials, and little things that make life
                better — all in one cart.
              </p>

              <div className="hero-buttons">

                <button
                  className="primary-btn"
                  onClick={goToShop}
                >
                  Explore the store
                  <ArrowUpRight size={16} />
                </button>

                <button
                  className="secondary-btn"
                  onClick={() =>
                    notify(
                      'Discover independent sellers · Add everything to one cart · Checkout in one place'
                    )
                  }
                >
                  Why SwiftCart?
                </button>

              </div>

              <div className="hero-proof">

                <div className="avatars">
                  <span>☺</span>
                  <span>✦</span>
                  <span>●</span>
                </div>

                <span>
                  <b>Local brands, big energy</b>
                  <br />
                  One cart. Many sellers. Easy shopping.
                </span>

              </div>

            </div>

            <div
              className="hero-art"
              aria-label="SwiftCart shopping bag illustration"
            >
              <div className="orbit" />

              <div className="product-stack">
                <div className="bag" />
                <div className="orb-product">◉</div>
                <div className="shoe" />
              </div>

              <div className="float-card float-one">
                <b>✦ Made for discovery</b>
                Find your next favourite
              </div>

              <div className="float-card float-two">
                <b>🛍 One easy checkout</b>
                Shop across sellers
              </div>
            </div>

          </div>
        </section>

                {/* CATEGORIES */}
        <section
          className="container"
          id="categories"
        >
          <div className="section-head">

            <div>
              <h2>Shop by category</h2>
              <p>
                A little bit of everything, picked for you.
              </p>
            </div>

            <button
              className="text-link"
              onClick={() => chooseCategory('All')}
            >
              View all categories
              <ArrowUpRight size={14} />
            </button>

          </div>

          <div className="categories">

            {categories.map((item) => (
              <button
                key={item.id}
                className={`category ${
                  category === item.id && !showWishlist
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  chooseCategory(item.id)
                }
              >
                <span className="emoji">
                  {item.emoji}
                </span>

                <strong>{item.label}</strong>

                <small>{item.detail}</small>
              </button>
            ))}

          </div>
        </section>

        {/* SHOP */}
        <section
          className="container shop-section"
          id="shop"
        >
          <div className="section-head shop-head">

            <div>
              <h2>
                {query.trim() ? (
                  <>
                    Search results for &ldquo;{query.trim()}&rdquo;{' '}
                    <span className="spark">🔍</span>
                  </>
                ) : showWishlist ? (
                  <>
                    Your wishlist <span className="spark">✳</span>
                  </>
                ) : category === 'All' ? (
                  <>
                    Trending right now <span className="spark">✳</span>
                  </>
                ) : (
                  <>
                    {category} picks <span className="spark">✳</span>
                  </>
                )}
              </h2>

              <p>
                {query.trim()
                  ? `Found ${visibleProducts.length} ${visibleProducts.length === 1 ? 'product' : 'products'} matching your search.`
                  : showWishlist
                  ? 'Your saved finds, all in one place.'
                  : `${visibleProducts.length} handpicked finds from independent sellers and brands.`}
              </p>

              {query.trim() && (
                <div className="search-active-pill-row">
                  <span className="search-pill">
                    Query: <strong>&ldquo;{query.trim()}&rdquo;</strong>
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      title="Clear search"
                    >
                      <X size={12} />
                    </button>
                  </span>
                  <button
                    type="button"
                    className="clear-all-text"
                    onClick={() => {
                      setQuery('');
                      setCategory('All');
                      setFilter('All');
                    }}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            <div className="toolbar">

              <button
                className={
                  filter === 'All'
                    ? 'filter-btn active'
                    : 'filter-btn'
                }
                onClick={() => setFilter('All')}
              >
                All items
              </button>

              <button
                className={
                  filter === 'Popular'
                    ? 'filter-btn active'
                    : 'filter-btn'
                }
                onClick={() => setFilter('Popular')}
              >
                Popular
              </button>

              <button
                className={
                  filter === 'New'
                    ? 'filter-btn active'
                    : 'filter-btn'
                }
                onClick={() => setFilter('New')}
              >
                New in
              </button>

              <label className="sort-wrap">
                <SlidersHorizontal size={14} />

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  aria-label="Sort products"
                >
                  <option value="featured">
                    Featured
                  </option>
                  <option value="low">
                    Price: low to high
                  </option>
                  <option value="high">
                    Price: high to low
                  </option>
                  <option value="rating">
                    Top rated
                  </option>
                </select>
              </label>

            </div>
          </div>

          <div className="product-grid">

            {visibleProducts.length ? (
              visibleProducts.map((p) => (
                <article
                  className="product-card"
                  key={p.id}
                >

                  <div
                    className="product-visual"
                    style={{ '--glow': p.glow }}
                  >
                    <span className="product-tag">
                      {p.tag}
                    </span>

                    <button
                      className={`wish ${isWishlisted(p) ? 'liked' : ''} ${recentlyWishlisted[p.id] ? 'animating' : ''}`}
                      onClick={() => toggleWishlist(p.id)}
                      aria-label={`Toggle wishlist for ${p.name}`}
                      title={isWishlisted(p) ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart
                        size={17}
                        className={recentlyWishlisted[p.id] ? 'heart-icon-pop' : ''}
                        fill={isWishlisted(p) ? '#ef4444' : 'none'}
                        color={isWishlisted(p) ? '#ef4444' : 'currentColor'}
                      />
                    </button>

                    <div className="product-art">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            'none';
                        }}
                      />
                    </div>
                  </div>

                  <div className="product-info">

                    <div className="vendor">
                      by {p.vendor}
                    </div>

                    <div
                      className="product-name"
                      title={p.name}
                    >
                      {p.name}
                    </div>

                    <div className="rating">
                      <span>★★★★★</span>
                      {p.rating}
                      <span className="review-count">
                        ({p.reviews})
                      </span>
                    </div>

                    <div className="price-row">

                      <div className="price">
                        {money(p.price)}
                        <span className="old-price">
                          {money(p.old)}
                        </span>
                      </div>

                      <button
                        className={`add-btn ${recentlyAdded[p.id] ? 'added' : ''}`}
                        onClick={() => addToCart(p.id)}
                        aria-label={`Add ${p.name} to cart`}
                        title={recentlyAdded[p.id] ? 'Added!' : 'Add to cart'}
                      >
                        {recentlyAdded[p.id] ? (
                          <>
                            <Check size={18} strokeWidth={3} />
                            <span className="plus-one-float">+1</span>
                          </>
                        ) : (
                          <Plus size={19} />
                        )}
                      </button>

                    </div>

                  </div>

                </article>
              ))
            ) : (
              <div className="empty-state">

                <div className="empty-icon">
                  ⌕
                </div>

                <strong>
                  {query.trim()
                    ? `No products found for "${query.trim()}".`
                    : showWishlist
                    ? 'Your wishlist is empty.'
                    : 'No matches just yet.'}
                </strong>

                <p>
                  {query.trim()
                    ? 'Check your spelling or try searching for keywords like headphones, sneakers, mug, or serum.'
                    : showWishlist
                    ? 'Tap the heart on any product to save it here.'
                    : 'Try another search or clear your filters.'}
                </p>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setCategory('All');
                    setFilter('All');
                    setQuery('');
                    setShowWishlist(false);
                  }}
                >
                  Show all products
                </button>

              </div>
            )}

          </div>
        </section>

        {/* SELLER BANNER */}
        <section
          className="container"
          id="seller"
        >
          <div className="seller-banner">

            <div>
              <h2>
                Have something worth sharing?
              </h2>

              <p>
                Bring your brand to SwiftCart. Set up your
                storefront, manage your products, and reach
                shoppers who love discovering something new.
              </p>
            </div>

            <button
              onClick={() => setShowSeller(true)}
            >
              Start selling on SwiftCart
              <ArrowUpRight size={15} />
            </button>

          </div>
        </section>

        {/* =====================================================
            SWIFTCART BEAUTY PRODUCT SPOTLIGHT
            VIDEO + IMAGE + PRODUCT DETAILS
            ===================================================== */}

        <section className="container product-spotlight">

          <div className="spotlight-card">

            {/* LEFT — MODEL VIDEO */}
            <div className="spotlight-video">

              <video
                src="/video/makeup-model.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                poster="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85"
              />

              <div className="video-label">
                BEAUTY EDIT
              </div>

            </div>

            {/* CENTER — MAKEUP PRODUCT IMAGE */}
            <div className="spotlight-product-image">

              <span className="spotlight-tag">
                BEAUTY PICK
              </span>

              <img
                src="https://m.media-amazon.com/images/I/61Ls4tW2emL._AC_UL480_FMwebp_QL65_.jpg"
                alt="Makeup beauty products"
              />

            </div>

            {/* RIGHT — PRODUCT DETAILS */}
            <div className="spotlight-details">

              <span className="sponsored-label">
                Sponsored <span>ⓘ</span>
              </span>

              <h2>
                Everyday Glow Makeup Set,
                Beauty Essentials for Your Daily Look
              </h2>

              <div className="spotlight-rating">

                <strong>4.6</strong>

                <span>
                  ★★★★★
                </span>

                <a href="#reviews">
                  (428)
                </a>

              </div>

              <div className="spotlight-badge">
                SwiftCart Beauty Pick
              </div>

              <div className="spotlight-price">

                <span>₹799</span>

                <del>₹1,499</del>

                <b>47% off</b>

              </div>

              <p className="spotlight-offer">
                ✦ Special offer for SwiftCart shoppers
              </p>

              <p className="spotlight-delivery">
                <strong>
                  FREE delivery
                </strong>
                <br />
                Get it delivered to your doorstep.
              </p>

              <button
                className="spotlight-btn"
                onClick={() =>
                  notify(
                    'Beauty product added to cart'
                  )
                }
              >
                Add to cart
                <ArrowUpRight size={16} />
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer>
        <div className="container footer-inner">

          <a
            className="brand footer-brand"
            href="#home"
          >
            <span className="brand-mark">
              ↗
            </span>
            swift<span>cart</span>
          </a>

          <span>
            © 2026 SwiftCart Marketplace. A concept
            storefront for everyone.
          </span>

          <div className="footer-links">

            <a href="#shop">
              Shop
            </a>

            <a href="#seller">
              Become a seller
            </a>

            {/* ADDED: account link */}
            <Link to={user ? accountPath : '/login'}>
              {user ? 'My account' : 'Sign in'}
            </Link>

            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();

                notify(
                  'Support centre preview — connect a support service later'
                );
              }}
            >
              Help & support
            </a>

          </div>

        </div>
      </footer>

      {/* CART DRAWER */}
      {showCart && (
        <div
          className="overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowCart(false);
              if (checkoutStep === 'success') setCheckoutStep('cart');
            }
          }}
        >
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >

            <div className="drawer-head">
              <h2>
                {checkoutStep === 'cart' && (
                  <>Your cart <span>({cartCount})</span></>
                )}
                {checkoutStep === 'shipping' && (
                  <>Checkout <span>· Delivery</span></>
                )}
                {checkoutStep === 'success' && (
                  <>Order Placed <span>· Confirmed</span></>
                )}
              </h2>

              <button
                className="close-btn"
                onClick={() => {
                  setShowCart(false);
                  if (checkoutStep === 'success') setCheckoutStep('cart');
                }}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* STEP 1: CART ITEMS */}
            {checkoutStep === 'cart' && (
              <>
                <div className="cart-items">
                  {cartEntries.length ? (
                    cartEntries.map(({ product: p, qty }) => (
                      <div className="cart-item" key={p.id}>
                        <div className="cart-thumb">{p.emoji}</div>
                        <div className="cart-item-details">
                          <strong>{p.name}</strong>
                          <small>{p.vendor}</small>
                          <div className="qty">
                            <button
                              onClick={() => updateQty(p.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span>{qty}</span>
                            <button
                              onClick={() => updateQty(p.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="cart-item-price">
                          {money(p.price * qty)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-cart">
                      <div>🛍️</div>
                      <strong>Your cart is taking a little break.</strong>
                      <p>Find something you love and add it here.</p>
                    </div>
                  )}
                </div>

                {cartEntries.length > 0 && (
                  <div className="cart-total">
                    <div className="total-line">
                      <span>Subtotal</span>
                      <span>{money(subtotal)}</span>
                    </div>

                    <div className="total-line">
                      <span>
                        Shipping {shipping === 0 ? '· free over ₹999' : ''}
                      </span>
                      <span>{shipping ? money(shipping) : 'FREE'}</span>
                    </div>

                    <div className="total-line grand">
                      <span>Total</span>
                      <span>{money(subtotal + shipping)}</span>
                    </div>

                    <button
                      className="checkout-btn"
                      onClick={handleCheckout}
                    >
                      Proceed to Delivery
                      <ArrowUpRight size={16} />
                    </button>

                    <p className="demo-note">
                      🔒 100% Secure Checkout · Live order saved in MongoDB database.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: SHIPPING DETAILS & PAYMENT SELECTION */}
            {checkoutStep === 'shipping' && (
              <div className="checkout-step-container">
                <div className="checkout-step-head">
                  <h3>1. Delivery Address</h3>
                  <p>Enter where you'd like your order delivered</p>
                </div>

                <div className="checkout-form-grid">
                  <div className="checkout-field full">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rasesh Kumar"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    />
                  </div>

                  <div className="checkout-field full">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    />
                  </div>

                  <div className="checkout-field full">
                    <label>Street Address / Flat No.</label>
                    <textarea
                      rows={2}
                      placeholder="Building, street, landmark..."
                      value={shippingAddress.line1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                    />
                  </div>

                  <div className="checkout-field">
                    <label>City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Pincode</label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    />
                  </div>
                </div>

                {/* PAYMENT METHOD SELECTION */}
                <div className="checkout-step-head" style={{ marginTop: '0.5rem' }}>
                  <h3>2. Payment Method</h3>
                  <p>Choose Cash on Delivery or Online UPI Payment</p>
                </div>

                <div className="payment-options-grid">
                  <button
                    type="button"
                    className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="payment-card-top">
                      <span>💵 Cash on Delivery</span>
                      {paymentMethod === 'cod' && <Check size={15} color="#1769ff" strokeWidth={3} />}
                    </div>
                    <span className="payment-card-sub">Pay at doorstep via cash/UPI</span>
                  </button>

                  <button
                    type="button"
                    className={`payment-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className="payment-card-top">
                      <span>⚡ Online UPI</span>
                      {paymentMethod === 'upi' && <Check size={15} color="#1769ff" strokeWidth={3} />}
                    </div>
                    <span className="payment-card-sub">GPay, PhonePe, Paytm, BHIM</span>
                  </button>
                </div>

                {/* UPI OPTIONS ACCORDION */}
                {paymentMethod === 'upi' && (
                  <div className="upi-details-box">
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                      Select Instant UPI App:
                    </div>
                    <div className="upi-apps-row">
                      <button
                        type="button"
                        className={`upi-app-chip ${selectedUpiApp === 'gpay' ? 'selected' : ''}`}
                        onClick={() => setSelectedUpiApp('gpay')}
                      >
                        Google Pay
                      </button>
                      <button
                        type="button"
                        className={`upi-app-chip ${selectedUpiApp === 'phonepe' ? 'selected' : ''}`}
                        onClick={() => setSelectedUpiApp('phonepe')}
                      >
                        PhonePe
                      </button>
                      <button
                        type="button"
                        className={`upi-app-chip ${selectedUpiApp === 'paytm' ? 'selected' : ''}`}
                        onClick={() => setSelectedUpiApp('paytm')}
                      >
                        Paytm
                      </button>
                      <button
                        type="button"
                        className={`upi-app-chip ${selectedUpiApp === 'bhim' ? 'selected' : ''}`}
                        onClick={() => setSelectedUpiApp('bhim')}
                      >
                        BHIM UPI
                      </button>
                    </div>

                    <div className="upi-input-group">
                      <input
                        type="text"
                        placeholder="Or enter UPI ID (e.g. mobile@upi)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>

                    <div className="upi-verify-tag">
                      <Check size={13} />
                      <span>Zero transaction fees · Instant online confirmation</span>
                    </div>
                  </div>
                )}

                <div className="checkout-summary-bar">
                  <span>Payable amount ({cartCount} items):</span>
                  <strong>{money(subtotal + shipping)}</strong>
                </div>

                <div className="checkout-actions-row">
                  <button
                    type="button"
                    className="outline-btn"
                    onClick={() => setCheckoutStep('cart')}
                  >
                    ← Back to Cart
                  </button>

                  <button
                    type="button"
                    className="checkout-btn"
                    disabled={isCheckingOut}
                    onClick={submitOrder}
                  >
                    {isCheckingOut ? (
                      paymentMethod === 'upi' ? 'Authorizing UPI Payment…' : 'Placing Order…'
                    ) : (
                      paymentMethod === 'upi' ? `Pay ${money(subtotal + shipping)} via UPI ➔` : 'Place Order (Cash on Delivery)'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER SUCCESS CELEBRATION */}
            {checkoutStep === 'success' && (
              <div className="order-success-screen">
                <div className="success-icon-ring">
                  <Check size={36} strokeWidth={3} />
                </div>

                <h3>Order Confirmed! 🎉</h3>
                <p className="order-success-sub">
                  Your order has been recorded in our MongoDB database and sent to sellers!
                </p>

                <div className="order-success-card">
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                      Order Tracking ID
                    </span>
                    <span className="order-id-badge">
                      {confirmedOrder?.orderNumber}
                    </span>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                      Shipping Address
                    </span>
                    <strong>{confirmedOrder?.shippingAddress?.fullName}</strong> ({confirmedOrder?.shippingAddress?.phone})
                    <div style={{ color: '#475569', fontSize: '0.82rem' }}>
                      {confirmedOrder?.shippingAddress?.line1}, {confirmedOrder?.shippingAddress?.city} - {confirmedOrder?.shippingAddress?.pincode}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                      Payment Method & Status
                    </span>
                    {confirmedOrder?.paymentMethod === 'upi' ? (
                      <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={15} strokeWidth={3} />
                        Online UPI — {money(confirmedOrder?.totalAmount || 0)} (Paid & Verified ✓)
                      </strong>
                    ) : (
                      <strong>
                        Cash on Delivery — {money(confirmedOrder?.totalAmount || 0)} (Pay at doorstep)
                      </strong>
                    )}
                  </div>

                  <div>
                    <span style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 600 }}>
                      🚚 Free Express Delivery (2-3 Business Days)
                    </span>
                  </div>
                </div>

                <div className="order-success-actions">
                  <Link
                    to={user ? accountPath : '/login'}
                    className="primary-btn"
                    onClick={() => {
                      setShowCart(false);
                      setCheckoutStep('cart');
                    }}
                  >
                    View in My Orders →
                  </Link>

                  <button
                    type="button"
                    className="outline-btn"
                    onClick={() => {
                      setShowCart(false);
                      setCheckoutStep('cart');
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}

          </aside>
        </div>
      )}

      {/* SELLER MODAL */}
      {showSeller && (
        <div
          className="overlay modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowSeller(false);
              setSellerSubmitted(false);
            }
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-title"
          >

            <div className="modal-head">
              <div>
                <h2 id="seller-title">
                  {sellerSubmitted ? 'Application Submitted! 🎉' : 'Start selling on SwiftCart'}
                </h2>
                <p>
                  {sellerSubmitted
                    ? 'Your brand application has been saved to our MongoDB database.'
                    : 'Join over 1,500+ independent brands and creators selling on SwiftCart.'}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() => {
                  setShowSeller(false);
                  setSellerSubmitted(false);
                }}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            {!sellerSubmitted ? (
              <form onSubmit={handleSellerSubmit}>
                <label htmlFor="brand">
                  Brand / store name *
                </label>
                <input
                  id="brand"
                  required
                  value={sellerForm.brand}
                  onChange={(e) =>
                    setSellerForm({
                      ...sellerForm,
                      brand: e.target.value
                    })
                  }
                  placeholder="e.g. The Everyday Studio"
                />

                <label htmlFor="email">
                  Business email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={sellerForm.email}
                  onChange={(e) =>
                    setSellerForm({
                      ...sellerForm,
                      email: e.target.value
                    })
                  }
                  placeholder="you@yourbrand.com"
                />

                <label htmlFor="phone">
                  Contact phone (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={sellerForm.phone}
                  onChange={(e) =>
                    setSellerForm({
                      ...sellerForm,
                      phone: e.target.value
                    })
                  }
                  placeholder="e.g. 9876543210"
                />

                <label htmlFor="seller-category">
                  Main product category *
                </label>
                <select
                  id="seller-category"
                  value={sellerForm.category}
                  onChange={(e) =>
                    setSellerForm({
                      ...sellerForm,
                      category: e.target.value
                    })
                  }
                >
                  <option>Fashion</option>
                  <option>Tech & gadgets</option>
                  <option>Home & living</option>
                  <option>Beauty</option>
                  <option>Lifestyle</option>
                  <option>Handcrafted & Artisanal</option>
                  <option>Other</option>
                </select>

                <label htmlFor="description">
                  Tell us about your brand / products (optional)
                </label>
                <textarea
                  id="description"
                  rows={2}
                  value={sellerForm.description}
                  onChange={(e) =>
                    setSellerForm({
                      ...sellerForm,
                      description: e.target.value
                    })
                  }
                  placeholder="What makes your products unique? (e.g. organic fabrics, handcrafted ceramics...)"
                />

                <div className="modal-actions">
                  <button
                    type="button"
                    className="outline-btn"
                    onClick={() =>
                      setShowSeller(false)
                    }
                  >
                    Maybe later
                  </button>

                  <button
                    className="primary-btn"
                    type="submit"
                    disabled={isSubmittingSeller}
                  >
                    {isSubmittingSeller ? 'Submitting Application…' : 'Submit Application'}
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="seller-success-screen">
                <div className="success-icon-ring">
                  <Check size={36} strokeWidth={3} />
                </div>

                <h3>Thank You, {submittedBrand}! 🎉</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.45, maxWidth: '360px', margin: '0 auto 1rem' }}>
                  Your seller onboarding application has been successfully recorded in our MongoDB database!
                </p>

                <div className="seller-success-card">
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>
                      Brand Name
                    </span>
                    <strong>{submittedBrand}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>
                      Category & Email
                    </span>
                    <span>{sellerForm.category} · {sellerForm.email}</span>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>
                      Application Status
                    </span>
                    <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={13} /> Under Review (Response within 24-48 hrs)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="primary-btn full-width"
                  style={{ width: '100%', padding: '0.85rem' }}
                  onClick={() => {
                    setShowSeller(false);
                    setSellerSubmitted(false);
                    setSellerForm({
                      brand: '',
                      email: '',
                      phone: '',
                      category: 'Fashion',
                      description: '',
                    });
                  }}
                >
                  Done · Back to Store
                </button>
              </div>
            )}

          </section>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          className="toast"
          role="status"
        >
          <Sparkles size={15} />
          {toast}
        </div>
      )}

    </div>
  );
}
