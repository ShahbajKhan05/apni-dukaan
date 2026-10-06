"use client";

import { useState, useEffect } from "react";
import { X, Package, Sparkles, Image as ImageIcon } from "lucide-react";
import { AdminProduct } from "@/lib/admin/types";
import { useAdmin } from "@/context/AdminContext";

interface ProductFormModalProps {
  productToEdit?: AdminProduct | null;
  onClose: () => void;
}

export default function ProductFormModal({
  productToEdit,
  onClose,
}: ProductFormModalProps) {
  const { categories, addProduct, updateProduct } = useAdmin();

  const [formData, setFormData] = useState({
    name: "",
    hindiName: "",
    category: categories[0]?.name || "Dairy & Breakfast",
    subcategory: "",
    description: "",
    sellingPrice: 50,
    mrp: 60,
    unit: "1 kg",
    stock: 20,
    lowStockThreshold: 5,
    brand: "",
    sku: "",
    image: "/images/categories/home.svg",
    featured: false,
    status: "active" as "active" | "disabled" | "out_of_stock",
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        hindiName: productToEdit.hindiName || "",
        category: productToEdit.category,
        subcategory: productToEdit.subcategory || "",
        description: productToEdit.description,
        sellingPrice: productToEdit.sellingPrice,
        mrp: productToEdit.mrp,
        unit: productToEdit.unit,
        stock: productToEdit.stock,
        lowStockThreshold: productToEdit.lowStockThreshold,
        brand: productToEdit.brand,
        sku: productToEdit.sku,
        image: productToEdit.image,
        featured: productToEdit.featured,
        status: productToEdit.status,
      });
    }
  }, [productToEdit]);

  // Calculate discount percentage automatically
  const discountPercent =
    formData.mrp > formData.sellingPrice
      ? Math.round(((formData.mrp - formData.sellingPrice) / formData.mrp) * 100)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const skuAuto =
      formData.sku.trim() ||
      `KIR-${formData.name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const matchedCat = categories.find(
      (c) => c.name === formData.category || c.id === formData.category
    );

    const payload = {
      name: formData.name.trim(),
      hindiName: formData.hindiName.trim() || undefined,
      category: formData.category,
      categoryId: matchedCat?.id,
      subcategory: formData.subcategory.trim() || undefined,
      description: formData.description.trim(),
      sellingPrice: Number(formData.sellingPrice),
      mrp: Number(formData.mrp),
      discountPercent,
      unit: formData.unit.trim(),
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold),
      brand: formData.brand.trim() || "Local Kirana",
      sku: skuAuto,
      image: formData.image,
      featured: formData.featured,
      status: formData.stock === 0 ? ("out_of_stock" as const) : formData.status,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      await addProduct(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity anim-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[650px] max-h-[92vh] flex flex-col rounded-2xl border border-[#edf0f2] bg-white shadow-2xl overflow-hidden anim-modal">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4 bg-[#fbfcfd]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#48a92b] text-white">
              <Package size={17} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#111]">
                {productToEdit ? "Edit Kirana Product" : "Add New Kirana Product"}
              </h3>
              <p className="text-[11.5px] text-[#777]">
                Product will instantly appear in the ApniDukaan customer app
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close product modal"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f2f4f6]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px]">
          {/* Product Name (English & Hindi) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Amul Taaza Milk"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Hindi / Local Name (Optional)
              </label>
              <input
                type="text"
                value={formData.hindiName}
                onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                placeholder="e.g. अमूल ताज़ा दूध"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              >
                {categories.length === 0 ? (
                  <option value={formData.category}>{formData.category}</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Subcategory / Type
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g. Toned Milk, Atta, Namkeen"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
          </div>

          {/* Pricing Row: Selling Price, MRP, and Auto Discount */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Selling Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                MRP (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold text-[#777] outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Discount
              </label>
              <div className="flex h-10 w-full items-center rounded-xl bg-[#eaf5e9] border border-[#c8e6c9] px-3 font-black text-[#2f7d32]">
                {discountPercent > 0 ? `${discountPercent}% OFF` : "No Discount"}
              </div>
            </div>
          </div>

          {/* Unit, Stock & Low Stock Threshold */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Unit / Pack Size <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. 1 L, 500 g, 6 pcs"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-bold text-[#111] outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Low Stock Limit
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
          </div>

          {/* Brand & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Amul, Aashirvaad, Tata"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                SKU / Barcode (Optional)
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Auto-generated if empty"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 font-mono text-[12px] outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1">
              Product Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description for customer app..."
              className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] p-3 outline-none focus:border-[#48a92b] focus:bg-white"
            />
          </div>

          {/* Toggles: Featured & Active */}
          <div className="flex flex-wrap items-center gap-6 rounded-xl border border-[#edf0f2] bg-[#fbfcfd] p-3.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded text-[#48a92b] focus:ring-[#48a92b]"
              />
              <span className="font-semibold text-[#222]">
                Mark as Featured Product (Shows on Homepage)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status === "active"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.checked ? "active" : "disabled",
                  })
                }
                className="h-4 w-4 rounded text-[#48a92b] focus:ring-[#48a92b]"
              />
              <span className="font-semibold text-[#222]">
                Visible in Customer Store
              </span>
            </label>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#edf0f2]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#e5e7eb] px-4 py-2 font-semibold text-[#666] hover:bg-[#f4f5f6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#48a92b] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#3d9124] active:scale-95"
            >
              {productToEdit ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
