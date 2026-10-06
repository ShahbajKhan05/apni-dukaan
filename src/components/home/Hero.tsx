"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            ".hero-title",
            ".hero-description",
            ".hero-button",
            ".hero-image",
          ],
          { opacity: 1, y: 0, scale: 1 },
        );
        return;
      }

      const isMobile = window.innerWidth < 768;
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          ".hero-title",
          {
            y: isMobile ? 12 : 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
        )
        .fromTo(
          ".hero-description",
          {
            y: isMobile ? 8 : 14,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          "-=0.35",
        )
        .fromTo(
          ".hero-button",
          {
            y: isMobile ? 8 : 12,
            opacity: 0,
            scale: 0.97,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.45,
          },
          "-=0.3",
        )
        .fromTo(
          ".hero-image",
          {
            scale: 0.94,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.45",
        );

      // Subtle, non-distracting floating animation
      gsap.to(".hero-image", {
        y: -5,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="mx-auto mt-2.5 w-full max-w-[1380px] px-4 sm:mt-3 sm:px-6 lg:px-8"
    >
      <div
        className="
          relative
          min-h-[145px]
          overflow-hidden
          rounded-[16px]
          border
          border-black/5
          bg-[#2F7D32]
          shadow-[0_4px_20px_rgba(47,125,50,0.12)]
          sm:min-h-[190px]
          sm:rounded-[20px]
          md:min-h-[240px]
          md:rounded-[24px]
        "
      >
        {/* BACKGROUND GRADIENT */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#267437]
            via-[#39853B]
            to-[#A2AA3C]
          "
        />

        {/* LIGHT GLOW */}
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-48
            h-[350px]
            w-[400px]
            rounded-full
            bg-[#F8CB46]/25
            blur-[90px]
            sm:h-[550px]
            sm:w-[650px]
            sm:blur-[110px]
          "
        />

        {/* CONTENT */}
        <div
          className="
            relative
            z-10
            flex
            h-full
            max-w-[60%]
            flex-col
            justify-center
            px-4
            py-3.5
            sm:max-w-[64%]
            sm:px-7
            sm:py-6
            md:max-w-[650px]
            md:px-10
            md:py-8
          "
        >
          <h1
            className="
              hero-title
              text-[20px]
              font-extrabold
              leading-[1.12]
              tracking-[-0.6px]
              text-white
              sm:text-[28px]
              sm:tracking-[-1px]
              md:text-[34px]
              lg:text-[40px]
              lg:tracking-[-1.2px]
            "
          >
            Stock up on daily essentials
          </h1>

          <p
            className="
              hero-description
              mt-1
              line-clamp-2
              text-[11.5px]
              font-normal
              leading-normal
              text-white/95
              sm:mt-2
              sm:line-clamp-none
              sm:max-w-[420px]
              sm:text-[14px]
              md:mt-2.5
              md:max-w-[500px]
              md:text-[15.5px]
            "
          >
            Get fresh groceries delivered quickly to your doorstep.
          </p>

          <div className="mt-2.5 sm:mt-3.5 md:mt-4">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("products");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="
                hero-button
                group
                inline-flex
                min-h-[34px]
                items-center
                gap-1.5
                rounded-[10px]
                bg-white
                px-3.5
                py-1.5
                text-[12.5px]
                font-semibold
                text-[#1f1f1f]
                shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                transition-all
                duration-200
                hover:gap-2.5
                hover:bg-[#F8CB46]
                hover:shadow-md
                active:scale-95
                sm:min-h-[38px]
                sm:px-4
                sm:py-2
                sm:text-[13.5px]
                md:text-[14.5px]
              "
            >
              Shop Now

              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1 sm:size-[16px]"
              />
            </button>
          </div>
        </div>

        {/* SVG ILLUSTRATION */}
        <div
          className="
            hero-image
            pointer-events-none
            absolute
            bottom-0
            right-0
            h-[88%]
            w-[40%]
            sm:h-[92%]
            sm:w-[44%]
            md:h-full
            md:w-[54%]
          "
        >
          <Image
            src="/images/categories/home.svg"
            alt="Fresh groceries"
            fill
            priority
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 45vw, 55vw"
            className="object-contain object-right-bottom"
          />
        </div>
      </div>
    </section>
  );
}