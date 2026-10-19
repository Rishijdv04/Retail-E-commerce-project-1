# 🛒 SwiftCart Marketplace

SwiftCart is a modern and responsive **multi-vendor e-commerce marketplace frontend** built using **React.js and Vite**.

The project provides a clean shopping experience where customers can explore products, search and filter items, manage their wishlist and cart, and preview seller-related functionality.

> **Current Status:** Frontend Prototype  
> Backend integration, authentication, database, payments, and vendor/admin dashboards are planned for future development.

---

## ✨ Features

### 🛍️ Customer Experience

- Browse products from multiple sellers
- Search products by name, seller, or category
- Filter products by category
- Popular and New product filters
- Sort products by price and rating
- Responsive product cards
- Wishlist management
- Add products to cart
- Increase or decrease product quantity
- Automatic cart subtotal calculation
- Shipping and total price calculation
- Toast notifications for user actions

### ❤️ Wishlist

- Add or remove products from wishlist
- View wishlist products separately
- Quick wishlist toggle from product cards

### 🛒 Shopping Cart

- Add products to cart
- Remove products from cart
- Update product quantities
- Calculate subtotal
- Calculate shipping charges
- Calculate final order total

### 🏪 Seller Preview

- Seller application form
- Seller onboarding UI preview
- Marketplace seller-focused interface

> The seller form is currently for demonstration purposes only and does not submit data to a backend.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| Vite | Development and build tool |
| JavaScript | Application logic |
| CSS3 | Styling and responsive design |
| React Hooks | State and UI management |
| Local Demo Data | Product and category data |

---

## 📁 Project Structure

```text
swiftcart-react/
│
├── src/
│   ├── data/
│   │   └── products.js
│   │
│   ├── App.jsx
│   ├── styles.css
│   └── main.jsx
│
├── index.html
├── package.json
└── README.md
```

### Important Files

**`src/App.jsx`**

Contains the main storefront UI and interactions, including:

- Search
- Category filters
- Product sorting
- Wishlist
- Shopping cart
- Seller application form

**`src/styles.css`**

Contains:

- Marketplace theme
- Colors
- Product card styling
- Hero section
- Navigation
- Responsive layouts
- Mobile styling

**`src/data/products.js`**

Contains the demo marketplace data, including:

- Product names
- Prices
- Sellers
- Categories
- Ratings
- Tags
- Product icons/emojis

**`index.html`**

Contains the page title and basic metadata.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js `20.19+` or `22.12+`
- npm
- VS Code or another code editor
- Git (recommended)

Check your Node.js and npm versions:

```bash
node -v
npm -v
```

---

## 💻 Run the Project Locally

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Open the project folder

```bash
cd Retail-E-commerce-project-1
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Vite will display a local development URL, usually:

```text
http://localhost:5173
```

Open it in your browser.

---

## 📱 Responsive Design

SwiftCart is designed to work across different screen sizes, including:

- Desktop
- Laptop
- Tablet
- Mobile

The interface automatically adjusts product grids, navigation, categories, and other components for smaller screens.

---

## ⚠️ Current Limitations

SwiftCart is currently a **frontend-only prototype**.

The current version does **not** include:

- Backend API
- Database
- Real user authentication
- Admin authentication
- Vendor authentication
- Admin dashboard
- Vendor dashboard
- Product image uploads
- Persistent cart storage
- Real order processing
- Payment gateway
- Secure checkout
- Backend inventory management
- Vendor-wise order splitting

All products and categories currently use local demo data.

The seller application and checkout interfaces are UI previews only.

> **Security Notice:** Do not collect or store real customer, authentication, or payment information until a secure backend and database are implemented.

---

## 🔮 Future Development

The next development phase can convert SwiftCart into a complete multi-vendor marketplace.

### Backend

- Node.js
- Express.js
- REST APIs
- MongoDB

### Authentication & Authorization

Implement JWT-based authentication with role-based access control for:

- 👤 Customer
- 🏪 Vendor
- 🛡️ Admin

### Vendor Features

- Vendor registration
- Vendor dashboard
- Add products
- Edit products
- Delete products
- Inventory management
- View vendor-specific orders
- Order status management

### Customer Features

- Registration and login
- Customer profile
- Saved addresses
- Persistent wishlist
- Persistent cart
- Order placement
- Order history
- Order tracking

### Admin Features

- Admin dashboard
- Manage customers
- Manage vendors
- Approve/reject sellers
- Manage marketplace products
- Manage categories
- Monitor orders
- Marketplace analytics

### Checkout & Orders

Future checkout functionality can include:

- Secure checkout
- Address management
- Payment gateway integration
- Order creation
- Vendor-wise order splitting
- Inventory updates
- Order confirmation

---

## 🔐 Security Goals

Future backend development should include:

- Password hashing
- JWT authentication
- Role-based authorization
- Protected API routes
- Input validation
- Secure environment variables
- Vendor-scoped data access
- Secure payment handling

---

## 🎯 Project Goal

The goal of SwiftCart is to evolve from a frontend marketplace prototype into a scalable **multi-vendor e-commerce platform** where customers can purchase products from multiple vendors while vendors independently manage their products and orders through dedicated dashboards.

---

## 👥 Development

This project is being developed collaboratively as a team project.

Contributors should pull the latest changes before starting work:

```bash
git pull origin main
```

After completing and testing changes:

```bash
git add .
git commit -m "Describe your changes"
git pull origin main
git push origin main
```

Always resolve merge conflicts before pushing changes.

---

## 📌 Project Status

🚧 **Under Active Development**

Current focus:

**Frontend Marketplace → Backend Integration → Authentication → Vendor/Admin Dashboards → Complete Multi-Vendor E-Commerce Platform**