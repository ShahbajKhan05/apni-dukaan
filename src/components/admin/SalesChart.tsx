"use client";

import { useAdmin } from "@/context/AdminContext";
import { BarChart3 } from "lucide-react";

export default function SalesChart() {
  const { orders } = useAdmin();

  // If there are no real orders, display clean empty state
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-[#edf0f2] bg-white p-6 sm:p-8 shadow-xs text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f5f6] text-[#888]">
          <BarChart3 size={24} />
        </div>
        <h3 className="text-[15px] font-bold text-[#222]">Not enough data yet</h3>
        <p className="text-[12.5px] text-[#777] max-w-[340px] mx-auto">
          Analytics will appear as your store receives orders.
        </p>
      </div>
    );
  }

  // Calculate live data when orders exist
  const totalSales = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const aov = Math.round(totalSales / (totalOrders || 1));

  return (
    <div className="rounded-2xl border border-[#edf0f2] bg-white p-4 sm:p-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#f4f5f6] pb-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#111] sm:text-[18px]">
            Sales & Order Velocity
          </h2>
          <p className="text-[12px] text-[#777]">
            Store order analytics
          </p>
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-[#fbfcfd] border border-[#edf0f2] p-3 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[11px] font-bold uppercase text-[#888]">Total Revenue</p>
          <p className="text-[17px] font-black text-[#111] sm:text-[20px]">
            ₹{totalSales.toLocaleString("en-IN")}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase text-[#888]">Total Orders</p>
          <p className="text-[17px] font-black text-[#2f7d32] sm:text-[20px]">
            {totalOrders}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase text-[#888]">Avg Order Value</p>
          <p className="text-[17px] font-black text-[#111] sm:text-[20px]">
            ₹{aov}
          </p>
        </div>
      </div>
    </div>
  );
}
