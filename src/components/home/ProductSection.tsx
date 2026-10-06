"use client";

import Image from "next/image";
import {
  Plus,
  Minus,
  X,
  Heart,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Sparkles,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  oldPrice?: string;
  oldPriceNum?: number;
  unit: string;
  quantity: string;
  image: string;
  discount?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  options?: string;
  description?: string;
  frequentlyBoughtWith?: string[];
}

// Clean initial empty list (no fake/mock grocery data)
export const PRODUCTS: Product[] = [];

interface ProductSectionProps {
  products?: Product[];
  categories?: { id: string; name: string; shortName: string; icon: string }[];
  offers?: any[];
  cart?: Record<string, number>;
  onAddToCart?: (product: Product) => void;
  onRemoveFromCart?: (product: Product) => void;
  selectedCategory?: string | null;
  onSelectCategory?: (category: string) => void;
  onClearCategoryFilter?: () => void;
  highlightedProduct?: string | null;
  wishlist?: string[];
  onToggleWishlist?: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  priceFilter?: string;
  onSelectPriceFilter?: (filter: string) => void;
  sortBy?: string;
  onSelectSortBy?: (sort: string) => void;
}

export default function ProductSection({
  products,
  categories = [],
  offers,
  cart = {},
  onAddToCart,
  onRemoveFromCart,
  selectedCategory = null,
  onSelectCategory,
  onClearCategoryFilter,
  highlightedProduct = null,
  wishlist = [],
  onToggleWishlist,
  onOpenProductDetail,
  searchQuery = "",
  onClearSearch,
  priceFilter = "all",
  onSelectPriceFilter,
  sortBy = "popular",
  onSelectSortBy,
}: ProductSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Active database offers (only rendered if real offers exist in the database)
  const [dbOffers, setDbOffers] = useState<any[]>(offers || []);

  useEffect(() => {
    if (offers !== undefined) {
      setDbOffers(offers);
      return;
    }
    // Fetch active database offers if not passed via props
    fetch("/api/offers")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (Array.isArray(d?.data)) setDbOffers(d.data);
      })
      .catch(() => {});
  }, [offers]);

  // Filter & Sort modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [stockOnlyFilter, setStockOnlyFilter] = useState(false);

  // Active filters & sorting
  const activeCategory = selectedCategory || "";

  // The base product list is driven by real database/API flow
  const productList = products !== undefined ? products : PRODUCTS;

  // Filter products by category, search query, price range, and in-stock
  const filteredProducts = productList.filter((product) => {
    // 1. Category
    if (activeCategory && product.category !== activeCategory) {
      return false;
    }

    // 2. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchUnit = product.unit.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchUnit) return false;
    }

    // 3. Price
    if (priceFilter === "under-100" && product.priceNum >= 100) return false;
    if (
      priceFilter === "100-250" &&
      (product.priceNum < 100 || product.priceNum > 250)
    )
      return false;
    if (
      priceFilter === "250-500" &&
      (product.priceNum < 250 || product.priceNum > 500)
    )
      return false;
    if (priceFilter === "500-plus" && product.priceNum < 500) return false;

    // 4. In Stock filter
    if (stockOnlyFilter && product.inStock === false) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.priceNum - b.priceNum;
    if (sortBy === "price-high") return b.priceNum - a.priceNum;
    if (sortBy === "discount") {
      const discA = parseInt(a.discount || "0", 10);
      const discB = parseInt(b.discount || "0", 10);
      return discB - discA;
    }
    if (sortBy === "name-az") return a.name.localeCompare(b.name);
    return 0; // "popular"
  });

  // Subtle GSAP entrance animation for bento tiles
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".bento-card");
    if (!cards?.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(cards, { y: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        cards,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [
    activeCategory,
    searchQuery,
    priceFilter,
    sortBy,
    stockOnlyFilter,
    sortedProducts.length,
  ]);

  const isDefaultStorefront =
    !activeCategory &&
    !searchQuery.trim() &&
    priceFilter === "all" &&
    !stockOnlyFilter;

  // Real category slices from database for complete storefront
  const featuredItems = sortedProducts.filter((p) => p.isFeatured).length >= 4
    ? sortedProducts.filter((p) => p.isFeatured).slice(0, 10)
    : sortedProducts.slice(0, 10);

  const freshProducts = productList.filter((p) => p.category === "Fruits & Vegetables");
  const dairyProducts = productList.filter((p) => p.category === "Dairy & Eggs");
  const snacksProducts = productList.filter((p) =>
    ["Snacks & Namkeen", "Biscuits", "Tea & Coffee", "Cold Drinks & Juices"].includes(p.category)
  );
  const staplesProducts = productList.filter((p) =>
    ["Atta, Rice & Grains", "Dal & Pulses", "Oil & Ghee", "Masala & Spices"].includes(p.category)
  );
  const homeProducts = productList.filter((p) =>
    ["Household Cleaning", "Personal Care", "Baby Care", "Pet Care"].includes(p.category)
  );

  const activeFiltersCount =
    (priceFilter !== "all" ? 1 : 0) + (stockOnlyFilter ? 1 : 0);

  const currentDisplayTitle = activeCategory
    ? activeCategory
    : searchQuery.trim()
    ? `Search: "${searchQuery}"`
    : isDefaultStorefront
    ? "Popular & Featured Picks"
    : "Curated Groceries";

  // Check if we should render spotlight featured card
  const hasMultipleProducts = sortedProducts.length >= 4;

  return (
    <section
      id="products"
      ref={sectionRef}
      className="mx-auto mt-6 w-full max-w-[1380px] px-4 sm:px-6 lg:px-8"
    >
      {/* =========================================================
          TOP BAR: Title, Active Category, Filter & Sort Controls
      ========================================================= */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-[#edf0f2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#48A92B]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#48A92B]">
              Fresh Kirana Market
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2.5 flex-wrap">
            <h2 className="text-[22px] font-black tracking-tight text-[#111] sm:text-[26px]">
              {currentDisplayTitle}
            </h2>
            {sortedProducts.length > 0 && (
              <span className="text-[13px] font-semibold text-[#888]">
                ({sortedProducts.length}{" "}
                {sortedProducts.length === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          <p className="mt-1 text-[12.5px] text-[#666] hidden sm:block">
            Fresh local produce, pantry staples, and everyday kirana delivered in minutes.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`
              flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12.5px] font-semibold transition-all active:scale-95
              ${
                activeFiltersCount > 0
                  ? "border-[#48a92b] bg-[#eaf5e9] text-[#2f7d32]"
                  : "border-[#d1d5db] bg-white text-[#444] hover:border-[#999] hover:bg-[#f9fafb]"
              }
            `}
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#48a92b] text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Control */}
          <button
            type="button"
            onClick={() => setIsSortModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#d1d5db] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#444] hover:border-[#999] hover:bg-[#f9fafb] active:scale-95 transition-all"
          >
            <ArrowUpDown size={14} />
            <span className="hidden sm:inline text-[#777]">Sort:</span>
            <span className="text-[#111]">
              {sortBy === "price-low"
                ? "Price: Low to High"
                : sortBy === "price-high"
                ? "Price: High to Low"
                : sortBy === "discount"
                ? "Discount"
                : sortBy === "name-az"
                ? "A–Z"
                : "Popular"}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================
          HORIZONTAL CATEGORY PILLS (When Real Categories Exist)
      ========================================================= */}
      {categories.length > 0 && (
        <div className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isAll = cat.id === "all";
            const isSelected = isAll
              ? !activeCategory
              : activeCategory === cat.name;

            const count = isAll
              ? productList.length
              : productList.filter((p) => p.category === cat.name).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (isAll) {
                    onClearCategoryFilter?.();
                  } else {
                    onSelectCategory?.(cat.name);
                  }
                }}
                className={`
                  inline-flex items-center gap-2 shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-all duration-150 active:scale-95
                  ${
                    isSelected
                      ? "bg-[#48a92b] text-white shadow-xs"
                      : "bg-[#f5f6f7] text-[#555] hover:bg-[#ebeef1] hover:text-[#111]"
                  }
                `}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/25 text-white"
                      : "bg-white text-[#777]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* =========================================================
          ACTIVE FILTER CHIPS
      ========================================================= */}
      {(activeCategory ||
        searchQuery ||
        priceFilter !== "all" ||
        stockOnlyFilter) && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[11.5px]">
          <span className="font-bold text-[#777] mr-1">Active:</span>
          {activeCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf5e9] border border-[#cbe7c8] px-2.5 py-0.5 font-bold text-[#2f7d32]">
              {activeCategory}
              <button
                type="button"
                onClick={onClearCategoryFilter}
                className="hover:text-black"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 font-bold text-[#92400e]">
              &quot;{searchQuery}&quot;
              <button
                type="button"
                onClick={onClearSearch}
                className="hover:text-black"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {priceFilter !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] border border-[#bfdbfe] px-2.5 py-0.5 font-bold text-[#1d4ed8]">
              Price: {priceFilter}
              <button
                type="button"
                onClick={() => onSelectPriceFilter?.("all")}
                className="hover:text-black"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {stockOnlyFilter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] px-2.5 py-0.5 font-bold text-[#374151]">
              In Stock Only
              <button
                type="button"
                onClick={() => setStockOnlyFilter(false)}
                className="hover:text-black"
              >
                <X size={11} />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              onClearCategoryFilter?.();
              onClearSearch?.();
              onSelectPriceFilter?.("all");
              setStockOnlyFilter(false);
            }}
            className="font-bold text-red-600 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* =========================================================
          CONTENT AREA: EMPTY STATE / SEARCH EMPTY / BENTO GRID
      ========================================================= */}
      {productList.length === 0 ? (
        /* Clean Compact Empty State When Store Has No Products Yet */
        <div className="mx-auto my-12 max-w-[520px] rounded-[20px] border border-[#edf0f2] bg-[#fafafa] p-8 text-center space-y-2.5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f2f4] text-[#888]">
            <ShoppingBag size={24} className="text-[#888]" />
          </div>
          <h3 className="text-[17px] font-bold text-[#111]">
            No products available yet
          </h3>
          <p className="text-[13px] text-[#666] leading-relaxed max-w-[340px] mx-auto">
            Products added by the store will appear here.
          </p>
        </div>
      ) : sortedProducts.length === 0 ? (
        /* Empty State for Search or Filter Mismatch */
        <div className="mx-auto my-12 max-w-[480px] rounded-[20px] border border-[#edf0f2] bg-[#fafafa] p-8 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f2f4] text-[#888]">
            <X size={24} />
          </div>
          <h3 className="text-[17px] font-bold text-[#111]">
            No products found
          </h3>
          <p className="text-[13px] text-[#777] max-w-[320px] mx-auto">
            We couldn&apos;t find any grocery items matching your current filters.
          </p>
          <button
            type="button"
            onClick={() => {
              onClearCategoryFilter?.();
              onClearSearch?.();
              onSelectPriceFilter?.("all");
              setStockOnlyFilter(false);
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#48a92b] px-4 py-2 text-[12.5px] font-bold text-white shadow-xs hover:bg-[#3d9124] transition-all"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : isDefaultStorefront ? (
        /* =========================================================
            COMPLETE STOREFRONT PRESENTATION (Categorized Sections)
        ========================================================= */
        <div className="space-y-12">
          {/* 1. POPULAR / FEATURED PRODUCTS */}
          <div>
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-flow-dense">
              {featuredItems.map((product, index) => {
                const count = cart[product.name] || 0;
                const isFavorited = wishlist.includes(product.id || product.name);
                const isHighlighted = highlightedProduct === product.name;
                const isSpotlightTile = index === 0 && hasMultipleProducts;
                const shouldRenderOfferTile = index === 6 && dbOffers.length > 0;

                return (
                  <React.Fragment key={product.id}>
                    {isSpotlightTile ? (
                      <FeaturedProductCard
                        product={product}
                        isFavorited={isFavorited}
                        isHighlighted={isHighlighted}
                        cartCount={count}
                        onAddToCart={onAddToCart}
                        onRemoveFromCart={onRemoveFromCart}
                        onToggleWishlist={onToggleWishlist}
                        onOpenProductDetail={onOpenProductDetail}
                      />
                    ) : (
                      <StandardProductCard
                        product={product}
                        isFavorited={isFavorited}
                        isHighlighted={isHighlighted}
                        cartCount={count}
                        onAddToCart={onAddToCart}
                        onRemoveFromCart={onRemoveFromCart}
                        onToggleWishlist={onToggleWishlist}
                        onOpenProductDetail={onOpenProductDetail}
                      />
                    )}

                    {shouldRenderOfferTile && (
                      <EditorialOfferCard
                        offer={dbOffers[0]}
                        onAction={() => {
                          const promoEl = document.getElementById("promos");
                          if (promoEl) {
                            promoEl.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 2. FRESH PRODUCE */}
          {freshProducts.length > 0 && (
            <CategoryBlockSection
              title="Fresh Picks"
              badge="Mandi Fresh"
              subtitle="Crisp vegetables, fresh herbs, and wholesome seasonal fruits"
              categoryTarget="Fruits & Vegetables"
              products={freshProducts}
              cart={cart}
              wishlist={wishlist}
              highlightedProduct={highlightedProduct}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onToggleWishlist={onToggleWishlist}
              onOpenProductDetail={onOpenProductDetail}
              onSelectCategory={onSelectCategory}
            />
          )}

          {/* 3. DAIRY & EGGS */}
          {dairyProducts.length > 0 && (
            <CategoryBlockSection
              title="Daily Dairy & Eggs"
              badge="Pure & Fresh"
              subtitle="Full cream milk, fresh malai paneer, butter, curd and protein-rich eggs"
              categoryTarget="Dairy & Eggs"
              products={dairyProducts}
              cart={cart}
              wishlist={wishlist}
              highlightedProduct={highlightedProduct}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onToggleWishlist={onToggleWishlist}
              onOpenProductDetail={onOpenProductDetail}
              onSelectCategory={onSelectCategory}
            />
          )}

          {/* 4. SNACKS & BEVERAGES */}
          {snacksProducts.length > 0 && (
            <CategoryBlockSection
              title="Snacks & Beverages"
              badge="Quick Bites"
              subtitle="Crispy namkeens, chips, tea, instant coffee, biscuits and cold drinks"
              categoryTarget="Snacks & Namkeen"
              products={snacksProducts}
              cart={cart}
              wishlist={wishlist}
              highlightedProduct={highlightedProduct}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onToggleWishlist={onToggleWishlist}
              onOpenProductDetail={onOpenProductDetail}
              onSelectCategory={onSelectCategory}
            />
          )}

          {/* 5. STAPLES */}
          {staplesProducts.length > 0 && (
            <CategoryBlockSection
              title="Pantry Essentials"
              badge="Daily Staples"
              subtitle="Chakki fresh atta, basmati rice, unpolished dals, pure ghee and aromatic spices"
              categoryTarget="Atta, Rice & Grains"
              products={staplesProducts}
              cart={cart}
              wishlist={wishlist}
              highlightedProduct={highlightedProduct}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onToggleWishlist={onToggleWishlist}
              onOpenProductDetail={onOpenProductDetail}
              onSelectCategory={onSelectCategory}
            />
          )}

          {/* 6. HOUSEHOLD / PERSONAL CARE */}
          {homeProducts.length > 0 && (
            <CategoryBlockSection
              title="Home & Personal Care"
              badge="Sparkling Clean"
              subtitle="Antiseptic handwashes, lemon dishwash liquids and powerful laundry detergents"
              categoryTarget="Household Cleaning"
              products={homeProducts}
              cart={cart}
              wishlist={wishlist}
              highlightedProduct={highlightedProduct}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onToggleWishlist={onToggleWishlist}
              onOpenProductDetail={onOpenProductDetail}
              onSelectCategory={onSelectCategory}
            />
          )}
        </div>
      ) : (
        /* Filtered / Search Grid */
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-flow-dense">
          {sortedProducts.map((product, index) => {
            const count = cart[product.name] || 0;
            const isFavorited = wishlist.includes(product.id || product.name);
            const isHighlighted = highlightedProduct === product.name;
            const isSpotlightTile = index === 0 && hasMultipleProducts;
            const shouldRenderOfferTile = index === 6 && dbOffers.length > 0;

            return (
              <React.Fragment key={product.id}>
                {isSpotlightTile ? (
                  <FeaturedProductCard
                    product={product}
                    isFavorited={isFavorited}
                    isHighlighted={isHighlighted}
                    cartCount={count}
                    onAddToCart={onAddToCart}
                    onRemoveFromCart={onRemoveFromCart}
                    onToggleWishlist={onToggleWishlist}
                    onOpenProductDetail={onOpenProductDetail}
                  />
                ) : (
                  <StandardProductCard
                    product={product}
                    isFavorited={isFavorited}
                    isHighlighted={isHighlighted}
                    cartCount={count}
                    onAddToCart={onAddToCart}
                    onRemoveFromCart={onRemoveFromCart}
                    onToggleWishlist={onToggleWishlist}
                    onOpenProductDetail={onOpenProductDetail}
                  />
                )}

                {shouldRenderOfferTile && (
                  <EditorialOfferCard
                    offer={dbOffers[0]}
                    onAction={() => {
                      const promoEl = document.getElementById("promos");
                      if (promoEl) {
                        promoEl.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* =========================================================
          PRICE LIST & QUALITY ASSURANCE (Rendered only when products exist)
      ========================================================= */}
      {sortedProducts.length > 0 && (
        <div className="mt-14 rounded-[20px] border border-[#edf0f2] bg-[#f9fafb] p-6 sm:p-8 space-y-6 text-[#444]">
          <div>
            <h3 className="text-[17px] font-bold text-[#111] sm:text-[19px]">
              Buy {currentDisplayTitle} Online at ApniDukaan
            </h3>
            <p className="mt-2 text-[12.5px] font-normal leading-relaxed text-[#666] sm:text-[13px]">
              Order fresh {currentDisplayTitle.toLowerCase()} and daily kitchen
              essentials online from ApniDukaan. We partner directly with verified
              local farmers and trusted brands to deliver daily freshness right
              to your doorstep.
            </p>
          </div>

          {/* Quality Grid */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-4">
              <div className="flex items-center gap-2 font-bold text-[13px] text-[#2f7d32]">
                <Sparkles size={16} />
                <span>Express Delivery</span>
              </div>
              <p className="mt-1 text-[11.5px] text-[#666]">
                Instant micro-store fulfillment right around your neighborhood.
              </p>
            </div>

            <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-4">
              <div className="flex items-center gap-2 font-bold text-[13px] text-[#2f7d32]">
                <Check size={16} />
                <span>Guaranteed Freshness</span>
              </div>
              <p className="mt-1 text-[11.5px] text-[#666]">
                Daily quality checks with instant, no-questions-asked returns.
              </p>
            </div>

            <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-4">
              <div className="flex items-center gap-2 font-bold text-[13px] text-[#2f7d32]">
                <Sparkles size={16} />
                <span>Fair Local Pricing</span>
              </div>
              <p className="mt-1 text-[11.5px] text-[#666]">
                Competitive kirana prices and transparent everyday rates.
              </p>
            </div>
          </div>

          {/* Price Summary Table */}
          <div>
            <h4 className="text-[14.5px] font-bold text-[#222] mb-3">
              {currentDisplayTitle} Price Overview
            </h4>

            <div className="overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
              <table className="w-full text-left text-[12.5px]">
                <thead className="bg-[#f0f2f4] text-[#333] font-semibold border-b border-[#e5e7eb]">
                  <tr>
                    <th className="py-2.5 px-4">Item Name</th>
                    <th className="py-2.5 px-4">Unit</th>
                    <th className="py-2.5 px-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f2]">
                  {sortedProducts.slice(0, 6).map((p) => (
                    <tr key={p.id} className="hover:bg-[#f9fafb]">
                      <td className="py-2.5 px-4 font-medium text-[#222]">
                        {p.name}
                      </td>
                      <td className="py-2.5 px-4 text-[#666]">{p.unit}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-[#111]">
                        {p.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          FILTER MODAL / BOTTOM SHEET
      ========================================================= */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[102] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-4">
          <div className="pointer-events-auto w-full max-w-[420px] rounded-t-[24px] border border-[#edf0f2] bg-white shadow-2xl md:rounded-[20px] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
              <h3 className="text-[16px] font-bold text-[#111]">
                Filter Products
              </h3>
              <button
                type="button"
                aria-label="Close filter"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 text-[#666] hover:bg-[#f2f4f6] rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-[13px]">
              {/* Price Filter */}
              <div>
                <p className="font-semibold text-[#222] mb-2">Price Range</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-100", label: "Under ₹100" },
                    { id: "100-250", label: "₹100–₹250" },
                    { id: "250-500", label: "₹250–₹500" },
                    { id: "500-plus", label: "₹500+" },
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      type="button"
                      onClick={() => onSelectPriceFilter?.(pr.id)}
                      className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                        priceFilter === pr.id
                          ? "border-[#48a92b] bg-[#eaf5e9] text-[#2f7d32] font-semibold"
                          : "border-[#e0e0e0] bg-white text-[#555]"
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="pt-2 border-t border-[#edf0f2]">
                <p className="font-semibold text-[#222] mb-2">Availability</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStockOnlyFilter(false)}
                    className={`flex-1 py-2 rounded-xl border font-medium ${
                      !stockOnlyFilter
                        ? "border-[#48a92b] bg-[#eaf5e9] text-[#2f7d32] font-semibold"
                        : "border-[#e0e0e0] bg-white text-[#555]"
                    }`}
                  >
                    All Items
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockOnlyFilter(true)}
                    className={`flex-1 py-2 rounded-xl border font-medium ${
                      stockOnlyFilter
                        ? "border-[#48a92b] bg-[#eaf5e9] text-[#2f7d32] font-semibold"
                        : "border-[#e0e0e0] bg-white text-[#555]"
                    }`}
                  >
                    In Stock Only
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-[#edf0f2] p-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onSelectPriceFilter?.("all");
                  setStockOnlyFilter(false);
                }}
                className="flex-1 rounded-xl border border-[#d1d5db] py-2.5 font-semibold text-[#555] hover:bg-[#f3f4f6]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 rounded-xl bg-[#48a92b] py-2.5 font-semibold text-white shadow-xs hover:bg-[#3d9124]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SORT MODAL / BOTTOM SHEET
      ========================================================= */}
      {isSortModalOpen && (
        <div className="fixed inset-0 z-[102] flex items-end justify-center pointer-events-none md:items-center p-0 md:p-4">
          <div className="pointer-events-auto w-full max-w-[360px] rounded-t-[24px] border border-[#edf0f2] bg-white shadow-2xl md:rounded-[20px] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
              <h3 className="text-[16px] font-bold text-[#111]">
                Sort Products
              </h3>
              <button
                type="button"
                aria-label="Close sort"
                onClick={() => setIsSortModalOpen(false)}
                className="p-1 text-[#666] hover:bg-[#f2f4f6] rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 space-y-1">
              {[
                { id: "popular", label: "Popular (Featured)" },
                { id: "price-low", label: "Price: Low to High" },
                { id: "price-high", label: "Price: High to Low" },
                { id: "discount", label: "Biggest Discount" },
                { id: "name-az", label: "Name: A–Z" },
              ].map((opt) => {
                const isSelected = sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSelectSortBy?.(opt.id);
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-[13.5px] transition-colors ${
                      isSelected
                        ? "bg-[#eaf5e9] text-[#2f7d32] font-semibold"
                        : "text-[#333] font-medium hover:bg-[#f6f8fa]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={16} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// =========================================================
// 1. LARGE FEATURED BENTO PRODUCT TILE (Spotlight Tile)
// =========================================================
function FeaturedProductCard({
  product,
  isFavorited,
  isHighlighted,
  cartCount,
  onAddToCart,
  onRemoveFromCart,
  onToggleWishlist,
  onOpenProductDetail,
}: {
  product: Product;
  isFavorited: boolean;
  isHighlighted: boolean;
  cartCount: number;
  onAddToCart?: (p: Product) => void;
  onRemoveFromCart?: (p: Product) => void;
  onToggleWishlist?: (p: Product) => void;
  onOpenProductDetail?: (p: Product) => void;
}) {
  const isOutOfStock = product.inStock === false;

  return (
    <article
      id={`product-${product.id}`}
      onClick={() => onOpenProductDetail?.(product)}
      className={`
        bento-card
        group
        relative
        col-span-2
        md:col-span-1
        md:row-span-2
        flex
        flex-col
        justify-between
        overflow-hidden
        rounded-[20px]
        border
        ${
          isHighlighted
            ? "border-[#F8CB46] ring-2 ring-[#F8CB46] bg-[#fffdf5]"
            : "border-[#edf0f2] bg-white"
        }
        p-4
        sm:p-5
        lg:p-6
        shadow-[0_2px_10px_rgba(0,0,0,0.03)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#dde2e6]
        hover:shadow-[0_14px_30px_rgba(0,0,0,0.07)]
        cursor-pointer
      `}
    >
      {/* Top Header / Badges */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf5e9] border border-[#cbe7c8] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#2f7d32]">
            <Sparkles size={11} className="text-[#48a92b]" />
            Spotlight Item
          </span>

          <button
            type="button"
            aria-label={
              isFavorited
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(product);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs shadow-xs transition-transform active:scale-85 ${
              isFavorited
                ? "text-red-500 hover:text-red-600 bg-white"
                : "text-[#888] hover:text-red-500 hover:bg-white"
            }`}
          >
            <Heart
              size={15}
              className={isFavorited ? "fill-red-500 text-red-500" : ""}
            />
          </button>
        </div>

        {/* Title & Unit */}
        <h3 className="mt-3 text-[18px] sm:text-[21px] font-black tracking-tight text-[#111] leading-snug line-clamp-2 group-hover:text-[#48A92B] transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-[12px] font-medium text-[#777]">
          {product.unit} • {product.category}
        </p>

        {product.description && (
          <p className="mt-2 text-[12.5px] text-[#666] line-clamp-2 leading-relaxed hidden sm:block">
            {product.description}
          </p>
        )}

        {/* Price & Badges */}
        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-[20px] sm:text-[22px] font-black text-[#111]">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[12.5px] text-[#999] line-through font-normal">
              {product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span className="rounded-full bg-[#48a92b] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              {product.discount}
            </span>
          )}
        </div>
      </div>

      {/* Large Image Canvas */}
      <div className="relative my-4 flex-1 min-h-[180px] sm:min-h-[220px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#f8f8f8]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <span className="rounded-full bg-black/85 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Prominent Bottom Action */}
      <div onClick={(e) => e.stopPropagation()}>
        {isOutOfStock ? (
          <div className="w-full text-center py-2.5 rounded-[12px] bg-[#f0f2f4] text-[12px] font-semibold text-[#888]">
            Currently Unavailable
          </div>
        ) : cartCount > 0 ? (
          <div className="flex h-[38px] w-full items-center justify-between rounded-[12px] bg-[#48a92b] px-3 text-white shadow-xs">
            <button
              type="button"
              aria-label={`Decrease ${product.name} quantity`}
              onClick={() => onRemoveFromCart?.(product)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/20 active:scale-90"
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>
            <span className="text-[13px] font-bold">
              {cartCount} in cart
            </span>
            <button
              type="button"
              aria-label={`Increase ${product.name} quantity`}
              onClick={() => onAddToCart?.(product)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/20 active:scale-90"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => onAddToCart?.(product)}
            className="w-full h-[38px] rounded-[12px] bg-[#48a92b] text-white text-[12.5px] font-bold shadow-xs hover:bg-[#3d9124] transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>ADD TO CART</span>
          </button>
        )}
      </div>
    </article>
  );
}

// =========================================================
// 2. STANDARD PRODUCT TILE (Surrounding bento tiles)
// =========================================================
function StandardProductCard({
  product,
  isFavorited,
  isHighlighted,
  cartCount,
  onAddToCart,
  onRemoveFromCart,
  onToggleWishlist,
  onOpenProductDetail,
}: {
  product: Product;
  isFavorited: boolean;
  isHighlighted: boolean;
  cartCount: number;
  onAddToCart?: (p: Product) => void;
  onRemoveFromCart?: (p: Product) => void;
  onToggleWishlist?: (p: Product) => void;
  onOpenProductDetail?: (p: Product) => void;
}) {
  const isOutOfStock = product.inStock === false;

  return (
    <article
      id={`product-${product.id}`}
      onClick={() => onOpenProductDetail?.(product)}
      className={`
        bento-card
        group
        relative
        col-span-1
        flex
        flex-col
        justify-between
        overflow-hidden
        rounded-[18px]
        border
        ${
          isHighlighted
            ? "border-[#F8CB46] ring-2 ring-[#F8CB46] bg-[#fffdf5]"
            : "border-[#edf0f2] bg-white"
        }
        p-3
        sm:p-3.5
        shadow-[0_1px_4px_rgba(0,0,0,0.02)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#dde2e6]
        hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]
        cursor-pointer
      `}
    >
      {/* Top Badges & Wishlist */}
      <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">
        {product.discount && (
          <span className="rounded-full bg-[#e63946] px-2 py-0.5 text-[9.5px] font-bold text-white shadow-xs">
            {product.discount}
          </span>
        )}
      </div>

      <button
        type="button"
        aria-label={
          isFavorited
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist?.(product);
        }}
        className={`
          absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs shadow-xs transition-transform active:scale-85
          ${
            isFavorited
              ? "text-red-500 hover:text-red-600 bg-white"
              : "text-[#888] hover:text-red-500 hover:bg-white"
          }
        `}
      >
        <Heart
          size={13}
          className={isFavorited ? "fill-red-500 text-red-500" : ""}
        />
      </button>

      {/* PRODUCT IMAGE CONTAINER */}
      <div className="relative aspect-square w-full items-center justify-center overflow-hidden rounded-[13px] bg-[#f8f8f8]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
          className="object-contain p-3.5 transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Out of Stock Pill */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[1px]">
            <span className="rounded-full bg-black/85 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-1 flex-col justify-between pt-2.5">
        <div>
          <span className="block text-[11px] font-medium text-[#777] truncate">
            {product.unit}
          </span>

          <h3 className="line-clamp-2 text-[13px] sm:text-[13.5px] font-semibold text-[#1a1a1a] leading-snug group-hover:text-[#48A92B] transition-colors mt-0.5">
            {product.name}
          </h3>
        </div>

        {/* PRICING & ADD BUTTON ROW */}
        <div
          className="mt-2.5 flex items-center justify-between gap-1 pt-1 border-t border-[#f7f8f9]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex min-w-0 flex-col">
            <span className="text-[14px] sm:text-[15px] font-extrabold text-[#111] leading-tight">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[10.5px] font-normal text-[#999] line-through leading-tight">
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Interactive Quantity Control */}
          {isOutOfStock ? (
            <span className="text-[10.5px] font-semibold text-[#999] bg-[#f0f2f4] px-2 py-1 rounded-[7px]">
              Unavailable
            </span>
          ) : cartCount > 0 ? (
            <div className="flex h-[32px] items-center rounded-[9px] bg-[#48a92b] px-1 text-white shadow-xs">
              <button
                type="button"
                aria-label={`Decrease ${product.name} quantity`}
                onClick={() => onRemoveFromCart?.(product)}
                className="flex h-6 w-5 items-center justify-center rounded hover:bg-white/20 active:scale-90"
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span className="min-w-[14px] text-center text-[12px] font-bold">
                {cartCount}
              </span>
              <button
                type="button"
                aria-label={`Increase ${product.name} quantity`}
                onClick={() => onAddToCart?.(product)}
                className="flex h-6 w-5 items-center justify-center rounded hover:bg-white/20 active:scale-90"
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() => onAddToCart?.(product)}
              className="
                flex
                h-[32px]
                items-center
                justify-center
                gap-1
                rounded-[9px]
                border
                border-[#48a92b]
                bg-[#f4fbf3]
                px-3
                text-[11.5px]
                font-bold
                text-[#2f7d32]
                shadow-xs
                transition-all
                duration-150
                hover:bg-[#48a92b]
                hover:text-white
                active:scale-90
              "
            >
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// =========================================================
// 3. EDITORIAL OFFER TILE (Rendered only when real active offers exist)
// =========================================================
function EditorialOfferCard({
  offer,
  onAction,
}: {
  offer: any;
  onAction?: () => void;
}) {
  return (
    <article
      onClick={onAction}
      className="
        bento-card
        col-span-2
        flex
        flex-col
        justify-between
        rounded-[20px]
        border
        border-[#efe8dc]
        bg-[#faf7f2]
        p-6
        sm:p-7
        shadow-[0_2px_10px_rgba(0,0,0,0.02)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#e3d7c3]
        hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)]
        cursor-pointer
      "
    >
      <div>
        <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#92400e]">
          {offer.badge || "Special Offer"}
        </span>
        <h3 className="mt-2 text-[19px] sm:text-[23px] font-black text-[#1f1f1f] leading-tight">
          {offer.title || "Daily Grocery Savings"}
        </h3>
        <p className="mt-2 text-[12.5px] sm:text-[13px] text-[#666] leading-relaxed max-w-[400px]">
          {offer.description ||
            "Enjoy handpicked fresh essentials and kitchen staples delivered in minutes."}
        </p>
      </div>

      <div className="mt-5 pt-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[12px] bg-[#1f1f1f] px-4 py-2.5 text-[12.5px] font-bold text-white hover:bg-[#333] transition-all shadow-xs active:scale-95"
        >
          <span>Explore Offer</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

// =========================================================
// 4. THEMATIC CATEGORY BLOCK SECTION (Used in Complete Storefront)
// =========================================================
function CategoryBlockSection({
  title,
  badge,
  subtitle,
  categoryTarget,
  products,
  cart,
  wishlist,
  highlightedProduct,
  onAddToCart,
  onRemoveFromCart,
  onToggleWishlist,
  onOpenProductDetail,
  onSelectCategory,
}: {
  title: string;
  badge: string;
  subtitle: string;
  categoryTarget: string;
  products: Product[];
  cart: Record<string, number>;
  wishlist: string[];
  highlightedProduct: string | null;
  onAddToCart?: (p: Product) => void;
  onRemoveFromCart?: (p: Product) => void;
  onToggleWishlist?: (p: Product) => void;
  onOpenProductDetail?: (p: Product) => void;
  onSelectCategory?: (category: string) => void;
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-[#edf0f2]">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between pb-1">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-[#eaf5e9] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#2f7d32]">
              {badge}
            </span>
          </div>
          <h3 className="mt-1 text-[19px] font-black tracking-tight text-[#111] sm:text-[22px]">
            {title}
          </h3>
          <p className="text-[12px] text-[#666]">{subtitle}</p>
        </div>

        {onSelectCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory(categoryTarget)}
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#48a92b] hover:text-[#3d9124] transition-colors self-start sm:self-auto mt-1 sm:mt-0"
          >
            <span>View All ({products.length})</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.slice(0, 10).map((product) => {
          const count = cart[product.name] || 0;
          const isFavorited = wishlist.includes(product.id || product.name);
          const isHighlighted = highlightedProduct === product.name;

          return (
            <StandardProductCard
              key={product.id}
              product={product}
              isFavorited={isFavorited}
              isHighlighted={isHighlighted}
              cartCount={count}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onToggleWishlist={onToggleWishlist}
              onOpenProductDetail={onOpenProductDetail}
            />
          );
        })}
      </div>
    </div>
  );
}