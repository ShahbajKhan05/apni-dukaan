"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Eye,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { AdminCustomer } from "@/lib/admin/types";

export default function AdminCustomersPage() {
  const { customers, orders } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(
    null
  );

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] sm:text-[22px]">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-[12.5px] text-[#666]">
            Repeat neighbourhood shoppers in Rewa and their purchase history
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white p-4 shadow-xs">
        <div className="relative max-w-[420px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone or neighborhood..."
            className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] pl-10 pr-3 text-[13px] outline-none focus:border-[#48a92b] focus:bg-white"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white shadow-xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="py-12 text-center space-y-1">
            <h3 className="text-[15px] font-bold text-[#222]">No customers yet.</h3>
            <p className="text-[13px] text-[#777]">
              Customers will appear here after they create an account or place an order.
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-12 text-center space-y-1">
            <h3 className="text-[15px] font-bold text-[#333]">No customers found</h3>
            <p className="text-[12.5px] text-[#777]">Try clearing your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-[13px] border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#edf0f2] bg-[#fbfcfd] text-[11px] font-bold uppercase tracking-wider text-[#777]">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Total Orders</th>
                  <th className="py-3 px-3">Lifetime Spent</th>
                  <th className="py-3 px-3">Last Order</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="transition-colors hover:bg-[#fbfcfd]"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f6] text-[#333] font-bold text-[12px] border border-[#edf0f2]">
                        {cust.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[#111]">{cust.name}</p>
                        <p className="text-[11px] text-[#777]">
                          Joined {cust.joinedDate}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <p className="font-medium text-[#333]">{cust.phone}</p>
                    <p className="text-[11px] text-[#888]">{cust.email}</p>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f5f6] px-2.5 py-0.5 text-[11px] font-bold text-[#333]">
                      <ShoppingBag size={12} className="text-[#888]" />
                      <span>{cust.totalOrders} orders</span>
                    </span>
                  </td>

                  <td className="py-3 px-3 font-black text-[#111] text-[14px]">
                    ₹{cust.totalSpent.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3 px-3 text-[12px] text-[#666]">
                    {cust.lastOrderDate}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        cust.status === "active"
                          ? "bg-[#eaf5e9] text-[#2f7d32]"
                          : "bg-[#f3f4f6] text-[#777]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          cust.status === "active" ? "bg-[#2f7d32]" : "bg-[#999]"
                        }`}
                      />
                      {cust.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(cust)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#e2e5e8] bg-white px-2.5 py-1 text-[11.5px] font-bold text-[#555] hover:bg-[#f3f4f6] hover:text-[#111]"
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Customer Details Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative z-10 w-full max-w-[540px] rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-2xl anim-modal text-[13px]">
            <div className="flex items-center justify-between border-b border-[#edf0f2] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111] text-white font-bold text-[14px]">
                  {selectedCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#111]">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-[11.5px] text-[#777]">
                    Customer ID: {selectedCustomer.id} • Joined {selectedCustomer.joinedDate}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-[#666] hover:text-[#111]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Quick metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#f8f9fa] border border-[#edf0f2] p-3 text-center">
                  <span className="text-[11px] font-bold uppercase text-[#888]">
                    Total Orders Placed
                  </span>
                  <p className="text-[20px] font-black text-[#111]">
                    {selectedCustomer.totalOrders}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f4fbf3] border border-[#c8e6c9] p-3 text-center">
                  <span className="text-[11px] font-bold uppercase text-[#2f7d32]">
                    Total Lifetime Spend
                  </span>
                  <p className="text-[20px] font-black text-[#2f7d32]">
                    ₹{selectedCustomer.totalSpent.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Contact info */}
              <div className="rounded-xl border border-[#edf0f2] p-3.5 space-y-2 bg-[#fbfcfd]">
                <div className="flex items-center gap-2 text-[#333]">
                  <Phone size={14} className="text-[#888]" />
                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="font-bold text-[#2f7d32] hover:underline"
                  >
                    {selectedCustomer.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[#333]">
                  <Mail size={14} className="text-[#888]" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-start gap-2 text-[#333]">
                  <MapPin size={14} className="text-[#888] mt-0.5 shrink-0" />
                  <span>{selectedCustomer.address}</span>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="rounded-xl bg-[#111] px-5 py-2 font-bold text-white shadow-xs hover:bg-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
