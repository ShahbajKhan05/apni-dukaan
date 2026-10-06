"use client";

import { useState } from "react";
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  History,
  ArrowUpDown,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { InventoryItem } from "@/lib/admin/types";
import StockAdjustModal from "@/components/admin/StockAdjustModal";

export default function AdminInventoryPage() {
  const { inventory, adjustStock } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "in_stock" | "low_stock" | "out_of_stock"
  >("all");
  const [selectedItemForAdjust, setSelectedItemForAdjust] =
    useState<InventoryItem | null>(null);
  const [selectedItemForHistory, setSelectedItemForHistory] =
    useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !item.productName.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const lowStockCount = inventory.filter((i) => i.status === "low_stock").length;
  const outOfStockCount = inventory.filter((i) => i.status === "out_of_stock").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] sm:text-[22px]">
            Kirana Physical Stock & Inventory ({inventory.length})
          </h1>
          <p className="text-[12.5px] text-[#666]">
            Keep shelf counts updated, log new wholesale stock purchases and record damaged items
          </p>
        </div>

        {/* Quick Low Stock Alert Pill */}
        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-xl bg-[#fff3cd] border border-[#ffeeba] px-3 py-1.5 text-[12px] font-bold text-[#856404]">
              <AlertTriangle size={14} />
              <span>{lowStockCount} Low</span>
            </span>
            {outOfStockCount > 0 && (
              <span className="flex items-center gap-1 rounded-xl bg-[#fee2e2] border border-[#fecaca] px-3 py-1.5 text-[12px] font-bold text-[#dc2626]">
                <XCircle size={14} />
                <span>{outOfStockCount} Out</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-[420px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product stock in store..."
              className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] pl-10 pr-3 text-[13px] outline-none focus:border-[#48a92b] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                { id: "all", label: "All Items" },
                { id: "in_stock", label: "In Stock" },
                { id: "low_stock", label: "Low Stock" },
                { id: "out_of_stock", label: "Out of Stock" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-xl px-3 py-1.5 text-[12px] font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-[#111] text-white shadow-xs"
                    : "bg-[#f4f5f6] text-[#555] hover:bg-[#e9ebed]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white shadow-xs overflow-hidden">
        {inventory.length === 0 ? (
          <div className="py-12 text-center space-y-1">
            <h3 className="text-[15px] font-bold text-[#222]">No inventory yet.</h3>
            <p className="text-[13px] text-[#777]">
              Products added to the store will appear here.
            </p>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="py-12 text-center space-y-1">
            <h3 className="text-[15px] font-bold text-[#333]">No items match filter</h3>
            <p className="text-[12.5px] text-[#777]">Try clearing search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-[13px] border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-[#edf0f2] bg-[#fbfcfd] text-[11px] font-bold uppercase tracking-wider text-[#777]">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Current Stock</th>
                  <th className="py-3 px-3">Min Threshold</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
              {filteredInventory.map((item) => {
                const isOut = item.status === "out_of_stock";
                const isLow = item.status === "low_stock";

                return (
                  <tr
                    key={item.productId}
                    className="transition-colors hover:bg-[#fbfcfd]"
                  >
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#111]">{item.productName}</p>
                      <p className="text-[11px] text-[#777]">Pack: {item.unit}</p>
                    </td>

                    <td className="py-3 px-3 text-[#555] font-medium">
                      {item.category}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[15px] font-black ${
                          isOut
                            ? "text-[#dc2626]"
                            : isLow
                            ? "text-[#856404]"
                            : "text-[#111]"
                        }`}
                      >
                        {item.currentStock} {item.unit}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[#777]">
                      {item.lowStockThreshold} {item.unit}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isOut
                            ? "bg-[#fee2e2] text-[#dc2626]"
                            : isLow
                            ? "bg-[#fff3cd] text-[#856404]"
                            : "bg-[#eaf5e9] text-[#2f7d32]"
                        }`}
                      >
                        {isOut ? (
                          <XCircle size={12} />
                        ) : isLow ? (
                          <AlertTriangle size={12} />
                        ) : (
                          <CheckCircle2 size={12} />
                        )}
                        <span>
                          {isOut ? "Out of Stock" : isLow ? "Low Stock" : "Healthy"}
                        </span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[11.5px] text-[#777]">
                      {item.lastUpdated}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustStock(item.productId, 10, "Purchase")}
                          title="Quick add +10 items"
                          className="rounded-lg bg-[#f0f9ed] px-2.5 py-1 text-[11px] font-bold text-[#2f7d32] hover:bg-[#e2f4de] transition-colors"
                        >
                          +10
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedItemForAdjust(item)}
                          className="rounded-lg border border-[#e5e7eb] px-2.5 py-1 text-[11.5px] font-bold text-[#333] hover:border-[#48a92b] hover:text-[#2f7d32] transition-colors"
                        >
                          Adjust Stock
                        </button>

                        <button
                          type="button"
                          aria-label={`View stock history for ${item.productName}`}
                          onClick={() => setSelectedItemForHistory(item)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#777] hover:bg-[#f3f4f6]"
                        >
                          <History size={15} />
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

      {/* Adjust Stock Modal */}
      {selectedItemForAdjust && (
        <StockAdjustModal
          item={selectedItemForAdjust}
          onClose={() => setSelectedItemForAdjust(null)}
        />
      )}

      {/* Stock History Drawer / Modal */}
      {selectedItemForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedItemForHistory(null)}
          />
          <div className="relative z-10 w-full max-w-[480px] rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-2xl anim-modal text-[13px]">
            <div className="flex items-center justify-between border-b border-[#edf0f2] pb-3">
              <div>
                <h3 className="text-[16px] font-bold text-[#111]">
                  Stock Adjustment History
                </h3>
                <p className="text-[11.5px] text-[#777]">
                  {selectedItemForHistory.productName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemForHistory(null)}
                className="text-[#666] hover:text-[#111]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2.5">
              {selectedItemForHistory.history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-xl bg-[#f8f9fa] border border-[#edf0f2] p-3 text-[12px]"
                >
                  <div>
                    <span className="font-bold text-[#222]">{h.reason}</span>
                    <p className="text-[10.5px] text-[#888]">{h.date}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-black ${
                        h.adjustment >= 0 ? "text-[#2f7d32]" : "text-[#dc2626]"
                      }`}
                    >
                      {h.adjustment >= 0 ? `+${h.adjustment}` : h.adjustment}
                    </span>
                    <p className="text-[10.5px] text-[#666]">
                      Result: {h.newStock} left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
