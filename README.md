# साईबाबा मोटर्स — Used Cars & Bikes Platform

A modern, production-quality used cars and bikes showroom and marketplace platform built specifically for **साईबाबा मोटर्स (Sai Baba Motors)** in **Kasba Walve, Radhanagari, Kolhapur**.

---

## 🌟 Key Highlights & Features

### 🏪 Public Marketplace
- **Brand Identity**: Original Navy Blue (`#0B192C`) + Pure White + Gold (`#F59E0B`) styling with authentic Devanagari typography for **साईबाबा मोटर्स** and English subtitles.
- **Interactive Vehicle Search**: Filter across all inventory or switch between Cars & Bikes with instant URL query parameter synchronization (shareable/bookmarkable search links).
- **Cars & Bikes Pages (`/cars` & `/bikes`)**:
  - Desktop multi-filter sidebar & mobile slide-over filter drawer.
  - Filter by Brand, Model, Price Range, Model Year, Kilometers Driven, Passing / RTO (e.g. MH 09), Fuel Type, Transmission, and Ownership.
  - Sorting by Newest, Price: Low to High, Price: High to Low, Lowest Running KM, and Latest Year.
- **Vehicle Details Page (`/vehicle/:id`)**:
  - Interactive multi-photo gallery with thumbnail carousel and full-screen lightbox modal.
  - Prominently styled price (in Indian Rupee format e.g. ₹5,25,000 / ₹9.25 Lakh).
  - Clean specification grid (Engine CC, Passing, Fuel, KM, Ownership, Color, Registration).
  - **Editable "Additional Information" card** (single owner notes, tyres, insurance, etc.).
  - **One-Tap Actions**:
    - **Call Now**: Direct dialer links to Rohit Patil, Amit Pawar, and Yuvaraj Chavan.
    - **WhatsApp Enquiry**: Pre-filled message with vehicle name, year, passing, and price.
    - **Online Enquiry Form**: Customer details and inquiry saved directly to MongoDB.
- **Sell Your Vehicle (`/sell`)**:
  - Dedicated multi-section submission form for local sellers.
  - Collects vehicle specs, expected price, and allows photo uploads.
  - Saves submissions into MongoDB for showroom review.
