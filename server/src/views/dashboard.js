export function renderDashboard({ uptime, mongoStatus, dbName, counts, port, clientUrl }) {
  const formatUptime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}m ${s}s`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SwiftCart API — Backend Server</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --border: #1f2937;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --primary: #10b981;
      --primary-glow: rgba(16, 185, 129, 0.2);
      --accent: #6366f1;
      --code-bg: #1e293b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2.5rem 1.5rem;
    }
    .container {
      max-width: 1040px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .brand-logo {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, #10b981, #059669);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.4rem;
      color: white;
      box-shadow: 0 4px 15px var(--primary-glow);
    }
    .brand-title h1 {
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .brand-title p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.9rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
    }
    .frontend-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      background: var(--accent);
      color: white;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    .frontend-btn:hover { opacity: 0.9; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 1.25rem;
      border-radius: 12px;
      position: relative;
    }
    .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.35rem;
    }
    .stat-value {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--text);
    }
    .stat-sub {
      font-size: 0.75rem;
      color: #34d399;
      margin-top: 0.25rem;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 2rem 0 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .endpoints-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    .endpoint-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .endpoint-row:last-child { border-bottom: none; }
    .endpoint-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .method {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      min-width: 52px;
      text-align: center;
    }
    .method.get { background: #064e3b; color: #6ee7b7; border: 1px solid #059669; }
    .method.post { background: #1e3a8a; color: #93c5fd; border: 1px solid #2563eb; }
    .method.put { background: #713f12; color: #fde047; border: 1px solid #ca8a04; }
    .method.patch { background: #581c87; color: #d8b4fe; border: 1px solid #9333ea; }
    .method.delete { background: #7f1d1d; color: #fca5a5; border: 1px solid #dc2626; }
    .path {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9rem;
      color: #e2e8f0;
    }
    .desc {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .test-link {
      font-size: 0.75rem;
      padding: 0.25rem 0.65rem;
      background: #1f2937;
      color: #38bdf8;
      text-decoration: none;
      border-radius: 6px;
      border: 1px solid #374151;
      transition: all 0.2s;
    }
    .test-link:hover { background: #374151; color: white; }

    .interactive-tester {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 2rem;
    }
    .tester-inputs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    select, input, button {
      font-family: inherit;
      font-size: 0.875rem;
      padding: 0.6rem 0.8rem;
      border-radius: 8px;
      background: #1f2937;
      border: 1px solid var(--border);
      color: white;
    }
    input { flex: 1; }
    button.run-btn {
      background: #10b981;
      border: none;
      font-weight: 600;
      cursor: pointer;
      padding: 0.6rem 1.2rem;
      color: #0b0f19;
    }
    button.run-btn:hover { background: #34d399; }
    pre.response-box {
      background: var(--code-bg);
      border: 1px solid var(--border);
      padding: 1rem;
      border-radius: 8px;
      max-height: 250px;
      overflow-y: auto;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 0.8rem;
      color: #a7f3d0;
    }
    .footer {
      margin-top: 3rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="brand">
        <div class="brand-logo">↗</div>
        <div class="brand-title">
          <h1>SwiftCart API Server</h1>
          <p>Enterprise E-Commerce Backend & MongoDB Engine</p>
        </div>
      </div>
      <div style="display: flex; gap: 0.75rem; align-items: center;">
        <span class="status-badge">
          <span class="status-dot"></span>
          REST API Online
        </span>
        <a class="frontend-btn" href="${clientUrl}" target="_blank">
          Open Storefront (Port 5173) ↗
        </a>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Database Connection</div>
        <div class="stat-value" style="font-size: 1.25rem; color: #10b981;">${mongoStatus}</div>
        <div class="stat-sub">DB: ${dbName}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Marketplace Products</div>
        <div class="stat-value">${counts.products}</div>
        <div class="stat-sub">Ready in MongoDB</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Registered Users</div>
        <div class="stat-value">${counts.users}</div>
        <div class="stat-sub">Admin & Customers</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Orders Stored</div>
        <div class="stat-value">${counts.orders}</div>
        <div class="stat-sub">Live Checkout Data</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Server Uptime</div>
        <div class="stat-value" style="font-size: 1.3rem;">${formatUptime(uptime)}</div>
        <div class="stat-sub">Port: ${port}</div>
      </div>
    </div>

    <h2 class="section-title">⚡ Available REST API Endpoints</h2>
    <div class="endpoints-card">
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method get">GET</span>
          <span class="path">/api/health</span>
          <span class="desc">— System & Database health check</span>
        </div>
        <a class="test-link" href="/api/health" target="_blank">Execute JSON ↗</a>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method get">GET</span>
          <span class="path">/api/products</span>
          <span class="desc">— Live products from MongoDB (search, filters, sort)</span>
        </div>
        <a class="test-link" href="/api/products" target="_blank">Execute JSON ↗</a>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method get">GET</span>
          <span class="path">/api/categories</span>
          <span class="desc">— Catalog categories</span>
        </div>
        <a class="test-link" href="/api/categories" target="_blank">Execute JSON ↗</a>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method post">POST</span>
          <span class="path">/api/auth/signup</span>
          <span class="desc">— Register new customer account (with JWT token)</span>
        </div>
        <span class="desc">JSON body: { name, email, password }</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method post">POST</span>
          <span class="path">/api/auth/login</span>
          <span class="desc">— Authenticate user or admin</span>
        </div>
        <span class="desc">JSON body: { email, password }</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method post">POST</span>
          <span class="path">/api/orders</span>
          <span class="desc">— Create order from cart (Checkout)</span>
        </div>
        <span class="desc">JSON body: { items, shippingAddress }</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method post">POST</span>
          <span class="path">/api/sellers/apply</span>
          <span class="desc">— Submit seller onboarding application</span>
        </div>
        <span class="desc">JSON body: { brand, email, category }</span>
      </div>
      <div class="endpoint-row">
        <div class="endpoint-left">
          <span class="method get">GET</span>
          <span class="path">/api/admin/stats</span>
          <span class="desc">— Total users, orders, products, and revenue</span>
        </div>
        <span class="desc">Requires Admin Bearer token</span>
      </div>
    </div>

    <div class="interactive-tester">
      <h2 style="font-size: 1.1rem; margin-bottom: 0.5rem;">🧪 Live API Quick Tester</h2>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Test any backend endpoint right now directly from your browser:</p>
      <div class="tester-inputs">
        <select id="tMethod">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
        <input id="tUrl" value="/api/products" placeholder="/api/health or /api/products" />
        <button class="run-btn" onclick="testApi()">Send Request</button>
      </div>
      <pre class="response-box" id="tOutput">Click "Send Request" to test the live API endpoint...</pre>
    </div>

    <footer class="footer">
      SwiftCart REST API & MongoDB Service • Running on <code>http://localhost:${port}</code>
    </footer>
  </div>

  <script>
    async function testApi() {
      const method = document.getElementById('tMethod').value;
      const url = document.getElementById('tUrl').value;
      const out = document.getElementById('tOutput');
      out.textContent = 'Loading request...';
      try {
        const res = await fetch(url, { method });
        const json = await res.json();
        out.textContent = JSON.stringify(json, null, 2);
      } catch (err) {
        out.textContent = 'Error: ' + err.message;
      }
    }
  </script>
</body>
</html>`;
}

