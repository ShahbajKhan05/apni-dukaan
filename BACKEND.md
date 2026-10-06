# ApniDukaan Backend Architecture & Database Documentation

ApniDukaan is an Indian kirana store management and hyperlocal customer ordering platform. This document outlines the backend foundation, database schema, transactional order workflows, and API architecture established in **Phase 5**.

---

## 1. Technology Stack

- **Framework**: Next.js 16 (App Router with Server Components, Route Handlers, and Server Actions)
- **Language**: TypeScript 5 (Strict Mode)
- **Database**: PostgreSQL
- **ORM & Data Modeling**: Prisma ORM (v6.19.3)
- **Safe Currency Math**: Prisma `Decimal` (`@db.Decimal(10, 2)`) for non-floating-point financial calculations

---

## 2. Architecture & Data Flow

```
                      CUSTOMER STOREFRONT (Web / Mobile)
                                      ↕
                    NEXT.JS ROUTE HANDLERS (/api/*)
                                      ↕
                     BUSINESS LOGIC / SERVICE LAYER
            (orderService, inventoryService, couponService, etc.)
                                      ↕
                           ATOMIC TRANSACTIONS
                         (Prisma $transaction)
                                      ↕
                             POSTGRESQL DATABASE
                                      ↕
                     ADMIN PANEL DASHBOARD (/admin/*)
```

### Core Business Guarantees:
1. **Never Trust Frontend Values**: Frontend cart prices, discounts, and totals are re-calculated and verified server-side against live database records.
2. **Atomic Order Placement**: Stock verification, price snapshotting, order creation, inventory decrements, and inventory audit transactions (`SALE`) execute in a single ACID transaction.
3. **Controlled Order State Transitions**:
   - `NEW` ➔ `ACCEPTED` | `CANCELLED`
   - `ACCEPTED` ➔ `PREPARING` | `CANCELLED`
   - `PREPARING` ➔ `PACKED` | `CANCELLED`
   - `PACKED` ➔ `OUT_FOR_DELIVERY` | `CANCELLED`
   - `OUT_FOR_DELIVERY` ➔ `DELIVERED` | `CANCELLED`
   - Terminal states (`DELIVERED`, `CANCELLED`) cannot be arbitrarily rolled back.
4. **Historical Immutability**: `OrderItem` stores snapshots of `productNameSnapshot` and `unitPrice`. Price or name changes made later by the Dukaan owner never mutate past invoices.
5. **Audited Inventory Tracking**: Any stock delta creates an `InventoryTransaction` with types: `PURCHASE`, `SALE`, `DAMAGE`, `EXPIRED`, `MANUAL_ADJUSTMENT`, or `RETURN`.

---

## 3. Database Entities & Schema (`prisma/schema.prisma`)

| Entity | Description | Key Relationships |
|---|---|---|
| `User` | Customers, Admins, and Dukaan Owner | `addresses`, `orders`, `cart`, `wishlist`, `notifications` |
| `Address` | Customer delivery locations (GPS + Text) | `user` |
| `Category` | Kirana departments with display ordering | `products`, `offers` |
| `Product` | Kirana items with Decimal pricing & SKU | `category`, `variants`, `inventory`, `orderItems` |
| `ProductVariant` | Optional pack sizes (e.g. 500ml vs 1L, 1kg vs 5kg) | `product`, `inventory`, `orderItems` |
| `Inventory` | Real-time stock counts and low-stock alerts | `product`, `variant`, `transactions` |
| `InventoryTransaction` | Immutable stock movement ledger | `inventory`, `createdBy` |
| `Order` | Order header with frozen address snapshot | `user`, `items`, `couponUsage`, `deliverySlot` |
| `OrderItem` | Item snapshots (frozen price & name) | `order`, `product`, `variant` |
| `Cart` & `CartItem` | Persistent shopping bag | `user`, `product`, `variant` |
| `Wishlist` & `WishlistItem` | Saved favorites with duplicate prevention | `user`, `product` |
| `Coupon` & `CouponUsage` | Promo codes with server-side validation | `usages`, `order`, `user` |
| `Offer` | Promotional banners and category discounts | `product`, `category` |
| `DeliverySlot` | Time windows for local kirana dispatch | `orders` |
| `StoreSettings` | Dukaan hours, delivery radius & fee thresholds | Single record (`default`) |
| `Notification` | In-app alerts for order updates and low stock | `user` |

---

