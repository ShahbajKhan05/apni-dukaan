import {
  AdminProduct,
  AdminCategory,
  AdminOrder,
  AdminCustomer,
  AdminCoupon,
  AdminOffer,
  DeliverySettings,
  StoreSettings,
  InventoryItem,
} from "./types";

// Empty initial states for a clean store (no fake data)
export const INITIAL_ADMIN_CATEGORIES: AdminCategory[] = [];
export const INITIAL_ADMIN_PRODUCTS: AdminProduct[] = [];
export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [];
export const INITIAL_ADMIN_CUSTOMERS: AdminCustomer[] = [];
export const INITIAL_ADMIN_COUPONS: AdminCoupon[] = [];
export const INITIAL_ADMIN_OFFERS: AdminOffer[] = [];
export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [];

export const INITIAL_DELIVERY_SETTINGS: DeliverySettings = {
  deliveryRadiusKm: 0,
  deliveryFee: 0,
  freeDeliveryAbove: 0,
  estimatedDeliveryTime: "",
  expressDeliveryEnabled: false,
  slots: [],
};

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: "",
  tagline: "",
  ownerName: "Store Owner",
  phone: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
  openingTime: "",
  closingTime: "",
  isOpen: false,
  upiId: "",
  acceptOnlinePayment: false,
  acceptCod: false,
  gstNumber: "",
  kiranaLicenseNo: "",
};
