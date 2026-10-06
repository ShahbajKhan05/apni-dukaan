"use client";

import {
  ChevronDown,
  MapPin,
  Search,
  ShoppingCart,
  UserRound,
  X,
  Plus,
  Clock,
  TrendingUp,
  Store,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { PRODUCTS, Product } from "@/components/home/ProductSection";

export interface HeaderProps {
  products?: Product[];
  cartCount?: number;
  selectedLocation?: string;
  hasLocation?: boolean;
  locationSource?: "gps" | "manual" | "saved";
  isLoggedIn?: boolean;
  userName?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenCart?: () => void;
  onOpenLocation?: () => void;
  onOpenAccount?: () => void;
  onSelectProduct?: (productName: string) => void;
  onAddToCart?: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
}

export default function Header({
  products = [],
  cartCount = 0,
  selectedLocation = "",
  hasLocation = false,
  locationSource,
  isLoggedIn = false,
  userName = "",
  searchQuery: externalSearchQuery,
  onSearchChange,
  onOpenCart,
  onOpenLocation,
  onOpenAccount,
  onSelectProduct,
  onAddToCart,
  onOpenProductDetail,
}: HeaderProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchContainerRefMobile = useRef<HTMLDivElement>(null);
  const searchContainerRefDesktop = useRef<HTMLDivElement>(null);

  const currentSearch =
    externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

  const handleUpdateSearch = (val: string) => {
    if (externalSearchQuery !== undefined && onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalSearchQuery(val);
      onSearchChange?.(val);
    }
  };

  // Case-insensitive matching by product name, category, and unit from real products
  const queryClean = currentSearch.trim().toLowerCase();
  const matchingProducts = queryClean
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(queryClean) ||
          p.category.toLowerCase().includes(queryClean) ||
          p.quantity.toLowerCase().includes(queryClean)
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRefMobile.current &&
        !searchContainerRefMobile.current.contains(event.target as Node) &&
        searchContainerRefDesktop.current &&
        !searchContainerRefDesktop.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSearchItem = (product: Product) => {
    // Add to recent searches if not present
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s.toLowerCase() !== product.name.toLowerCase());
      return [product.name, ...next].slice(0, 6);
    });

    if (onOpenProductDetail) {
      onOpenProductDetail(product);
    } else {
      onSelectProduct?.(product.name);
    }
    setIsSearchFocused(false);
  };

  const handleApplyTerm = (term: string) => {
    handleUpdateSearch(term);
    setIsSearchFocused(false);
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleRemoveRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  const renderSuggestionsPanel = () => {
    if (!isSearchFocused) return null;

    if (!currentSearch.trim()) {
      // Empty Search: Show Recent Searches if any
      if (recentSearches.length === 0) return null;

      return (
        <div className="anim-dropdown absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[340px] overflow-y-auto rounded-[18px] border border-[#edf0f2] bg-white p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-1.5 px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#888]">
            <Clock size={13} />
            <span>Recent Searches</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((term) => (
              <span
                key={term}
                onClick={() => handleApplyTerm(term)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#e2e5e8] bg-[#f8f9fa] px-3 py-1 text-[12px] font-semibold text-[#333] transition-all hover:border-[#48a92b] hover:bg-[#f0f9ed] hover:text-[#2f7d32]"
              >
                <span>{term}</span>
                <button
                  type="button"
                  aria-label={`Remove ${term} from recent searches`}
                  onClick={(e) => handleRemoveRecentSearch(term, e)}
                  className="rounded-full p-0.5 text-[#999] hover:bg-black/10 hover:text-[#333]"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>
      );
    }

    // Has text: Show Live Results or No Results
    return (
      <div className="anim-dropdown absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[320px] overflow-y-auto rounded-[18px] border border-[#edf0f2] bg-white p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
        {matchingProducts.length > 0 ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#888]">
              <span>Matching Products</span>
              <span className="text-[#2f7d32]">
                {matchingProducts.length}{" "}
                {matchingProducts.length === 1 ? "result" : "results"}
              </span>
            </div>
            {matchingProducts.map((p) => (
              <div
                key={p.name}
                onClick={() => handleSelectSearchItem(p)}
                className="flex cursor-pointer items-center justify-between rounded-xl p-2 transition-all hover:bg-[#f6f8fa] active:bg-[#eef2f6]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#f7f8f8]">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#222]">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#777]">
                      {p.quantity} •{" "}
                      <span className="font-bold text-[#1f1f1f]">
                        {p.price}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Add ${p.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart?.(p);
                  }}
                  className="flex h-7 items-center gap-1 rounded-[7px] border border-[#48a92b] px-2.5 text-[11px] font-bold text-[#48a92b] shadow-xs transition-all hover:bg-[#48a92b] hover:text-white active:scale-90"
                >
                  <Plus size={13} />
                  Add
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-[13.5px] font-bold text-[#333]">
              No products found
            </p>
            <button
              type="button"
              onClick={() => handleUpdateSearch("")}
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#48a92b] px-3.5 py-1.5 text-[12px] font-bold text-white hover:bg-[#3d9124]"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#edf0f2] bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* =================================================
            MOBILE HEADER (< lg)
        ================================================= */}
        <div className="flex flex-col py-2.5 lg:hidden">
          {/* 1. TOP ROW: Logo on left, Account + Cart on right */}
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <a
              href="/"
              className="shrink-0 text-[24px] font-black tracking-[-1.5px] sm:text-[26px]"
            >
              <span className="text-[#F8CB46]">Apni</span>
              <span className="text-[#48A92B]">Dukaan</span>
            </a>

            {/* Action Buttons: Admin, Account & Cart */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* Store Admin Quick Link */}
              <a
                href="/admin"
                title="Kirana Store Admin Panel"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#f8f9fa] border border-[#edf0f2] text-[#444] hover:bg-[#fff9e6] hover:text-[#8d6e1f] active:scale-95"
              >
                <Store size={17} />
              </a>
              {/* Account Icon */}
              <button
                type="button"
                aria-label={
                  isLoggedIn ? `Account (${userName})` : "Open Account / Login"
                }
                onClick={onOpenAccount}
                className={`relative flex h-[38px] w-[38px] items-center justify-center rounded-full transition-all active:scale-95 ${
                  isLoggedIn
                    ? "bg-[#eaf5e9] text-[#2f7d32] font-bold text-[13px] border border-[#48a92b]/30"
                    : "bg-[#f4f5f6] text-[#222] hover:bg-[#e9ebed]"
                }`}
              >
                {isLoggedIn ? (
                  <span>
                    {userName
                      ? userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "SK"}
                  </span>
                ) : (
                  <UserRound size={19} />
                )}
                {isLoggedIn && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#48a92b] border-2 border-white" />
                )}
              </button>

              {/* Cart Button */}
              <button
                type="button"
                aria-label="Open Shopping Cart"
                onClick={onOpenCart}
                className="flex h-[38px] items-center gap-1.5 rounded-full bg-[#48A92B] px-3.5 text-white shadow-xs transition-all hover:bg-[#3d9124] hover:shadow-sm active:scale-95"
              >
                <ShoppingCart size={17} />
                <span className="text-[13px] font-bold">Cart</span>
                {cartCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[11px] font-black text-[#2f7d32]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 2. DELIVERY / LOCATION ROW */}
          <button
            type="button"
            onClick={onOpenLocation}
            className="mt-2 flex w-full items-center gap-1.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-[#f8f9fa] active:scale-[0.99]"
          >
            <div className="flex shrink-0 items-center gap-1">
              <MapPin
                size={14}
                fill="#F8CB46"
                className="shrink-0 text-[#F8CB46]"
              />
              <span className="whitespace-nowrap text-[12.5px] font-bold text-[#1f1f1f]">
                {hasLocation ? "Delivery in 8 mins" : "Select delivery location"}
              </span>
              {hasLocation && <span className="text-[#bbb]">•</span>}
            </div>
            <span className="min-w-0 flex-1 truncate text-[12px] text-[#666]">
              {hasLocation ? selectedLocation : "Tap to choose area"}
            </span>
            <ChevronDown size={13} className="shrink-0 text-[#666]" />
          </button>

          {/* 3. SEARCH BAR ROW (Mobile) */}
          <div ref={searchContainerRefMobile} className="relative mt-2 w-full">
            <div className="relative w-full">
              <Search
                size={18}
                strokeWidth={2}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]"
              />
              <input
                type="search"
                value={currentSearch}
                onChange={(e) => handleUpdateSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for milk, bread, eggs..."
                className="
                  h-[44px]
                  w-full
                  rounded-[12px]
                  border
                  border-[#e5e7eb]
                  bg-[#f8f9fa]
                  pl-10
                  pr-10
                  text-[13.5px]
                  text-[#222]
                  outline-none
                  transition-all
                  duration-150
                  placeholder:text-[#888]
                  focus:border-[#48A92B]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#48A92B]/20
                "
              />
              {currentSearch && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => handleUpdateSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#888] transition-colors hover:text-[#222]"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Mobile Search Suggestions Dropdown */}
            {renderSuggestionsPanel()}
          </div>
        </div>

        {/* =================================================
            DESKTOP HEADER (>= lg)
        ================================================= */}
        <div className="hidden h-[74px] items-center justify-between gap-6 lg:flex">
          {/* Logo & Delivery info */}
          <div className="flex shrink-0 items-center gap-7">
            <a
              href="/"
              className="text-[28px] font-extrabold tracking-[-1.5px] transition-transform hover:scale-102"
            >
              <span className="text-[#F8CB46]">Apni</span>
              <span className="text-[#48A92B]">Dukaan</span>
            </a>

            {/* Location selector trigger */}
            <button
              type="button"
              onClick={onOpenLocation}
              className="group flex flex-col text-left transition-colors hover:opacity-85"
            >
              <div className="flex items-center gap-1 text-[13px] font-bold text-[#1f1f1f]">
                <MapPin
                  size={14}
                  fill="#F8CB46"
                  className="text-[#F8CB46] transition-transform group-hover:scale-110"
                />
                <span>
                  {hasLocation
                    ? "Delivery in 8 minutes"
                    : "Select delivery location"}
                </span>
                <ChevronDown
                  size={14}
                  className="transition-transform group-hover:translate-y-0.5"
                />
              </div>
              <span className="max-w-[220px] truncate text-[12px] font-normal text-[#666]">
                {hasLocation ? selectedLocation : "Click to choose area"}
              </span>
            </button>
          </div>

          {/* Search bar container */}
          <div
            ref={searchContainerRefDesktop}
            className="relative flex-1 max-w-[560px]"
          >
            <div className="relative w-full">
              <Search
                size={18}
                strokeWidth={2}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777]"
              />
              <input
                type="search"
                value={currentSearch}
                onChange={(e) => handleUpdateSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for milk, bread, eggs..."
                className="
                  h-[46px]
                  w-full
                  rounded-[14px]
                  border
                  border-[#e5e7eb]
                  bg-[#f8f9fa]
                  pl-11
                  pr-11
                  text-[14px]
                  text-[#222]
                  outline-none
                  transition-all
                  duration-150
                  placeholder:text-[#888]
                  focus:border-[#48A92B]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#48A92B]/20
                "
              />
              {currentSearch && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => handleUpdateSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#888] transition-colors hover:text-[#222]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Desktop Search Suggestions Dropdown */}
            {renderSuggestionsPanel()}
          </div>

          {/* Store Admin Quick Link */}
          <a
            href="/admin"
            className="hidden xl:flex shrink-0 items-center gap-1.5 rounded-xl border border-[#edf0f2] bg-[#fbfcfd] px-3 py-2 text-[13px] font-semibold text-[#555] hover:border-[#48a92b]/40 hover:text-[#2f7d32] transition-colors"
          >
            <Store size={15} />
            <span>Store Admin</span>
          </a>

          {/* Account button */}
          <button
            type="button"
            onClick={onOpenAccount}
            className="flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[14px] text-[#222] transition-all hover:bg-[#f4f5f6] hover:text-[#48a92b] active:scale-95"
          >
            <UserRound
              size={18}
              className={isLoggedIn ? "text-[#48a92b]" : "text-[#555]"}
            />
            <span className="font-semibold">
              {isLoggedIn
                ? userName
                  ? userName.split(" ")[0]
                  : "Account"
                : "Login"}
            </span>
            <ChevronDown size={14} />
          </button>

          {/* Cart button - Primary Action */}
          <button
            type="button"
            onClick={onOpenCart}
            className="mr-2 flex h-[44px] shrink-0 items-center gap-2 rounded-[12px] bg-[#48A92B] px-4 text-white shadow-xs transition-all duration-150 hover:bg-[#3d9124] hover:shadow-sm active:scale-95"
          >
            <ShoppingCart size={19} />
            <span className="text-[14px] font-semibold">My Cart</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-[#2f7d32] shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}