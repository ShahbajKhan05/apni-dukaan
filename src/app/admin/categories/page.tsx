"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  FolderTree,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Package,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { AdminCategory } from "@/lib/admin/types";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminCategoriesPage() {
  const { categories, products, deleteCategory, updateCategory } = useAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<AdminCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);

  // Compute live product counts per category
  const categoriesWithCounts = categories.map((cat) => {
    const liveCount = products.filter((p) => p.category === cat.name).length;
    return { ...cat, itemCount: liveCount };
  });

  const handleOpenAdd = () => {
    setCategoryToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (c: AdminCategory) => {
    setCategoryToEdit(c);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (c: AdminCategory) => {
    const nextStatus = c.status === "active" ? "disabled" : "active";
    updateCategory(c.id, { status: nextStatus });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const current = categories[index];
      const target = categories[index - 1];
      updateCategory(current.id, { displayOrder: target.displayOrder });
      updateCategory(target.id, { displayOrder: current.displayOrder });
    } else if (direction === "down" && index < categories.length - 1) {
      const current = categories[index];
      const target = categories[index + 1];
      updateCategory(current.id, { displayOrder: target.displayOrder });
      updateCategory(target.id, { displayOrder: current.displayOrder });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] sm:text-[22px]">
            Store Categories ({categories.length})
          </h1>
          <p className="text-[12.5px] text-[#666]">
            Configure shelf categories and browsing chips visible on the mobile and desktop customer store
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2.5 text-[13px] font-bold text-white shadow-xs hover:bg-[#3d9124] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>+ Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white shadow-xs overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <h3 className="text-[15px] font-bold text-[#222]">
              No categories yet.
            </h3>
            <p className="text-[13px] text-[#777]">
              Add categories from Admin to organize your store.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2 text-[13px] font-bold text-white shadow-xs hover:bg-[#3d9124]"
            >
              <Plus size={15} />
              <span>Add Category</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-[13px] border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#edf0f2] bg-[#fbfcfd] text-[11px] font-bold uppercase tracking-wider text-[#777]">
                  <th className="py-3 px-4 w-14">Order</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Live Products</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
              {categoriesWithCounts.map((cat, idx) => (
                <tr
                  key={cat.id}
                  className="transition-colors hover:bg-[#fbfcfd]"
                >
                  {/* Order & Reorder arrows */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[12px] font-bold text-[#888] w-4">
                        {idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, "up")}
                          className="text-[#999] hover:text-[#111] disabled:opacity-30"
                        >
                          <MoveUp size={11} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === categories.length - 1}
                          onClick={() => handleMove(idx, "down")}
                          className="text-[#999] hover:text-[#111] disabled:opacity-30"
                        >
                          <MoveDown size={11} />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Icon & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#f8f9fa] border border-[#edf0f2]">
                        <Image
                          src={cat.icon}
                          alt={cat.name}
                          fill
                          sizes="40px"
                          className="object-contain p-1.5"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#111]">{cat.name}</p>
                        <p className="text-[11px] text-[#777]">
                          {cat.hindiName || cat.shortName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3 px-3 text-[#666] max-w-[260px] truncate">
                    {cat.description}
                  </td>

                  {/* Products count */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f5f6] px-2.5 py-0.5 text-[11px] font-bold text-[#333]">
                      <Package size={12} className="text-[#888]" />
                      <span>{cat.itemCount} items</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        cat.status === "active"
                          ? "bg-[#eaf5e9] text-[#2f7d32]"
                          : "bg-[#f3f4f6] text-[#777]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          cat.status === "active" ? "bg-[#2f7d32]" : "bg-[#999]"
                        }`}
                      />
                      {cat.status === "active" ? "Active" : "Disabled"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={cat.status === "active" ? "Disable category" : "Enable category"}
                        onClick={() => handleToggleStatus(cat)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f3f4f6] hover:text-[#111]"
                      >
                        {cat.status === "active" ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      <button
                        type="button"
                        title="Edit category"
                        onClick={() => handleOpenEdit(cat)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f3f4f6] hover:text-[#2f7d32]"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        type="button"
                        title="Delete category"
                        onClick={() => setCategoryToDelete(cat)}
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

      {/* Add / Edit Category Modal */}
      {isFormOpen && (
        <CategoryFormModal
          categoryToEdit={categoryToEdit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Delete Category Confirm Dialog */}
      {categoryToDelete && (
        <ConfirmDialog
          isOpen={Boolean(categoryToDelete)}
          title="Delete Category?"
          message={`Are you sure you want to delete "${categoryToDelete.name}"? Products under this category will need to be re-assigned.`}
          confirmLabel="Delete Category"
          isDestructive={true}
          onConfirm={() => {
            deleteCategory(categoryToDelete.id);
            setCategoryToDelete(null);
          }}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
}
