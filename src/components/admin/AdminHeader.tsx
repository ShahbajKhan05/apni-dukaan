"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Store,
  ExternalLink,
  Calendar,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Store Dashboard",
    subtitle: "Real-time overview of your kirana sales, stock & orders",
  },
  "/admin/products": {
    title: "Product Catalogue",
    subtitle: "Manage prices, MRP, discounts and live store visibility",
  },
  "/admin/categories": {
    title: "Categories",
    subtitle: "Organize kirana inventory into easy shopper categories",
  },
  "/admin/inventory": {
    title: "Inventory & Stock Levels",
    subtitle: "Track physical stock, log purchases and adjust damaged goods",
  },
  "/admin/orders": {
    title: "Customer Orders",
    subtitle: "Accept, prepare, pack and dispatch orders in real-time",
  },
  "/admin/customers": {
    title: "Customer Directory",
    subtitle: "View loyalty, order history and contact details",
  },
  "/admin/coupons": {
    title: "Discount Coupons",
    subtitle: "Create promotional codes to boost average order value",
  },
  "/admin/offers": {
    title: "Store Banners & Deals",
    subtitle: "Promote seasonal specials and buy-one-get-one deals",
  },
  "/admin/delivery": {
    title: "Delivery Configuration",
    subtitle: "Set delivery radius, express fee and active time slots",
  },
  "/admin/settings": {
    title: "Store Settings",
    subtitle: "Configure store timings, address, UPI ID and kirana license",
  },
};

export default function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const pathname = usePathname();
  const { storeSettings, orders } = useAdmin();

  const currentMeta = PAGE_TITLES[pathname] || {
    title: "Store Admin",
    subtitle: "ApniDukaan Kirana Store Management",
  };

  const pendingOrders = orders.filter(
    (o) => o.status === "New" || o.status === "Accepted"
  ).length;

  const todayStr = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#edf0f2] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation sidebar"
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#edf0f2] text-[#444] hover:bg-[#f6f8fa] md:hidden"
        >
          <Menu size={18} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-bold text-[#111] sm:text-[19px]">
              {currentMeta.title}
            </h1>
            <span
              className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${
                storeSettings.isOpen
                  ? "bg-[#eaf5e9] text-[#2f7d32]"
                  : "bg-[#fee2e2] text-[#dc2626]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  storeSettings.isOpen ? "bg-[#2f7d32]" : "bg-[#dc2626]"
                }`}
              />
              {storeSettings.isOpen ? "Live & Taking Orders" : "Store Closed"}
            </span>
          </div>
          <p className="hidden text-[11.5px] text-[#777] sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Date, Pending Orders alert, View Store CTA & Owner Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date indicator */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-[#edf0f2] bg-[#f9fafb] px-3 py-1.5 text-[12px] font-semibold text-[#555]">
          <Calendar size={13} className="text-[#888]" />
          <span>{todayStr}</span>
        </div>

        {/* Pending Orders quick badge */}
        {pendingOrders > 0 && (
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 rounded-xl bg-[#fff9e6] border border-[#f8cb46]/40 px-3 py-1.5 text-[12px] font-bold text-[#8d6e1f] transition-transform active:scale-95"
          >
            <ShoppingBag size={14} className="text-[#f8cb46]" />
            <span className="hidden sm:inline">Pending:</span>
            <span>{pendingOrders}</span>
          </Link>
        )}

        {/* Live Store Button */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#48a92b] bg-[#f4fbf3] px-3 py-1.5 text-[12px] font-bold text-[#2f7d32] hover:bg-[#eaf7e8] transition-all active:scale-95"
        >
          <Store size={14} />
          <span>Customer App</span>
          <ExternalLink size={12} />
        </Link>

        {/* Store Owner Avatar */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#edf0f2]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111] text-white font-bold text-[13px] shadow-xs">
            SK
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-[12.5px] font-bold leading-tight text-[#111]">
              {storeSettings.ownerName}
            </p>
            <p className="text-[10.5px] text-[#777] leading-tight">
              Kirana Owner
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
