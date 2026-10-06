export interface AdminProduct {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  categoryId?: string;
  subcategory?: string;
  description: string;
  sellingPrice: number;
  mrp: number;
  discountPercent: number;
  unit: string;
  stock: number;
  lowStockThreshold: number;
  brand: string;
  sku: string;
  image: string;
  featured: boolean;
  status: "active" | "disabled" | "out_of_stock";
}

export interface AdminCategory {
  id: string;
  name: string;
  hindiName?: string;
  shortName: string;
  description: string;
  itemCount: number;
  status: "active" | "disabled";
  displayOrder: number;
  icon: string;
}

export interface StockAdjustment {
  id: string;
  date: string;
  adjustment: number;
  reason: "Purchase" | "Sale Correction" | "Damaged" | "Expired" | "Manual Adjustment";
  newStock: number;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  lowStockThreshold: number;
  unit: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
  history: StockAdjustment[];
}

export type OrderStatus =
  | "New"
  | "Accepted"
  | "Preparing"
  | "Packed"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface AdminOrderItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AdminOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  landmark?: string;
  items: AdminOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: "UPI" | "Cash on Delivery" | "Card";
  paymentStatus: "Paid" | "Pending";
  status: OrderStatus;
  createdAt: string;
  deliveryTimeSlot?: string;
  notes?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "inactive";
  joinedDate: string;
}

export interface AdminCoupon {
  code: string;
  title: string;
  discountType: "flat" | "percentage";
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  usageCount: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  tag?: string;
}

export interface AdminOffer {
  id: string;
  title: string;
  description: string;
  categoryOrProduct: string;
  offerType: "percentage" | "bogo" | "flat" | "free_delivery";
  discountValue: string;
  badge: string;
  startDate: string;
  endDate: string;
  active: boolean;
  background: string;
}

export interface DeliverySlot {
  id: string;
  label: string;
  timeRange: string;
  active: boolean;
}

export interface DeliverySettings {
  deliveryRadiusKm: number;
  deliveryFee: number;
  freeDeliveryAbove: number;
  estimatedDeliveryTime: string;
  expressDeliveryEnabled: boolean;
  slots: DeliverySlot[];
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  upiId: string;
  acceptOnlinePayment: boolean;
  acceptCod: boolean;
  gstNumber?: string;
  kiranaLicenseNo?: string;
}
