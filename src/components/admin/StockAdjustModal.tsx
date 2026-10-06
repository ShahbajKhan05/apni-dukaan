"use client";

import { useState } from "react";
import { X, Boxes, AlertCircle, Plus, Minus } from "lucide-react";
import { InventoryItem } from "@/lib/admin/types";
import { useAdmin } from "@/context/AdminContext";

interface StockAdjustModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

const REASONS = [
  "Purchase",
  "Sale Correction",
  "Damaged",
  "Expired",
  "Manual Adjustment",
] as const;

export default function StockAdjustModal({
  item,
  onClose,
}: StockAdjustModalProps) {
  const { adjustStock } = useAdmin();
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(10);
  const [isPositive, setIsPositive] = useState<boolean>(true);
  const [reason, setReason] = useState<
    "Purchase" | "Sale Correction" | "Damaged" | "Expired" | "Manual Adjustment"
  >("Purchase");

  if (!item) return null;

  const signedAdjustment = isPositive ? Math.abs(adjustmentAmount) : -Math.abs(adjustmentAmount);
  const calculatedNewStock = Math.max(0, item.currentStock + signedAdjustment);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (signedAdjustment === 0) return;
    adjustStock(item.productId, signedAdjustment, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity anim-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-[480px] rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-2xl anim-modal">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#edf0f2] pb-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf5e9] text-[#2f7d32]">
              <Boxes size={18} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#111]">
                Adjust Kirana Stock
              </h3>
              <p className="text-[11.5px] text-[#777] truncate max-w-[280px]">
                {item.productName}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close stock adjustment"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f2f4f6]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Current Stock Banner */}
          <div className="flex items-center justify-between rounded-xl bg-[#f8f9fa] border border-[#edf0f2] p-3 text-[13px]">
            <div>
              <span className="text-[#666]">Current Physical Stock:</span>
              <p className="font-bold text-[#111] text-[15px]">
                {item.currentStock} {item.unit}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[#666]">Low Limit:</span>
              <p className="font-bold text-[#856404] text-[14px]">
                {item.lowStockThreshold} {item.unit}
              </p>
            </div>
          </div>

          {/* Type of Adjustment: Add or Subtract */}
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1.5">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPositive(true);
                  if (reason === "Damaged" || reason === "Expired") {
                    setReason("Purchase");
                  }
                }}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12.5px] font-bold transition-all ${
                  isPositive
                    ? "border-[#48a92b] bg-[#f4fbf3] text-[#2f7d32] shadow-xs"
                    : "border-[#e5e7eb] bg-white text-[#555] hover:bg-[#fafafa]"
                }`}
              >
                <Plus size={15} />
                <span>Add Stock (+ Inward)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPositive(false);
                  if (reason === "Purchase") {
                    setReason("Damaged");
                  }
                }}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12.5px] font-bold transition-all ${
                  !isPositive
                    ? "border-[#dc2626] bg-[#fef2f2] text-[#dc2626] shadow-xs"
                    : "border-[#e5e7eb] bg-white text-[#555] hover:bg-[#fafafa]"
                }`}
              >
                <Minus size={15} />
                <span>Reduce Stock (- Outward)</span>
              </button>
            </div>
          </div>

          {/* Adjustment Quantity */}
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1">
              Quantity to {isPositive ? "Add" : "Deduct"} ({item.unit})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                required
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 text-[14px] font-bold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white"
              />
              <div className="flex gap-1 shrink-0">
                {[5, 10, 25].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAdjustmentAmount(val)}
                    className="rounded-lg border border-[#e2e5e8] bg-white px-2.5 py-2 text-[11px] font-bold text-[#555] hover:bg-[#f4f5f6]"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reason Select */}
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1">
              Reason for Adjustment
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 text-[13px] text-[#222] outline-none focus:border-[#48a92b] focus:bg-white"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Calculated Output Box */}
          <div className="rounded-xl border border-[#c8e6c9] bg-[#eaf5e9] p-3 flex items-center justify-between text-[13px]">
            <span className="font-semibold text-[#2f7d32]">New Calculated Stock:</span>
            <span className="text-[17px] font-black text-[#2f7d32]">
              {calculatedNewStock} {item.unit}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#edf0f2]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#e5e7eb] px-4 py-2 text-[13px] font-semibold text-[#666] hover:bg-[#f4f5f6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#48a92b] px-5 py-2 text-[13px] font-bold text-white shadow-xs hover:bg-[#3d9124] active:scale-95"
            >
              Save Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
