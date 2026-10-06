"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  ArrowRight,
  MapPin,
  Navigation,
  Home as HomeIcon,
  Briefcase,
  Trash2,
  Edit2,
  Package,
  FileText,
  Gift,
  HelpCircle,
  Shield,
  LogOut,
  ShoppingBag,
  Check,
  CheckCircle2,
  Search,
  ChevronRight,
  User,
  Sparkles,
  CreditCard,
  Smartphone,
  Banknote,
  Truck,
  Clock,
  Tag,
  AlertCircle,
  Info,
  Lock,
  ChevronLeft,
  Heart,
  Bell,
  ChevronDown,
  Headphones,
  PhoneCall,
  Mail,
  MessageSquare,
  CheckCheck,
  Loader2,
  Compass,
} from "lucide-react";

import Header from "@/components/layout/Header";
import CategoryNav from "@/components/home/CategoryNav";
import Hero from "@/components/home/Hero";
import PromoCards from "@/components/home/PromoCards";
import Categories from "@/components/home/Categories";
import ProductSection, {
  PRODUCTS,
  Product,
} from "@/components/home/ProductSection";
import Footer from "@/components/layout/Footer";

// =========================================================
// DATA TYPES
// =========================================================

export interface AppLocation {
  latitude?: number;
  longitude?: number;
  formattedAddress: string;
  locality?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  source: "gps" | "manual" | "saved";
}

export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  phone: string;
  email: string;
}

export interface SavedAddress {
  id: string;
  label: "Home" | "Work" | "Other";
  name: string;
  phone: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  tag?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  priceNum: number;
  image: string;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  address: SavedAddress;
  deliveryMethod: {
    type: "express" | "schedule";
    label: string;
    detail: string;
  };
  paymentMethod: "cod" | "upi" | "card";
  createdAt: string;
  status: "Order Placed" | "Preparing" | "Out for Delivery" | "Delivered";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  iconType: "order" | "offer" | "delivery";
}

// Saved Addresses (Empty clean initial state)
const INITIAL_ADDRESSES: SavedAddress[] = [];

// Popular Indian Cities & Delivery Locations for instant manual lookup
export const POPULAR_DELIVERY_CITIES: AppLocation[] = [
  { formattedAddress: "Rewa, Madhya Pradesh", locality: "Civil Lines", city: "Rewa", state: "Madhya Pradesh", country: "India", postalCode: "486001", source: "manual" },
  { formattedAddress: "Noida, Uttar Pradesh", locality: "Sector 62", city: "Noida", state: "Uttar Pradesh", country: "India", postalCode: "201301", source: "manual" },
  { formattedAddress: "Indore, Madhya Pradesh", locality: "Vijay Nagar", city: "Indore", state: "Madhya Pradesh", country: "India", postalCode: "452010", source: "manual" },
  { formattedAddress: "Bhopal, Madhya Pradesh", locality: "MP Nagar", city: "Bhopal", state: "Madhya Pradesh", country: "India", postalCode: "462011", source: "manual" },
  { formattedAddress: "Delhi, NCT", locality: "Connaught Place", city: "New Delhi", state: "Delhi", country: "India", postalCode: "110001", source: "manual" },
  { formattedAddress: "Gurugram, Haryana", locality: "Cyber City", city: "Gurugram", state: "Haryana", country: "India", postalCode: "122002", source: "manual" },
  { formattedAddress: "Bengaluru, Karnataka", locality: "Koramangala", city: "Bengaluru", state: "Karnataka", country: "India", postalCode: "560034", source: "manual" },
  { formattedAddress: "Mumbai, Maharashtra", locality: "Bandra West", city: "Mumbai", state: "Maharashtra", country: "India", postalCode: "400050", source: "manual" },
  { formattedAddress: "Pune, Maharashtra", locality: "Kothrud", city: "Pune", state: "Maharashtra", country: "India", postalCode: "411038", source: "manual" },
  { formattedAddress: "Hyderabad, Telangana", locality: "Hitech City", city: "Hyderabad", state: "Telangana", country: "India", postalCode: "500081", source: "manual" },
  { formattedAddress: "Jaipur, Rajasthan", locality: "Malviya Nagar", city: "Jaipur", state: "Rajasthan", country: "India", postalCode: "302017", source: "manual" },
  { formattedAddress: "Lucknow, Uttar Pradesh", locality: "Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh", country: "India", postalCode: "226010", source: "manual" },
  { formattedAddress: "Jabalpur, Madhya Pradesh", locality: "Wright Town", city: "Jabalpur", state: "Madhya Pradesh", country: "India", postalCode: "482002", source: "manual" },
  { formattedAddress: "Gwalior, Madhya Pradesh", locality: "City Centre", city: "Gwalior", state: "Madhya Pradesh", country: "India", postalCode: "474011", source: "manual" },
  { formattedAddress: "Satna, Madhya Pradesh", locality: "Station Road", city: "Satna", state: "Madhya Pradesh", country: "India", postalCode: "485001", source: "manual" },
  { formattedAddress: "Varanasi, Uttar Pradesh", locality: "Cantt", city: "Varanasi", state: "Uttar Pradesh", country: "India", postalCode: "221002", source: "manual" },
  { formattedAddress: "Prayagraj, Uttar Pradesh", locality: "Civil Lines", city: "Prayagraj", state: "Uttar Pradesh", country: "India", postalCode: "211001", source: "manual" },
  { formattedAddress: "Chandigarh, Punjab", locality: "Sector 17", city: "Chandigarh", state: "Chandigarh", country: "India", postalCode: "160017", source: "manual" },
  { formattedAddress: "Ahmedabad, Gujarat", locality: "Navrangpura", city: "Ahmedabad", state: "Gujarat", country: "India", postalCode: "380009", source: "manual" },
  { formattedAddress: "Kolkata, West Bengal", locality: "Park Street", city: "Kolkata", state: "West Bengal", country: "India", postalCode: "700016", source: "manual" },
];

// Delivery Slots
const DELIVERY_SLOTS = [
  {
    id: "express",
    type: "express" as const,
    label: "⚡ Express Delivery",
    subtext: "Instant 8–15 mins delivery",
    badge: "Fastest",
  },
  {
    id: "slot-1",
    type: "schedule" as const,
    label: "Today: 10:00 AM – 12:00 PM",
    subtext: "Morning delivery window",
    badge: "",
  },
  {
    id: "slot-2",
    type: "schedule" as const,
    label: "Today: 12:00 PM – 2:00 PM",
    subtext: "Afternoon delivery window",
    badge: "",
  },
  {
    id: "slot-3",
    type: "schedule" as const,
    label: "Today: 4:00 PM – 6:00 PM",
    subtext: "Evening delivery window",
    badge: "",
  },
];

// Initial orders (Empty clean store)
const INITIAL_ORDERS: Order[] = [];

// Initial Notifications (Empty clean store)
const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

// Available Coupons (Loaded from store configuration/database)
const AVAILABLE_COUPONS: Array<{
  code: string;
  title: string;
  description: string;
  tag: string;
  minOrder: number;
}> = [];

