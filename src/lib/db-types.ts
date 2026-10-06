import type {
  Product as PrismaProduct,
  Category as PrismaCategory,
  Inventory as PrismaInventory,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  User as PrismaUser,
  Address as PrismaAddress,
  Coupon as PrismaCoupon,
  Offer as PrismaOffer,
  StoreSettings as PrismaStoreSettings,
  DeliverySlot as PrismaDeliverySlot,
} from "@prisma/client";

import type {
  AdminProduct,
  AdminCategory,
  AdminOrder,
  AdminOrderItem,
  AdminCustomer,
  AdminCoupon,
  AdminOffer,
  StoreSettings as AdminStoreSettings,
} from "./admin/types";

import type { Product as CustomerProduct } from "@/components/home/ProductSection";

/**
 * Type mapper: Prisma Product + Inventory -> Customer Storefront Product
 */
export function prismaToCustomerProduct(
  p: PrismaProduct & {
    category?: { name: string };
    inventory?: PrismaInventory | null;
  }
): CustomerProduct {
  const priceNum = Number(p.sellingPrice);
  const oldPriceNum = Number(p.mrp);
  const inStock = (p.inventory?.quantity ?? 0) > 0;

  return {
    id: p.slug || p.id,
    name: p.name,
    category: p.category?.name ?? "General",
    price: `₹${priceNum}`,
    priceNum,
    originalPrice: `₹${oldPriceNum}`,
    oldPrice: `₹${oldPriceNum}`,
    oldPriceNum,
    unit: p.unit,
    quantity: p.unit,
    image: p.image || "/images/categories/home.svg",
    discount: p.discount ? `${Number(p.discount)}% OFF` : undefined,
    inStock,
    description: p.description ?? undefined,
  };
}

/**
 * Type mapper: Prisma Product + Inventory -> Admin Product
 */
export function prismaToAdminProduct(
  p: PrismaProduct & {
    category: PrismaCategory;
    inventory?: PrismaInventory | null;
  }
): AdminProduct {
  const sellingPrice = Number(p.sellingPrice);
  const mrp = Number(p.mrp);
  const stock = p.inventory?.quantity ?? 0;
  const lowStockThreshold = p.inventory?.lowStockThreshold ?? 10;

  let status: "active" | "disabled" | "out_of_stock" = "active";
  if (!p.isActive) {
    status = "disabled";
  } else if (stock <= 0) {
    status = "out_of_stock";
  }

  return {
    id: p.id,
    name: p.name,
    hindiName: p.hindiName ?? undefined,
    category: p.category.name,
    description: p.description ?? "",
    sellingPrice,
    mrp,
    discountPercent: p.discount ? Number(p.discount) : 0,
    unit: p.unit,
    stock,
    lowStockThreshold,
    brand: p.brand ?? "",
    sku: p.sku,
    image: p.image,
    featured: p.isFeatured,
    status,
  };
}

/**
 * Type mapper: Prisma Category -> Admin Category
 */
export function prismaToAdminCategory(
  c: PrismaCategory & { _count?: { products: number } }
): AdminCategory {
  return {
    id: c.id,
    name: c.name,
    hindiName: c.hindiName ?? undefined,
    shortName: c.name.split(" ")[0],
    description: c.description ?? "",
    itemCount: c._count?.products ?? 0,
    status: c.isActive ? "active" : "disabled",
    displayOrder: c.displayOrder,
    icon: c.image || "/images/categories/home.svg",
  };
}

/**
 * Type mapper: Prisma Order -> Admin Order
 */
export function prismaToAdminOrder(
  o: PrismaOrder & {
    user: Pick<PrismaUser, "id" | "name" | "phone" | "email">;
    items: PrismaOrderItem[];
  }
): AdminOrder {
  const addr = (o.deliveryAddressSnapshot as any) || {};

  const statusMap: Record<string, AdminOrder["status"]> = {
    NEW: "New",
    ACCEPTED: "Accepted",
    PREPARING: "Preparing",
    PACKED: "Packed",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const paymentMap: Record<string, AdminOrder["paymentMethod"]> = {
    COD: "Cash on Delivery",
    UPI: "UPI",
    CARD: "Card",
  };

  return {
    orderId: o.orderNumber,
    customerName: addr.name || o.user.name,
    customerPhone: addr.phone || o.user.phone,
    customerEmail: o.user.email || "",
    deliveryAddress: addr.addressLine
      ? `${addr.addressLine}${addr.city ? `, ${addr.city}` : ""}`
      : "Address not recorded",
    items: o.items.map((i) => ({
      id: i.id,
      name: i.productNameSnapshot,
      unit: "pack",
      price: Number(i.unitPrice),
      quantity: i.quantity,
      image: "/images/categories/home.svg",
    })),
    subtotal: Number(o.subtotal),
    deliveryFee: Number(o.deliveryFee),
    discount: Number(o.discount),
    total: Number(o.total),
    paymentMethod: paymentMap[o.paymentMethod] || "Cash on Delivery",
    paymentStatus: o.paymentStatus === "PAID" ? "Paid" : "Pending",
    status: statusMap[o.status] || "New",
    createdAt: o.createdAt.toISOString(),
    notes: o.notes ?? undefined,
  };
}

/**
 * Type mapper: Prisma User -> Admin Customer
 */
export function prismaToAdminCustomer(
  u: PrismaUser & {
    addresses?: PrismaAddress[];
    orders?: PrismaOrder[];
  }
): AdminCustomer {
  const orders = u.orders ?? [];
  const totalSpent = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const defaultAddr = u.addresses?.find((a) => a.isDefault) ?? u.addresses?.[0];

  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email ?? "",
    address: defaultAddr
      ? `${defaultAddr.addressLine}, ${defaultAddr.city}`
      : "No address on file",
    totalOrders: orders.length,
    totalSpent: Math.round(totalSpent * 100) / 100,
    lastOrderDate: orders[0]?.createdAt.toISOString() || "Never",
    status: u.isActive ? "active" : "inactive",
    joinedDate: u.createdAt.toISOString(),
  };
}

/**
 * Type mapper: Prisma StoreSettings -> Admin StoreSettings
 */
export function prismaToAdminStoreSettings(s: PrismaStoreSettings): AdminStoreSettings {
  return {
    storeName: s.storeName,
    tagline: s.tagline ?? "",
    ownerName: "Ramesh Gupta",
    phone: s.storePhone,
    email: s.storeEmail,
    address: s.storeAddress,
    city: s.city,
    pincode: s.pincode,
    openingTime: s.openingTime,
    closingTime: s.closingTime,
    isOpen: s.isOpen,
    upiId: s.upiId ?? "",
    acceptOnlinePayment: s.acceptOnlinePayment,
    acceptCod: s.acceptCod,
    gstNumber: s.gstNumber ?? undefined,
    kiranaLicenseNo: s.kiranaLicenseNo ?? undefined,
  };
}
