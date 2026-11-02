# 🛍️ SwiftCart — Multi-Vendor E-Commerce Marketplace

<p align="center">
  <strong>A modern marketplace experience built with React, Vite, and Node.js.</strong>
  <br />
  Discover products, explore sellers, manage your shopping cart, and experience a growing multi-vendor commerce platform.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</p>

---

## 📌 Overview

**SwiftCart** is a collaborative multi-vendor e-commerce marketplace designed to provide a seamless shopping experience for customers while building the foundation for independent seller operations.

The platform combines a modern React frontend with a separate Node.js backend architecture.

It focuses on product discovery, category-based browsing, search, sorting, wishlist management, shopping cart operations, authentication, user profiles, and administrative functionality.

The application follows a modular architecture with reusable components, organized services, centralized state management, and separate frontend and backend directories.

### 🎯 Project Vision

To develop a complete multi-vendor marketplace where:

* Customers can discover and purchase products.
* Vendors can manage their own products and orders.
* Administrators can oversee marketplace operations.
* Different user roles have access to their respective features.

---

## ✨ Key Features

### 🛒 Shopping Experience

* Browse products from multiple sellers.
* Search products by name, seller, or category.
* Explore products using category filters.
* Filter popular and newly added products.
* Sort products by price and rating.
* Interactive product detail modal.
* Responsive product cards and product sections.
* Toast notifications for user interactions.

### ❤️ Wishlist Management

* Add products to wishlist.
* Remove products from wishlist.
* View shortlisted products separately.
* Toggle wishlist directly from product cards.

### 🧺 Shopping Cart

* Add products to the shopping cart.
* Increase or decrease product quantities.
* Remove individual products.
* Automatically calculate cart subtotal.
* Calculate shipping charges.
* Display the estimated order total.

### 🔐 Authentication & User Management

* Login and registration interfaces.
* Authentication form validation.
* Authentication service layer.
* Centralized authentication state management.
* Protected route structure.
* Customer profile interface.
* Role-oriented access structure.

### 🛡️ Admin Dashboard

* Dedicated admin dashboard.
* Separate admin page structure.
* Protected administrative routes.
* Foundation for marketplace administration.

### 🏪 Seller Experience

* Seller application interface.
* Seller onboarding experience.
* Foundation for independent vendor operations.

### ⚙️ Backend Architecture

* Separate Node.js server directory.
* Organized backend source structure.
* API integration through Axios.
* Environment variable configuration.
* Backend development and production scripts.
* Database seeding script.

---

## 🧰 Technology Stack

| Technology        | Purpose                                |
| ----------------- | -------------------------------------- |
| React.js          | Component-based user interface         |
| Vite              | Frontend development and build tooling |
| JavaScript (ES6+) | Application logic                      |
| Node.js           | Backend runtime                        |
| Express.js        | Backend API framework                  |
| MongoDB           | Database                               |
| Mongoose          | Database object modeling               |
| Axios             | API communication                      |
| React Router      | Application navigation                 |
| Zustand           | Client-side state management           |
| React Hook Form   | Form handling                          |
| Zod               | Form validation                        |
| Lucide React      | Icons                                  |
| Sonner            | Toast notifications                    |
| CSS3              | Responsive styling                     |
| Git & GitHub      | Version control and collaboration      |

---

## 🏗️ Project Structure

The project follows a modular architecture with separate frontend and backend directories.

```text
Retail-E-commerce-project-1/
│
├── public/
│   ├── products/
│   └── videos/
│
├── server/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── test_e2e.js
│
├── src/
│   │
│   ├── components/
│   │   └── auth/
│   │       ├── Field.jsx
│   │       └── RequireAuth.jsx
│   │
│   ├── data/
│   │   ├── productDetails.js
│   │   └── products.js
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── AuthPages.jsx
│   │   │   └── schemas.js
│   │   │
│   │   └── ProfilePage.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   │
│   ├── store/
│   │   └── authStore.js
│   │
│   ├── styles/
│   │   └── auth.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

### Core Modules

| Module                   | Responsibility                     |
| ------------------------ | ---------------------------------- |
| `App.jsx`                | Main marketplace application       |
| `main.jsx`               | Application entry point            |
| `products.js`            | Marketplace product data           |
| `productDetails.js`      | Detailed product information       |
| `ProductDetailModal.jsx` | Product detail interface           |
| `AuthPages.jsx`          | Login and registration interfaces  |
| `Field.jsx`              | Reusable authentication form field |
| `RequireAuth.jsx`        | Protected route component          |
| `schemas.js`             | Form validation schemas            |
| `AdminDashboard.jsx`     | Admin dashboard                    |
| `ProfilePage.jsx`        | Customer profile                   |
| `api.js`                 | Centralized API configuration      |
| `authService.js`         | Authentication API services        |
| `authStore.js`           | Authentication state management    |
| `styles.css`             | Main marketplace styling           |
| `auth.css`               | Authentication-related styling     |

---

## ⚙️ Getting Started

Follow these instructions to run SwiftCart locally.

### Prerequisites

Make sure you have installed:

* Node.js 20.19+ or 22.12+
* npm
* Git
* Visual Studio Code
* MongoDB (if required by your backend configuration)

Verify your installation:

```bash
node -v
npm -v
git --version
```

### 1. Clone the Repository

```bash
git clone https://github.com/Rishijdv04/Retail-E-commerce-project-1.git
```

### 2. Navigate to the Project

```bash
cd Retail-E-commerce-project-1
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 5. Configure Environment Variables

