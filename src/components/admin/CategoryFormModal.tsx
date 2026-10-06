"use client";

import { useState, useEffect } from "react";
import { X, FolderTree } from "lucide-react";
import { AdminCategory } from "@/lib/admin/types";
import { useAdmin } from "@/context/AdminContext";

interface CategoryFormModalProps {
  categoryToEdit?: AdminCategory | null;
  onClose: () => void;
}

export default function CategoryFormModal({
  categoryToEdit,
  onClose,
}: CategoryFormModalProps) {
  const { addCategory, updateCategory, categories } = useAdmin();

  const [formData, setFormData] = useState({
    name: "",
    hindiName: "",
    shortName: "",
    description: "",
    displayOrder: categories.length + 1,
    status: "active" as "active" | "disabled",
    icon: "/images/categories/home.svg",
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        hindiName: categoryToEdit.hindiName || "",
        shortName: categoryToEdit.shortName,
        description: categoryToEdit.description,
        displayOrder: categoryToEdit.displayOrder,
        status: categoryToEdit.status,
        icon: categoryToEdit.icon,
      });
    }
  }, [categoryToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      hindiName: formData.hindiName.trim() || undefined,
      shortName: formData.shortName.trim() || formData.name.trim(),
      description: formData.description.trim(),
      displayOrder: Number(formData.displayOrder),
      status: formData.status,
      icon: formData.icon,
      itemCount: categoryToEdit ? categoryToEdit.itemCount : 0,
    };

    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, payload);
    } else {
      addCategory(payload);
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

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-2xl anim-modal text-[13px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#edf0f2] pb-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8CB46] text-[#111]">
              <FolderTree size={18} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#111]">
                {categoryToEdit ? "Edit Category" : "Add New Kirana Category"}
              </h3>
              <p className="text-[11.5px] text-[#777]">
                Categories appear in the customer shop navigation
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close category modal"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f2f4f6]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dairy & Breakfast"
              className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Hindi / Local Name
              </label>
              <input
                type="text"
                value={formData.hindiName}
                onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                placeholder="e.g. दूध और नाश्ता"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Short Chip Label
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                placeholder="e.g. Dairy"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description of items in this category..."
              className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] p-3 outline-none focus:border-[#48a92b] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 outline-none focus:border-[#48a92b] focus:bg-white"
              >
                <option value="active">Active (Visible)</option>
                <option value="disabled">Disabled (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
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
              {categoryToEdit ? "Update Category" : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
