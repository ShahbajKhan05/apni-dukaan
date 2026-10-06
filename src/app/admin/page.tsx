"use client";

import { useState } from "react";
import DashboardStats from "@/components/admin/DashboardStats";
import SalesChart from "@/components/admin/SalesChart";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import TopProductsList from "@/components/admin/TopProductsList";
import LowStockAlert from "@/components/admin/LowStockAlert";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import StockAdjustModal from "@/components/admin/StockAdjustModal";
import { AdminOrder, InventoryItem } from "@/lib/admin/types";
import { useAdmin } from "@/context/AdminContext";
import { Sparkles, Calendar, Store, ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
  const { storeSettings, inventory } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [stockAdjustItem, setStockAdjustItem] = useState<InventoryItem | null>(null);

  const handleQuickRestock = (productId: string) => {
    const item = inventory.find((i) => i.productId === productId);
    if (item) setStockAdjustItem(item);
  };

  const todayFormatted = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-black text-[#111] sm:text-[24px]">
              Namaste, {storeSettings.ownerName} 🙏
            </h1>
            <span className="hidden sm:inline-flex rounded-full bg-[#F8CB46]/20 border border-[#F8CB46]/50 px-2.5 py-0.5 text-[11px] font-bold text-[#8d6e1f]">
              Rewa Kirana Center
            </span>
          </div>
          <p className="text-[13px] text-[#666] mt-0.5">
            Here&apos;s your daily kirana store performance and pending delivery pipeline for {todayFormatted}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 rounded-xl bg-[#f4fbf3] border border-[#c8e6c9] px-3 py-1.5 text-[12px] font-bold text-[#2f7d32]">
            <span className="h-2 w-2 rounded-full bg-[#48a92b] animate-pulse" />
            <span>Store {storeSettings.isOpen ? "Open" : "Closed"}</span>
          </div>
        </div>
      </div>

      {/* 6 Key Stats Cards */}
      <DashboardStats />

      {/* Sales Chart Overview */}
      <SalesChart />

      {/* Two Column Grid: Recent Orders & Alerts / Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Queue (7 cols on Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          <RecentOrdersTable onSelectOrder={setSelectedOrder} />
        </div>

        {/* Low Stock Alerts & Top Products (5 cols on Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <LowStockAlert onQuickRestock={handleQuickRestock} />
          <TopProductsList />
        </div>
      </div>

      {/* Order Details Drawer/Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Quick Stock Adjust Modal */}
      {stockAdjustItem && (
        <StockAdjustModal
          item={stockAdjustItem}
          onClose={() => setStockAdjustItem(null)}
        />
      )}
    </div>
  );
}
