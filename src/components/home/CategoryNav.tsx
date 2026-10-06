"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  ShoppingBag,
  ShoppingBasket,
  Apple,
  Milk,
  Croissant,
  Cookie,
  CupSoda,
  Coffee,
  Home,
  Sparkles,
  Baby,
  Cross,
  Headphones,
  Smartphone,
  Shirt,
  Gamepad2,
  Wheat,
  Dog,
  Flame,
  Tag,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  shortName?: string;
  icon?: string;
}

interface CategoryNavProps {
  categories?: CategoryItem[];
  selectedCategory?: string | null;
  onSelectCategory?: (categoryName: string) => void;
}

// Semantic Lucide icon mapping based on category names / keywords
function getCategoryIcon(name: string): LucideIcon {
  const n = (name || "").toLowerCase();

  if (n === "all") return ShoppingBag;
  if (n.includes("fruit") || n.includes("veg") || n.includes("fresh")) return Apple;
  if (n.includes("dairy") || n.includes("egg") || n.includes("milk")) return Milk;
  if (
    n.includes("atta") ||
    n.includes("grain") ||
    n.includes("rice") ||
    n.includes("pulse") ||
    n.includes("dal")
  )
    return Wheat;
  if (n.includes("snack") || n.includes("namkeen") || n.includes("biscuit"))
    return Cookie;
  if (n.includes("bakery") || n.includes("bread") || n.includes("croissant"))
    return Croissant;
  if (n.includes("tea") || n.includes("coffee") || n.includes("cafe"))
    return Coffee;
  if (
    n.includes("drink") ||
    n.includes("juice") ||
    n.includes("beverage") ||
    n.includes("soda")
  )
    return CupSoda;
  if (
    n.includes("masala") ||
    n.includes("spice") ||
    n.includes("oil") ||
    n.includes("ghee")
  )
    return Flame;
  if (n.includes("clean") || n.includes("house") || n.includes("home"))
    return Home;
  if (
    n.includes("personal") ||
    n.includes("beauty") ||
    n.includes("cosmetic") ||
    n.includes("care")
  )
    return Sparkles;
  if (n.includes("baby")) return Baby;
  if (n.includes("pet")) return Dog;
  if (n.includes("pharmacy") || n.includes("health") || n.includes("medic"))
    return Cross;
  if (n.includes("electronic") || n.includes("gadget")) return Headphones;
  if (n.includes("mobile") || n.includes("phone")) return Smartphone;
  if (n.includes("fashion") || n.includes("cloth")) return Shirt;
  if (n.includes("toy") || n.includes("game")) return Gamepad2;
  if (n.includes("package") || n.includes("sweet")) return ShoppingBasket;

  return Tag;
}

// Concise category label formatter for single-line horizontal bar
function getDisplayName(cat: CategoryItem): string {
  if (cat.shortName && cat.shortName !== cat.name) {
    return cat.shortName;
  }
  const n = cat.name;
  if (n === "Fruits & Vegetables") return "Fresh & Veg";
  if (n === "Atta, Rice & Grains") return "Atta & Rice";
  if (n === "Cold Drinks & Juices") return "Drinks & Juices";
  if (n === "Household Cleaning") return "Cleaning & Home";
  if (n === "Breakfast & Cereals") return "Breakfast";
  return n;
}

export default function CategoryNav({
  categories = [],
  selectedCategory = null,
  onSelectCategory,
}: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Normalize categories list: Ensure "All" is always the first item
  const displayCategories: CategoryItem[] = React.useMemo(() => {
    const rawList = categories || [];
    const nonAll = rawList.filter(
      (c) => c.id !== "all" && c.name.toLowerCase() !== "all",
    );

    return [{ id: "all", name: "All", shortName: "All" }, ...nonAll];
  }, [categories]);

  // Check scroll position to display subtle desktop navigation chevrons
  const checkScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [displayCategories]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -240 : 240;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleCategoryClick = (cat: CategoryItem, e: React.MouseEvent<HTMLButtonElement>) => {
    const isAll = cat.id === "all" || cat.name.toLowerCase() === "all";

    // Auto-scroll clicked item smoothly into view within category bar
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    if (isAll) {
      onSelectCategory?.("");
    } else {
      onSelectCategory?.(cat.name);
    }

    // Smoothly scroll the page to products section
    const targetSection = document.getElementById("products");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Category Navigation"
      className="sticky top-[102px] lg:top-[74px] z-40 w-full border-b border-[#edf0f2] bg-white transition-shadow"
    >
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Desktop Left Scroll Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Scroll categories left"
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white/95 p-1 text-[#666] shadow-sm backdrop-blur-xs transition-all hover:bg-white hover:text-[#111] hover:scale-105 active:scale-95 lg:flex"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Desktop Right Scroll Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Scroll categories right"
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white/95 p-1 text-[#666] shadow-sm backdrop-blur-xs transition-all hover:bg-white hover:text-[#111] hover:scale-105 active:scale-95 lg:flex"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Single-line Horizontally Scrollable Categories Bar */}
        <div
          ref={scrollRef}
          onScroll={checkScrollState}
          className="no-scrollbar flex h-[54px] sm:h-[58px] items-center gap-6 sm:gap-7 lg:gap-8 overflow-x-auto scroll-smooth whitespace-nowrap"
        >
          {displayCategories.map((cat) => {
            const isAll = cat.id === "all" || cat.name.toLowerCase() === "all";
            const isActive = isAll
              ? !selectedCategory || selectedCategory === ""
              : selectedCategory === cat.name;

            const IconComponent = getCategoryIcon(cat.name);
            const displayName = getDisplayName(cat);

            return (
              <button
                key={cat.id || cat.name}
                type="button"
                onClick={(e) => handleCategoryClick(cat, e)}
                className={`
                  group relative flex h-full shrink-0 items-center gap-2 px-1 text-[13px] sm:text-[13.5px] transition-colors duration-150 active:scale-[0.98]
                  ${isActive ? "font-bold text-[#48A92B]" : "font-medium text-[#4B5563] hover:text-[#1F1F1F]"}
                `}
                aria-current={isActive ? "true" : undefined}
              >
                {/* Semantic Outline Icon */}
                <IconComponent
                  size={16}
                  className={`
                    shrink-0 transition-colors duration-150
                    ${
                      isActive
                        ? "text-[#48A92B]"
                        : "text-[#71717A] group-hover:text-[#1F1F1F]"
                    }
                  `}
                />

                {/* Category Display Name */}
                <span>{displayName}</span>

                {/* Active Indicator Underline Bar */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[#48A92B] transition-all duration-200"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