Navigate to the server directory and create a `.env` file using `.env.example` as a reference.

```bash
cd server
```

Configure the environment variables required by your backend.

Never commit your actual `.env` file or expose sensitive credentials.

Return to the root directory:

```bash
cd ..
```

### 6. Seed Demo Data (If Required)

```bash
npm run server:seed
```

This runs the backend database seeding script.

### 7. Start the Backend Server

```bash
npm run server:dev
```

Alternatively, use:

```bash
npm run server
```

### 8. Start the Frontend

Open a second terminal in the project root directory:

```bash
npm run dev
```

### 9. Open in Browser

Vite will provide a local development URL, generally:

```text
http://localhost:5173
```

---

## 📱 Responsive Experience

SwiftCart aims to provide a consistent shopping experience across different screen sizes.

| Device  | Design Support                         |
| ------- | -------------------------------------- |
| Desktop | Full marketplace layout                |
| Laptop  | Optimized shopping interface           |
| Tablet  | Adaptive product grids                 |
| Mobile  | Mobile-friendly navigation and layouts |

---

## 🔭 Development Roadmap

SwiftCart is being developed in phases to gradually evolve into a complete multi-vendor marketplace.

### Phase 1 — Marketplace Frontend

* [x] Product listing interface
* [x] Search and category filters
* [x] Product sorting
* [x] Wishlist interface
* [x] Shopping cart
* [x] Cart quantity management
* [x] Product detail interface
* [x] Seller application UI

### Phase 2 — Authentication & User Management

* [x] Login and registration interfaces
* [x] Authentication service structure
* [x] Authentication state management
* [x] Protected route structure
* [x] Profile interface
* [ ] Complete backend authentication verification
* [ ] Secure session management

### Phase 3 — Backend Integration

* [x] Separate backend directory
* [x] Backend server entry point
* [x] API service integration structure
* [x] Environment configuration template
* [x] Database seeding script
* [ ] Complete API validation and testing
* [ ] Production security configuration

### Phase 4 — Vendor Management

* [ ] Vendor registration and approval
* [ ] Vendor dashboard
* [ ] Add, edit, and delete products
* [ ] Product image uploads
* [ ] Inventory management
* [ ] Vendor-specific order management

### Phase 5 — Admin Management

* [x] Admin dashboard interface
* [x] Dedicated admin page structure
* [ ] Customer management
* [ ] Vendor approval and management
* [ ] Product and category management
* [ ] Marketplace analytics

### Phase 6 — Orders & Payments

* [ ] Secure checkout
* [ ] Address management
* [ ] Order creation
* [ ] Vendor-wise order splitting
* [ ] Payment gateway integration
* [ ] Order tracking
* [ ] Order history

### Phase 7 — Production Readiness

* [ ] Complete database integration
* [ ] Backend validation
* [ ] Security testing
* [ ] Performance optimization
* [ ] Deployment and monitoring

---

## 🔐 Security Considerations

Security is an important part of the SwiftCart architecture.

The platform aims to incorporate:

* Secure password hashing.
* JWT-based authentication or an equivalent secure session mechanism.
* Server-side role-based authorization.
* Protected API endpoints.
* Input validation and sanitization.
* Environment-based secret management.
* Vendor-scoped product and order access.
* Secure payment processing.

**Important:** Frontend route protection alone does not provide security. All sensitive operations must be validated and authorized by the backend.

---

## 🤝 Contributing

SwiftCart is developed collaboratively as a team project.

Contributors are encouraged to follow the team's Git workflow.

### Development Workflow

**1. Get the latest main branch**

```bash
git checkout main
git pull origin main
```

**2. Switch to your feature branch**

```bash
git checkout vinita
```

**3. Merge the latest main changes**

```bash
git merge main
```

**4. Make your changes and test locally**

```bash
npm run dev
```

**5. Stage and commit your changes**

```bash
git add .
git commit -m "Describe your changes"
```

**6. Push your branch**

```bash
git push origin vinita
```

**7. Create a Pull Request**

* Base branch: `main`
* Compare branch: `vinita`
* Provide a meaningful title and description.
* Review changes before merging.

### Contribution Guidelines

* Keep changes focused and organized.
* Follow the existing project structure.
* Avoid committing unnecessary files.
* Test your changes before creating a PR.
* Resolve merge conflicts carefully.
* Never commit passwords, API keys, or sensitive credentials.

---

## 👥 Team Development

SwiftCart is a collaborative development project.

The team works together to improve the marketplace experience, implement new features, maintain code quality, and gradually introduce backend functionality.

Contributions, suggestions, and improvements are welcome.

---

## 📌 Project Direction

```text
Marketplace Frontend
        |
        v
Authentication & User Management
        |
        v
Backend API Integration
        |
        v
Vendor & Admin Management
        |
        v
Orders & Payments
        |
        v
Production-Ready Marketplace
```

---

<p align="center">
  <strong>SwiftCart — Building a better multi-vendor shopping experience, one feature at a time. 🛍️</strong>
</p>
