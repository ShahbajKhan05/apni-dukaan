"use client";

import { useState } from "react";
import {
  Ticket,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { AdminCoupon } from "@/lib/admin/types";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminCouponsPage() {
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<AdminCoupon>({
    code: "",
    title: "",
    discountType: "flat",
    discountValue: 50,
    minOrder: 299,
    maxDiscount: 100,
    usageCount: 0,
    usageLimit: 500,
    validFrom: "01 Mar 2025",
    validUntil: "31 Dec 2025",
    active: true,
    tag: "Discount",
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    addCoupon({
      ...formData,
      code: formData.code.trim().toUpperCase(),
      title: formData.title.trim() || `${formData.code} Discount`,
      discountValue: Number(formData.discountValue),
      minOrder: Number(formData.minOrder),
      usageLimit: Number(formData.usageLimit),
    });

    setIsModalOpen(false);
    setFormData({
      code: "",
      title: "",
      discountType: "flat",
      discountValue: 50,
      minOrder: 299,
      maxDiscount: 100,
      usageCount: 0,
      usageLimit: 500,
      validFrom: "01 Mar 2025",
      validUntil: "31 Dec 2025",
      active: true,
      tag: "Discount",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] sm:text-[22px]">
            Kirana Discount Coupons ({coupons.length})
          </h1>
          <p className="text-[12.5px] text-[#666]">
            Configure promotional codes for the customer checkout cart
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2.5 text-[13px] font-bold text-white shadow-xs hover:bg-[#3d9124] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>+ Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white shadow-xs overflow-hidden">
        {coupons.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <h3 className="text-[15px] font-bold text-[#222]">No coupons created</h3>
            <p className="text-[13px] text-[#777]">
              Create promotional discount codes for your customers.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2 text-[13px] font-bold text-white shadow-xs hover:bg-[#3d9124]"
            >
              <Plus size={15} />
              <span>Create Coupon</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-[13px] border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-[#edf0f2] bg-[#fbfcfd] text-[11px] font-bold uppercase tracking-wider text-[#777]">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-3">Offer Title</th>
                  <th className="py-3 px-3">Discount</th>
                  <th className="py-3 px-3">Min Order</th>
                  <th className="py-3 px-3">Redemptions</th>
                  <th className="py-3 px-3">Validity</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
              {coupons.map((c) => (
                <tr key={c.code} className="transition-colors hover:bg-[#fbfcfd]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[13px] tracking-wider rounded-lg bg-[#fff9e6] border border-[#f8cb46]/40 px-2 py-0.5 text-[#111]">
                        {c.code}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-semibold text-[#222]">
                    {c.title}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-black text-[#2f7d32]">
                      {c.discountType === "flat"
                        ? `₹${c.discountValue} OFF`
                        : `${c.discountValue}% OFF`}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-[#555]">
                    ₹{c.minOrder}
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-[12px] font-medium text-[#444]">
                      {c.usageCount} / {c.usageLimit}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-[11.5px] text-[#777]">
                    {c.validUntil}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        c.active
                          ? "bg-[#eaf5e9] text-[#2f7d32]"
                          : "bg-[#f3f4f6] text-[#777]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          c.active ? "bg-[#2f7d32]" : "bg-[#999]"
                        }`}
                      />
                      {c.active ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={c.active ? "Disable coupon" : "Enable coupon"}
                        onClick={() => toggleCouponStatus(c.code)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f3f4f6]"
                      >
                        {c.active ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      <button
                        type="button"
                        title="Delete coupon"
                        onClick={() => setCouponToDelete(c.code)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#999] hover:bg-[#fee2e2] hover:text-[#dc2626]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-2xl anim-modal text-[13px]">
            <div className="flex items-center justify-between border-b border-[#edf0f2] pb-3">
              <h3 className="text-[16px] font-bold text-[#111]">
                Create Store Coupon
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#666] hover:text-[#111]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. FESTIVE50"
                    className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-mono font-bold uppercase outline-none focus:border-[#48a92b] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as any })
                    }
                    className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
                  >
                    <option value="flat">Flat ₹ Discount</option>
                    <option value="percentage">% Percentage Discount</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Title / Offer Label
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Flat ₹50 OFF on orders above ₹299"
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Discount Value {formData.discountType === "flat" ? "(₹)" : "(%)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: Number(e.target.value) })
                    }
                    className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold outline-none focus:border-[#48a92b] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.minOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, minOrder: Number(e.target.value) })
                    }
                    className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#edf0f2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#e5e7eb] px-4 py-2 font-semibold text-[#666] hover:bg-[#f4f5f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#48a92b] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#3d9124]"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {couponToDelete && (
        <ConfirmDialog
          isOpen={Boolean(couponToDelete)}
          title="Delete Coupon Code?"
          message={`Are you sure you want to permanently delete coupon "${couponToDelete}"? Customers will no longer be able to apply it at checkout.`}
          confirmLabel="Delete Coupon"
          isDestructive={true}
          onConfirm={() => {
            deleteCoupon(couponToDelete);
            setCouponToDelete(null);
          }}
          onCancel={() => setCouponToDelete(null)}
        />
      )}
    </div>
  );
}
