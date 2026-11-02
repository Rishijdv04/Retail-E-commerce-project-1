import { useState, useEffect } from 'react';
import {
  X,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  ChevronRight,
  ThumbsUp,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { getProductDetails } from '../data/productDetails';

const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

export default function ProductDetailModal({
  product: rawProduct,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) {
  const product = getProductDetails(rawProduct);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || { name: 'Standard Edition', hex: '#3b82f6' }
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    setAddedAnimation(true);
    onAddToCart(product.id, quantity, selectedColor.name);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuy = () => {
    onBuyNow(product.id, quantity, selectedColor.name);
  };

  const handleHelpful = (reviewId, initialCount) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? initialCount) + 1,
    }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      className="pdp-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
    >
      <div
        className="pdp-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header bar with Breadcrumbs & Close */}
        <div className="pdp-top-bar">
          <nav className="pdp-breadcrumbs">
            <span>Home</span>
            <ChevronRight size={13} />
            <span>{product.category}</span>
            <ChevronRight size={13} />
            <span>{product.vendor}</span>
            <ChevronRight size={13} />
            <span className="current">{product.name}</span>
          </nav>

          <div className="pdp-top-actions">
            <button
              className="pdp-icon-btn"
              onClick={handleShare}
              title="Share product link"
              aria-label="Share product"
            >
              {copiedLink ? <Check size={16} color="#059669" /> : <Share2 size={16} />}
              <span className="pdp-btn-label">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              className="pdp-close-btn"
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Main Content Grid (Gallery | Details & Specs | Buy Box) */}
        <div className="pdp-content-grid">
          {/* =========================================================
              COLUMN 1: IMAGE GALLERY & THUMBNAILS
             ========================================================= */}
          <div className="pdp-gallery-col">
            <div className="pdp-thumbnails-strip">
              {product.gallery.map((g, idx) => (
                <button
                  key={idx}
                  className={`pdp-thumb-btn ${selectedImageIdx === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIdx(idx)}
                  title={g.label}
                >
                  <img
                    src={product.image}
                    alt={g.label}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="pdp-thumb-tag">{g.tag}</span>
                </button>
              ))}
            </div>

            <div
              className="pdp-hero-image-wrap"
              style={{
                '--pdp-glow': product.glow || '#dbeafe',
                borderColor: selectedColor.border || '#cbd5e1',
              }}
            >
              <div className="pdp-badge-stack">
                {product.choiceBadge && (
                  <div className="pdp-choice-badge">
                    <span>{product.choiceBadge}</span>
                  </div>
                )}
                {product.tag && (
                  <span className="pdp-product-tag">{product.tag}</span>
                )}
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="pdp-hero-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="pdp-hero-fallback-emoji">{product.emoji}</span>

              <div className="pdp-view-caption">
                {product.gallery[selectedImageIdx]?.label || 'Primary View'} · {selectedColor.name}
              </div>
            </div>
          </div>

          {/* =========================================================
              COLUMN 2: TITLE, SPECS, COLORS & REVIEWS
             ========================================================= */}
          <div className="pdp-details-col">
            <div className="pdp-brand-row">
              <span className="pdp-brand-name">Brand: <strong>{product.vendor}</strong></span>
              <span className="pdp-store-badge">✓ Verified Brand Partner</span>
            </div>

            <h1 className="pdp-title">{product.name}</h1>

            <div className="pdp-ratings-row">
              <div className="pdp-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                  />
                ))}
                <span className="pdp-rating-num">{product.rating}</span>
              </div>
              <span className="pdp-divider">|</span>
              <a href="#reviews" className="pdp-rating-link">
                {product.reviews} customer ratings
              </a>
              <span className="pdp-divider">|</span>
              <span className="pdp-bought-count">{product.boughtPastMonth}</span>
            </div>

            {/* Price Box */}
            <div className="pdp-price-section">
              <div className="pdp-deal-pill">Limited time deal</div>
              <div className="pdp-price-row">
                <span className="pdp-discount-pct">
                  -{Math.round(((product.old - product.price) / product.old) * 100)}%
                </span>
                <span className="pdp-current-price">{money(product.price)}</span>
              </div>
              <div className="pdp-mrp-row">
                <span className="pdp-mrp-label">M.R.P.:</span>
                <span className="pdp-mrp-val">{money(product.old)}</span>
                <span className="pdp-tax-note">Inclusive of all taxes</span>
              </div>
            </div>

            {/* Amazon-style Highlights / Services bar */}
            <div className="pdp-services-row">
              <div className="pdp-service-item">
                <Truck size={20} color="#2563eb" />
                <span>Free Express Delivery</span>
              </div>
              <div className="pdp-service-item">
                <RotateCcw size={20} color="#2563eb" />
                <span>7 Days Replacement</span>
              </div>
              <div className="pdp-service-item">
                <ShieldCheck size={20} color="#2563eb" />
                <span>1 Year Warranty</span>
              </div>
            </div>

            {/* COLOR SELECTOR */}
            <div className="pdp-color-picker-section">
              <div className="pdp-color-title">
                Colour: <strong>{selectedColor.name}</strong>
              </div>
              <div className="pdp-color-swatches">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    className={`pdp-color-swatch-btn ${selectedColor.name === c.name ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                  >
                    <span
                      className="pdp-color-dot"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="pdp-color-label">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SPECIFICATIONS TABLE */}
            <div className="pdp-specs-section">
              <h3 className="pdp-subhead">Technical Details & Specifications</h3>
              <div className="pdp-specs-table">
                {product.specs.map((s, i) => (
                  <div key={i} className="pdp-spec-row">
                    <span className="pdp-spec-key">{s.key}</span>
                    <span className="pdp-spec-val">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ABOUT THIS ITEM BULLETS */}
            <div className="pdp-bullets-section">
              <h3 className="pdp-subhead">About this item</h3>
              <ul className="pdp-bullets-list">
                {product.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            {/* CUSTOMER REVIEWS */}
            <div className="pdp-reviews-section" id="reviews">
              <h3 className="pdp-subhead">Customer reviews & ratings</h3>

              {/* Review Breakdown Progress Bars */}
              <div className="pdp-breakdown-card">
                <div className="pdp-breakdown-score">
                  <span className="pdp-big-rating">{product.rating}</span>
                  <div className="pdp-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span className="pdp-total-ratings-txt">{product.reviews} global ratings</span>
                </div>

                <div className="pdp-progress-bars">
                  {[
                    { star: '5 star', pct: product.ratingBreakdown.five },
                    { star: '4 star', pct: product.ratingBreakdown.four },
                    { star: '3 star', pct: product.ratingBreakdown.three },
                    { star: '2 star', pct: product.ratingBreakdown.two },
                    { star: '1 star', pct: product.ratingBreakdown.one },
                  ].map((bar, i) => (
                    <div key={i} className="pdp-bar-row">
                      <span className="pdp-bar-label">{bar.star}</span>
                      <div className="pdp-bar-track">
                        <div
                          className="pdp-bar-fill"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                      <span className="pdp-bar-pct">{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Customer Reviews */}
              <div className="pdp-reviews-list">
                {product.reviewsList.map((rev) => (
                  <div key={rev.id} className="pdp-review-card">
                    <div className="pdp-reviewer-row">
                      <div className="pdp-avatar">{rev.avatar}</div>
                      <div>
                        <strong className="pdp-author-name">{rev.author}</strong>
                        {rev.verified && (
                          <span className="pdp-verified-badge">✓ Verified Purchase</span>
                        )}
                      </div>
                    </div>

                    <div className="pdp-review-rating-row">
                      <div className="pdp-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < rev.rating ? '#f59e0b' : 'none'}
                            color="#f59e0b"
                          />
                        ))}
                      </div>
                      <strong className="pdp-review-title">{rev.title}</strong>
                    </div>

                    <div className="pdp-review-date">
                      Reviewed in India on {rev.date}
                    </div>

                    <p className="pdp-review-body">{rev.text}</p>

                    <button
                      className="pdp-helpful-btn"
                      onClick={() => handleHelpful(rev.id, rev.helpful)}
                    >
                      <ThumbsUp size={13} />
                      Helpful ({helpfulCounts[rev.id] ?? rev.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================
              COLUMN 3: AMAZON RIGHT BUY BOX
             ========================================================= */}
          <div className="pdp-buybox-col">
            <div className="pdp-buybox-card">
              <div className="pdp-buybox-price">{money(product.price * quantity)}</div>

              <div className="pdp-delivery-badge">
                <Truck size={14} color="#059669" />
                <span>
                  <strong>FREE Delivery</strong> by <strong>Tomorrow, 2 PM</strong>
                </span>
              </div>

              <div className="pdp-stock-status">
                <span className="pdp-stock-dot" />
                In Stock · Ready to Dispatch
              </div>

              <div className="pdp-meta-table">
                <div className="pdp-meta-row">
                  <span>Ships from</span>
                  <strong>SwiftCart Direct</strong>
                </div>
                <div className="pdp-meta-row">
                  <span>Sold by</span>
                  <strong>{product.vendor}</strong>
                </div>
                <div className="pdp-meta-row">
                  <span>Selected</span>
                  <strong>{selectedColor.name}</strong>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="pdp-qty-row">
                <label htmlFor="pdp-qty-select">Quantity:</label>
                <select
                  id="pdp-qty-select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="pdp-buybox-buttons">
                <button
                  className={`pdp-cart-btn ${addedAnimation ? 'added' : ''}`}
                  onClick={handleAdd}
                >
                  <ShoppingBag size={17} />
                  {addedAnimation ? `Added ${quantity} to Cart! ✓` : 'Add to Cart'}
                </button>

                <button
                  className="pdp-buynow-btn"
                  onClick={handleBuy}
                >
                  <Zap size={17} />
                  Buy Now
                </button>

                <button
                  className={`pdp-wishlist-btn ${isWishlisted ? 'liked' : ''}`}
                  onClick={onToggleWishlist}
                >
                  <Heart
                    size={16}
                    fill={isWishlisted ? '#ef4444' : 'none'}
                    color={isWishlisted ? '#ef4444' : 'currentColor'}
                  />
                  {isWishlisted ? 'Saved in Wishlist' : 'Add to Wish List'}
                </button>
              </div>

              <div className="pdp-security-note">
                <ShieldCheck size={14} color="#059669" />
                <span>Secure 256-bit encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

