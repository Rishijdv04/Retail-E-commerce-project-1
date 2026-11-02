# 🛍️ SwiftCart — Multi-Vendor E-Commerce Marketplace

<p align="center">
  <strong>A modern marketplace experience built with React and Vite.</strong>
  <br />
  Discover products, explore sellers, manage your shopping cart, and experience a growing multi-vendor commerce platform.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</p>

---

## 📌 Overview

**SwiftCart** is a collaborative multi-vendor e-commerce marketplace project designed to provide a seamless shopping experience for customers while building the foundation for independent seller operations.

The platform focuses on essential marketplace functionality, including product discovery, category-based browsing, search, sorting, wishlist management, shopping cart operations, and seller-related interfaces.

The project is being developed incrementally, with a focus on clean UI, reusable components, responsive layouts, and scalable application architecture.

### 🎯 Project Vision

To develop a complete multi-vendor marketplace where:

* Customers can discover and purchase products.
* Vendors can manage their own products and orders.
* Administrators can oversee marketplace operations.
* Different user roles have access to their respective features.

> **Development Status:** Frontend marketplace with authentication and role-oriented interface development in progress. Full production backend, database, payment processing, and order management are planned development areas.

---

## ✨ Key Features

### 🛒 Shopping Experience

* Browse products from multiple sellers.
* Search by product name, seller, or category.
* Explore products using category filters.
* Filter popular and newly added products.
* Sort products by price and rating.
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
* Display the final estimated order total.

### 🔐 Authentication & User Interface

* Login and registration interfaces.
* Authentication-related form validation.
* Role-oriented protected route structure.
* Customer profile interface.
* Authentication service and state management structure.

*Production-ready authentication requires a properly configured and secured backend.*

### 🛡️ Admin Interface

* Admin dashboard interface.
* Separate admin route structure.
* Foundation for marketplace administration.

*Dashboard functionality and backend-powered administrative operations are under development.*

### 🏪 Seller Experience

* Seller application form.
* Seller onboarding interface preview.
* Marketplace-focused seller experience.

*Seller application submission and vendor management require backend integration.*

---

## 🧰 Technology Stack

| Technology        | Purpose                                  |
| ----------------- | ---------------------------------------- |
| React.js          | Component-based user interface           |
| Vite              | Development server and build tooling     |
| JavaScript (ES6+) | Application logic                        |
| CSS3              | Responsive styling and layouts           |
| React Hooks       | Component state and lifecycle management |
| React Router      | Application navigation and routing       |
| Zustand           | Client-side state management             |
| React Hook Form   | Form handling                            |
| Zod               | Form schema validation                   |
| Local Demo Data   | Initial marketplace product data         |

---

## 🏗️ Application Structure

The project follows a modular React application structure.

