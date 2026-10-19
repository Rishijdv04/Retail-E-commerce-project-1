# SwiftCart Marketplace — Frontend

A customizable React + Vite frontend prototype for the SwiftCart retail multi-vendor marketplace.

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- VS Code (or another editor)

## Run in VS Code
1. Extract `swiftcart-react.zip` to a folder.
2. Open that folder in VS Code (`File → Open Folder`).
3. Open **Terminal → New Terminal**.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the local development server:
   ```bash
   npm run dev
   ```
6. Open the local URL Vite prints in the terminal (usually `http://localhost:5173`).

## Main files
- `src/App.jsx` — storefront UI and interactions (search, category filters, wishlist, cart, seller form).
- `src/styles.css` — theme, layout, colors, responsive styling.
- `src/data/products.js` — demo products and categories. Edit this file to change product names, prices, sellers, emojis, tags, and category labels.
- `index.html` — page title and metadata.

## Current functionality
- Responsive storefront
- Search by product, seller, and category
- Category and Popular/New filters
- Sort by price or rating
- Add/remove quantities in cart; subtotal, shipping, and total calculation
- Wishlist toggle and wishlist view
- Seller application preview form
- Toast feedback

## Important limitations
This is **frontend-only** and uses local demo data. It does not yet include a database, real authentication, vendor/admin dashboards, image uploads, real payments, or backend order splitting. The seller form and checkout are previews only. Do not collect real customer or payment data until a secure backend is implemented.

## Suggested next phase
Build a Node.js + Express API with MongoDB, JWT authentication, role-based access control (Admin/Vendor/Customer), vendor-scoped product CRUD, and orders split by vendor at checkout.
