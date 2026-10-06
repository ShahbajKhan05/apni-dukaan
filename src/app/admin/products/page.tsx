"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { AdminProduct } from "@/lib/admin/types";
import ProductFormModal from "@/components/admin/ProductFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminProductsPage() {
  const { products, categories, deleteProduct, duplicateProduct, updateProduct } =
    useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockFilter, setSelectedStockFilter] = useState<
    "all" | "in_stock" | "low_stock" | "out_of_stock"
  >("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    "all" | "active" | "disabled"
  >("all");
  const [sortBy, setSortBy] = useState<
    "name-asc" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc"
  >("name-asc");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<AdminProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);

  // Filter & Search logic
  const filteredProducts = products.filter((p) => {
    // Search by name, brand, SKU or Hindi name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchHindi = p.hindiName ? p.hindiName.includes(q) : false;
      if (!matchName && !matchBrand && !matchSku && !matchHindi) return false;
    }

    // Category filter
    if (selectedCategory !== "all" && p.category !== selectedCategory) {
      return false;
    }

    // Stock filter
    if (selectedStockFilter === "out_of_stock" && p.stock !== 0) return false;
    if (selectedStockFilter === "low_stock" && (p.stock === 0 || p.stock > p.lowStockThreshold)) {
      return false;
    }
    if (selectedStockFilter === "in_stock" && p.stock <= p.lowStockThreshold) {
      return false;
    }

    // Status filter
    if (selectedStatusFilter !== "all" && p.status !== selectedStatusFilter) {
      return false;
    }

    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "price-asc") return a.sellingPrice - b.sellingPrice;
    if (sortBy === "price-desc") return b.sellingPrice - a.sellingPrice;
    if (sortBy === "stock-asc") return a.stock - b.stock;
    if (sortBy === "stock-desc") return b.stock - a.stock;
    return 0;
  });

  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: AdminProduct) => {
    setProductToEdit(p);
    setIsFormOpen(true);
  };

  const handleToggleActive = (p: AdminProduct) => {
    const nextStatus = p.status === "disabled" ? "active" : "disabled";
    updateProduct(p.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-[#edf0f2] p-5 shadow-xs">
        <div>
          <h1 className="text-[20px] font-bold text-[#111] sm:text-[22px]">
            Product Catalogue ({products.length})
          </h1>
          <p className="text-[12.5px] text-[#666]">
            Add, update selling prices, track MRP margins and manage customer availability
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2.5 text-[13px] font-bold text-white shadow-xs hover:bg-[#3d9124] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search Field */}
          <div className="relative sm:col-span-2">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, brand, SKU or Hindi name..."
              className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] pl-10 pr-3 text-[13px] outline-none focus:border-[#48a92b] focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 text-[13px] text-[#333] outline-none focus:border-[#48a92b] focus:bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Level Filter */}
          <div>
            <select
              value={selectedStockFilter}
              onChange={(e) => setSelectedStockFilter(e.target.value as any)}
              className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 text-[13px] text-[#333] outline-none focus:border-[#48a92b] focus:bg-white"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock (&gt; Limit)</option>
              <option value="low_stock">Low Stock (≤ Limit)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 text-[13px] text-[#333] outline-none focus:border-[#48a92b] focus:bg-white"
            >
              <option value="name-asc">Sort: Name (A to Z)</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="stock-asc">Sort: Stock (Lowest first)</option>
              <option value="stock-desc">Sort: Stock (Highest first)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags Bar */}
        {(searchQuery ||
          selectedCategory !== "all" ||
          selectedStockFilter !== "all" ||
          selectedStatusFilter !== "all") && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f4f5f6] text-[12px]">
            <span className="font-semibold text-[#888]">Showing filtered:</span>
            <span className="font-bold text-[#111]">
              {sortedProducts.length} of {products.length} products
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedStockFilter("all");
                setSelectedStatusFilter("all");
              }}
              className="text-[#2f7d32] font-bold hover:underline ml-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="rounded-2xl border border-[#edf0f2] bg-white shadow-xs overflow-hidden">
        {products.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <h3 className="text-[15px] font-bold text-[#222]">
              No products yet.
            </h3>
            <p className="text-[13px] text-[#777]">
              Add your first product to start selling.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2 text-[13px] font-bold text-white shadow-xs hover:bg-[#3d9124]"
            >
              <Plus size={15} />
              <span>Add Product</span>
            </button>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Package size={36} className="mx-auto text-[#bbb]" />
            <h3 className="text-[15px] font-bold text-[#333]">
              No products match filters
            </h3>
            <p className="text-[12.5px] text-[#777]">
              Try adjusting your search query or clearing filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-[13px] border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-[#edf0f2] bg-[#fbfcfd] text-[11px] font-bold uppercase tracking-wider text-[#777]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price / MRP</th>
                  <th className="py-3 px-3">Discount</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Unit</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
                {sortedProducts.map((p) => {
                  const isOutOfStock = p.stock === 0;
                  const isLowStock = !isOutOfStock && p.stock <= p.lowStockThreshold;

                  return (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-[#fbfcfd]"
                    >
                      {/* Product Thumbnail & Names */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#f8f9fa] border border-[#edf0f2]">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              sizes="44px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[#111]">{p.name}</p>
                              {p.featured && (
                                <span className="rounded bg-[#F8CB46]/30 px-1.5 py-0.2 text-[9px] font-black text-[#8d6e1f] uppercase">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#777]">
                              {p.hindiName && <span>{p.hindiName}</span>}
                              <span>•</span>
                              <span className="font-mono text-[#888]">{p.sku}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-[#555] font-medium">
                        {p.category}
                      </td>

                      {/* Price / MRP */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-[#111] text-[14px]">
                            ₹{p.sellingPrice}
                          </span>
                          {p.mrp > p.sellingPrice && (
                            <span className="text-[11px] text-[#999] line-through">
                              ₹{p.mrp}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="py-3 px-3">
                        {p.discountPercent > 0 ? (
                          <span className="rounded-md bg-[#eaf5e9] px-2 py-0.5 text-[11px] font-bold text-[#2f7d32]">
                            {p.discountPercent}% OFF
                          </span>
                        ) : (
                          <span className="text-[#999] text-[11px]">MRP</span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              isOutOfStock
                                ? "text-[#dc2626]"
                                : isLowStock
                                ? "text-[#856404]"
                                : "text-[#111]"
                            }`}
                          >
                            {p.stock}
                          </span>
                          {isOutOfStock ? (
                            <span className="rounded bg-[#fee2e2] px-1.5 py-0.5 text-[10px] font-bold text-[#dc2626]">
                              Out
                            </span>
                          ) : isLowStock ? (
                            <span className="rounded bg-[#fff3cd] px-1.5 py-0.5 text-[10px] font-bold text-[#856404]">
                              Low
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Unit */}
                      <td className="py-3 px-3 text-[#666] font-medium">
                        {p.unit}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            p.status === "active"
                              ? "bg-[#eaf5e9] text-[#2f7d32]"
                              : "bg-[#f3f4f6] text-[#6b7280]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              p.status === "active" ? "bg-[#2f7d32]" : "bg-[#6b7280]"
                            }`}
                          />
                          {p.status === "active" ? "Active" : "Disabled"}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle Active / Disabled */}
                          <button
                            type="button"
                            title={p.status === "active" ? "Disable Product" : "Enable Product"}
                            onClick={() => handleToggleActive(p)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f3f4f6] hover:text-[#111]"
                          >
                            {p.status === "active" ? <Eye size={15} /> : <EyeOff size={15} />}
                          </button>

                          {/* Edit Product */}
                          <button
                            type="button"
                            title="Edit Product"
                            onClick={() => handleOpenEdit(p)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f3f4f6] hover:text-[#2f7d32]"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Duplicate Product */}
                          <button
                            type="button"
                            title="Duplicate Product"
                            onClick={() => duplicateProduct(p.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f3f4f6] hover:text-[#111]"
                          >
                            <Copy size={15} />
                          </button>

                          {/* Delete Product */}
                          <button
                            type="button"
                            title="Delete Product"
                            onClick={() => setProductToDelete(p)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#999] hover:bg-[#fee2e2] hover:text-[#dc2626]"
                          >
                            <Trash2 size={15} />
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

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <ProductFormModal
          productToEdit={productToEdit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <ConfirmDialog
          isOpen={Boolean(productToDelete)}
          title="Delete Kirana Product?"
          message={`Are you sure you want to permanently delete "${productToDelete.name}"? This item will no longer appear in the customer store.`}
          confirmLabel="Delete Product"
          isDestructive={true}
          onConfirm={() => {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
          }}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </div>
  );
}
