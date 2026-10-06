"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Truck,
  Clock,
  Printer,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { AdminOrder, OrderStatus } from "@/lib/admin/types";
import { ORDER_STATUS_COLORS } from "@/components/admin/RecentOrdersTable";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";

const ORDER_TABS: (OrderStatus | "All")[] = [
  "All",
  "New",
  "Accepted",
  "Preparing",
  "Packed",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();

  const [activeTab, setActiveTab] = useState<OrderStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderForDetail, setSelectedOrderForDetail] =
    useState<AdminOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (activeTab !== "All" && o.status !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = o.orderId.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchAddress = o.deliveryAddress.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchPhone && !matchAddress) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] sm:text-[22px]">
            Customer Deliveries & Orders ({orders.length})
          </h1>
          <p className="text-[12.5px] text-[#666]">
            Accept live incoming orders, assign delivery boys and track doorstep fulfillment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#edf0f2] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#555] hover:bg-[#f8f9fa] shadow-xs"
          >
            <Printer size={15} />
            <span>Print Dispatch List</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white p-4 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative max-w-[420px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer name or phone..."
            className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] pl-10 pr-3 text-[13px] outline-none focus:border-[#48a92b] focus:bg-white"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-[#f4f5f6]">
          {ORDER_TABS.map((tab) => {
            const count =
              tab === "All"
                ? orders.length
                : orders.filter((o) => o.status === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-[#111] text-white shadow-xs"
                    : "bg-[#f8f9fa] text-[#666] hover:bg-[#edf0f2] hover:text-[#111]"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    activeTab === tab
                      ? "bg-white/20 text-white"
                      : "bg-[#e5e7eb] text-[#555]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white shadow-xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-12 text-center space-y-1">
            <h3 className="text-[15px] font-bold text-[#222]">
              No orders yet.
            </h3>
            <p className="text-[13px] text-[#777]">
              Customer orders will appear here as they are placed.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center space-y-1">
            <ShoppingBag size={36} className="mx-auto text-[#bbb]" />
            <h3 className="text-[15px] font-bold text-[#333]">
              No orders found
            </h3>
            <p className="text-[12.5px] text-[#777]">
              There are no orders matching the &quot;{activeTab}&quot; filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-[13px] border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#edf0f2] bg-[#fbfcfd] text-[11px] font-bold uppercase tracking-wider text-[#777]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Delivery Address</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
                {filteredOrders.map((ord) => {
                  const statusStyle =
                    ORDER_STATUS_COLORS[ord.status] || ORDER_STATUS_COLORS.New;

                  return (
                    <tr
                      key={ord.orderId}
                      className="transition-colors hover:bg-[#fbfcfd]"
                    >
                      <td className="py-3 px-4 font-bold text-[#111]">
                        #{ord.orderId}
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-semibold text-[#222]">
                          {ord.customerName}
                        </p>
                        <p className="text-[11px] text-[#888]">
                          {ord.customerPhone}
                        </p>
                      </td>

                      <td className="py-3 px-3 text-[#555]">
                        <span className="font-semibold">{ord.items.length} items</span>
                        <p className="text-[11px] text-[#888] truncate max-w-[140px]">
                          {ord.items.map((i) => i.name).join(", ")}
                        </p>
                      </td>

                      <td className="py-3 px-3 font-black text-[#111]">
                        ₹{ord.total}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block rounded bg-[#f4f5f6] px-2 py-0.5 text-[11px] font-semibold text-[#444]">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </td>

                      <td className="py-3 px-3 text-[#555] max-w-[200px]">
                        <p className="truncate text-[12px]">{ord.deliveryAddress}</p>
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

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Workflow Buttons */}
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
                              onClick={() =>
                                updateOrderStatus(ord.orderId, "Out for Delivery")
                              }
                              className="rounded-lg bg-[#0284c7] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#0369a1]"
                            >
                              Dispatch
                            </button>
                          )}
                          {ord.status === "Out for Delivery" && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(ord.orderId, "Delivered")}
                              className="rounded-lg bg-[#2f7d32] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#256828]"
                            >
                              Delivered
                            </button>
                          )}

                          {/* View details */}
                          <button
                            type="button"
                            title="View order details"
                            onClick={() => setSelectedOrderForDetail(ord)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e2e5e8] bg-white text-[#555] hover:bg-[#f3f4f6]"
                          >
                            <Eye size={14} />
                          </button>
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

      {/* Order Details Drawer / Modal */}
      {selectedOrderForDetail && (
        <OrderDetailsModal
          order={selectedOrderForDetail}
          onClose={() => setSelectedOrderForDetail(null)}
        />
      )}
    </div>
  );
}
