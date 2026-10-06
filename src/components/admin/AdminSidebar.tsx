"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  Ticket,
  BadgePercent,
  Truck,
  Settings,
  Store,
  ExternalLink,
  Power,
  X,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, badgeKey: "orders" },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/offers", label: "Offers", icon: BadgePercent },
  { href: "/admin/delivery", label: "Delivery", icon: Truck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { storeSettings, toggleStoreStatus, orders, inventory } = useAdmin();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "New" || o.status === "Accepted" || o.status === "Preparing"
  ).length;

  const lowStockCount = inventory.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  ).length;

  const content = (
    <div className="flex h-full flex-col justify-between bg-white text-[#1f1f1f]">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8CB46] text-[#111] font-black text-[18px] shadow-xs">
              <Store size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-black tracking-tight text-[#111]">
                  <span className="text-[#F8CB46]">Apni</span>
                  <span className="text-[#48A92B]">Dukaan</span>
                </span>
                <span className="rounded bg-[#f0f4f8] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#555]">
                  Kirana
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#777]">
                Store Control Center
              </p>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              aria-label="Close admin menu"
              onClick={onCloseMobile}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f4f5f6] md:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Store Active Status Card */}
        <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-[#fafafa] border border-[#edf0f2]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`relative flex h-3 w-3 items-center justify-center`}
              >
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                    storeSettings.isOpen ? "bg-[#48a92b]" : "bg-red-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    storeSettings.isOpen ? "bg-[#2f7d32]" : "bg-red-600"
                  }`}
                />
              </span>
              <div>
                <span className="text-[12px] font-bold text-[#222]">
                  {storeSettings.isOpen ? "Store is Open" : "Store is Closed"}
                </span>
                <p className="text-[10px] text-[#777]">
                  {storeSettings.isOpen ? "Accepting orders" : "Orders paused"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleStoreStatus}
              title={storeSettings.isOpen ? "Click to close store" : "Click to open store"}
              className={`flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold transition-all ${
                storeSettings.isOpen
                  ? "bg-[#eaf5e9] text-[#2f7d32] hover:bg-[#d8edd6]"
                  : "bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca]"
              }`}
            >
              <Power size={11} strokeWidth={2.5} />
              <span>{storeSettings.isOpen ? "Close" : "Open"}</span>
            </button>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="mt-3 px-3 space-y-1">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(link.href);

            const badgeCount =
              link.badgeKey === "orders" ? pendingOrdersCount : undefined;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all ${
                  isActive
                    ? "bg-[#48A92B] text-white shadow-xs font-bold"
                    : "text-[#4b5563] hover:bg-[#f6f8fa] hover:text-[#111]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={
                      isActive
                        ? "text-white"
                        : "text-[#71717a] group-hover:text-[#111]"
                    }
                  />
                  <span>{link.label}</span>
                </div>

                {badgeCount !== undefined && badgeCount > 0 && (
                  <span
                    className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10.5px] font-black ${
                      isActive
                        ? "bg-white text-[#2f7d32]"
                        : "bg-[#eaf5e9] text-[#2f7d32]"
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}

                {link.label === "Inventory" && lowStockCount > 0 && (
                  <span
                    className={`flex h-5 items-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-[#F8CB46] text-black"
                        : "bg-[#fff3cd] text-[#856404]"
                    }`}
                  >
                    {lowStockCount} low
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Area */}
      <div className="border-t border-[#edf0f2] p-3 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-[#edf0f2] bg-[#fbfcfd] px-3 py-2 text-[12px] font-semibold text-[#333] hover:bg-[#f0f4f8] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store size={15} className="text-[#48a92b]" />
            <span>View Live Customer Store</span>
          </div>
          <ExternalLink size={13} className="text-[#888]" />
        </Link>

        <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#888]">
          <span>Rewa Kirana Center</span>
          <span className="font-mono">v1.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 flex-col shrink-0 border-r border-[#edf0f2] bg-white h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-[280px] max-w-[85vw] flex-col bg-white shadow-2xl anim-drawer-right">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