## 4. Environment Variables (`.env.example`)

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apnidukaan?schema=public"

# Authentication & Security
AUTH_SECRET="your-super-secret-auth-key-change-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Store Configuration Defaults
STORE_NAME="ApniDukaan Kirana"
STORE_PHONE="+91 98765 43210"
STORE_CITY="Rewa"

# Environment
NODE_ENV="development"
```

---

## 5. Setup, Migrations & Seeding

### 1. Install Dependencies & Generate Prisma Client
```bash
npm install
npm run db:generate
```

### 2. Push Schema to Database (Development)
```bash
npm run db:push
```

### 3. Run Production Migrations
```bash
npm run db:migrate
```

### 4. Seed Database with Realistic Indian Kirana Data
```bash
npm run db:seed
```

The seed script creates:
- **1 Store Owner** (`Ramesh Gupta`), **1 Store Manager** (`Suresh Sharma`), and **4 Customers** with addresses in Rewa, MP.
- **4 Delivery Slots** (Morning, Midday, Evening, Night Express).
- **21 Authentic Kirana Categories** (Vegetables & Fruits, Dairy & Bread, Atta/Rice/Dal, Masalas, Edible Oils, etc.).
- **40+ Products** with accurate MRPs, selling prices, units, and stock quantities (including low-stock and out-of-stock samples).
- **4 Historical Orders** across different lifecycle statuses (`DELIVERED`, `OUT_FOR_DELIVERY`, `PREPARING`, `NEW`).
- **3 Active Coupons** (`WELCOME50`, `KIRANA10`, `FREEDEL`).
- **Store Settings & Policies** (Free delivery above ₹199, 15-30 min delivery radius).

---

## 6. Server & API Operations

All endpoints return standardized JSON envelopes:
- Success: `{ "success": true, "data": ..., "meta": { ... } }`
- Error: `{ "success": false, "error": { "code": "INSUFFICIENT_STOCK", "message": "..." } }`

### Products
- `GET /api/products` — Filter by `category`, `search`, `featured`, `limit`, `offset`
- `POST /api/products` — Create new product with initial inventory and stock transaction
- `GET /api/products/:id` — Fetch single product with variants and stock
- `PUT /api/products/:id` — Update pricing, details, or category
- `DELETE /api/products/:id` — Soft-disable product (preserves historical order records)

### Categories
- `GET /api/categories` — List active categories with product counts
- `POST /api/categories` — Add new category with display order
- `PUT /api/categories/:id` — Update category details
- `DELETE /api/categories/:id` — Soft-disable category

### Inventory
- `GET /api/inventory` — Live inventory table with status (`in_stock`, `low_stock`, `out_of_stock`)
- `POST /api/inventory/adjust` — Adjust stock with reason and transaction audit logging

### Orders
- `GET /api/orders` — List orders (filterable by `status`, `userId`)
- `POST /api/orders` — Place order (atomic validation, pricing, and stock decrement)
- `PATCH /api/orders/:id/status` — State machine transition (`NEW` ➔ `ACCEPTED` ➔ `PREPARING` ➔ `PACKED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`)

### Customers
- `GET /api/customers` — Customer list with total orders, total spent, and default addresses

### Coupons & Offers
- `GET /api/coupons` — List available coupons
- `POST /api/coupons` — Create coupon with expiration and usage limits
- `POST /api/coupons/validate` — Validate coupon against order subtotal server-side
- `GET /api/offers` — List promotional banners and category offers

### Store Settings
- `GET /api/settings` — Get store settings and delivery slots
- `PUT /api/settings` — Update timings, delivery radius, fee, and UPI credentials

---

## 7. Security & Authentication Strategy (Next Phase)

- **Authentication**: JWT/Session-based authentication with bcrypt-hashed passwords or OTP phone verification.
- **Role-Based Access Control (RBAC)**:
  - `CUSTOMER`: Can place orders, view own order history, save addresses, manage own cart/wishlist.
  - `ADMIN`: Can manage orders, adjust inventory, view customers, and update stock.
  - `OWNER`: Full store configuration, store settings, pricing, coupons, and staff management.
- **Route Protection**: Next.js Middleware (`src/middleware.ts`) restricting `/admin/*` and `/api/admin/*` to `ADMIN` and `OWNER` roles.
- **Secrets Management**: Database credentials and secrets strictly kept server-side in `.env` (never exposed via `NEXT_PUBLIC_*`).
