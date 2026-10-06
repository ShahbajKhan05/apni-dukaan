# ApniDukaan Database & Backend Documentation

## 1. Database Choice & Overview
- **Database**: PostgreSQL (Relational)
- **ORM**: Prisma ORM (`@prisma/client` & `prisma` v6.19.3)
- **Language**: TypeScript 5
- **Currency Handling**: Safe fixed-point `Decimal` (`@db.Decimal(10, 2)`) for all financial amounts (prices, MRPs, subtotals, delivery fees, discounts, and order totals). No floats are used for money.

---

## 2. Environment Variables (`.env.example`)
```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apnidukaan?schema=public"

# Auth Secret (Minimum 32 characters)
AUTH_SECRET="dev-secret-key-change-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Store Configuration Defaults
STORE_NAME="ApniDukaan Kirana"
STORE_PHONE="+91 98765 43210"
STORE_CITY="Rewa"

NODE_ENV="development"
```

---

## 3. Core Database Models & Enums

### Entities (19 Models):
1. **`User`**: Store owner, staff, and customers (`id`, `name`, `email`, `phone`, `role`, `passwordHash`, `avatar`, `isActive`, `createdAt`, `updatedAt`).
2. **`Address`**: Delivery locations (`id`, `userId`, `label`, `name`, `phone`, `addressLine`, `area`, `city`, `state`, `postalCode`, `latitude`, `longitude`, `isDefault`).
3. **`Category`**: Departments (`id`, `name`, `hindiName`, `slug`, `description`, `image`, `displayOrder`, `isActive`).
4. **`Product`**: Kirana products (`id`, `name`, `hindiName`, `slug`, `brand`, `categoryId`, `image`, `unit`, `sellingPrice`, `mrp`, `discount`, `sku`, `isFeatured`, `isActive`).
5. **`ProductVariant`**: Optional variant sizes like 500ml vs 1L or 5kg vs 10kg (`id`, `productId`, `name`, `unit`, `sellingPrice`, `mrp`, `sku`, `isActive`).
6. **`Inventory`**: Stock tracking (`id`, `productId`, `variantId`, `quantity`, `lowStockThreshold`, `updatedAt`).
7. **`InventoryTransaction`**: Stock audit ledger (`id`, `inventoryId`, `type`, `quantity`, `previousQuantity`, `newQuantity`, `reason`, `referenceId`, `createdById`, `createdAt`).
8. **`Cart` & `CartItem`**: Persistent user cart (`cartId`, `productId`, `variantId`, `quantity`, `priceAtAddition`).
9. **`Wishlist` & `WishlistItem`**: Saved items with uniqueness (`wishlistId`, `productId`).
10. **`Order`**: Order header (`orderNumber`, `userId`, `status`, `subtotal`, `deliveryFee`, `discount`, `total`, `paymentStatus`, `paymentMethod`, `deliveryAddressSnapshot`, `couponCode`, `deliverySlotId`).
11. **`OrderItem`**: Historical frozen snapshot (`orderId`, `productId`, `variantId`, `productNameSnapshot`, `unitPrice`, `quantity`, `subtotal`).
12. **`Coupon`**: Promo codes (`code`, `type`, `value`, `minimumOrder`, `maximumDiscount`, `usageLimit`, `usedCount`, `startsAt`, `expiresAt`, `isActive`).
13. **`CouponUsage`**: User redemptions (`couponId`, `userId`, `orderId`, `discountAmount`).
14. **`Offer`**: Store banners and promotions (`title`, `type`, `value`, `badge`, `productId`, `categoryId`, `startsAt`, `expiresAt`, `isActive`).
15. **`DeliverySlot`**: Delivery windows (`name`, `startTime`, `endTime`, `maxOrders`, `isActive`).
16. **`StoreSettings`**: Local store operating hours, radius, free delivery threshold, and UPI ID.
17. **`Notification`**: System alerts (`userId`, `type`, `title`, `message`, `isRead`).

### Enums:
- `UserRole`: `CUSTOMER`, `ADMIN`, `OWNER`
- `OrderStatus`: `NEW`, `ACCEPTED`, `PREPARING`, `PACKED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`
- `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`
- `PaymentMethod`: `COD`, `UPI`, `CARD`
- `InventoryTransactionType`: `PURCHASE`, `SALE`, `DAMAGE`, `EXPIRED`, `MANUAL_ADJUSTMENT`, `RETURN`
- `CouponType`: `PERCENTAGE`, `FIXED`, `FREE_DELIVERY`
- `OfferType`: `PERCENTAGE`, `BOGO`, `FIXED`, `FREE_DELIVERY`
- `AddressLabel`: `HOME`, `WORK`, `OTHER`
- `NotificationType`: `ORDER_CREATED`, `ORDER_STATUS_CHANGED`, `LOW_STOCK`, `PROMOTION`, `GENERAL`

---

## 4. Key Relationships & Architecture
```
User (1) ──── (N) Addresses
User (1) ──── (1) Cart (1) ──── (N) CartItems
User (1) ──── (1) Wishlist (1) ─ (N) WishlistItems
User (1) ──── (N) Orders (1) ─── (N) OrderItems
User (1) ──── (N) Notifications

Category (1) ─ (N) Products (1) ── (N) Variants
                     │   │
                     │   └── (1) Inventory (1) ── (N) InventoryTransactions
                     ├── (N) OrderItems
                     ├── (N) CartItems
                     └── (N) WishlistItems

StoreSettings (Single record: "default")
DeliverySlots (N)
Coupons (1) ── (N) CouponUsages
Offers (N)
```

---

## 5. Important Business Rules Prepared in Schema

1. **Price Integrity (Never Trust Frontend Prices)**:
   Frontend cart item prices are never trusted at checkout. Current database prices are read in an atomic transaction to compute the order subtotal.
2. **Order Historical Immutability**:
   `OrderItem` stores frozen snapshots of `productNameSnapshot` and `unitPrice`. Price or name adjustments made later by the store owner never mutate historical invoices.
3. **Delivery Address Snapshot**:
   `Order.deliveryAddressSnapshot` records the exact delivery address (name, phone, line, area, city, pincode) at the instant of order placement.
4. **Controlled Order State Machine**:
   Strict transition flow: `NEW` ➔ `ACCEPTED` ➔ `PREPARING` ➔ `PACKED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`. Any non-terminal state may transition to `CANCELLED`. Terminal states (`DELIVERED`, `CANCELLED`) cannot be arbitrarily altered.
5. **Traceable Inventory Ledger**:
   Stock reductions do not occur silently. Every stock change creates an `InventoryTransaction` record documenting quantity delta, previous quantity, new quantity, and reason.
6. **Soft Deletions for Relational Integrity**:
   Products and categories feature an `isActive` toggle. Disabling a category or product prevents future orders while preserving past order relationships.

---

## 6. Migration and Seed Commands

### Generate Prisma Client:
```bash
npm run db:generate
# or: npx prisma generate
```

### Push Schema to Database:
```bash
npm run db:push
# or: npx prisma db push
```

### Create and Apply Migration:
```bash
npm run db:migrate
# or: npx prisma migrate dev
```

### Run Seed Script:
```bash
npm run db:seed
# or: npx tsx prisma/seed.ts
```
The seed script populates 21 authentic Kirana categories, 45+ products with variants and stock levels, 8 users (1 owner, 1 admin, 6 customers), customer delivery addresses, 10 orders across all statuses, active coupons, and store settings.

> **Note**: Database operations (`db:push`, `db:migrate`, `db:seed`) require a running PostgreSQL instance specified in `DATABASE_URL`.