export default function Home() {
  // =========================================================
  // STATE MANAGEMENT
  // =========================================================

  // 1. Search & Filter State (Phase 9)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [highlightedProduct, setHighlightedProduct] = useState<string | null>(null);

  // Dynamic Store Data from Database
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Array<{ id: string; name: string; shortName: string; icon: string }>>([]);
  const [offersList, setOffersList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStoreData() {
      try {
        // Fetch products
        const pRes = await fetch("/api/products");
        if (pRes.ok) {
          const pData = await pRes.json();
          if (Array.isArray(pData.data)) {
            const mapped: Product[] = pData.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: typeof p.category === "string" ? p.category : p.category?.name || "General",
              price: `₹${p.sellingPrice}`,
              priceNum: Number(p.sellingPrice),
              originalPrice: p.mrp ? `₹${p.mrp}` : undefined,
              oldPrice: p.mrp ? `₹${p.mrp}` : undefined,
              oldPriceNum: p.mrp ? Number(p.mrp) : undefined,
              unit: p.unit || "unit",
              quantity: p.unit || "1 pc",
              image: p.image || "/images/categories/home.svg",
              discount: p.mrp && p.sellingPrice < p.mrp
                ? `${Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100)}% OFF`
                : undefined,
              inStock: (p.stock ?? p.inventory?.currentStock ?? 0) > 0,
              description: p.description ? p.description.replace("[DEMO_APNIDUKAAN] ", "") : undefined,
            }));
            setProductsList(mapped);
          }
        }

        // Fetch categories
        const cRes = await fetch("/api/categories");
        if (cRes.ok) {
          const cData = await cRes.json();
          if (Array.isArray(cData.data)) {
            const mappedCats = [
              { id: "all", name: "All", shortName: "All", icon: "/images/categories/home.svg" },
              ...cData.data.map((c: any) => ({
                id: c.slug || c.id,
                name: c.name,
                shortName: c.shortName || c.name,
                icon: c.image || c.icon || "/images/categories/home.svg",
              })),
            ];
            setCategoriesList(mappedCats);
          }
        }

        // Fetch offers
        const oRes = await fetch("/api/offers");
        if (oRes.ok) {
          const oData = await oRes.json();
          if (Array.isArray(oData.data)) {
            const bgGradients = ["#FEF3C7", "#EFF6FF", "#ECFDF5", "#FDF2E9"];
            const mappedOffers = oData.data.map((o: any, idx: number) => ({
              title: o.title,
              description: o.description ? o.description.replace("[DEMO_APNIDUKAAN] ", "") : "Special store offer",
              offerBadge: o.badge || (o.value ? `${o.value}% OFF` : "SPECIAL"),
              background: bgGradients[idx % bgGradients.length],
              image: "/images/products/fruits.svg",
            }));
            setOffersList(mappedOffers);
          }
        }
      } catch (err) {
        console.error("Failed to fetch customer storefront data:", err);
      }
    }

    fetchStoreData();
  }, []);

  // 2. Product Experience State (Phase 10)
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // 3. Offers, Coupons & Promotions State (Phase 11)
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // 4. User, Authentication & Profile State (Phase 6 & 12)
  const [user, setUser] = useState<UserProfile>({
    isLoggedIn: false,
    name: "",
    phone: "",
    email: "",
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginStep, setLoginStep] = useState<"phone" | "otp">("phone");
  const [mobileInput, setMobileInput] = useState("");
  const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pendingCheckoutAfterLogin, setPendingCheckoutAfterLogin] = useState(false);

  // 5. Account Dashboard & Sub-tabs State (Phase 12)
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAccountDashboardOpen, setIsAccountDashboardOpen] = useState(false);
  const [accountDashboardTab, setAccountDashboardTab] = useState<
    "profile" | "orders" | "addresses" | "wishlist" | "coupons" | "notifications" | "help" | "faq" | "privacy"
  >("profile");

  // Profile Edit State
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Wishlist State (Phase 12 - Clean empty initial state)
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Notifications State (Phase 12)
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // FAQ Accordion Open State
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(0);

  // Help & Support Category State
  const [selectedHelpCategory, setSelectedHelpCategory] = useState<string | null>(null);

  // 6. Address & Delivery State (Phase 7)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormData, setAddressFormData] = useState({
    label: "Home" as "Home" | "Work" | "Other",
    name: "",
    phone: "",
    house: "",
    street: "",
    landmark: "",
    city: "Rewa",
    state: "Madhya Pradesh",
    pincode: "486001",
  });
  const [addressFormErrors, setAddressFormErrors] = useState<Record<string, string>>({});

  // Delivery slot state
  const [selectedSlotId, setSelectedSlotId] = useState<string>("express");
  const [isSlotPickerOpen, setIsSlotPickerOpen] = useState(false);

  // Header Location Selector & Active Location State
  const [appLocation, setAppLocation] = useState<AppLocation | null>(null);
  const [detectedGpsLocation, setDetectedGpsLocation] = useState<AppLocation | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSearchResults, setLocationSearchResults] = useState<AppLocation[]>([]);
  const [isSearchingLocationApi, setIsSearchingLocationApi] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const locationSearchInputRef = useRef<HTMLInputElement>(null);

  // 7. Cart State (Phase 5)
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 8. Checkout & Order Flow (Phase 8)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cod" | "upi" | "card">("cod");
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Orders & Confirmation state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [trackingToast, setTrackingToast] = useState<string | null>(null);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // =========================================================
  // CALCULATIONS & COMPUTED VALUES
  // =========================================================

  const selectedAddress =
    savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

  const selectedSlot =
    DELIVERY_SLOTS.find((s) => s.id === selectedSlotId) || DELIVERY_SLOTS[0];

  const hasLocation = Boolean(appLocation);
  const headerLocationDisplay = appLocation ? appLocation.formattedAddress : "";

  const FREE_DELIVERY_THRESHOLD = 499;
  const cartItems = productsList.filter((p) => (cart[p.name] || 0) > 0);
  const totalItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const subtotal = cartItems.reduce(
    (acc, p) => acc + p.priceNum * (cart[p.name] || 0),
    0,
  );

  // Calculate delivery fee
  let deliveryFee = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 25;
  if (appliedCoupon === "FREESHIP") {
    deliveryFee = 0;
  }

  // Calculate coupon discount
  let couponDiscount = 0;
  if (appliedCoupon === "APNI50") {
    if (subtotal >= 299) {
      couponDiscount = 50;
    }
  } else if (appliedCoupon === "WELCOME10") {
    couponDiscount = Math.min(100, Math.round(subtotal * 0.1));
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - couponDiscount);

  const totalSavings =
    cartItems.reduce(
      (acc, p) =>
        acc +
        ((p.oldPriceNum || p.priceNum) - p.priceNum) * (cart[p.name] || 0),
      0,
    ) + couponDiscount;

  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100),
  );

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // =========================================================
  // TOAST NOTIFICATION HELPER
  // =========================================================

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // =========================================================
  // LOCK SCROLL ON MODALS
  // =========================================================

  useEffect(() => {
    const isAnyModalOpen =
      isCartOpen ||
      isLocationOpen ||
      isAccountOpen ||
      isLoginModalOpen ||
      isAddressModalOpen ||
      isAddAddressOpen ||
      isSlotPickerOpen ||
      isCheckoutOpen ||
      isOrderSuccessOpen ||
      isAccountDashboardOpen ||
      isCouponDrawerOpen ||
      Boolean(selectedProductDetail);

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    isCartOpen,
    isLocationOpen,
    isAccountOpen,
    isLoginModalOpen,
    isAddressModalOpen,
    isAddAddressOpen,
    isSlotPickerOpen,
    isCheckoutOpen,
    isOrderSuccessOpen,
    isAccountDashboardOpen,
    isCouponDrawerOpen,
    selectedProductDetail,
  ]);

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        setIsLocationOpen(false);
        setIsAccountOpen(false);
        setIsLoginModalOpen(false);
        setIsAddressModalOpen(false);
        setIsAddAddressOpen(false);
        setIsSlotPickerOpen(false);
        setIsCheckoutOpen(false);
        setIsOrderSuccessOpen(false);
        setIsAccountDashboardOpen(false);
        setIsCouponDrawerOpen(false);
        setSelectedProductDetail(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // =========================================================
  // CART ACTIONS
  // =========================================================

  const handleAddToCart = (product: Product) => {
    setCart((prev) => ({
      ...prev,
      [product.name]: (prev[product.name] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart((prev) => {
      const current = prev[product.name] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[product.name];
        return next;
      }
      return {
        ...prev,
        [product.name]: current - 1,
      };
    });
  };

  const handleDeleteItem = (product: Product) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[product.name];
      return next;
    });
  };

  const handleClearCart = () => {
    setCart({});
    setAppliedCoupon(null);
  };

  // =========================================================
  // PHASE 10: PRODUCT EXPERIENCE ACTIONS
  // =========================================================

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProductDetail(product);
  };

  const handleBuyNow = (product: Product) => {
    // Add to cart if not already present
    if (!cart[product.name]) {
      handleAddToCart(product);
    }
    // Close detail view and trigger checkout flow
    setSelectedProductDetail(null);
    handleStartCheckout();
  };

  const handleAddBundleToCart = (bundleProducts: Product[]) => {
    setCart((prev) => {
      const next = { ...prev };
      bundleProducts.forEach((p) => {
        next[p.name] = (next[p.name] || 0) + 1;
      });
      return next;
    });
    showToast(`Added bundle (${bundleProducts.length} items) to cart! 🎉`);
  };

  // =========================================================
  // PHASE 12: WISHLIST ACTIONS
  // =========================================================

  const handleToggleWishlist = (product: Product) => {
    const key = product.id || product.name;
    setWishlist((prev) => {
      const exists = prev.includes(key);
      if (exists) {
        showToast(`Removed from wishlist: ${product.name}`);
        return prev.filter((item) => item !== key);
      } else {
        showToast(`Added to wishlist: ${product.name} ❤️`);
        return [...prev, key];
      }
    });
  };

  // =========================================================
  // PHASE 9: CATEGORY & SEARCH
  // =========================================================

  const handleSelectCategory = (categoryName: string) => {
    if (!categoryName || categoryName.toLowerCase() === "all") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory((prev) => (prev === categoryName ? null : categoryName));
    }
    const productsElement = document.getElementById("products");
    if (productsElement) {
      productsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectProductFromSearch = (productName: string) => {
    setHighlightedProduct(productName);
    const productEl = document.getElementById("products");
    if (productEl) {
      productEl.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      setHighlightedProduct(null);
    }, 2800);
  };

  // =========================================================
  // LOCATION SEARCH EFFECT (Hybrid Offline Instant + Nominatim API)
  // =========================================================

  useEffect(() => {
    const query = locationSearch.trim();
    if (!query) {
      setLocationSearchResults([]);
      setIsSearchingLocationApi(false);
      return;
    }

    // Instant local results
    const lower = query.toLowerCase();
    const localMatches = POPULAR_DELIVERY_CITIES.filter(
      (c) =>
        c.formattedAddress.toLowerCase().includes(lower) ||
        (c.city && c.city.toLowerCase().includes(lower)) ||
        (c.locality && c.locality.toLowerCase().includes(lower)) ||
        (c.state && c.state.toLowerCase().includes(lower))
    );
    setLocationSearchResults(localMatches);

    if (query.length < 3) {
      setIsSearchingLocationApi(false);
      return;
    }

    setIsSearchingLocationApi(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=in&addressdetails=1&limit=5`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        const apiResults: AppLocation[] = (data || []).map((item: any) => {
          const addr = item.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.municipality ||
            addr.state_district ||
            "";
          const locality =
            addr.suburb || addr.neighbourhood || addr.residential || addr.road || "";
          const state = addr.state || "";
          const parts = [locality, city, state].filter(Boolean);
          const formatted =
            parts.length > 0
              ? parts.join(", ")
              : item.display_name.split(",").slice(0, 3).join(",").trim();

          return {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            formattedAddress: formatted,
            locality: locality || undefined,
            city: city || undefined,
            state: state || undefined,
            country: addr.country || "India",
            postalCode: addr.postcode || undefined,
            source: "manual" as const,
          };
        });

        // Merge API results with local results avoiding duplicates
        const seen = new Set(localMatches.map((m) => m.formattedAddress.toLowerCase()));
        const uniqueApiResults = apiResults.filter(
          (a) => !seen.has(a.formattedAddress.toLowerCase())
        );
        setLocationSearchResults([...localMatches, ...uniqueApiResults]);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          // Keep localMatches intact
        }
      } finally {
        setIsSearchingLocationApi(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [locationSearch]);

  // Real Browser Geolocation Detection with Nominatim Reverse Geocoding
  const handleDetectLocationClick = () => {
    setLocationError(null);

    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let detectedAddress: AppLocation = {
          latitude,
          longitude,
          formattedAddress: "",
          source: "gps",
        };

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { Accept: "application/json" } }
          );

          if (!res.ok) {
            throw new Error("Geocoding failed");
          }

          const data = await res.json();
          const addr = data.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.municipality ||
            addr.suburb ||
            addr.state_district ||
            "";
          const locality =
            addr.suburb ||
            addr.neighbourhood ||
            addr.residential ||
            addr.road ||
            "";
          const state = addr.state || "";
          const country = addr.country || "India";
          const postalCode = addr.postcode || "";

          let formatted = "";
          if (locality && city && locality !== city) {
            formatted = `${locality}, ${city}`;
          } else if (city && state) {
            formatted = `${city}, ${state}`;
          } else if (city) {
            formatted = city;
          } else if (data.display_name) {
            formatted = data.display_name.split(",").slice(0, 2).join(",").trim();
          } else {
            formatted = `Lat: ${latitude.toFixed(3)}, Lon: ${longitude.toFixed(3)}`;
          }

          detectedAddress = {
            latitude,
            longitude,
            formattedAddress: formatted,
            locality: locality || undefined,
            city: city || undefined,
            state: state || undefined,
            country,
            postalCode: postalCode || undefined,
            source: "gps",
          };

          setDetectedGpsLocation(detectedAddress);
          setAppLocation(detectedAddress);
          setIsDetectingLocation(false);
          setIsLocationOpen(false);
          showToast(`Location detected: ${formatted}`);
        } catch {
          // If reverse geocoding fails:
          // Keep coordinates internally for current session
          detectedAddress.formattedAddress = `Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
          setDetectedGpsLocation(detectedAddress);
          setAppLocation(detectedAddress);
          setIsDetectingLocation(false);
          setIsLocationOpen(false);
          showToast("Location detected, but address could not be loaded.");
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        switch (err.code) {
          case 1: // PERMISSION_DENIED
            setLocationError(
              "Location permission was denied. Please allow location access or search your city manually."
            );
            break;
          case 2: // POSITION_UNAVAILABLE
            setLocationError(
              "Unable to determine your location. Please check your network or device GPS."
            );
            break;
          case 3: // TIMEOUT
            setLocationError(
              "Location request timed out. Please try again or search manually."
            );
            break;
          default:
            setLocationError(
              "Unable to retrieve location. Please search your city manually."
            );
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  const handleSelectManualLocation = (loc: AppLocation) => {
    setAppLocation(loc);
    setIsLocationOpen(false);
    setLocationSearch("");
    showToast(`Delivery location set to ${loc.city || loc.formattedAddress}`);
  };

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    const loc: AppLocation = {
      formattedAddress: `${addr.house}, ${addr.street}, ${addr.city}`,
      locality: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.pincode,
      source: "saved",
    };
    setAppLocation(loc);
    setIsLocationOpen(false);
    showToast(`Delivering to ${addr.label} (${addr.city})`);
  };

  const handleEnterLocationManually = () => {
    setLocationError(null);
    if (locationSearchInputRef.current) {
      locationSearchInputRef.current.focus();
    }
  };

  // =========================================================
  // PHASE 6: AUTHENTICATION ACTIONS
  // =========================================================

  const handleOpenLogin = (forCheckout = false) => {
    setPendingCheckoutAfterLogin(forCheckout);
    setLoginStep("phone");
    setMobileInput("");
    setOtpInput(["", "", "", "", "", ""]);
    setLoginError(null);
    setIsAccountOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleMobileSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = mobileInput.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setLoginError("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    setLoginError(null);
    setLoginStep("otp");
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const nextOtp = [...otpInput];
    nextOtp[index] = val;
    setOtpInput(nextOtp);

    if (val && index < 5) {
      const nextEl = document.getElementById(`otp-input-${index + 1}`);
      if (nextEl) nextEl.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpInput[index] && index > 0) {
      const prevEl = document.getElementById(`otp-input-${index - 1}`);
      if (prevEl) prevEl.focus();
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otpInput.join("");
    if (enteredOtp.length < 6 || !/^\d{6}$/.test(enteredOtp)) {
      setLoginError("Please enter a complete 6-digit verification code");
      return;
    }

    const formattedPhone = mobileInput ? `+91 ${mobileInput}` : "+91 98765 43210";
    setUser({
      isLoggedIn: true,
      name: "Shahbaj Khan",
      phone: formattedPhone,
      email: "shahbaj.khan@apnidukaan.com",
    });

    setIsLoginModalOpen(false);
    showToast("Welcome to ApniDukaan! 🎉");

    if (pendingCheckoutAfterLogin) {
      setPendingCheckoutAfterLogin(false);
      setIsCheckoutOpen(true);
    }
  };

  const handleContinueAsGuest = () => {
    setUser({
      isLoggedIn: true,
      name: "Guest Shopper",
      phone: "+91 98000 00000",
      email: "guest@apnidukaan.com",
    });
    setIsLoginModalOpen(false);
    showToast("Welcome to ApniDukaan (Guest Session)");

    if (pendingCheckoutAfterLogin) {
      setPendingCheckoutAfterLogin(false);
      setIsCheckoutOpen(true);
    }
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      name: "Shahbaj Khan",
      phone: "9876543210",
      email: "shahbaj.khan@apnidukaan.com",
    });
    setIsAccountOpen(false);
    setIsAccountDashboardOpen(false);
    showToast("You have been logged out.");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: profileFormData.name.trim() || prev.name,
      phone: profileFormData.phone.trim() || prev.phone,
      email: profileFormData.email.trim() || prev.email,
    }));
    setProfileSuccessMsg(true);
    showToast("Profile updated successfully!");
    setTimeout(() => {
      setProfileSuccessMsg(false);
    }, 1500);
  };

  // =========================================================
  // PHASE 7: ADDRESS ACTIONS
  // =========================================================

  const handleOpenAddAddress = (addressToEdit?: SavedAddress) => {
    setAddressFormErrors({});
    if (addressToEdit) {
      setEditingAddressId(addressToEdit.id);
      setAddressFormData({
        label: addressToEdit.label,
        name: addressToEdit.name,
        phone: addressToEdit.phone.replace("+91 ", ""),
        house: addressToEdit.house,
        street: addressToEdit.street,
        landmark: addressToEdit.landmark || "",
        city: addressToEdit.city,
        state: addressToEdit.state,
        pincode: addressToEdit.pincode,
      });
    } else {
      setEditingAddressId(null);
      setAddressFormData({
        label: "Home",
        name: user.name || "Shahbaj Khan",
        phone: user.phone ? user.phone.replace("+91 ", "") : "9876543210",
        house: "",
        street: "",
        landmark: "",
        city: "Rewa",
        state: "Madhya Pradesh",
        pincode: "486001",
      });
    }
    setIsAddAddressOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!addressFormData.name.trim()) errors.name = "Full name is required";
    if (!addressFormData.phone.trim() || addressFormData.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Valid 10-digit mobile number is required";
    }
    if (!addressFormData.house.trim()) errors.house = "House / Flat / Building is required";
    if (!addressFormData.street.trim()) errors.street = "Street / Area is required";
    if (!addressFormData.city.trim()) errors.city = "City is required";
    if (!addressFormData.pincode.trim() || !/^\d{6}$/.test(addressFormData.pincode.trim())) {
      errors.pincode = "Valid 6-digit Pincode is required";
    }

    if (Object.keys(errors).length > 0) {
      setAddressFormErrors(errors);
      return;
    }

    if (editingAddressId) {
      setSavedAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddressId
            ? {
                ...addr,
                label: addressFormData.label,
                name: addressFormData.name.trim(),
                phone: `+91 ${addressFormData.phone.trim()}`,
                house: addressFormData.house.trim(),
                street: addressFormData.street.trim(),
                landmark: addressFormData.landmark.trim(),
                city: addressFormData.city.trim(),
                state: addressFormData.state.trim(),
                pincode: addressFormData.pincode.trim(),
              }
            : addr
        )
      );
      showToast("Address updated successfully!");
    } else {
      const newId = `addr-${Date.now()}`;
      const newAddress: SavedAddress = {
        id: newId,
        label: addressFormData.label,
        name: addressFormData.name.trim(),
        phone: `+91 ${addressFormData.phone.trim()}`,
        house: addressFormData.house.trim(),
        street: addressFormData.street.trim(),
        landmark: addressFormData.landmark.trim(),
        city: addressFormData.city.trim(),
        state: addressFormData.state.trim(),
        pincode: addressFormData.pincode.trim(),
      };
      setSavedAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddressId(newId);
      showToast("New address saved!");
    }

    setIsAddAddressOpen(false);
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedAddresses.length <= 1) {
      showToast("You must keep at least one saved address.");
      return;
    }
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) {
      const remaining = savedAddresses.filter((a) => a.id !== id);
      if (remaining.length > 0) {
        setSelectedAddressId(remaining[0].id);
      }
    }
    showToast("Address deleted.");
  };

  // =========================================================
  // PHASE 11: COUPON ACTIONS & DRAWER
  // =========================================================

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    setCouponError(null);
    setCouponSuccess(null);

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (code === "APNI50") {
      if (subtotal < 299) {
        setCouponError("APNI50 requires a minimum order of ₹299");
        return;
      }
      setAppliedCoupon("APNI50");
      setCouponSuccess("₹50 discount applied with APNI50! 🎉");
      setCouponCodeInput("");
      showToast("Coupon APNI50 applied!");
    } else if (code === "WELCOME10") {
      setAppliedCoupon("WELCOME10");
      setCouponSuccess("10% discount applied with WELCOME10! 🎉");
      setCouponCodeInput("");
      showToast("Coupon WELCOME10 applied!");
    } else if (code === "FREESHIP") {
      setAppliedCoupon("FREESHIP");
      setCouponSuccess("FREE Delivery unlocked with FREESHIP! 🚚");
      setCouponCodeInput("");
      showToast("Free Delivery coupon applied!");
    } else {
      setCouponError("Invalid coupon code. Try APNI50, WELCOME10 or FREESHIP");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess(null);
    setCouponError(null);
    showToast("Coupon removed.");
  };

  // =========================================================
  // PHASE 8: CHECKOUT & PLACE ORDER
  // =========================================================

  const handleStartCheckout = () => {
    setIsCartOpen(false);
    if (!user.isLoggedIn) {
      handleOpenLogin(true);
      return;
    }
    setCheckoutError(null);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty. Please add items before placing order.");
      return;
    }

    if (!user.isLoggedIn) {
      setCheckoutError("Please login to place your order.");
      setIsCheckoutOpen(false);
      handleOpenLogin(true);
      return;
    }

    if (!selectedAddress) {
      setCheckoutError("Please select a delivery address.");
      return;
    }

    if (!selectedSlot) {
      setCheckoutError("Please select a delivery slot.");
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `#APD${randomNum}`;

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      name: item.name,
      quantity: cart[item.name],
      price: item.price,
      priceNum: item.priceNum,
      image: item.image,
    }));

    const now = new Date();
    const formattedDate = `Today, ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const newOrder: Order = {
      orderId: newOrderId,
      items: orderItems,
      subtotal,
      deliveryFee,
      discount: couponDiscount,
      total: grandTotal,
      address: selectedAddress,
      deliveryMethod: {
        type: selectedSlot.type,
        label: selectedSlot.label,
        detail: selectedSlot.type === "express" ? "8–15 minutes" : selectedSlot.label,
      },
      paymentMethod: selectedPaymentMethod,
      createdAt: formattedDate,
      status: "Order Placed",
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestPlacedOrder(newOrder);

    // Push new notification for the placed order
    const orderNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Order Placed Successfully",
      message: `Your order ${newOrderId} is being prepared at your local store. Arriving in ${newOrder.deliveryMethod.detail}.`,
      time: "Just now",
      read: false,
      iconType: "order",
    };
    setNotifications((prev) => [orderNotif, ...prev]);

    handleClearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
  };

  // Open specific tab in Account Dashboard
  const handleOpenAccountTab = (
    tab:
      | "profile"
      | "orders"
      | "addresses"
      | "wishlist"
      | "coupons"
      | "notifications"
      | "help"
      | "faq"
      | "privacy"
  ) => {
    setIsAccountOpen(false);
    setAccountDashboardTab(tab);
    setIsAccountDashboardOpen(true);
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read.");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#1f1f1f]">
      {/* =========================================================
          GLOBAL TOAST NOTIFICATION
      ========================================================= */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-2 rounded-full bg-[#111] px-5 py-2.5 text-[13px] font-bold text-white shadow-xl anim-modal">
          <Sparkles size={15} className="text-[#F8CB46]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER (Phase 9 Search & Header Integration) */}
      <Header
        products={productsList}
        cartCount={totalItemsCount}
        selectedLocation={headerLocationDisplay}
        hasLocation={hasLocation}
        locationSource={appLocation?.source}
        isLoggedIn={user.isLoggedIn}
        userName={user.name}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onSelectProduct={handleSelectProductFromSearch}
        onAddToCart={handleAddToCart}
        onOpenProductDetail={handleOpenProductDetail}
      />

      {/* HORIZONTAL CATEGORY NAVIGATION BAR */}
      <CategoryNav
        categories={categoriesList}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* HERO */}
      <Hero />

      {/* PROMO CARDS (Phase 11 Offer Badges) */}
      <PromoCards offers={offersList} />

      {/* CATEGORIES */}
      <Categories
        categories={categoriesList}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* PRODUCTS SECTION (Phase 9 Filters/Sort, Phase 10 Detail, Phase 12 Wishlist) */}
      <ProductSection
        products={productsList}
        categories={categoriesList}
        cart={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onClearCategoryFilter={() => setSelectedCategory(null)}
        highlightedProduct={highlightedProduct}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onOpenProductDetail={handleOpenProductDetail}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
        priceFilter={priceFilter}
        onSelectPriceFilter={setPriceFilter}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
      />

      {/* FOOTER */}
      <Footer />

      {/* =========================================================
          GLOBAL BACKDROP OVERLAY
      ========================================================= */}
      {(isCartOpen ||
        isLocationOpen ||
        isAccountOpen ||
        isLoginModalOpen ||
        isAddressModalOpen ||
        isAddAddressOpen ||
        isSlotPickerOpen ||
        isCheckoutOpen ||
        isOrderSuccessOpen ||
        isAccountDashboardOpen ||
        isCouponDrawerOpen ||
        Boolean(selectedProductDetail)) && (
        <div
          className="anim-fade-in fixed inset-0 z-[99] bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => {
            setIsCartOpen(false);
            setIsLocationOpen(false);
            setIsAccountOpen(false);
            setIsLoginModalOpen(false);
            setIsAddressModalOpen(false);
            setIsAddAddressOpen(false);
            setIsSlotPickerOpen(false);
            setIsCheckoutOpen(false);
            setIsAccountDashboardOpen(false);
            setIsCouponDrawerOpen(false);
            setSelectedProductDetail(null);
          }}
        />
      )}

      {/* =========================================================
          PHASE 10: PRODUCT DETAIL MODAL / BOTTOM SHEET
      ========================================================= */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-[101] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-4">
          <div
            className="
              pointer-events-auto
              w-full
              max-w-[540px]
              rounded-t-[24px]
              border
              border-[#edf0f2]
              bg-white
              shadow-2xl
              md:rounded-[20px]
              max-h-[92vh]
              flex
              flex-col
              overflow-hidden
              anim-bottom-sheet
              md:anim-modal
            "
          >
            {/* Mobile Drag Indicator */}
            <div className="pt-3 pb-1 md:hidden">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-[#e2e5e8]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#edf0f2] px-6 py-3.5">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#2f7d32] bg-[#eaf5e9] px-2.5 py-0.5 rounded-full">
                {selectedProductDetail.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Toggle Wishlist"
                  onClick={() => handleToggleWishlist(selectedProductDetail)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6] transition-colors"
                >
                  <Heart
                    size={18}
                    className={
                      wishlist.includes(
                        selectedProductDetail.id || selectedProductDetail.name
                      )
                        ? "fill-red-500 text-red-500"
                        : ""
                    }
                  />
                </button>

                <button
                  type="button"
                  aria-label="Close product details"
                  onClick={() => setSelectedProductDetail(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content (Scrollable) */}
            <div className="overflow-y-auto p-5 space-y-5 flex-1">
              {/* Image & Badges */}
              <div className="relative flex h-[190px] w-full items-center justify-center rounded-[14px] bg-[#f8f8f8] border border-[#edf0f2]">
                {selectedProductDetail.discount && (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[#48a92b] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs">
                    {selectedProductDetail.discount}
                  </span>
                )}
                <Image
                  src={selectedProductDetail.image}
                  alt={selectedProductDetail.name}
                  fill
                  sizes="260px"
                  className="object-contain p-4"
                />
              </div>

              {/* Title, Unit & Availability */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[19px] font-bold text-[#111]">
                      {selectedProductDetail.name}
                    </h3>
                    <p className="mt-0.5 text-[13px] font-medium text-[#666]">
                      {selectedProductDetail.quantity}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      selectedProductDetail.inStock !== false
                        ? "bg-[#eaf5e9] text-[#2f7d32]"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {selectedProductDetail.inStock !== false
                      ? "In Stock ✓"
                      : "Currently Unavailable"}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-[22px] font-bold text-[#111]">
                    {selectedProductDetail.price}
                  </span>
                  {selectedProductDetail.originalPrice && (
                    <span className="text-[14px] text-[#999] line-through font-normal">
                      {selectedProductDetail.originalPrice}
                    </span>
                  )}
                  {selectedProductDetail.discount && (
                    <span className="text-[12px] font-semibold text-[#2f7d32]">
                      ({selectedProductDetail.discount})
                    </span>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="rounded-[14px] bg-[#f9fafb] border border-[#edf0f2] p-4 text-[13px] font-normal leading-relaxed text-[#555]">
                <p className="font-bold text-[#222] mb-1">Product Details</p>
                <p>
                  {selectedProductDetail.description ||
                    "Fresh, high-grade grocery selection sourced with care. Packed hygienically and delivered instantly to your door."}
                </p>
              </div>

              {/* Frequently Bought Together (Phase 10 Requirement) */}
              {selectedProductDetail.frequentlyBoughtWith && (
                <div>
                  <p className="text-[12.5px] font-bold uppercase tracking-wider text-[#333] mb-2.5">
                    Frequently Bought Together
                  </p>
                  <div className="space-y-2">
                    {PRODUCTS.filter(
                      (p) =>
                        selectedProductDetail.frequentlyBoughtWith?.includes(p.id) &&
                        p.name !== selectedProductDetail.name
                    ).map((compItem) => (
                      <div
                        key={compItem.name}
                        className="flex items-center justify-between rounded-[14px] border border-[#edf0f2] p-2.5 bg-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-10 w-10 rounded-lg bg-[#f8f9fa] shrink-0">
                            <Image
                              src={compItem.image}
                              alt={compItem.name}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#222]">
                              {compItem.name}
                            </p>
                            <p className="text-[11.5px] text-[#777]">
                              {compItem.quantity} •{" "}
                              <strong className="text-[#111]">{compItem.price}</strong>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            handleAddToCart(compItem);
                            showToast(`Added ${compItem.name} to cart!`);
                          }}
                          className="rounded-[8px] border border-[#48a92b] px-3 py-1 text-[11.5px] font-bold text-[#48a92b] hover:bg-[#48a92b] hover:text-white transition-all active:scale-90"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Products: You May Also Like (Phase 10 Requirement) */}
              <div>
                <p className="text-[12.5px] font-bold uppercase tracking-wider text-[#333] mb-2.5">
                  You May Also Like
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {productsList.filter(
                    (p) =>
                      p.category === selectedProductDetail.category &&
                      p.name !== selectedProductDetail.name
                  )
                    .slice(0, 2)
                    .map((rel) => (
                      <div
                        key={rel.name}
                        onClick={() => setSelectedProductDetail(rel)}
                        className="cursor-pointer rounded-[14px] border border-[#edf0f2] p-2.5 hover:border-[#48a92b]/40 transition-all bg-white"
                      >
                        <div className="relative h-16 w-full rounded-lg bg-[#f8f9fa] mb-1.5">
                          <Image
                            src={rel.image}
                            alt={rel.name}
                            fill
                            sizes="70px"
                            className="object-contain p-1"
                          />
                        </div>
                        <p className="text-[12px] font-bold text-[#222] truncate">
                          {rel.name}
                        </p>
                        <p className="text-[11px] font-bold text-[#48a92b]">
                          {rel.price}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions CTA (Add to Cart & Buy Now) */}
            <div className="border-t border-[#edf0f2] bg-white p-4 space-y-2">
              <div className="flex items-center gap-3">
                {/* Quantity or Add to Cart */}
                {cart[selectedProductDetail.name] ? (
                  <div className="flex h-11 items-center justify-between rounded-[14px] bg-[#48a92b] px-3 text-white shadow-md flex-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(selectedProductDetail)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/20 active:scale-90"
                    >
                      <Minus size={15} strokeWidth={3} />
                    </button>
                    <span className="text-[15px] font-black">
                      {cart[selectedProductDetail.name]} in cart
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(selectedProductDetail)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/20 active:scale-90"
                    >
                      <Plus size={15} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={selectedProductDetail.inStock === false}
                    onClick={() => {
                      handleAddToCart(selectedProductDetail);
                      showToast(`Added ${selectedProductDetail.name} to cart!`);
                    }}
                    className={`
                      flex-1 rounded-[14px] py-3.5 text-[14px] font-extrabold text-white shadow-md transition-all active:scale-98
                      ${
                        selectedProductDetail.inStock !== false
                          ? "bg-[#48a92b] hover:bg-[#3d9124]"
                          : "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                      }
                    `}
                  >
                    {selectedProductDetail.inStock !== false
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                )}

                {/* Buy Now Button */}
                <button
                  type="button"
                  disabled={selectedProductDetail.inStock === false}
                  onClick={() => handleBuyNow(selectedProductDetail)}
                  className={`
                    flex-1 rounded-[14px] py-3.5 text-[14px] font-extrabold text-[#111] transition-all active:scale-98 shadow-md
                    ${
                      selectedProductDetail.inStock !== false
                        ? "bg-[#F8CB46] hover:bg-[#e6b937]"
                        : "bg-gray-200 cursor-not-allowed text-gray-400 shadow-none"
                    }
                  `}
                >
                  Buy Now ⚡
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PHASE 11: COUPONS DRAWER / MODAL
      ========================================================= */}
      {isCouponDrawerOpen && (
        <div className="fixed inset-0 z-[102] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-4">
          <div
            className="
              pointer-events-auto
              w-full
              max-w-[460px]
              rounded-t-[24px]
              border
              border-[#edf0f2]
              bg-white
              shadow-2xl
              md:rounded-[20px]
              max-h-[85vh]
              flex
              flex-col
              overflow-hidden
              anim-bottom-sheet
              md:anim-modal
            "
          >
            <div className="flex items-center justify-between border-b border-[#edf0f2] px-6 py-4">
              <div className="flex items-center gap-2">
                <Tag size={19} className="text-[#48a92b]" />
                <h3 className="text-[17px] font-bold text-[#1f1f1f]">
                  Available Coupons
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3.5">
              {AVAILABLE_COUPONS.map((cp) => {
                const isApplied = appliedCoupon === cp.code;

                return (
                  <div
                    key={cp.code}
                    className={`
                      rounded-[16px] border p-4 transition-all
                      ${
                        isApplied
                          ? "border-[#48a92b] bg-[#f8faf8] ring-1.5 ring-[#48a92b]"
                          : "border-[#edf0f2] bg-white hover:border-[#ccc]"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-[#F8CB46]/30 px-2 py-0.5 text-[11px] font-black tracking-wider text-[#111]">
                            {cp.code}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#48a92b]">
                            {cp.tag}
                          </span>
                        </div>
                        <h4 className="mt-1.5 text-[14px] font-bold text-[#222]">
                          {cp.title}
                        </h4>
                        <p className="mt-0.5 text-[12px] text-[#666]">
                          {cp.description}
                        </p>
                      </div>

                      {isApplied ? (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-[12px] font-bold text-red-600 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            handleApplyCoupon(cp.code);
                            setIsCouponDrawerOpen(false);
                          }}
                          className="rounded-lg bg-[#48a92b] px-3.5 py-1.5 text-[12px] font-bold text-white hover:bg-[#3d9124] shadow-xs active:scale-95"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PHASE 12: COMPLETE ACCOUNT DASHBOARD
          Desktop: Clean sidebar + content | Mobile: Stacked sections/tabs
      ========================================================= */}
      {isAccountDashboardOpen && (
        <div className="fixed inset-0 z-[101] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-6">
          <div
            className="
              pointer-events-auto
              w-full
              max-w-[840px]
              rounded-t-[24px]
              border
              border-[#edf0f2]
              bg-white
              shadow-2xl
              md:rounded-[20px]
              max-h-[90vh]
              flex
              flex-col
              overflow-hidden
              anim-bottom-sheet
              md:anim-modal
            "
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#edf0f2] px-6 py-4 bg-[#fafafa]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8CB46] text-[#111] font-bold text-[15px]">
                  {user.isLoggedIn
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "AD"}
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#111]">
                    {user.isLoggedIn ? user.name : "ApniDukaan Account"}
                  </h3>
                  <p className="text-[12px] font-normal text-[#777]">
                    {user.isLoggedIn ? user.phone : "Log in for seamless orders & addresses"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close account dashboard"
                onClick={() => setIsAccountDashboardOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#eee]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dashboard Body: Responsive Sidebar + Content Area */}
            <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-[220px] border-b md:border-b-0 md:border-r border-[#edf0f2] bg-[#fcfcfc] overflow-x-auto md:overflow-y-auto no-scrollbar flex md:flex-col p-2 gap-1 shrink-0">
                {[
                  { id: "profile" as const, label: "My Profile", icon: User },
                  {
                    id: "orders" as const,
                    label: "My Orders",
                    icon: Package,
                    badge: `${orders.length}`,
                  },
                  {
                    id: "addresses" as const,
                    label: "Saved Addresses",
                    icon: MapPin,
                    badge: `${savedAddresses.length}`,
                  },
                  {
                    id: "wishlist" as const,
                    label: "Wishlist",
                    icon: Heart,
                    badge: `${wishlist.length}`,
                  },
                  { id: "coupons" as const, label: "My Coupons", icon: Tag },
                  {
                    id: "notifications" as const,
                    label: "Notifications",
                    icon: Bell,
                    badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : "",
                  },
                  { id: "help" as const, label: "Help & Support", icon: Headphones },
                  { id: "faq" as const, label: "FAQs", icon: HelpCircle },
                  { id: "privacy" as const, label: "Privacy", icon: Shield },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = accountDashboardTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAccountDashboardTab(item.id)}
                      className={`
                        flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold whitespace-nowrap transition-all
                        ${
                          isActive
                            ? "bg-[#48a92b] text-white shadow-xs"
                            : "text-[#555] hover:bg-[#f0f2f4] hover:text-[#111]"
                        }
                      `}
                    >
                      <Icon size={16} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                            isActive
                              ? "bg-white text-[#2f7d32]"
                              : "bg-[#e5e7eb] text-[#444]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {user.isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-auto hidden md:flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                )}
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6">
                {/* 1. PROFILE TAB */}
                {accountDashboardTab === "profile" && (
                  <div className="space-y-4 max-w-[440px]">
                    <h4 className="text-[16px] font-black text-[#111]">Personal Profile</h4>
                    <form onSubmit={handleSaveProfile} className="space-y-3.5">
                      <div>
                        <label className="block text-[12px] font-bold text-[#555] mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileFormData.name}
                          onChange={(e) =>
                            setProfileFormData({ ...profileFormData, name: e.target.value })
                          }
                          className="w-full rounded-xl border border-[#d1d5db] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#48a92b]"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-[#555] mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          value={profileFormData.phone}
                          onChange={(e) =>
                            setProfileFormData({
                              ...profileFormData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-[#d1d5db] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#48a92b]"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-[#555] mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={profileFormData.email}
                          onChange={(e) =>
                            setProfileFormData({
                              ...profileFormData,
                              email: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-[#d1d5db] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#48a92b]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="rounded-xl bg-[#48a92b] px-6 py-2.5 text-[13.5px] font-bold text-white shadow-xs hover:bg-[#3d9124] transition-all"
                      >
                        Save Profile Changes
                      </button>
                    </form>
                  </div>
                )}

                {/* 2. MY ORDERS TAB */}
                {accountDashboardTab === "orders" && (
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-black text-[#111]">Order History</h4>

                    {selectedOrderForDetail ? (
                      /* Order Detail Drilldown */
                      <div className="space-y-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForDetail(null)}
                          className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#48a92b] hover:underline"
                        >
                          <ChevronLeft size={16} />
                          <span>Back to all orders</span>
                        </button>

                        <div className="rounded-[18px] border border-[#edf0f2] bg-[#f9fafb] p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-[#edf0f2] pb-2">
                            <div>
                              <p className="text-[15px] font-black text-[#111]">
                                {selectedOrderForDetail.orderId}
                              </p>
                              <p className="text-[11.5px] text-[#777]">
                                Placed on {selectedOrderForDetail.createdAt}
                              </p>
                            </div>
                            <span className="rounded-full bg-[#eaf5e9] px-2.5 py-1 text-[11px] font-extrabold text-[#2f7d32]">
                              {selectedOrderForDetail.status}
                            </span>
                          </div>

                          {/* Status Stepper */}
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-1.5">
                              Delivery Progress
                            </p>
                            <div className="grid grid-cols-4 gap-1 text-center">
                              {(["Order Placed", "Preparing", "Out for Delivery", "Delivered"] as const).map(
                                (step, idx) => {
                                  const steps = [
                                    "Order Placed",
                                    "Preparing",
                                    "Out for Delivery",
                                    "Delivered",
                                  ];
                                  const currentIdx = steps.indexOf(selectedOrderForDetail.status);
                                  const isDone = idx <= currentIdx;

                                  return (
                                    <div key={step}>
                                      <div
                                        className={`h-1.5 w-full rounded-full mb-1 ${
                                          isDone ? "bg-[#48a92b]" : "bg-[#e5e7eb]"
                                        }`}
                                      />
                                      <span
                                        className={`text-[9.5px] font-bold ${
                                          isDone ? "text-[#2f7d32]" : "text-[#999]"
                                        }`}
                                      >
                                        {step}
                                      </span>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Address & Payment Details */}
                          <div className="pt-2 border-t border-[#edf0f2] text-[12px] text-[#555] space-y-1">
                            <p>
                              <strong>Delivering to:</strong>{" "}
                              {selectedOrderForDetail.address.house},{" "}
                              {selectedOrderForDetail.address.street},{" "}
                              {selectedOrderForDetail.address.city}
                            </p>
                            <p>
                              <strong>Payment:</strong>{" "}
                              {selectedOrderForDetail.paymentMethod.toUpperCase()} (₹
                              {selectedOrderForDetail.total})
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="rounded-[16px] border border-[#edf0f2] divide-y divide-[#eee] p-3">
                          {selectedOrderForDetail.items.map((it) => (
                            <div
                              key={it.name}
                              className="flex items-center justify-between py-2 text-[12.5px]"
                            >
                              <span className="truncate pr-2 text-[#333]">
                                {it.name} × {it.quantity}
                              </span>
                              <span className="font-bold text-[#111]">
                                ₹{it.priceNum * it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Orders List */
                      orders.length === 0 ? (
                        <div className="py-12 text-center space-y-2">
                          <Package size={36} className="mx-auto text-[#bbb]" />
                          <p className="text-[14.5px] font-bold text-[#333]">No orders placed yet</p>
                          <p className="text-[12px] text-[#777] max-w-[240px] mx-auto">
                            Your placed orders will show up here with live status updates.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAccountDashboardOpen(false);
                              const el = document.getElementById("products");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2 text-[12.5px] font-bold text-white shadow-xs hover:bg-[#3d9124]"
                          >
                            Browse Products
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {orders.map((ord) => (
                            <div
                              key={ord.orderId}
                              onClick={() => setSelectedOrderForDetail(ord)}
                              className="flex cursor-pointer items-center justify-between rounded-[16px] border border-[#edf0f2] p-3.5 hover:border-[#48a92b]/40 transition-all bg-white"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-[14px] text-[#111]">
                                    {ord.orderId}
                                  </span>
                                  <span className="rounded-full bg-[#eaf5e9] px-2 py-0.5 text-[10px] font-bold text-[#2f7d32]">
                                    {ord.status}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-[12px] text-[#666]">
                                  {ord.items.length} {ord.items.length === 1 ? "item" : "items"} •{" "}
                                  <strong className="text-[#111]">₹{ord.total}</strong>
                                </p>
                                <p className="text-[11px] text-[#999]">{ord.createdAt}</p>
                              </div>
                              <ChevronRight size={18} className="text-[#bbb]" />
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* 3. SAVED ADDRESSES TAB */}
                {accountDashboardTab === "addresses" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[16px] font-black text-[#111]">Saved Delivery Addresses</h4>
                      <button
                        type="button"
                        onClick={() => handleOpenAddAddress()}
                        className="text-[12.5px] font-bold text-[#48a92b] hover:underline"
                      >
                        + Add Address
                      </button>
                    </div>

                    {savedAddresses.length === 0 ? (
                      <div className="py-10 text-center space-y-2">
                        <MapPin size={34} className="mx-auto text-[#bbb]" />
                        <p className="text-[14px] font-bold text-[#333]">No saved addresses</p>
                        <p className="text-[12px] text-[#777]">Add an address for quick one-click checkout.</p>
                        <button
                          type="button"
                          onClick={() => handleOpenAddAddress()}
                          className="mt-2 inline-flex items-center gap-1 rounded-xl bg-[#48a92b] px-3.5 py-1.5 text-[12px] font-bold text-white shadow-xs hover:bg-[#3d9124]"
                        >
                          <Plus size={13} />
                          <span>Add New Address</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                      {savedAddresses.map((addr) => {
                        const isCurrent = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            className={`rounded-[16px] border p-3.5 flex items-start justify-between ${
                              isCurrent
                                ? "border-[#48a92b] bg-[#f8faf8]"
                                : "border-[#edf0f2] bg-white"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[13.5px] text-[#222]">
                                  {addr.label}
                                </span>
                                {isCurrent && (
                                  <span className="text-[10.5px] font-bold text-[#2f7d32] bg-[#eaf5e9] px-2 py-0.2 rounded-full">
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-[12.5px] text-[#555]">
                                {addr.name} ({addr.phone})
                              </p>
                              <p className="text-[12px] text-[#777]">
                                {addr.house}, {addr.street}, {addr.city} - {addr.pincode}
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenAddAddress(addr)}
                                className="p-1 text-[#777] hover:text-[#222]"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteAddress(addr.id, e)}
                                className="p-1 text-[#777] hover:text-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    )}
                  </div>
                )}

                {/* 4. WISHLIST TAB (Phase 12 Requirement) */}
                {accountDashboardTab === "wishlist" && (
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-black text-[#111]">
                      My Wishlist ({wishlist.length})
                    </h4>

                    {wishlist.length === 0 ? (
                      <div className="py-10 text-center space-y-2">
                        <Heart size={32} className="mx-auto text-[#bbb]" />
                        <p className="text-[14px] font-bold text-[#333]">
                          Your wishlist is empty
                        </p>
                        <p className="text-[12px] text-[#777]">
                          Tap the heart icon on any product to save it here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {productsList.filter((p) =>
                          wishlist.includes(p.id || p.name)
                        ).map((favItem) => (
                          <div
                            key={favItem.name}
                            className="flex items-center justify-between rounded-[16px] border border-[#edf0f2] p-3 bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 rounded-xl bg-[#f8f9fa] shrink-0 border border-[#edf0f2]">
                                <Image
                                  src={favItem.image}
                                  alt={favItem.name}
                                  fill
                                  sizes="48px"
                                  className="object-contain p-1"
                                />
                              </div>
                              <div>
                                <p className="text-[13.5px] font-bold text-[#222]">
                                  {favItem.name}
                                </p>
                                <p className="text-[11.5px] text-[#777]">
                                  {favItem.quantity} •{" "}
                                  <strong className="text-[#111]">{favItem.price}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  handleAddToCart(favItem);
                                  showToast(`Added ${favItem.name} to cart!`);
                                }}
                                className="rounded-xl bg-[#48a92b] px-3.5 py-1.5 text-[12px] font-bold text-white hover:bg-[#3d9124] shadow-xs active:scale-95"
                              >
                                + Add to Cart
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleWishlist(favItem)}
                                className="p-1 text-[#aaa] hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. COUPONS TAB (Phase 11 Requirement) */}
                {accountDashboardTab === "coupons" && (
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-black text-[#111]">Exclusive Coupons</h4>
                    {AVAILABLE_COUPONS.length === 0 ? (
                      <div className="py-10 text-center space-y-1">
                        <Tag size={32} className="mx-auto text-[#bbb]" />
                        <p className="text-[14px] font-bold text-[#333]">No coupons available</p>
                        <p className="text-[12px] text-[#777]">Active store discounts will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {AVAILABLE_COUPONS.map((c) => (
                          <div
                            key={c.code}
                            className="rounded-[16px] border border-[#edf0f2] p-4 bg-white flex items-center justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-[#F8CB46]/30 px-2 py-0.5 text-[11px] font-black text-[#111]">
                                  {c.code}
                                </span>
                                <span className="text-[10px] font-bold text-[#2f7d32] uppercase">
                                  {c.tag}
                                </span>
                              </div>
                              <h5 className="mt-1 font-bold text-[13.5px] text-[#222]">
                                {c.title}
                              </h5>
                              <p className="text-[11.5px] text-[#777]">
                                {c.description}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleApplyCoupon(c.code);
                                setIsAccountDashboardOpen(false);
                              }}
                              className="rounded-xl border border-[#48a92b] px-3.5 py-1.5 text-[12px] font-bold text-[#48a92b] hover:bg-[#48a92b] hover:text-white transition-all active:scale-95"
                            >
                              Apply
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. NOTIFICATIONS TAB (Phase 12 Requirement) */}
                {accountDashboardTab === "notifications" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[16px] font-black text-[#111]">Notifications</h4>
                      {unreadNotifCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkNotificationsRead}
                          className="text-[12px] font-bold text-[#48a92b] hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="py-10 text-center space-y-1">
                        <Bell size={32} className="mx-auto text-[#bbb]" />
                        <p className="text-[14px] font-bold text-[#333]">No notifications</p>
                        <p className="text-[12px] text-[#777]">Order updates and notices will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`rounded-[16px] border p-3.5 flex items-start gap-3 ${
                            notif.read
                              ? "border-[#edf0f2] bg-white opacity-80"
                              : "border-[#cbe7c8] bg-[#f8fdf8]"
                          }`}
                        >
                          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf5e9] text-[#2f7d32] shrink-0">
                            {notif.iconType === "order" ? (
                              <Package size={15} />
                            ) : notif.iconType === "offer" ? (
                              <Tag size={15} />
                            ) : (
                              <Truck size={15} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-[13px] font-bold text-[#222]">
                                {notif.title}
                              </p>
                              <span className="text-[10.5px] text-[#999]">{notif.time}</span>
                            </div>
                            <p className="mt-0.5 text-[12px] text-[#666] leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                )}

                {/* 7. HELP & SUPPORT TAB (Phase 12 Requirement) */}
                {accountDashboardTab === "help" && (
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-black text-[#111]">Help & Customer Support</h4>
                    <p className="text-[12.5px] text-[#666]">
                      What can we assist you with today? Choose a category below:
                    </p>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: "order", label: "Order Issues", desc: "Missing or delayed item" },
                        { id: "payment", label: "Payment Issues", desc: "Refund or billing help" },
                        { id: "delivery", label: "Delivery Issues", desc: "Rider status & tracking" },
                        { id: "product", label: "Product Issues", desc: "Quality or freshness" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedHelpCategory(item.label)}
                          className={`
                            p-3 rounded-[14px] border text-left transition-all active:scale-98
                            ${
                              selectedHelpCategory === item.label
                                ? "border-[#48a92b] bg-[#f8faf8] ring-1 ring-[#48a92b]"
                                : "border-[#edf0f2] bg-white hover:border-[#ccc]"
                            }
                          `}
                        >
                          <p className="font-bold text-[13px] text-[#222]">{item.label}</p>
                          <p className="text-[11px] text-[#777] mt-0.5">{item.desc}</p>
                        </button>
                      ))}
                    </div>

                    {/* Support Contact Channels */}
                    <div className="rounded-[18px] bg-[#f9fafb] border border-[#edf0f2] p-4 space-y-3">
                      <p className="font-bold text-[13px] text-[#222]">
                        24x7 Instant Assistance
                      </p>
                      <div className="space-y-2 text-[12.5px] text-[#555]">
                        <div className="flex items-center gap-2">
                          <PhoneCall size={15} className="text-[#48a92b]" />
                          <span>Toll-Free Helpline: <strong>1800-APNI-DUKAAN</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={15} className="text-[#48a92b]" />
                          <span>Email Support: <strong>support@apnidukaan.com</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare size={15} className="text-[#48a92b]" />
                          <span>Live Chat: Available daily 6:00 AM – 11:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. FAQS ACCORDION TAB (Phase 12 Requirement) */}
                {accountDashboardTab === "faq" && (
                  <div className="space-y-3.5">
                    <h4 className="text-[16px] font-black text-[#111]">
                      Frequently Asked Questions
                    </h4>

                    <div className="space-y-2">
                      {[
                        {
                          q: "How fast is delivery?",
                          a: "We deliver in 8–15 minutes through our local micro-fulfillment stores across Rewa. Every order is packed fresh upon confirmation.",
                        },
                        {
                          q: "How can I cancel an order?",
                          a: "Orders can be cancelled directly from the 'My Orders' screen within 2 minutes of placement before our store associates begin packing.",
                        },
                        {
                          q: "How do I apply a coupon?",
                          a: "You can apply coupons during Checkout or from the 'My Coupons' section by tapping the Apply button or entering codes like APNI50.",
                        },
                        {
                          q: "What payment methods are supported?",
                          a: "We currently support Cash on Delivery (COD) as well as UPI (Google Pay, PhonePe, Paytm) and Cards upon delivery.",
                        },
                        {
                          q: "What happens if a product is unavailable?",
                          a: "Unavailable products are automatically marked as out of stock on our catalog. If an item becomes unavailable after ordering, you are immediately notified.",
                        },
                      ].map((item, idx) => {
                        const isOpen = expandedFaqId === idx;
                        return (
                          <div
                            key={item.q}
                            className="rounded-[14px] border border-[#edf0f2] bg-white overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedFaqId(isOpen ? null : idx)}
                              className="flex w-full items-center justify-between p-3.5 text-left text-[13px] font-bold text-[#222]"
                            >
                              <span>{item.q}</span>
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 text-[#777] ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-3.5 pb-3.5 text-[12.5px] leading-relaxed text-[#666] border-t border-[#f5f5f5] pt-2">
                                {item.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 9. PRIVACY TAB */}
                {accountDashboardTab === "privacy" && (
                  <div className="space-y-3.5 text-[13px] text-[#555] leading-relaxed max-w-[500px]">
                    <h4 className="text-[16px] font-black text-[#111]">Privacy & Data Policy</h4>
                    <p>
                      At ApniDukaan, your privacy is strictly protected. This demo application operates fully client-side inside your browser session.
                    </p>
                    <p>
                      We never store credit card numbers, passwords, or personal location telemetry on any external database.
                    </p>
                    <p>
                      All orders, addresses, and wishlist items are safely managed through local React state for demo performance.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          ACCOUNT MENU (Header Trigger)
      ========================================================= */}
      {isAccountOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none md:items-start md:justify-end p-0 md:p-6">
          <div
            className="
              pointer-events-auto
              w-full
              max-w-[360px]
              rounded-t-[24px]
              border
              border-[#edf0f2]
              bg-white
              shadow-2xl
              md:rounded-[20px]
              md:mt-12
              max-h-[85vh]
              flex
              flex-col
              overflow-hidden
              anim-bottom-sheet
              md:anim-dropdown
            "
          >
            <div className="pt-3 pb-1 md:hidden">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-[#e2e5e8]" />
            </div>

            <div className="flex items-center justify-between border-b border-[#edf0f2] bg-[#fafafa] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8CB46] text-[#111] font-black text-[15px]">
                  {user.isLoggedIn
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "AD"}
                </div>
                <div>
                  <h4 className="text-[14.5px] font-bold text-[#1f1f1f]">
                    {user.isLoggedIn ? user.name : "Welcome to ApniDukaan"}
                  </h4>
                  <p className="text-[12px] text-[#777]">
                    {user.isLoggedIn ? user.phone : "Log in for fast checkout"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAccountOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#eee]"
              >
                <X size={18} />
              </button>
            </div>

            {!user.isLoggedIn && (
              <div className="p-4 border-b border-[#edf0f2] bg-[#f8faf8]">
                <button
                  type="button"
                  onClick={() => handleOpenLogin(false)}
                  className="w-full rounded-[12px] bg-[#48a92b] py-2.5 text-[13.5px] font-bold text-white shadow-xs hover:bg-[#3d9124] transition-all"
                >
                  Login / Sign Up
                </button>
              </div>
            )}

            <div className="overflow-y-auto py-2">
              {[
                {
                  label: "My Account Dashboard",
                  icon: User,
                  badge: "",
                  action: () => handleOpenAccountTab("profile"),
                },
                {
                  label: "My Orders",
                  icon: Package,
                  badge: `${orders.length}`,
                  action: () => handleOpenAccountTab("orders"),
                },
                {
                  label: "Saved Addresses",
                  icon: MapPin,
                  badge: `${savedAddresses.length}`,
                  action: () => handleOpenAccountTab("addresses"),
                },
                {
                  label: "Wishlist",
                  icon: Heart,
                  badge: `${wishlist.length}`,
                  action: () => handleOpenAccountTab("wishlist"),
                },
                {
                  label: "My Coupons",
                  icon: Tag,
                  badge: "3 Available",
                  action: () => handleOpenAccountTab("coupons"),
                },
                {
                  label: "Notifications",
                  icon: Bell,
                  badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : "",
                  action: () => handleOpenAccountTab("notifications"),
                },
                {
                  label: "Help & Support",
                  icon: Headphones,
                  badge: "",
                  action: () => handleOpenAccountTab("help"),
                },
                {
                  label: "FAQs",
                  icon: HelpCircle,
                  badge: "",
                  action: () => handleOpenAccountTab("faq"),
                },
                {
                  label: "Account Privacy",
                  icon: Shield,
                  badge: "",
                  action: () => handleOpenAccountTab("privacy"),
                },
                ...(user.isLoggedIn
                  ? [
                      {
                        label: "Log Out",
                        icon: LogOut,
                        badge: "",
                        isDanger: true,
                        action: handleLogout,
                      },
                    ]
                  : []),
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className={`
                      flex w-full items-center justify-between px-5 py-3 text-left transition-all active:scale-[0.99]
                      ${
                        item.isDanger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-[#222] hover:bg-[#f6f8fa]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={17}
                        className={item.isDanger ? "text-red-500" : "text-[#666]"}
                      />
                      <span className="text-[13.5px] font-medium">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[11px] font-semibold text-[#666]">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={14} className="text-[#aaa]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          LOGIN / OTP MODAL (Phase 6)
      ========================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[101] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-4">
          <div className="pointer-events-auto w-full max-w-[420px] rounded-t-[24px] border border-[#edf0f2] bg-white shadow-2xl md:rounded-[20px] max-h-[92vh] flex flex-col overflow-hidden anim-bottom-sheet md:anim-modal">
            <div className="pt-3 pb-1 md:hidden">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-[#e2e5e8]" />
            </div>

            <div className="flex items-center justify-between border-b border-[#edf0f2] px-6 py-4">
              <div className="flex items-center gap-2">
                {loginStep === "otp" && (
                  <button
                    type="button"
                    onClick={() => {
                      setLoginStep("phone");
                      setLoginError(null);
                    }}
                    className="mr-1 rounded-full p-1 text-[#666] hover:bg-[#f2f4f6]"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <div>
                  <h3 className="text-[18px] font-black tracking-tight text-[#1f1f1f]">
                    <span className="text-[#F8CB46]">Apni</span>
                    <span className="text-[#48A92B]">Dukaan</span>
                  </h3>
                  <p className="text-[12px] text-[#777]">
                    {loginStep === "phone" ? "Welcome back" : "Verification code sent"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5">
              {loginStep === "phone" ? (
                <form onSubmit={handleMobileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#333] mb-1.5">
                      Mobile number
                    </label>
                    <div className="flex items-center rounded-[14px] border border-[#e2e5e8] bg-[#f8f9fa] focus-within:border-[#48a92b] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#48a92b]/20 transition-all overflow-hidden">
                      <span className="px-3.5 py-3 text-[14px] font-bold text-[#555] border-r border-[#e2e5e8] bg-[#f0f2f4]">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        autoFocus
                        value={mobileInput}
                        onChange={(e) => {
                          setMobileInput(e.target.value.replace(/\D/g, ""));
                          setLoginError(null);
                        }}
                        placeholder="Enter mobile number"
                        className="w-full bg-transparent px-3.5 py-3 text-[15px] font-semibold text-[#222] outline-none placeholder:text-[#999]"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-1.5 text-[12px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-[14px] bg-[#48a92b] py-3.5 text-[14.5px] font-bold text-white shadow-md hover:bg-[#3d9124] transition-all active:scale-98"
                  >
                    Continue
                  </button>

                  <div className="relative my-4 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#edf0f2]" />
                    </div>
                    <span className="relative bg-white px-3 text-[11.5px] text-[#999]">
                      OR
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleContinueAsGuest}
                    className="w-full rounded-[14px] border border-[#e2e5e8] bg-[#fafbfc] py-3 text-[13.5px] font-semibold text-[#444] hover:bg-[#f0f2f4] active:scale-98"
                  >
                    Continue as Guest
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center">
                    <p className="text-[14px] font-bold text-[#222]">
                      Enter 6-digit OTP
                    </p>
                    <p className="text-[12px] text-[#777] mt-0.5">
                      Sent to +91 {mobileInput || "9876543210"}
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 pt-2">
                    {otpInput.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="h-12 w-11 rounded-[12px] border border-[#d1d5db] bg-[#f9fafb] text-center text-[18px] font-extrabold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white focus:ring-2 focus:ring-[#48a92b]/20"
                      />
                    ))}
                  </div>

                  <div className="rounded-lg bg-[#f0f9ed] p-2.5 text-center text-[11.5px] text-[#2f7d32] border border-[#d2edd0]">
                    💡 <strong>Demo Mode:</strong> Any 6 digits accepted (e.g. 123456)
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-1.5 text-[12px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-[14px] bg-[#48a92b] py-3.5 text-[14.5px] font-bold text-white shadow-md hover:bg-[#3d9124] transition-all active:scale-98"
                  >
                    Verify & Continue
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpInput(["1", "2", "3", "4", "5", "6"]);
                        setLoginError(null);
                      }}
                      className="text-[12px] font-semibold text-[#48a92b] hover:underline"
                    >
                      Auto-fill demo code (123456)
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SAVED ADDRESSES MODAL (Phase 7)
      ========================================================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[101] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-4">
          <div className="pointer-events-auto w-full max-w-[480px] rounded-t-[24px] border border-[#edf0f2] bg-white shadow-2xl md:rounded-[20px] max-h-[85vh] flex flex-col overflow-hidden anim-bottom-sheet md:anim-modal">
            <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
              <div>
                <h3 className="text-[17px] font-bold text-[#1f1f1f]">
                  Saved Addresses
                </h3>
                <p className="text-[12px] text-[#777]">
                  Select or manage your delivery locations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-3.5">
              <button
                type="button"
                onClick={() => handleOpenAddAddress()}
                className="flex w-full items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-[#48a92b] bg-[#f7fbf6] py-3 text-[13.5px] font-bold text-[#2f7d32] hover:bg-[#eaf7e8] transition-all"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>+ Add New Address</span>
              </button>

              <div className="space-y-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  const Icon =
                    addr.label === "Home"
                      ? HomeIcon
                      : addr.label === "Work"
                      ? Briefcase
                      : MapPin;

                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setIsAddressModalOpen(false);
                        showToast(`Address set to ${addr.label}`);
                      }}
                      className={`flex cursor-pointer items-start justify-between rounded-[16px] border p-4 transition-all active:scale-[0.99] ${
                        isSelected
                          ? "border-[#48a92b] bg-[#f8faf8] ring-1.5 ring-[#48a92b]"
                          : "border-[#edf0f2] bg-white hover:border-[#ccc]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isSelected
                              ? "bg-[#48a92b] text-white"
                              : "bg-[#f3f4f6] text-[#555]"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-[#222]">
                              {addr.label}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#2f7d32]">
                                <Check size={12} strokeWidth={3} /> Selected
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[13px] font-medium text-[#333]">
                            {addr.name} • <span className="text-[#666]">{addr.phone}</span>
                          </p>
                          <p className="mt-1 text-[12px] text-[#666] leading-relaxed">
                            {addr.house}, {addr.street}, {addr.city} - {addr.pincode}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenAddAddress(addr)}
                          className="rounded-lg p-1.5 text-[#666] hover:bg-black/5"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAddress(addr.id, e)}
                          className="rounded-lg p-1.5 text-[#666] hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          ADD / EDIT ADDRESS FORM (Phase 7)
      ========================================================= */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-[102] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-4">
          <div className="pointer-events-auto w-full max-w-[480px] rounded-t-[24px] border border-[#edf0f2] bg-white shadow-2xl md:rounded-[20px] max-h-[90vh] flex flex-col overflow-hidden anim-bottom-sheet md:anim-modal">
            <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
              <h3 className="text-[17px] font-bold text-[#1f1f1f]">
                {editingAddressId ? "Edit Address" : "+ Add New Address"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="overflow-y-auto p-5 space-y-3.5">
              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Home", "Work", "Other"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setAddressFormData({ ...addressFormData, label: type })
                      }
                      className={`rounded-xl border py-2 text-[13px] font-bold transition-all ${
                        addressFormData.label === type
                          ? "border-[#48a92b] bg-[#eaf5e9] text-[#2f7d32]"
                          : "border-[#e0e0e0] bg-white text-[#555]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={addressFormData.name}
                  onChange={(e) =>
                    setAddressFormData({ ...addressFormData, name: e.target.value })
                  }
                  className="w-full rounded-[12px] border border-[#d1d5db] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#48a92b]"
                />
                {addressFormErrors.name && (
                  <p className="mt-1 text-[11px] text-red-600">{addressFormErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={addressFormData.phone}
                  onChange={(e) =>
                    setAddressFormData({
                      ...addressFormData,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full rounded-[12px] border border-[#d1d5db] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#48a92b]"
                />
                {addressFormErrors.phone && (
                  <p className="mt-1 text-[11px] text-red-600">{addressFormErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  House / Flat / Building *
                </label>
                <input
                  type="text"
                  value={addressFormData.house}
                  onChange={(e) =>
                    setAddressFormData({ ...addressFormData, house: e.target.value })
                  }
                  className="w-full rounded-[12px] border border-[#d1d5db] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#48a92b]"
                />
                {addressFormErrors.house && (
                  <p className="mt-1 text-[11px] text-red-600">{addressFormErrors.house}</p>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Street / Area *
                </label>
                <input
                  type="text"
                  value={addressFormData.street}
                  onChange={(e) =>
                    setAddressFormData({ ...addressFormData, street: e.target.value })
                  }
                  className="w-full rounded-[12px] border border-[#d1d5db] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#48a92b]"
                />
                {addressFormErrors.street && (
                  <p className="mt-1 text-[11px] text-red-600">{addressFormErrors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressFormData.city}
                    onChange={(e) =>
                      setAddressFormData({ ...addressFormData, city: e.target.value })
                    }
                    className="w-full rounded-[12px] border border-[#d1d5db] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#48a92b]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={addressFormData.pincode}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        pincode: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="w-full rounded-[12px] border border-[#d1d5db] px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[#48a92b]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="flex-1 rounded-[14px] border border-[#d1d5db] py-3 text-[14px] font-bold text-[#555] hover:bg-[#f3f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-[14px] bg-[#48a92b] py-3 text-[14px] font-bold text-white shadow-md hover:bg-[#3d9124] active:scale-98"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DELIVERY SLOT PICKER (Phase 7)
      ========================================================= */}
      {isSlotPickerOpen && (
        <div className="fixed inset-0 z-[101] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-4">
          <div className="pointer-events-auto w-full max-w-[420px] rounded-t-[24px] border border-[#edf0f2] bg-white shadow-2xl md:rounded-[20px] max-h-[85vh] flex flex-col overflow-hidden anim-bottom-sheet md:anim-modal">
            <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
              <div>
                <h3 className="text-[17px] font-bold text-[#1f1f1f]">
                  Choose Delivery Slot
                </h3>
                <p className="text-[12px] text-[#777]">
                  Express or scheduled convenient time
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSlotPickerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-2.5 overflow-y-auto">
              {DELIVERY_SLOTS.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => {
                      setSelectedSlotId(slot.id);
                      setIsSlotPickerOpen(false);
                      showToast(`Delivery set to: ${slot.label}`);
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-[16px] border p-3.5 transition-all ${
                      isSelected
                        ? "border-[#48a92b] bg-[#f8faf8] ring-1.5 ring-[#48a92b]"
                        : "border-[#edf0f2] bg-white hover:border-[#ccc]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          isSelected ? "bg-[#48a92b] text-white" : "bg-[#f4f5f6] text-[#555]"
                        }`}
                      >
                        {slot.type === "express" ? (
                          <Truck size={17} />
                        ) : (
                          <Clock size={17} />
                        )}
                      </div>
                      <div>
                        <p className="text-[13.5px] font-bold text-[#222]">
                          {slot.label}
                        </p>
                        <p className="text-[11.5px] text-[#777]">{slot.subtext}</p>
                      </div>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-[#48a92b] bg-[#48a92b] text-white"
                          : "border-[#bbb] bg-white"
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          LOCATION SELECTOR MODAL / BOTTOM SHEET (Header)
      ========================================================= */}
      {isLocationOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-4">
          <div className="pointer-events-auto w-full max-w-[490px] rounded-t-[24px] border border-[#edf0f2] bg-white shadow-2xl md:rounded-[22px] max-h-[88vh] md:max-h-[85vh] flex flex-col overflow-hidden anim-bottom-sheet md:anim-modal">
            {/* Mobile drag bar */}
            <div className="pt-3 pb-1 md:hidden">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-[#e2e5e8]" />
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
              <div>
                <h3 className="text-[17px] font-bold text-[#1f1f1f]">
                  Change Location
                </h3>
                <p className="text-[12px] text-[#777]">
                  Instant delivery in 8 minutes
                </p>
              </div>
              <button
                type="button"
                aria-label="Close location selector"
                onClick={() => setIsLocationOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="overflow-y-auto px-4 py-4 md:px-5 md:py-5 space-y-4">
              {/* 1. Detect My Location Button */}
              <button
                type="button"
                disabled={isDetectingLocation}
                onClick={handleDetectLocationClick}
                className={`flex w-full items-center justify-center gap-2 rounded-[14px] border py-3 px-4 text-[13.5px] font-bold transition-all ${
                  isDetectingLocation
                    ? "border-[#48a92b]/40 bg-[#f4fbf3] text-[#2f7d32] opacity-80 cursor-wait"
                    : "border-[#48a92b] bg-[#f4fbf3] text-[#2f7d32] hover:bg-[#eaf7e8] active:scale-[0.99] shadow-xs"
                }`}
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 size={17} className="animate-spin text-[#48a92b]" />
                    <span>Detecting your location...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={16} className="text-[#2f7d32]" />
                    <span>Detect my location</span>
                    <span className="ml-auto rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide text-[#2f7d32]">
                      GPS
                    </span>
                  </>
                )}
              </button>

              {/* 2. Location Error / Permission State Banner */}
              {locationError && (
                <div className="rounded-[14px] bg-[#fff8e1] border border-[#ffe082] p-3.5 text-[12.5px] text-[#7c5e10] space-y-2 anim-modal">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={17} className="shrink-0 text-[#f59e0b] mt-0.5" />
                    <span className="leading-snug">{locationError}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleEnterLocationManually}
                      className="inline-flex items-center gap-1 text-[12px] font-bold text-[#2f7d32] underline hover:text-[#256828]"
                    >
                      <span>Enter location manually</span>
                      <ArrowRight size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationError(null)}
                      className="text-[11.5px] text-[#888] hover:text-[#444]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Divider OR */}
              <div className="relative flex items-center justify-center py-0.5">
                <div className="w-full border-t border-[#edf0f2]" />
                <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#999]">
                  OR
                </span>
              </div>

              {/* 4. Manual Location Search Input */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]"
                />
                <input
                  ref={locationSearchInputRef}
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search delivery location (e.g. Rewa, Noida, Indore)..."
                  className="h-[44px] w-full rounded-[14px] border border-[#e2e5e8] bg-[#f8f9fa] pl-10 pr-9 text-[13px] text-[#222] outline-none transition-all placeholder:text-[#999] focus:border-[#48a92b] focus:bg-white focus:ring-2 focus:ring-[#48a92b]/15"
                />
                {locationSearch ? (
                  <button
                    type="button"
                    aria-label="Clear location search"
                    onClick={() => setLocationSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#888] hover:bg-[#eef0f2] hover:text-[#333]"
                  >
                    <X size={14} />
                  </button>
                ) : isSearchingLocationApi ? (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <Loader2 size={15} className="animate-spin text-[#888]" />
                  </div>
                ) : null}
              </div>

              {/* 5. Search Suggestions Results (When user is typing) */}
              {locationSearch.trim() && (
                <div className="rounded-[16px] border border-[#e5e9ec] bg-white p-2 shadow-xs space-y-1">
                  <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#888]">
                    <span>Location Suggestions</span>
                    {isSearchingLocationApi && (
                      <span className="flex items-center gap-1 text-[11px] font-normal text-[#666]">
                        <Loader2 size={11} className="animate-spin" /> Searching...
                      </span>
                    )}
                  </div>
                  {locationSearchResults.length > 0 ? (
                    locationSearchResults.slice(0, 7).map((item, idx) => (
                      <div
                        key={`${item.formattedAddress}-${idx}`}
                        onClick={() => handleSelectManualLocation(item)}
                        className="flex cursor-pointer items-start justify-between rounded-[12px] p-2.5 transition-all hover:bg-[#f6fbf5] active:bg-[#edf7eb]"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <MapPin size={16} className="mt-0.5 shrink-0 text-[#48a92b]" />
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-[#222] truncate">
                              {item.locality ? `${item.locality}, ` : ""}{item.city || item.formattedAddress}
                            </p>
                            <p className="text-[11.5px] text-[#666] truncate">
                              {item.formattedAddress}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded bg-[#f3f4f6] px-1.5 py-0.5 text-[10px] font-semibold text-[#666]">
                          Select
                        </span>
                      </div>
                    ))
                  ) : !isSearchingLocationApi ? (
                    <div className="p-3 text-center text-[12.5px] text-[#777]">
                      No delivery locations matching &quot;{locationSearch}&quot;.
                    </div>
                  ) : null}
                </div>
              )}

              {/* 6. Current GPS Location (If detected earlier) */}
              {detectedGpsLocation && (
                <div>
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#999]">
                      Current GPS Location
                    </span>
                    <span className="rounded bg-[#e8f5e9] px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-[#2f7d32]">
                      Live Coordinates
                    </span>
                  </div>
                  <div
                    onClick={() => handleSelectManualLocation(detectedGpsLocation)}
                    className={`flex cursor-pointer items-start justify-between rounded-[14px] border p-3.5 transition-all ${
                      appLocation?.source === "gps" && appLocation.formattedAddress === detectedGpsLocation.formattedAddress
                        ? "border-[#48a92b] bg-[#f7fbf6] ring-1.5 ring-[#48a92b]"
                        : "border-[#e0e8e0] bg-[#fafffa] hover:border-[#48a92b]/50"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#48a92b] text-white">
                        <Navigation size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-bold text-[#222] truncate">
                            {detectedGpsLocation.locality || detectedGpsLocation.city || "Current Location"}
                          </span>
                          {appLocation?.source === "gps" && appLocation.formattedAddress === detectedGpsLocation.formattedAddress && (
                            <span className="flex items-center gap-0.5 rounded-full bg-[#48a92b]/15 px-2 py-0.5 text-[10.5px] font-bold text-[#2f7d32]">
                              <Check size={11} strokeWidth={3} /> Active Delivery
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[12px] text-[#666] truncate">
                          {detectedGpsLocation.formattedAddress}
                        </p>
                        {detectedGpsLocation.latitude && detectedGpsLocation.longitude && (
                          <p className="mt-1 text-[10.5px] font-mono text-[#888]">
                            {detectedGpsLocation.latitude.toFixed(4)}° N, {detectedGpsLocation.longitude.toFixed(4)}° E
                          </p>
                        )}
                      </div>
                    </div>

                    {!(appLocation?.source === "gps" && appLocation.formattedAddress === detectedGpsLocation.formattedAddress) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectManualLocation(detectedGpsLocation);
                        }}
                        className="shrink-0 rounded-lg bg-[#48a92b] px-2.5 py-1 text-[11.5px] font-bold text-white hover:bg-[#3d9124] transition-colors"
                      >
                        Deliver Here
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 7. Saved Addresses (Home, Work, Other) */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#999]">
                    Saved Addresses
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLocationOpen(false);
                      handleOpenAddAddress();
                    }}
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[#2f7d32] hover:underline"
                  >
                    <Plus size={13} />
                    <span>Add New</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {savedAddresses
                    .filter((a) =>
                      locationSearch
                        ? a.street.toLowerCase().includes(locationSearch.toLowerCase()) ||
                          a.label.toLowerCase().includes(locationSearch.toLowerCase()) ||
                          a.city.toLowerCase().includes(locationSearch.toLowerCase())
                        : true
                    )
                    .map((addr) => {
                      const isCurrent =
                        appLocation?.source === "saved" && selectedAddressId === addr.id;
                      const Icon =
                        addr.label === "Home"
                          ? HomeIcon
                          : addr.label === "Work"
                          ? Briefcase
                          : MapPin;

                      return (
                        <div
                          key={addr.id}
                          className={`flex items-start justify-between rounded-[14px] border p-3.5 transition-all ${
                            isCurrent
                              ? "border-[#48a92b] bg-[#f7fbf6] ring-1.5 ring-[#48a92b]"
                              : "border-[#edf0f2] bg-white hover:border-[#48a92b]/40"
                          }`}
                        >
                          <div
                            onClick={() => handleSelectSavedAddress(addr)}
                            className="flex cursor-pointer items-start gap-3 min-w-0 flex-1 pr-2"
                          >
                            <div
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                isCurrent
                                  ? "bg-[#48a92b] text-white"
                                  : "bg-[#f3f4f6] text-[#555]"
                              }`}
                            >
                              <Icon size={15} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[13.5px] font-bold text-[#222]">
                                  {addr.label}
                                </span>
                                {isCurrent && (
                                  <span className="flex items-center gap-0.5 rounded-full bg-[#48a92b]/15 px-2 py-0.5 text-[10.5px] font-bold text-[#2f7d32]">
                                    <Check size={11} strokeWidth={3} /> Active Delivery
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-[12px] text-[#666] line-clamp-2">
                                {addr.house}, {addr.street}, {addr.city} - {addr.pincode}
                              </p>
                            </div>
                          </div>

                          {/* Actions: Select, Edit, Delete */}
                          <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                            {!isCurrent && (
                              <button
                                type="button"
                                onClick={() => handleSelectSavedAddress(addr)}
                                className="rounded-lg bg-[#f0f9ed] px-2.5 py-1 text-[11.5px] font-bold text-[#2f7d32] hover:bg-[#e2f4de] transition-colors"
                              >
                                Select
                              </button>
                            )}
                            <button
                              type="button"
                              aria-label={`Edit ${addr.label} address`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsLocationOpen(false);
                                handleOpenAddAddress(addr);
                              }}
                              className="rounded-lg p-1.5 text-[#777] hover:bg-[#f3f4f6] hover:text-[#222] transition-colors"
                              title="Edit address"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${addr.label} address`}
                              onClick={(e) => handleDeleteAddress(addr.id, e)}
                              className="rounded-lg p-1.5 text-[#999] hover:bg-[#fee2e2] hover:text-[#dc2626] transition-colors"
                              title="Delete address"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CART DRAWER (Phase 5)
      ========================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
          <div className="pointer-events-auto flex h-full w-full flex-col justify-between bg-white shadow-[-12px_0_36px_rgba(0,0,0,0.12)] md:max-w-[420px] max-h-[92vh] self-end rounded-t-[24px] md:max-h-full md:self-auto md:rounded-none anim-bottom-sheet md:anim-drawer-right">
            <div>
              <div className="pt-2.5 pb-1 md:hidden">
                <div className="mx-auto h-1.5 w-12 rounded-full bg-[#e2e5e8]" />
              </div>

              <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#48a92b]" />
                  <h3 className="text-[17px] font-bold text-[#1f1f1f]">My Cart</h3>
                  {totalItemsCount > 0 && (
                    <span className="rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-[11.5px] font-bold text-[#2f7d32]">
                      {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {cartItems.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-[12px] font-medium text-red-500 hover:text-red-700 hover:underline px-1 py-0.5"
                    >
                      Clear cart
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6]"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Free Delivery Bar */}
              {cartItems.length > 0 && (
                <div className="border-b border-[#edf0f2] bg-[#f8faf8] px-5 py-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    {subtotal >= FREE_DELIVERY_THRESHOLD || appliedCoupon === "FREESHIP" ? (
                      <span className="font-bold text-[#2f7d32] flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[#F8CB46]" />
                        FREE delivery unlocked 🎉
                      </span>
                    ) : (
                      <span className="font-semibold text-[#333]">
                        Add <strong className="text-[#2f7d32]">₹{amountToFreeDelivery}</strong> more for <strong className="text-[#2f7d32]">FREE delivery</strong>
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-[#666]">
                      ₹{subtotal} / ₹{FREE_DELIVERY_THRESHOLD}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5ece4]">
                    <div
                      className="h-full bg-gradient-to-r from-[#48a92b] to-[#2f7d32] transition-all duration-300 rounded-full"
                      style={{
                        width: `${
                          appliedCoupon === "FREESHIP" ? 100 : freeDeliveryProgress
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f9fa] border border-[#edf0f2]">
                    <ShoppingBag size={38} className="text-[#bbb]" />
                  </div>
                  <h4 className="mt-4 text-[17px] font-bold text-[#222]">
                    Your cart is empty
                  </h4>
                  <p className="mt-1.5 max-w-[240px] text-[13px] text-[#777]">
                    Add fresh groceries & essentials to begin.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      const el = document.getElementById("products");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-[12px] bg-[#48a92b] px-6 py-2.5 text-[13.5px] font-bold text-white shadow-xs hover:bg-[#3d9124]"
                  >
                    Start Shopping
                    <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-[#fdf8e7] border border-[#f3e3a2] p-3 text-[12px] text-[#7c6317]">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="shrink-0 text-[#f8cb46]" />
                      <span>
                        Delivering to{" "}
                        <strong className="underline">
                          {selectedAddress?.label || "Home"}
                        </strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsAddressModalOpen(true);
                      }}
                      className="text-[11.5px] font-bold text-[#48a92b] underline"
                    >
                      Change
                    </button>
                  </div>

                  <div className="divide-y divide-[#edf0f2]">
                    {cartItems.map((item) => {
                      const qty = cart[item.name] || 0;
                      return (
                        <div
                          key={item.name}
                          className="flex items-center justify-between py-3.5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f8f9fa] border border-[#edf0f2]">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-contain p-1.5"
                              />
                            </div>
                            <div>
                              <p className="text-[13.5px] font-bold text-[#222]">
                                {item.name}
                              </p>
                              <p className="text-[11.5px] text-[#777]">
                                {item.quantity} •{" "}
                                <span className="font-bold text-[#1f1f1f]">
                                  {item.price}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 items-center rounded-lg bg-[#48a92b] px-1 text-white shadow-xs">
                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(item)}
                                className="flex h-7 w-6 items-center justify-center rounded hover:bg-white/20"
                              >
                                <Minus size={13} strokeWidth={3} />
                              </button>
                              <span className="min-w-[16px] text-center text-[12.5px] font-extrabold">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(item)}
                                className="flex h-7 w-6 items-center justify-center rounded hover:bg-white/20"
                              >
                                <Plus size={13} strokeWidth={3} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#999] hover:text-red-500"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-[16px] bg-[#f9fafb] border border-[#edf0f2] p-3.5 space-y-2 text-[12.5px]">
                    <p className="font-bold text-[#222] text-[13px] border-b border-[#edf0f2] pb-1.5">
                      Bill Details
                    </p>
                    <div className="flex justify-between text-[#666]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#222]">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#666]">
                      <span>Delivery Fee</span>
                      <span
                        className={`font-bold ${
                          deliveryFee === 0 ? "text-[#2f7d32]" : "text-[#222]"
                        }`}
                      >
                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[14px] font-black text-[#111] pt-1.5 border-t border-[#edf0f2]">
                      <span>Total</span>
                      <span>₹{subtotal + deliveryFee}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-[#edf0f2] bg-white p-4 space-y-2">
                <button
                  type="button"
                  onClick={handleStartCheckout}
                  className="flex w-full items-center justify-between rounded-[14px] bg-[#48a92b] px-5 py-3.5 text-[14px] font-semibold text-white shadow-md hover:bg-[#3d9124] active:scale-98 transition-all"
                >
                  <div className="text-left">
                    <span className="block text-[11px] font-normal text-white/80">
                      Total ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
                    </span>
                    <span className="text-[16px] font-bold">₹{subtotal + deliveryFee}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[14px] font-semibold">
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-2 text-[13px] font-semibold text-[#666] hover:text-[#222] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          CHECKOUT MODAL (Phase 8 + 11 Coupons)
      ========================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[101] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-6">
          <div className="pointer-events-auto w-full max-w-[880px] rounded-t-[24px] border border-[#edf0f2] bg-white shadow-2xl md:rounded-[20px] max-h-[92vh] flex flex-col overflow-hidden anim-bottom-sheet md:anim-modal">
            <div className="pt-3 pb-1 md:hidden">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-[#e2e5e8]" />
            </div>

            <div className="flex items-center justify-between border-b border-[#edf0f2] px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf5e9] text-[#2f7d32]">
                  <Truck size={19} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1f1f1f]">Checkout</h3>
                  <p className="text-[11.5px] font-normal text-[#777]">
                    Review details & place your grocery order
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close checkout"
                onClick={() => setIsCheckoutOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f4f6]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 md:p-6 flex-1">
              {checkoutError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-[12.5px] font-semibold text-red-600 border border-red-100">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: Address, Delivery, Items, Payment */}
                <div className="lg:col-span-7 space-y-4">
                  {/* 1. Address */}
                  <div className="rounded-[18px] border border-[#edf0f2] bg-[#f9fafb] p-4">
                    <div className="flex items-center justify-between border-b border-[#edf0f2] pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={17} className="text-[#48a92b]" />
                        <h4 className="text-[13.5px] font-bold text-[#1f1f1f]">
                          1. Delivery Address
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(true)}
                        className="text-[12px] font-bold text-[#48a92b] hover:underline"
                      >
                        Change / Add
                      </button>
                    </div>

                    {selectedAddress && (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-[#222]">
                            {selectedAddress.label}
                          </span>
                          <span className="text-[12px] text-[#666]">
                            ({selectedAddress.name} • {selectedAddress.phone})
                          </span>
                        </div>
                        <p className="mt-1 text-[12.5px] text-[#555] leading-relaxed">
                          {selectedAddress.house}, {selectedAddress.street},{" "}
                          {selectedAddress.city} - {selectedAddress.pincode}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2. Delivery Slot */}
                  <div className="rounded-[18px] border border-[#edf0f2] bg-[#f9fafb] p-4">
                    <div className="flex items-center justify-between border-b border-[#edf0f2] pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock size={17} className="text-[#48a92b]" />
                        <h4 className="text-[13.5px] font-bold text-[#1f1f1f]">
                          2. Delivery Slot
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSlotPickerOpen(true)}
                        className="text-[12px] font-bold text-[#48a92b] hover:underline"
                      >
                        Change Slot
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-white rounded-[14px] border border-[#e5e7eb] p-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[18px]">
                          {selectedSlot.type === "express" ? "⚡" : "🕒"}
                        </span>
                        <div>
                          <p className="text-[13px] font-bold text-[#222]">
                            {selectedSlot.label}
                          </p>
                          <p className="text-[11.5px] text-[#777]">
                            {selectedSlot.subtext}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11.5px] font-bold text-[#2f7d32] bg-[#eaf5e9] px-2 py-0.5 rounded-full">
                        {selectedSlot.type === "express" ? "Standard FREE" : "Scheduled"}
                      </span>
                    </div>
                  </div>

                  {/* 3. Items */}
                  <div className="rounded-[18px] border border-[#edf0f2] bg-[#f9fafb] p-4">
                    <div className="flex items-center justify-between border-b border-[#edf0f2] pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <Package size={17} className="text-[#48a92b]" />
                        <h4 className="text-[13.5px] font-bold text-[#1f1f1f]">
                          3. Order Items ({totalItemsCount})
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCheckoutOpen(false);
                          setIsCartOpen(true);
                        }}
                        className="text-[12px] font-bold text-[#48a92b] hover:underline"
                      >
                        Modify Cart
                      </button>
                    </div>

                    <div className="max-h-[160px] overflow-y-auto space-y-2 divide-y divide-[#eee]">
                      {cartItems.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between pt-2 text-[12.5px]"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="font-bold text-[#111]">
                              {item.name}
                            </span>
                            <span className="text-[#777]">
                              × {cart[item.name]}
                            </span>
                          </div>
                          <span className="font-extrabold text-[#222]">
                            ₹{item.priceNum * (cart[item.name] || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Payment Method */}
                  <div className="rounded-[18px] border border-[#edf0f2] bg-[#f9fafb] p-4">
                    <div className="flex items-center gap-2 border-b border-[#edf0f2] pb-2.5 mb-3">
                      <Banknote size={17} className="text-[#48a92b]" />
                      <h4 className="text-[13.5px] font-bold text-[#1f1f1f]">
                        4. Payment Method
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {[
                        {
                          id: "cod" as const,
                          label: "Cash on Delivery",
                          subtext: "Pay with Cash or UPI upon arrival",
                          icon: Banknote,
                          badge: "Default",
                        },
                        {
                          id: "upi" as const,
                          label: "UPI (Google Pay, PhonePe, Paytm)",
                          subtext: "Instant contactless mobile payment",
                          icon: Smartphone,
                          badge: "",
                        },
                        {
                          id: "card" as const,
                          label: "Credit / Debit Card",
                          subtext: "Visa, Mastercard, RuPay",
                          icon: CreditCard,
                          badge: "",
                        },
                      ].map((method) => {
                        const isSelected = selectedPaymentMethod === method.id;
                        const Icon = method.icon;

                        return (
                          <div
                            key={method.id}
                            onClick={() => {
                              setSelectedPaymentMethod(method.id);
                              if (method.id !== "cod") {
                                setPaymentNotice(
                                  "Online payment will be enabled in a future version. For this demo, Cash on Delivery is active."
                                );
                              } else {
                                setPaymentNotice(null);
                              }
                            }}
                            className={`flex cursor-pointer items-center justify-between rounded-[14px] border p-3 transition-all ${
                              isSelected
                                ? "border-[#48a92b] bg-white ring-1.5 ring-[#48a92b]"
                                : "border-[#e5e7eb] bg-white hover:border-[#bbb]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                                  isSelected ? "bg-[#48a92b] text-white" : "bg-[#f3f4f6] text-[#555]"
                                }`}
                              >
                                <Icon size={16} />
                              </div>
                              <div>
                                <span className="text-[13px] font-bold text-[#222]">
                                  {method.label}
                                </span>
                                <p className="text-[11px] text-[#777]">{method.subtext}</p>
                              </div>
                            </div>
                            <div
                              className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
                                isSelected
                                  ? "border-[#48a92b] bg-[#48a92b] text-white"
                                  : "border-[#bbb] bg-white"
                              }`}
                            >
                              {isSelected && <Check size={11} strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {paymentNotice && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#fff8e1] border border-[#ffe082] p-2.5 text-[11.5px] text-[#8d6e1f]">
                        <Info size={14} className="shrink-0 mt-0.5" />
                        <span>{paymentNotice}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Coupon, Bill Details, Place Order CTA */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Coupon Card */}
                  <div className="rounded-[18px] border border-[#edf0f2] bg-[#f9fafb] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-[#48a92b]" />
                        <h4 className="text-[13.5px] font-bold text-[#1f1f1f]">
                          Apply Coupon
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCouponDrawerOpen(true)}
                        className="text-[11.5px] font-bold text-[#48a92b] hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between rounded-xl bg-[#eaf5e9] border border-[#cbe7c8] p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-[#2f7d32]" />
                          <div>
                            <p className="text-[12.5px] font-bold text-[#2f7d32]">
                              {appliedCoupon} Applied!
                            </p>
                            <p className="text-[11px] text-[#447242]">
                              {appliedCoupon === "APNI50"
                                ? "₹50 discount saved"
                                : appliedCoupon === "WELCOME10"
                                ? "10% off saved"
                                : "Delivery fee waived"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[12px] font-bold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 rounded-[12px] border border-[#d1d5db] bg-white px-3 py-2 text-[13px] font-semibold uppercase outline-none focus:border-[#48a92b]"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon()}
                            className="rounded-[12px] bg-[#48a92b] px-4 py-2 text-[12.5px] font-bold text-white shadow-xs hover:bg-[#3d9124]"
                          >
                            Apply
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {[
                            { code: "APNI50", desc: "₹50 off" },
                            { code: "WELCOME10", desc: "10% off" },
                            { code: "FREESHIP", desc: "Free Delivery" },
                          ].map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => handleApplyCoupon(c.code)}
                              className="rounded-lg border border-dashed border-[#48a92b] bg-white px-2 py-1 text-[11px] font-bold text-[#2f7d32] hover:bg-[#eaf5e9]"
                            >
                              + {c.code}
                            </button>
                          ))}
                        </div>

                        {couponError && (
                          <p className="text-[11.5px] text-red-600">{couponError}</p>
                        )}
                        {couponSuccess && (
                          <p className="text-[11.5px] text-[#2f7d32] font-semibold">
                            {couponSuccess}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bill Details */}
                  <div className="rounded-[18px] border border-[#edf0f2] bg-[#f9fafb] p-4 space-y-2.5 text-[12.5px]">
                    <h4 className="font-bold text-[#1f1f1f] text-[13.5px] border-b border-[#edf0f2] pb-2">
                      Bill Details
                    </h4>

                    <div className="flex justify-between text-[#666]">
                      <span>Item Total</span>
                      <span className="font-semibold text-[#222]">₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between text-[#666]">
                      <span>Delivery Fee</span>
                      <span
                        className={`font-bold ${
                          deliveryFee === 0 ? "text-[#2f7d32]" : "text-[#222]"
                        }`}
                      >
                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                      </span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-[#2f7d32] font-bold">
                        <span>Coupon Discount ({appliedCoupon})</span>
                        <span>-₹{couponDiscount}</span>
                      </div>
                    )}

                    {totalSavings > 0 && (
                      <div className="flex justify-between text-[#2f7d32] font-semibold pt-1 border-t border-[#edf0f2]">
                        <span>Total Savings</span>
                        <span>₹{totalSavings}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[15px] font-bold text-[#111] pt-2 border-t border-[#edf0f2]">
                      <span>Grand Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* Place Order CTA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#48a92b] py-3.5 text-[15px] font-semibold text-white shadow-md hover:bg-[#3d9124] active:scale-98 transition-all"
                    >
                      <Lock size={16} />
                      <span>Place Order • ₹{grandTotal}</span>
                    </button>
                    <p className="mt-2 text-center text-[11px] font-normal text-[#888]">
                      Safe and secure checkout • Instant 8–15 mins delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          ORDER SUCCESS CONFIRMATION (Phase 8)
      ========================================================= */}
      {isOrderSuccessOpen && latestPlacedOrder && (
        <div className="fixed inset-0 z-[102] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-6">
          <div className="pointer-events-auto w-full max-w-[480px] rounded-t-[24px] border border-[#edf0f2] bg-white shadow-2xl md:rounded-[20px] max-h-[92vh] flex flex-col overflow-hidden anim-bottom-sheet md:anim-modal">
            <div className="p-6 text-center space-y-3 border-b border-[#edf0f2] bg-[#f8faf8]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf7e8] text-[#2f7d32] shadow-sm">
                <CheckCircle2 size={38} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-[20px] font-black text-[#1f1f1f]">
                  Order Placed Successfully!
                </h3>
                <p className="text-[13px] font-bold text-[#48a92b] mt-0.5">
                  Order ID: {latestPlacedOrder.orderId}
                </p>
                <p className="text-[12px] text-[#666] mt-1">
                  Arriving in{" "}
                  <strong className="text-[#2f7d32]">
                    {latestPlacedOrder.deliveryMethod.detail}
                  </strong>
                </p>
              </div>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              <div className="rounded-[16px] bg-[#f9fafb] border border-[#edf0f2] p-4 text-[12.5px] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#222]">
                  <MapPin size={15} className="text-[#F8CB46]" />
                  <span>Delivering to: {latestPlacedOrder.address.label}</span>
                </div>
                <p className="text-[#555] leading-relaxed">
                  {latestPlacedOrder.address.house}, {latestPlacedOrder.address.street},{" "}
                  {latestPlacedOrder.address.city} - {latestPlacedOrder.address.pincode}
                </p>
                <div className="pt-2 border-t border-[#edf0f2] flex items-center justify-between text-[12px] text-[#666]">
                  <span>
                    Payment: <strong>{latestPlacedOrder.paymentMethod.toUpperCase()}</strong>
                  </span>
                  <span className="font-extrabold text-[#111] text-[13.5px]">
                    Total: ₹{latestPlacedOrder.total}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-[#888]">
                  Ordered Items ({latestPlacedOrder.items.length})
                </p>
                <div className="rounded-[14px] border border-[#edf0f2] p-3 space-y-2 max-h-[140px] overflow-y-auto bg-white">
                  {latestPlacedOrder.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-[12px]"
                    >
                      <span className="truncate pr-2 text-[#333]">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-bold text-[#111]">
                        ₹{item.priceNum * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {trackingToast && (
                <div className="rounded-xl bg-[#eaf5e9] border border-[#cbe7c8] p-3 text-[12px] text-[#2f7d32] font-semibold flex items-center gap-2">
                  <Info size={15} />
                  <span>{trackingToast}</span>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setTrackingToast(
                      "Order tracking will be available soon. Your items are currently being packed at the nearest store!"
                    )
                  }
                  className="w-full rounded-[14px] border border-[#48a92b] bg-[#f7fbf6] py-3 text-[13.5px] font-bold text-[#2f7d32] hover:bg-[#eaf7e8] transition-all"
                >
                  Track Order
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOrderSuccessOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full rounded-[14px] bg-[#48a92b] py-3.5 text-[14px] font-extrabold text-white shadow-md hover:bg-[#3d9124] transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}