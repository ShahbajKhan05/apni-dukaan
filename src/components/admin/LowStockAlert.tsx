"use client";

import Link from "next/link";
import { AlertTriangle, XCircle, Plus, ArrowRight, Boxes } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface LowStockAlertProps {
  onQuickRestock?: (productId: string, productName: string) => void;
}

export default function LowStockAlert({ onQuickRestock }: LowStockAlertProps) {
  const { inventory, adjustStock } = useAdmin();

  // Low stock or out of stock items
  const alertItems = inventory
    .filter((i) => i.status === "low_stock" || i.status === "out_of_stock")
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-[#edf0f2] bg-white p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#f4f5f6] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff3cd] text-[#856404]">
            <AlertTriangle size={15} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#111] sm:text-[18px]">
              Low Stock & Restock Alerts
            </h2>
            <p className="text-[12px] text-[#777]">
              Urgent replenishment required to avoid order cancellations
            </p>
          </div>
        </div>

        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-1 text-[12px] font-bold text-[#2f7d32] hover:underline"
        >
          <span>View Inventory</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="mt-4 space-y-2.5">
        {alertItems.length === 0 ? (
          <div className="py-6 text-center text-[13px] text-[#777]">
            All kirana inventory levels are healthy! 🎉
          </div>
        ) : (
          alertItems.map((item) => {
            const isOut = item.status === "out_of_stock";

            return (
              <div
                key={item.productId}
                className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                  isOut
                    ? "border-[#fecaca] bg-[#fff5f5]"
                    : "border-[#ffeeba] bg-[#fffdf5]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isOut ? "bg-[#fee2e2] text-[#dc2626]" : "bg-[#fff3cd] text-[#856404]"
                    }`}
                  >
                    {isOut ? <XCircle size={16} /> : <AlertTriangle size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#222] truncate">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-[#666]">
                      {isOut ? (
                        <span className="font-extrabold text-[#dc2626]">OUT OF STOCK</span>
                      ) : (
                        <span className="font-bold text-[#856404]">
                          Only {item.currentStock} left (Min: {item.lowStockThreshold})
                        </span>
                      )}{" "}
                      • {item.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onQuickRestock) {
                        onQuickRestock(item.productId, item.productName);
                      } else {
                        adjustStock(item.productId, 10, "Purchase");
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-white border border-[#ddd] hover:border-[#48a92b] px-2.5 py-1 text-[11.5px] font-bold text-[#333] hover:text-[#2f7d32] shadow-xs active:scale-95 transition-all"
                  >
                    <Plus size={13} />
                    <span>+10 Stock</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
