"use client";

import { useState } from "react";
import {
  BadgePercent,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { AdminOffer } from "@/lib/admin/types";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminOffersPage() {
  const { offers, categories, addOffer, toggleOfferStatus, deleteOffer } =
    useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<AdminOffer, "id">>({
    title: "",
    description: "",
    categoryOrProduct: categories[0]?.name || "Dairy & Breakfast",
    offerType: "percentage",
    discountValue: "20% OFF",
    badge: "SPECIAL DEAL",
    startDate: "01 Mar 2025",
    endDate: "30 Apr 2025",
    active: true,
    background: "#eaf5e9",
  });

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addOffer(formData);
    setIsModalOpen(false);
    setFormData({
      title: "",
      description: "",
      categoryOrProduct: categories[0]?.name || "Dairy & Breakfast",
      offerType: "percentage",
      discountValue: "20% OFF",
      badge: "SPECIAL DEAL",
      startDate: "01 Mar 2025",
      endDate: "30 Apr 2025",
      active: true,
      background: "#eaf5e9",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] sm:text-[22px]">
            Store Promotional Offers & Banners ({offers.length})
          </h1>
          <p className="text-[12.5px] text-[#666]">
            Configure promotional promo cards that appear on the customer app homepage
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2.5 text-[13px] font-bold text-white shadow-xs hover:bg-[#3d9124] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>+ Create Offer</span>
        </button>
      </div>

      {/* Offer Cards Preview */}
      <div>
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#888] mb-3">
          Live Store Promo Banners (Customer Preview)
        </h2>
        {offers.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-[#edf0f2] bg-white space-y-2">
            <h3 className="text-[15px] font-bold text-[#222]">No offers yet</h3>
            <p className="text-[13px] text-[#777]">
              Create promotional banners that appear on the customer storefront.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2 text-[13px] font-bold text-white shadow-xs hover:bg-[#3d9124]"
            >
              <Plus size={15} />
              <span>Create Offer</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                style={{ backgroundColor: offer.background }}
                className="relative flex flex-col justify-between rounded-2xl border border-black/5 p-4 sm:p-5 shadow-xs transition-all min-h-[160px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#111] shadow-xs">
                      {offer.badge}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        offer.active
                          ? "bg-[#2f7d32] text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {offer.active ? "Live" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#111] leading-tight">
                    {offer.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#444] line-clamp-2">
                    {offer.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-2 text-[11px] font-semibold text-[#333]">
                  <span>{offer.discountValue}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Toggle offer status"
                      onClick={() => toggleOfferStatus(offer.id)}
                      className="p-1 rounded bg-white/80 hover:bg-white text-[#222]"
                    >
                      {offer.active ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button
                      type="button"
                      title="Delete offer"
                      onClick={() => setOfferToDelete(offer.id)}
                      className="p-1 rounded bg-white/80 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offers Management Table */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-[13px] border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#edf0f2] bg-[#fbfcfd] text-[11px] font-bold uppercase tracking-wider text-[#777]">
                <th className="py-3 px-4">Offer Title</th>
                <th className="py-3 px-3">Target Category</th>
                <th className="py-3 px-3">Offer Type</th>
                <th className="py-3 px-3">Discount Value</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0f2]">
              {offers.map((offer) => (
                <tr key={offer.id} className="transition-colors hover:bg-[#fbfcfd]">
                  <td className="py-3 px-4">
                    <p className="font-bold text-[#111]">{offer.title}</p>
                    <p className="text-[11px] text-[#777] truncate max-w-[240px]">
                      {offer.description}
                    </p>
                  </td>

                  <td className="py-3 px-3 text-[#555] font-medium">
                    {offer.categoryOrProduct}
                  </td>

                  <td className="py-3 px-3 capitalize text-[#333]">
                    {offer.offerType}
                  </td>

                  <td className="py-3 px-3 font-bold text-[#2f7d32]">
                    {offer.discountValue}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        offer.active
                          ? "bg-[#eaf5e9] text-[#2f7d32]"
                          : "bg-[#f3f4f6] text-[#777]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          offer.active ? "bg-[#2f7d32]" : "bg-[#999]"
                        }`}
                      />
                      {offer.active ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => toggleOfferStatus(offer.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f3f4f6]"
                      >
                        {offer.active ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfferToDelete(offer.id)}
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
      </div>

      {/* Create Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-2xl anim-modal text-[13px]">
            <div className="flex items-center justify-between border-b border-[#edf0f2] pb-3">
              <h3 className="text-[16px] font-bold text-[#111]">
                Create Store Offer Banner
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#666] hover:text-[#111]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Offer Headline
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 20% OFF on Morning Fresh Milk"
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Offer Details / Subtitle
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g. Valid on all milk and breakfast items"
                  className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Applicable Category
                  </label>
                  <select
                    value={formData.categoryOrProduct}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryOrProduct: e.target.value })
                    }
                    className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Discount Badge Text
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: e.target.value })
                    }
                    placeholder="e.g. 20% OFF / Buy 2 Get 1"
                    className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold text-[#2f7d32] outline-none focus:border-[#48a92b] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Card Theme Tint
                </label>
                <div className="flex gap-2">
                  {[
                    { label: "Green", color: "#eaf5e9" },
                    { label: "Yellow", color: "#fff9e6" },
                    { label: "Blue", color: "#f0f4f8" },
                    { label: "Pink", color: "#fdf2f8" },
                  ].map((t) => (
                    <button
                      key={t.color}
                      type="button"
                      onClick={() => setFormData({ ...formData, background: t.color })}
                      style={{ backgroundColor: t.color }}
                      className={`h-8 flex-1 rounded-lg border text-[11px] font-bold transition-all ${
                        formData.background === t.color
                          ? "border-[#111] ring-1 ring-[#111]"
                          : "border-black/10"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
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
                  Save & Publish Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {offerToDelete && (
        <ConfirmDialog
          isOpen={Boolean(offerToDelete)}
          title="Delete Store Offer?"
          message="Are you sure you want to delete this promotional offer? It will immediately disappear from the customer homepage."
          confirmLabel="Delete Offer"
          isDestructive={true}
          onConfirm={() => {
            deleteOffer(offerToDelete);
            setOfferToDelete(null);
          }}
          onCancel={() => setOfferToDelete(null)}
        />
      )}
    </div>
  );
}
