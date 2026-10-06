"use client";

import { useState } from "react";
import {
  Truck,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Power,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminDeliveryPage() {
  const { deliverySettings, updateDeliverySettings, showAdminToast } = useAdmin();

  const [settings, setSettings] = useState(deliverySettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliverySettings({
      ...settings,
      deliveryRadiusKm: Number(settings.deliveryRadiusKm),
      deliveryFee: Number(settings.deliveryFee),
      freeDeliveryAbove: Number(settings.freeDeliveryAbove),
    });
  };

  const handleToggleSlot = (slotId: string) => {
    const updatedSlots = settings.slots.map((s) =>
      s.id === slotId ? { ...s, active: !s.active } : s
    );
    const updated = { ...settings, slots: updatedSlots };
    setSettings(updated);
    updateDeliverySettings(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] sm:text-[22px]">
            Delivery Settings & Slot Configuration
          </h1>
          <p className="text-[12.5px] text-[#666]">
            Configure delivery radius from your shop in Rewa, base charges and dispatch time windows
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Delivery Pricing & Radius Card */}
        <div className="rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f4f5f6] pb-3">
            <Truck size={18} className="text-[#48a92b]" />
            <h2 className="text-[16px] font-bold text-[#111]">
              Delivery Radius & Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[13px]">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Delivery Radius (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="25"
                  required
                  value={settings.deliveryRadiusKm}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      deliveryRadiusKm: Number(e.target.value),
                    })
                  }
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#888]">
                  km
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#777]">
                Customer checkout blocks orders outside this radius
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Standard Delivery Fee (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  required
                  value={settings.deliveryFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      deliveryFee: Number(e.target.value),
                    })
                  }
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#888]">
                  ₹
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#777]">
                Charged on orders below the free delivery limit
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Free Delivery Order Threshold (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  required
                  value={settings.freeDeliveryAbove}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freeDeliveryAbove: Number(e.target.value),
                    })
                  }
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold text-[#2f7d32] outline-none focus:border-[#48a92b] focus:bg-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#888]">
                  ₹
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#777]">
                Orders above this amount receive 100% free delivery
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Estimated Delivery ETA
              </label>
              <input
                type="text"
                required
                value={settings.estimatedDeliveryTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    estimatedDeliveryTime: e.target.value,
                  })
                }
                placeholder="e.g. 8–15 minutes"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white"
              />
              <p className="mt-1 text-[11px] text-[#777]">
                Displayed in the customer header and checkout
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Time Slots Card */}
        <div className="rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f4f5f6] pb-3">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#48a92b]" />
              <div>
                <h2 className="text-[16px] font-bold text-[#111]">
                  Delivery Time Slots
                </h2>
                <p className="text-[12px] text-[#777]">
                  Enable or disable ordering slots based on staff availability
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {settings.slots.map((slot) => (
              <div
                key={slot.id}
                className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                  slot.active
                    ? "border-[#48a92b] bg-[#f7fbf6]"
                    : "border-[#e5e7eb] bg-[#fbfcfd] opacity-70"
                }`}
              >
                <div>
                  <p className="text-[13px] font-bold text-[#222]">
                    {slot.label}
                  </p>
                  <p className="text-[11.5px] text-[#666]">
                    {slot.timeRange}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSlot(slot.id)}
                  className={`flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold transition-all ${
                    slot.active
                      ? "bg-[#48a92b] text-white"
                      : "bg-[#e5e7eb] text-[#666]"
                  }`}
                >
                  <Power size={11} />
                  <span>{slot.active ? "Active" : "Paused"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="rounded-xl bg-[#48a92b] px-6 py-2.5 text-[13.5px] font-bold text-white shadow-xs hover:bg-[#3d9124] active:scale-95 transition-all"
          >
            Save Delivery Settings
          </button>
        </div>
      </form>
    </div>
  );
}
