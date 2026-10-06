"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface CategoryItem {
  id: string;
  name: string;
  shortName: string;
  icon: string;
}

// Clean initial empty list (no fake/demo categories)
export const CATEGORIES_LIST: CategoryItem[] = [];

interface CategoriesProps {
  categories?: CategoryItem[];
  selectedCategory?: string | null;
  onSelectCategory?: (category: string) => void;
}

export default function Categories({
  categories = [],
  selectedCategory = null,
  onSelectCategory,
}: CategoriesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayList = categories.length > 0 ? categories : CATEGORIES_LIST;

  useEffect(() => {
    if (displayList.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".category-chip", { y: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        ".category-chip",
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.02,
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
  }, [displayList.length]);

  return (
    <section
      ref={sectionRef}
      className="mx-auto mt-4 w-full max-w-[1380px] px-4 sm:mt-5 sm:px-6 lg:hidden"
    >
      {/* MOBILE & TABLET CATEGORY ROW */}
      <div className="relative w-full">
        {displayList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafafa] p-3 text-center">
            <p className="text-[12.5px] font-semibold text-[#555]">No categories yet</p>
            <p className="text-[11px] text-[#888] mt-0.5">
              Add categories from Admin to organize your store.
            </p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="
              no-scrollbar
              -mx-4
              flex
              gap-2.5
              overflow-x-auto
              px-4
              py-1.5
              scroll-smooth
              sm:mx-0
              sm:px-0
            "
          >
            {displayList.map((cat) => {
              const isAll = cat.id === "all";
              const isActive = isAll
                ? !selectedCategory
                : selectedCategory === cat.name;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (isAll) {
                      onSelectCategory?.("");
                    } else {
                      onSelectCategory?.(cat.name);
                    }
                  }}
                  className={`
                    category-chip
                    flex
                    shrink-0
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3.5
                    py-1.5
                    text-[12.5px]
                    transition-all
                    duration-150
                    active:scale-95
                    ${
                      isActive
                        ? "border-[#48a92b] bg-[#eaf5e9] text-[#2f7d32] font-semibold shadow-xs ring-1 ring-[#48a92b]"
                        : "border-[#e5e7eb] bg-white text-[#444] font-medium hover:border-[#bbb] hover:bg-[#f8f9fa]"
                    }
                  `}
                >
                  <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-[#f0f2f4]">
                    <Image
                      src={cat.icon || "/images/categories/home.svg"}
                      alt={cat.name}
                      fill
                      sizes="20px"
                      className="object-contain p-0.5"
                    />
                  </div>
                  <span className="whitespace-nowrap">{cat.shortName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}