"use client";

import {
  IndianRupee,
  ShoppingBag,
  Clock,
  PackageCheck,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function DashboardStats() {
  const { orders, inventory } = useAdmin();

  // Compute live stats from context data
  const totalSales = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.status === "New" || o.status === "Accepted" || o.status === "Preparing"
  ).length;

  const lowStockCount = inventory.filter((i) => i.status === "low_stock").length;
  const outOfStockCount = inventory.filter((i) => i.status === "out_of_stock").length;

  const totalItemsSold = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0), 0);

  const stats = [
    {
      label: "Today's Sales",
      value: `₹${totalSales.toLocaleString("en-IN")}`,
      subtext: totalSales > 0 ? "From completed & pending orders" : "No sales yet today",
      trend: totalSales > 0 ? "up" : "neutral",
      icon: IndianRupee,
      color: "bg-[#eaf5e9] text-[#2f7d32] border-[#c8e6c9]",
      badge: totalSales > 0 ? "Active" : "₹0",
    },
    {
      label: "Today's Orders",
      value: `${orders.length}`,
      subtext: orders.length > 0 ? `${pendingOrders} need dispatch` : "No orders yet",
      trend: orders.length > 0 ? "up" : "neutral",
      icon: ShoppingBag,
      color: "bg-[#fff9e6] text-[#8d6e1f] border-[#f8cb46]/40",
      badge: `${pendingOrders} Pending`,
    },
    {
      label: "Pending Action",
      value: `${pendingOrders}`,
      subtext: pendingOrders > 0 ? "Needs packing / delivery" : "All caught up",
      trend: pendingOrders > 0 ? "warning" : "neutral",
      icon: Clock,
      color: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
      badge: pendingOrders > 0 ? "Action Required" : "Clear",
    },
    {
      label: "Items Sold",
      value: `${totalItemsSold}`,
      subtext: totalItemsSold > 0 ? "From customer orders" : "No items sold yet",
      trend: totalItemsSold > 0 ? "up" : "neutral",
      icon: PackageCheck,
      color: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
      badge: "Units",
    },
    {
      label: "Low Stock Items",
      value: `${lowStockCount}`,
      subtext: lowStockCount > 0 ? "Re-order needed soon" : "Healthy stock",
      trend: lowStockCount > 0 ? "warning" : "neutral",
      icon: AlertTriangle,
      color: "bg-[#fff3cd] text-[#856404] border-[#ffeeba]",
      badge: lowStockCount > 0 ? "Warning" : "Good",
    },
    {
      label: "Out of Stock",
      value: `${outOfStockCount}`,
      subtext: outOfStockCount > 0 ? "Restock needed" : "Zero items out",
      trend: outOfStockCount > 0 ? "down" : "neutral",
      icon: XCircle,
      color: "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]",
      badge: outOfStockCount > 0 ? "Restock" : "None",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-[#edf0f2] bg-white p-3.5 sm:p-4 shadow-xs transition-all hover:border-[#ddd] hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777]">
                  {stat.label}
                </span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-xl border ${stat.color}`}
                >
                  <Icon size={14} />
                </div>
              </div>

              <div className="mt-2 text-[20px] font-black tracking-tight text-[#111] sm:text-[23px]">
                {stat.value}
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-[#f4f5f6] pt-2 text-[11px]">
              <span className="text-[#666] truncate">{stat.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
