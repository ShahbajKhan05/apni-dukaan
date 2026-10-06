"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface PromoOffer {
  title: string;
  description: string;
  image?: string;
  background?: string;
  offerBadge?: string;
}

interface PromoCardsProps {
  offers?: PromoOffer[];
}

export default function PromoCards({ offers = [] }: PromoCardsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!offers || offers.length === 0) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".promo-card", { y: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        ".promo-card",
        {
          y: 18,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  const handleOrderNow = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="mx-auto mt-4 w-full max-w-[1380px] px-4 sm:mt-6 sm:px-6 lg:px-8"
    >
      <div
        className="
          no-scrollbar
          -mx-4
          flex
          gap-3.5
          overflow-x-auto
          px-4
          pb-2
          pt-1
          snap-x
          snap-mandatory
          md:mx-0
          md:grid
          md:grid-cols-3
          md:gap-4
          md:overflow-visible
          md:px-0
          md:pb-0
        "
      >
        {offers.map((promo) => (
          <article
            key={promo.title}
            style={{ backgroundColor: promo.background }}
            className="
              promo-card
              group
              relative
              flex
              min-h-[155px]
              w-[78vw]
              max-w-[320px]
              shrink-0
              snap-start
              flex-col
              justify-between
              overflow-hidden
              rounded-[16px]
              border
              border-black/5
              p-4
              shadow-[0_2px_10px_rgba(0,0,0,0.03)]
              transition-all
              duration-300
              active:scale-[0.98]
              sm:min-h-[165px]
              sm:rounded-[20px]
              sm:p-5
              md:w-auto
              md:max-w-none
              md:shrink
              md:hover:-translate-y-1.5
              md:hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]
            "
          >
            {/* TEXT */}
            <div className="relative z-10 max-w-[58%] sm:max-w-[62%]">
              {promo.offerBadge && (
                <span className="mb-1.5 inline-block rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#111] shadow-xs">
                  {promo.offerBadge}
                </span>
              )}
              <h2
                className="
                  whitespace-pre-line
                  text-[17px]
                  font-bold
                  leading-[1.15]
                  tracking-[-0.4px]
                  text-[#222]
                  sm:text-[19px]
                "
              >
                {promo.title}
              </h2>

              <p className="mt-1 text-[11.5px] font-normal leading-[1.35] text-[#333] line-clamp-2 sm:text-[12px]">
                {promo.description}
              </p>

              <button
                type="button"
                onClick={handleOrderNow}
                className="
                  group/button
                  mt-3
                  inline-flex
                  min-h-[34px]
                  items-center
                  gap-1.5
                  rounded-[8px]
                  bg-[#222]
                  px-3
                  py-1.5
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-xs
                  transition-all
                  duration-200
                  hover:bg-black
                  hover:shadow-sm
                  active:scale-95
                  sm:mt-4
                  sm:px-3.5
                  sm:py-2
                  sm:text-[13px]
                "
              >
                Order Now

                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover/button:translate-x-1 sm:size-[15px]"
                />
              </button>
            </div>

            {/* IMAGE */}
            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                right-0
                h-full
                w-[44%]
                transition-transform
                duration-500
                group-hover:scale-105
                sm:w-[46%]
              "
            >
              <Image
                src={promo.image || "/images/categories/home.svg"}
                alt={promo.title.replace("\n", " ")}
                fill
                sizes="(max-width: 768px) 45vw, 33vw"
                className="object-contain object-right-bottom"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}