- **Showroom Location & Direction**:
  - Kasba Walve showroom location with embedded map and direct **"Get Directions"** button linking to [Google Maps](https://maps.app.goo.gl/WQ68i3YbbE5u36jY8).
- **About Us & Contact Us**: Trustworthy local story and direct contact desk for the 3 showroom owners.

---

### 🛡️ Showroom Admin Dashboard (`/admin`)
- **Secure Authentication**: JWT-based login (`/admin/login`) with bcrypt password hashing and route protection.
- **Analytics Overview (`/admin/dashboard`)**:
  - Live metric cards: Total Inventory, Cars, Bikes, Featured, Sold, Active Listings, Customer Enquiries, and Vehicle Sell Requests.
  - Recent inquiries and sell requests tables.
- **Full Vehicle CRUD (`/admin/vehicles`)**:
  - Add & Edit vehicles through a clean multi-section modal.
  - **Zero Code Editing Required**: Showroom owners can update Price, Photos, Brand, Model, Variant, Year, Running KM, Passing (e.g., MH 09), Fuel, Transmission, Ownership, Color, Engine CC, Description, Additional Information, and Status.
  - **Instant Live Update**: Changes immediately persist to MongoDB and reflect on public pages.
  - Quick action buttons: **Mark as Sold**, **Feature on Home**, and **Delete**.
- **Customer Enquiry Management (`/admin/enquiries`)**:
  - Review customer leads with vehicle links, update status (`New` → `Contacted` → `Closed`), and call/WhatsApp customers directly.
- **Sell Requests Management (`/admin/sell-requests`)**:
  - Review customer vehicle purchase submissions, preview uploaded photos, verify expected prices, and update workflow status (`New` → `Contacted` → `Purchased` → `Rejected` → `Closed`).

---

## 👥 Showroom Partners & Contacts

| Partner Name | Phone Number | Role |
| :--- | :--- | :--- |
| **Rohit Patil** | `+91 91309 59393` | Partner & Showroom Lead |
| **Amit Pawar** | `+91 90965 45144` | Partner & Sales Head |
| **Yuvaraj Chavan** | `+91 96896 53300` | Partner & Vehicle Evaluation |

**Showroom Address**: Kasba Walve, Taluka Radhanagari, District Kolhapur, Maharashtra  
**Google Maps Location**: [https://maps.app.goo.gl/WQ68i3YbbE5u36jY8](https://maps.app.goo.gl/WQ68i3YbbE5u36jY8)  
**Business Hours**: Monday – Sunday: 9:00 AM – 8:30 PM  

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18
  - Vite
  - Tailwind CSS (with custom Navy & Gold theme)
  - Framer Motion (micro-interactions & slide drawers)
  - React Router DOM v6
  - Lucide React Icons
  - Axios (with JWT interceptors)
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose
  - JSON Web Tokens (JWT) & bcryptjs
  - Helmet (security headers with cross-origin resource policy)
  - CORS configuration
  - Express Rate Limiting
  - Multer (multi-image upload with mimetype and size checks)
  - Modular image architecture (Local static storage + Cloudinary ready)
  - Automatic In-Memory MongoDB fallback for zero-configuration testing

---

## 🚀 Getting Started & Installation

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### 1. Install All Dependencies
From the project root:
```bash
npm run install:all
```
*(Or install individually inside `/server` and `/client` directories with `npm install`)*

### 2. Environment Variables Configuration
The server includes a pre-configured `.env` file. You can adjust settings or copy from `.env.example`:
```bash
cd server
cp .env.example .env
```

**Environment Variables Reference**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/saibabamotors
JWT_SECRET=saibaba_motors_super_secure_jwt_secret_key_2026
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary Cloud Image Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> **Note on MongoDB**: If you have a local MongoDB service or MongoDB Atlas cluster running, specify its connection string in `MONGODB_URI`. If left unconfigured, the server automatically starts an embedded, high-performance in-memory MongoDB instance so the platform works out-of-the-box immediately!

---

### 3. Seed Realistic Indian Cars & Bikes Data
Seed 16 realistic vehicles (Cars: Swift, Creta, Baleno, Nexon, City, Thar, Innova Crysta, Seltos; Bikes: Classic 350, Pulsar, Splendor, Activa, Apache, MT-15, Access 125, Duke 200) with Kolhapur / Kasba Walve `MH 09` passing:
```bash
cd server
npm run seed
```

---

### 4. Run the Development Servers
From the root directory:
```bash
npm run dev
```
Or start server and client separately in two terminals:
```bash
# Terminal 1 (Backend API on http://localhost:5000)
cd server
npm run dev

# Terminal 2 (Frontend Client on http://localhost:5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Default Admin Account

To access the Showroom Admin Dashboard:
- **URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Email**: `admin@saibabamotors.com`
- **Password**: `admin123`

---

## 📡 REST API Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Admin login | Public |
| `GET` | `/api/auth/me` | Current admin profile | Admin (JWT) |
| `GET` | `/api/vehicles` | List vehicles with filters, search, sort, pagination | Public |
| `GET` | `/api/vehicles/featured` | Get featured vehicles for homepage | Public |
| `GET` | `/api/vehicles/filters` | Distinct filter options (brands, passing, min/max) | Public |
| `GET` | `/api/vehicles/:id` | Vehicle details by ID + related vehicles | Public |
| `POST` | `/api/vehicles` | Add new vehicle to showroom | Admin (JWT) |
| `PUT` | `/api/vehicles/:id` | Update vehicle info, price, photos, passing, etc. | Admin (JWT) |
| `DELETE` | `/api/vehicles/:id` | Delete vehicle listing | Admin (JWT) |
| `PATCH` | `/api/vehicles/:id/status`| Toggle status (`available`, `sold`, `inactive`) | Admin (JWT) |
| `PATCH` | `/api/vehicles/:id/featured`| Toggle featured ribbon | Admin (JWT) |
| `POST` | `/api/enquiries` | Submit customer vehicle enquiry | Public |
| `GET` | `/api/enquiries` | List all customer enquiries | Admin (JWT) |
| `PATCH` | `/api/enquiries/:id/status` | Update enquiry status (`New`, `Contacted`, `Closed`) | Admin (JWT) |
| `POST` | `/api/sell-requests` | Customer vehicle selling submission | Public |
| `GET` | `/api/sell-requests` | List all sell requests | Admin (JWT) |
| `PATCH` | `/api/sell-requests/:id/status` | Update sell request status | Admin (JWT) |
| `POST` | `/api/upload` | Upload multiple images (Multer / Cloudinary) | Public / Admin |
| `GET` | `/api/stats` | Dashboard statistics & recent items | Admin (JWT) |
| `GET` | `/api/health` | Service health check | Public |

---

## 📦 Production Build

To build the client for production:
```bash
cd client
npm run build
```
This generates optimized, minified assets into `client/dist`.

---

## 📄 License & Attribution
© 2026 **साईबाबा मोटर्स (Sai Baba Motors)**. Kasba Walve, Kolhapur. All rights reserved.