```text
Retail-E-commerce-project-1/
│
├── public/
│   ├── products/
│   └── videos/
│
├── src/
│   │
│   ├── components/
│   │   └── auth/
│   │       ├── Field.jsx
│   │       └── RequireAuth.jsx
│   │
│   ├── data/
│   │   └── products.js
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── AuthPages.jsx
│   │   │   └── schemas.js
│   │   │
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   └── ProfilePage.jsx
│   │
│   ├── services/
│   │   └── authService.js
│   │
│   ├── store/
│   │   └── authStore.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

*Note: The structure represents the current application modules. Additional components and pages may be added as development progresses.*

### Core Modules

| Module               | Responsibility                                                        |
| -------------------- | --------------------------------------------------------------------- |
| `App.jsx`            | Main marketplace interface                                            |
| `main.jsx`           | Application entry point and routing setup                             |
| `products.js`        | Demo product information                                              |
| `AuthPages.jsx`      | Login and registration interfaces                                     |
| `RequireAuth.jsx`    | Protected route component                                             |
| `AuthDashboard.jsx`  | Authentication-related functionality is organized across auth modules |
| `AdminDashboard.jsx` | Admin dashboard interface                                             |
| `ProfilePage.jsx`    | Customer profile interface                                            |
| `authService.js`     | Authentication service layer                                          |
| `authStore.js`       | Authentication state management                                       |
| `schemas.js`         | Form validation schemas                                               |
| `styles.css`         | Main marketplace styling                                              |

---

## ⚙️ Getting Started

Follow these instructions to run SwiftCart locally.

### Prerequisites

Make sure you have the following installed:

* Node.js `20.19+` or `22.12+`
* npm
* Git
* Visual Studio Code or another code editor

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

### 3. Install Dependencies

Install root frontend and backend dependencies:

```bash
npm install
cd server && npm install && cd ..
```

### 4. Seed Demo Data (Optional)

Seed catalog products, categories, demo customers, and admin accounts into MongoDB:

```bash
npm run server:seed
```

### 5. Start the Backend API Server

Start the Express REST API (runs on http://localhost:5000 with auto-failover to in-memory MongoDB):

```bash
npm run server
```

### 6. Start the Frontend Development Server

In a second terminal window:

```bash
npm run dev
```

### 7. Open in Browser

Vite will serve the frontend at:

```text
http://localhost:5173
```

---

## 📱 Responsive Experience

SwiftCart is designed with responsive layouts to support different screen sizes.

| Device  | Design Support                                 |
| ------- | ---------------------------------------------- |
| Desktop | Full marketplace layout                        |
| Laptop  | Optimized shopping interface                   |
| Tablet  | Adaptive product grids                         |
| Mobile  | Mobile-friendly navigation and product layouts |

The interface uses responsive CSS layouts to improve usability across devices.

---

## 🔭 Development Roadmap

SwiftCart is being developed in phases to gradually evolve into a complete marketplace platform.

### Phase 1 — Marketplace Frontend

* [x] Product listing interface
* [x] Search and category filters
* [x] Product sorting
* [x] Wishlist interface
* [x] Shopping cart
* [x] Cart quantity management
* [x] Seller application UI

### Phase 2 — Authentication & User Management

* [x] Login and registration interfaces
* [x] Authentication service structure
* [x] Authentication state management structure
* [x] Protected route structure
* [x] Profile interface
* [x] Complete backend authentication integration
* [x] Secure session management
* [x] Role-based backend authorization

### Phase 3 — Vendor Management

* [ ] Vendor registration and approval
* [ ] Vendor dashboard
* [ ] Add, edit, and delete products
* [ ] Product image uploads
* [ ] Inventory management
* [ ] Vendor-specific order management

### Phase 4 — Admin Management

* [x] Admin dashboard interface
* [x] Admin backend integration
* [ ] Customer management
* [ ] Vendor approval and management
* [ ] Product and category management
* [ ] Marketplace analytics

### Phase 5 — Orders & Payments

* [x] Secure checkout
* [ ] Address management
* [x] Order creation
* [ ] Vendor-wise order splitting
* [ ] Payment gateway integration
* [ ] Order tracking
* [x] Order history

### Phase 6 — Production Readiness

* [x] Database integration (MongoDB & Mongoose)
* [x] REST API integration (Express)
* [ ] Backend validation
* [ ] Security testing
* [ ] Performance optimization
* [ ] Deployment and monitoring

---

## 🔐 Security Considerations

Security is an important part of the planned backend implementation.

The production version should include:

* Secure password hashing.
* JWT-based authentication or an equivalent secure session mechanism.
* Server-side role-based authorization.
* Protected API endpoints.
* Input validation and sanitization.
* Environment-based secret management.
* Vendor-scoped product and order access.
* Secure payment processing.
* Proper authentication and authorization checks.

> **Important:** Frontend route protection alone does not provide security. All sensitive operations must be validated and authorized by the backend.

---

## 🤝 Contributing

SwiftCart is being developed collaboratively as a team project.

Contributors are encouraged to follow the team's Git workflow.

### Development Workflow

**1. Get the latest main branch**

```bash
git checkout main
git pull origin main
```

**2. Create or switch to your feature branch**

```bash
git checkout -b feature/your-feature-name
```

**3. Make your changes and test locally**

```bash
npm install
npm run dev
```

**4. Stage and commit your changes**

```bash
git add .
git commit -m "Add your feature description"
```

**5. Push your feature branch**

```bash
git push origin feature/your-feature-name
```

**6. Create a Pull Request**

* Base branch: `main`
* Compare branch: Your feature branch
* Provide a clear title and description.
* Review the changes before merging.

### Contribution Guidelines

* Keep changes focused and organized.
* Follow the existing project structure.
* Avoid committing unnecessary files.
* Test your changes before creating a PR.
* Resolve merge conflicts carefully.
* Never commit passwords, API keys, or other secrets.

---

## 👥 Team Development

SwiftCart is a collaborative development project.

The team works together to improve the marketplace experience, implement new features, maintain code quality, and gradually introduce backend functionality.

Contributions, suggestions, and improvements are welcome.

---

## 📌 Current Project Direction

```text
Marketplace UI
      ↓
Authentication & Authorization
      ↓
Backend API Integration
      ↓
Vendor & Admin Management
      ↓
Orders & Payments
      ↓
Production-Ready Marketplace
```

**SwiftCart — Building a better multi-vendor shopping experience, one feature at a time.**
