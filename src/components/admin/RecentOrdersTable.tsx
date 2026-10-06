"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Eye, CheckCircle2 } from "lucide-react";
import { AdminOrder, OrderStatus } from "@/lib/admin/types";
import { useAdmin } from "@/context/AdminContext";

interface RecentOrdersTableProps {
  onSelectOrder?: (order: AdminOrder) => void;
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  New: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]", border: "border-[#bfdbfe]" },
  Accepted: { bg: "bg-[#fef3c7]", text: "text-[#92400e]", border: "border-[#fde68a]" },
  Preparing: { bg: "bg-[#fff9e6]", text: "text-[#8d6e1f]", border: "border-[#f8cb46]/40" },
  Packed: { bg: "bg-[#f3e8ff]", text: "text-[#6b21a8]", border: "border-[#e9d5ff]" },
  "Out for Delivery": { bg: "bg-[#e0f2fe]", text: "text-[#0369a1]", border: "border-[#bae6fd]" },
  Delivered: { bg: "bg-[#eaf5e9]", text: "text-[#2f7d32]", border: "border-[#c8e6c9]" },
  Cancelled: { bg: "bg-[#fee2e2]", text: "text-[#dc2626]", border: "border-[#fecaca]" },
};

export default function RecentOrdersTable({ onSelectOrder }: RecentOrdersTableProps) {
  const { orders, updateOrderStatus } = useAdmin();

  // Show up to 6 recent orders on the dashboard
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="rounded-2xl border border-[#edf0f2] bg-white p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#f4f5f6] pb-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#111] sm:text-[18px]">
            Live Orders Queue
          </h2>
          <p className="text-[12px] text-[#777]">
            Incoming customer deliveries from Rewa neighborhoods
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#2f7d32] hover:text-[#256828] hover:underline"
        >
          <span>View All Orders</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Responsive Table / Card Container */}
      {recentOrders.length === 0 ? (
        <div className="py-10 text-center space-y-1">
          <p className="text-[14px] font-bold text-[#333]">No orders yet</p>
          <p className="text-[12px] text-[#777]">
            New customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto no-scrollbar -mx-4 sm:mx-0">
          <table className="w-full text-left text-[13px] border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-[#edf0f2] text-[11px] font-bold uppercase tracking-wider text-[#888]">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f5f6]">
              {recentOrders.map((ord) => {
                const statusStyle =
                  ORDER_STATUS_COLORS[ord.status] || ORDER_STATUS_COLORS.New;

              return (
                <tr
                  key={ord.orderId}
                  className="transition-colors hover:bg-[#fbfcfd]"
                >
                  <td className="py-3 px-3 font-bold text-[#111]">
                    #{ord.orderId}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-[#222]">{ord.customerName}</p>
                    <p className="text-[11px] text-[#888]">{ord.customerPhone}</p>
                  </td>
                  <td className="py-3 px-3 text-[#555]">
                    {ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                  </td>
                  <td className="py-3 px-3 font-black text-[#111]">
                    ₹{ord.total}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block rounded-md bg-[#f4f5f6] px-2 py-0.5 text-[11px] font-semibold text-[#444]">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11.5px] text-[#777]">
                    {ord.createdAt}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ord.status === "New" && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.orderId, "Accepted")}
                          className="rounded-lg bg-[#48a92b] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#3d9124]"
                        >
                          Accept
                        </button>
                      )}
                      {ord.status === "Accepted" && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.orderId, "Preparing")}
                          className="rounded-lg bg-[#f8cb46] px-2.5 py-1 text-[11px] font-bold text-[#111] shadow-xs hover:bg-[#efb82f]"
                        >
                          Pack
                        </button>
                      )}
                      {ord.status === "Preparing" && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.orderId, "Out for Delivery")}
                          className="rounded-lg bg-[#0284c7] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#0369a1]"
                        >
                          Dispatch
                        </button>
                      )}
                      {onSelectOrder && (
                        <button
                          type="button"
                          aria-label={`View order ${ord.orderId} details`}
                          onClick={() => onSelectOrder(ord)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#777] hover:bg-[#f3f4f6] hover:text-[#111]"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
