"use client";

import { useState } from "react";
import {
  Store,
  MapPin,
  Clock,
  CreditCard,
  FileText,
  Save,
  CheckCircle2,
  Power,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminSettingsPage() {
  const { storeSettings, updateStoreSettings, toggleStoreStatus } = useAdmin();

  const [form, setForm] = useState(storeSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(form);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] sm:text-[22px]">
            Kirana Store Settings & Profile
          </h1>
          <p className="text-[12.5px] text-[#666]">
            Configure store contact information, operational hours, UPI ID and billing details
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleStoreStatus}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-bold transition-all shadow-xs ${
              storeSettings.isOpen
                ? "bg-[#eaf5e9] text-[#2f7d32] border border-[#c8e6c9] hover:bg-[#d8edd6]"
                : "bg-[#fee2e2] text-[#dc2626] border border-[#fecaca] hover:bg-[#fecaca]"
            }`}
          >
            <Power size={14} />
            <span>Store is {storeSettings.isOpen ? "OPEN" : "CLOSED"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Store Information */}
        <div className="rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f4f5f6] pb-3">
            <Store size={18} className="text-[#48a92b]" />
            <h2 className="text-[16px] font-bold text-[#111]">
              General Kirana Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[13px]">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Store Business Name
              </label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Shop Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Owner / Proprietor Name
              </label>
              <input
                type="text"
                required
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-semibold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Primary WhatsApp / Mobile
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Store Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                City & State
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Address & Operating Timings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Address */}
          <div className="rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-xs space-y-3.5 text-[13px]">
            <div className="flex items-center gap-2 border-b border-[#f4f5f6] pb-3">
              <MapPin size={18} className="text-[#48a92b]" />
              <h2 className="text-[16px] font-bold text-[#111]">
                Physical Shop Address
              </h2>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Shop Address (Full)
              </label>
              <textarea
                rows={2}
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] p-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  GST Number (Optional)
                </label>
                <input
                  type="text"
                  value={form.gstNumber || ""}
                  onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-mono text-[12px] outline-none focus:border-[#48a92b] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-xs space-y-3.5 text-[13px]">
            <div className="flex items-center gap-2 border-b border-[#f4f5f6] pb-3">
              <Clock size={18} className="text-[#48a92b]" />
              <h2 className="text-[16px] font-bold text-[#111]">
                Daily Store Operating Hours
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Morning Opening Time
                </label>
                <input
                  type="text"
                  required
                  value={form.openingTime}
                  onChange={(e) =>
                    setForm({ ...form, openingTime: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold outline-none focus:border-[#48a92b] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Night Closing Time
                </label>
                <input
                  type="text"
                  required
                  value={form.closingTime}
                  onChange={(e) =>
                    setForm({ ...form, closingTime: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold outline-none focus:border-[#48a92b] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                FSSAI Kirana License / Registration
              </label>
              <input
                type="text"
                value={form.kiranaLicenseNo || ""}
                onChange={(e) =>
                  setForm({ ...form, kiranaLicenseNo: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-mono text-[12px] outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Payment & QR Integration */}
        <div className="rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f4f5f6] pb-3">
            <CreditCard size={18} className="text-[#48a92b]" />
            <h2 className="text-[16px] font-bold text-[#111]">
              Payment Collection & UPI Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Shop UPI VPA (For Direct Customer QR Payment)
              </label>
              <input
                type="text"
                required
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-mono font-bold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white"
              />
              <p className="mt-1 text-[11px] text-[#777]">
                Used at customer checkout when paying via GooglePay / PhonePe / Paytm
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.acceptOnlinePayment}
                  onChange={(e) =>
                    setForm({ ...form, acceptOnlinePayment: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-[#48a92b] focus:ring-[#48a92b]"
                />
                <span className="font-semibold text-[#222]">
                  Accept Online UPI & Card Payments
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.acceptCod}
                  onChange={(e) =>
                    setForm({ ...form, acceptCod: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-[#48a92b] focus:ring-[#48a92b]"
                />
                <span className="font-semibold text-[#222]">
                  Accept Cash on Delivery (COD)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#48a92b] px-6 py-2.5 text-[13.5px] font-bold text-white shadow-xs hover:bg-[#3d9124] active:scale-95 transition-all"
          >
            <Save size={16} />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
