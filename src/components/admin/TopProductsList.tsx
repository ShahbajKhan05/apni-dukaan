"use client";

import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function TopProductsList() {
  const { orders } = useAdmin();

  // Aggregate product sales from real customer orders
  const productSalesMap: Record<
    string,
    { name: string; quantity: number; revenue: number }
  > = {};

  orders
    .filter((o) => o.status !== "Cancelled")
    .forEach((order) => {
      order.items.forEach((item) => {
        if (!productSalesMap[item.name]) {
          productSalesMap[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productSalesMap[item.name].quantity += item.quantity;
        productSalesMap[item.name].revenue += item.price * item.quantity;
      });
    });

  const topSelling = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-[#edf0f2] bg-white p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#f4f5f6] pb-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#111] sm:text-[18px]">
            Top Fast-Moving Products
          </h2>
          <p className="text-[12px] text-[#777]">
            Highest turnover items this week
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-[12px] font-bold text-[#2f7d32] hover:underline"
        >
          <span>All Products</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {topSelling.length === 0 ? (
        <div className="py-10 text-center space-y-1">
          <p className="text-[14px] font-bold text-[#333]">No sales yet</p>
          <p className="text-[12px] text-[#777] max-w-[280px] mx-auto">
            Your best-selling products will appear here after customers place orders.
          </p>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-[#f4f5f6]">
          {topSelling.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 transition-colors hover:bg-[#fafafa] px-2 rounded-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-[12px] font-black text-[#bbb] w-4">
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#222] truncate">
                    {item.name}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <p className="text-[13px] font-black text-[#111]">
                  ₹{item.revenue.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] font-semibold text-[#2f7d32]">
                  {item.quantity} units sold
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
