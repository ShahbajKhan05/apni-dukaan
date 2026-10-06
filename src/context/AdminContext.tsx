"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
  OrderStatus,
} from "@/lib/admin/types";
import {
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_ADMIN_CATEGORIES,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_CUSTOMERS,
  INITIAL_ADMIN_COUPONS,
  INITIAL_ADMIN_OFFERS,
  INITIAL_DELIVERY_SETTINGS,
  INITIAL_STORE_SETTINGS,
  INITIAL_INVENTORY_ITEMS,
} from "@/lib/admin/mockData";

interface AdminContextType {
  products: AdminProduct[];
  categories: AdminCategory[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  coupons: AdminCoupon[];
  offers: AdminOffer[];
  inventory: InventoryItem[];
  deliverySettings: DeliverySettings;
  storeSettings: StoreSettings;
  toastMessage: string | null;
  showAdminToast: (msg: string) => void;

  // Products
  addProduct: (product: Omit<AdminProduct, "id">) => void | Promise<void>;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;

  // Categories
  addCategory: (category: Omit<AdminCategory, "id">) => void;
  updateCategory: (id: string, updates: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;

  // Inventory
  adjustStock: (
    productId: string,
    adjustment: number,
    reason: "Purchase" | "Sale Correction" | "Damaged" | "Expired" | "Manual Adjustment"
  ) => void;

  // Orders
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Coupons
  addCoupon: (coupon: AdminCoupon) => void;
  toggleCouponStatus: (code: string) => void;
  deleteCoupon: (code: string) => void;

  // Offers
  addOffer: (offer: Omit<AdminOffer, "id">) => void;
  toggleOfferStatus: (id: string) => void;
  deleteOffer: (id: string) => void;

  // Delivery & Settings
  updateDeliverySettings: (updates: Partial<DeliverySettings>) => void;
  updateStoreSettings: (updates: Partial<StoreSettings>) => void;
  toggleStoreStatus: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_ADMIN_CATEGORIES);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_ADMIN_CUSTOMERS);
  const [coupons, setCoupons] = useState<AdminCoupon[]>(INITIAL_ADMIN_COUPONS);
  const [offers, setOffers] = useState<AdminOffer[]>(INITIAL_ADMIN_OFFERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(INITIAL_DELIVERY_SETTINGS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showAdminToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch real data from database APIs on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Products
        const prodRes = await fetch("/api/products?all=true");
        if (prodRes.ok) {
          const res = await prodRes.json();
          if (Array.isArray(res.data)) {
            const mappedProds: AdminProduct[] = res.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              hindiName: p.hindiName || "",
              category: typeof p.category === "string" ? p.category : p.category?.name || "General",
              categoryId: p.categoryId,
              brand: p.brand || "",
              sku: p.sku || p.id.slice(0, 8),
              sellingPrice: Number(p.sellingPrice),
              mrp: Number(p.mrp),
              costPrice: p.costPrice ? Number(p.costPrice) : Math.round(Number(p.sellingPrice) * 0.8),
              stock: p.stock ?? p.inventory?.currentStock ?? 0,
              unit: p.unit || "unit",
              lowStockThreshold: p.inventory?.lowStockThreshold ?? 5,
              status: (p.isActive ? (p.stock === 0 ? "out_of_stock" : "active") : "disabled") as "active" | "out_of_stock" | "disabled",
              image: p.image || "/images/categories/home.svg",
              isFeatured: p.isFeatured || false,
            }));
            setProducts(mappedProds);
          }
        }

        // Categories
        const catRes = await fetch("/api/categories?all=true");
        if (catRes.ok) {
          const res = await catRes.json();
          if (Array.isArray(res.data)) {
            const mappedCats: AdminCategory[] = res.data.map((c: any) => ({
              id: c.id,
              name: c.name,
              shortName: c.shortName || c.name,
              hindiName: c.hindiName || "",
              slug: c.slug,
              description: c.description || "",
              icon: c.icon || "/images/categories/home.svg",
              displayOrder: c.displayOrder || 0,
              isActive: c.isActive !== false,
            }));
            setCategories(mappedCats);
          }
        }

        // Orders
        const ordRes = await fetch("/api/orders");
        if (ordRes.ok) {
          const res = await ordRes.json();
          if (Array.isArray(res.data)) {
            setOrders(res.data);
          }
        }

        // Inventory
        const invRes = await fetch("/api/inventory");
        if (invRes.ok) {
          const res = await invRes.json();
          if (Array.isArray(res.data)) {
            setInventory(res.data);
          }
        }

        // Customers
        const custRes = await fetch("/api/customers");
        if (custRes.ok) {
          const res = await custRes.json();
          if (Array.isArray(res.data)) {
            setCustomers(res.data);
          }
        }

        // Coupons
        const coupRes = await fetch("/api/coupons?all=true");
        if (coupRes.ok) {
          const res = await coupRes.json();
          if (Array.isArray(res.data)) {
            setCoupons(res.data);
          }
        }

        // Offers
        const offRes = await fetch("/api/offers?all=true");
        if (offRes.ok) {
          const res = await offRes.json();
          if (Array.isArray(res.data)) {
            setOffers(res.data);
          }
        }

        // Store Settings
        const setRes = await fetch("/api/settings");
        if (setRes.ok) {
          const res = await setRes.json();
          if (res.data) {
            setStoreSettings((prev) => ({
              ...prev,
              storeName: res.data.storeName || "",
              tagline: res.data.tagline || "",
              phone: res.data.phone || "",
              email: res.data.email || "",
              address: res.data.address || "",
              city: res.data.city || "",
              state: res.data.state || "",
              pincode: res.data.pincode || "",
              upiId: res.data.upiId || "",
              gstNumber: res.data.gstNumber || "",
              fssaiNumber: res.data.fssaiNumber || "",
              isOpen: res.data.isOpen ?? false,
            }));
            if (res.data.deliveryRadiusKm !== undefined) {
              setDeliverySettings((prev) => ({
                ...prev,
                deliveryRadiusKm: res.data.deliveryRadiusKm ?? 0,
                deliveryFee: res.data.deliveryFee ?? 0,
                freeDeliveryAbove: res.data.freeDeliveryAbove ?? 0,
                estimatedDeliveryTime: res.data.estimatedDeliveryTime || "",
              }));
            }
          }
        }
      } catch (e) {
        console.error("Failed to load real admin data:", e);
      }
    }

    loadData();
  }, []);

  // PRODUCT ACTIONS
  const addProduct = async (newProdData: Omit<AdminProduct, "id">) => {
    let createdId = `prod-${Date.now()}`;
    let createdCategoryId = newProdData.categoryId;

    try {
      const matchedCat = categories.find(
        (c) => c.name === newProdData.category || c.id === newProdData.category
      );

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdData.name,
          hindiName: newProdData.hindiName,
          category: newProdData.category,
          categoryId: matchedCat?.id || newProdData.categoryId || newProdData.category,
          description: newProdData.description,
          brand: newProdData.brand,
          unit: newProdData.unit,
          sellingPrice: newProdData.sellingPrice,
          mrp: newProdData.mrp,
          discount: newProdData.discountPercent,
          sku: newProdData.sku,
          image: newProdData.image,
          isFeatured: Boolean(newProdData.featured),
          stock: newProdData.stock,
          lowStockThreshold: newProdData.lowStockThreshold,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const created = json.data?.product || json.data;
        if (created?.id) {
          createdId = created.id;
          createdCategoryId = created.categoryId;
        }
      }
    } catch (err) {
      console.error("Failed to persist product via API:", err);
    }

    const newProduct: AdminProduct = { ...newProdData, id: createdId, categoryId: createdCategoryId };
    setProducts((prev) => [newProduct, ...prev]);

    // Also add to inventory
    const newInv: InventoryItem = {
      productId: createdId,
      productName: newProduct.name,
      category: newProduct.category,
      currentStock: newProduct.stock,
      lowStockThreshold: newProduct.lowStockThreshold,
      unit: newProduct.unit,
      status:
        newProduct.stock === 0
          ? "out_of_stock"
          : newProduct.stock <= newProduct.lowStockThreshold
          ? "low_stock"
          : "in_stock",
      lastUpdated: "Just now",
      history: [
        {
          id: `adj-${Date.now()}`,
          date: "Today, just now",
          adjustment: newProduct.stock,
          reason: "Purchase",
          newStock: newProduct.stock,
        },
      ],
    };
    setInventory((prev) => [newInv, ...prev]);
    showAdminToast(`Product "${newProduct.name}" added successfully!`);
  };

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };
        if (updates.stock !== undefined) {
          updated.status =
            updated.stock === 0
              ? "out_of_stock"
              : updated.status === "disabled"
              ? "disabled"
              : "active";
        }
        return updated;
      })
    );

    // Sync with inventory
    if (updates.stock !== undefined || updates.name || updates.category) {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.productId !== id) return item;
          const nextStock = updates.stock !== undefined ? updates.stock : item.currentStock;
          const threshold =
            updates.lowStockThreshold !== undefined ? updates.lowStockThreshold : item.lowStockThreshold;
          return {
            ...item,
            productName: updates.name || item.productName,
            category: updates.category || item.category,
            currentStock: nextStock,
            lowStockThreshold: threshold,
            status: nextStock === 0 ? "out_of_stock" : nextStock <= threshold ? "low_stock" : "in_stock",
            lastUpdated: "Just now",
          };
        })
      );
    }
    showAdminToast("Product updated successfully!");
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setInventory((prev) => prev.filter((item) => item.productId !== id));
    showAdminToast(`Product "${prod?.name || id}" removed.`);
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: AdminProduct = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      sku: `${target.sku}-CP`,
    };
    setProducts((prev) => [duplicated, ...prev]);
    showAdminToast(`Created copy of "${target.name}".`);
  };

  // CATEGORY ACTIONS
  const addCategory = (catData: Omit<AdminCategory, "id">) => {
    const newCategory: AdminCategory = {
      ...catData,
      id: `cat-${Date.now()}`,
      itemCount: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
    showAdminToast(`Category "${newCategory.name}" created!`);
  };

  const updateCategory = (id: string, updates: Partial<AdminCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showAdminToast("Category updated.");
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showAdminToast(`Category "${cat?.name || id}" deleted.`);
  };

  // INVENTORY ADJUSTMENT ACTION
  const adjustStock = (
    productId: string,
    adjustment: number,
    reason: "Purchase" | "Sale Correction" | "Damaged" | "Expired" | "Manual Adjustment"
  ) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        const newStock = Math.max(0, item.currentStock + adjustment);
        const status =
          newStock === 0
            ? "out_of_stock"
            : newStock <= item.lowStockThreshold
            ? "low_stock"
            : "in_stock";

        const newHistoryItem = {
          id: `adj-${Date.now()}`,
          date: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          adjustment,
          reason,
          newStock,
        };

        return {
          ...item,
          currentStock: newStock,
          status,
          lastUpdated: "Just now",
          history: [newHistoryItem, ...item.history],
        };
      })
    );

    // Also update product stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newStock = Math.max(0, p.stock + adjustment);
        return {
          ...p,
          stock: newStock,
          status: newStock === 0 ? "out_of_stock" : p.status === "disabled" ? "disabled" : "active",
        };
      })
    );

    const sign = adjustment > 0 ? `+${adjustment}` : `${adjustment}`;
    showAdminToast(`Stock updated (${sign}) for ${reason}.`);
  };

  // ORDER ACTIONS
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status } : ord))
    );
    showAdminToast(`Order #${orderId} marked as ${status}.`);
  };

  // COUPON ACTIONS
  const addCoupon = (coupon: AdminCoupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showAdminToast(`Coupon code ${coupon.code} activated!`);
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
    showAdminToast(`Coupon ${code} status toggled.`);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showAdminToast(`Coupon ${code} removed.`);
  };

  // OFFER ACTIONS
  const addOffer = (offerData: Omit<AdminOffer, "id">) => {
    const newOffer: AdminOffer = { ...offerData, id: `off-${Date.now()}` };
    setOffers((prev) => [newOffer, ...prev]);
    showAdminToast(`Store offer "${newOffer.title}" launched!`);
  };

  const toggleOfferStatus = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );
    showAdminToast("Offer status updated.");
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    showAdminToast("Offer deleted.");
  };

  // DELIVERY SETTINGS
  const updateDeliverySettings = (updates: Partial<DeliverySettings>) => {
    setDeliverySettings((prev) => ({ ...prev, ...updates }));
    showAdminToast("Delivery settings saved!");
  };

  // STORE SETTINGS
  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...updates }));
    showAdminToast("Store settings updated successfully!");
  };

  const toggleStoreStatus = () => {
    setStoreSettings((prev) => {
      const nextState = !prev.isOpen;
      showAdminToast(nextState ? "Store is now OPEN for customer orders! 🟢" : "Store is now CLOSED. 🔴");
      return { ...prev, isOpen: nextState };
    });
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        categories,
        orders,
        customers,
        coupons,
        offers,
        inventory,
        deliverySettings,
        storeSettings,
        toastMessage,
        showAdminToast,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        adjustStock,
        updateOrderStatus,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        addOffer,
        toggleOfferStatus,
        deleteOffer,
        updateDeliverySettings,
        updateStoreSettings,
        toggleStoreStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
