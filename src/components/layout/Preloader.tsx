"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [isComplete, setIsComplete] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<SVGSVGElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressGlowRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const greenCurtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Accessibility: Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setIsComplete(true);
      return;
    }

    // 2. Lock body scroll during initial preloader
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Progress counter numeric tracker
    const progressObj = { value: 0 };

    const statusCopy = [
      "Preparing your store",
      "Fresh picks incoming",
      "Almost ready",
      "Ready to deliver",
    ];

    // 3. React Strict Mode-safe GSAP Context
    const ctx = gsap.context(() => {
      // Set initial element states
      gsap.set(containerRef.current, { visibility: "visible" });
      gsap.set(logoRef.current, { opacity: 0, y: 22, scale: 0.94 });
      if (leafRef.current) {
        gsap.set(leafRef.current, { opacity: 0, scale: 0.8, rotation: -8 });
      }
      gsap.set(labelRef.current, { opacity: 0, y: 10 });
      gsap.set(progressLineRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(progressGlowRef.current, { opacity: 0, xPercent: -100 });
      gsap.set(taglineRef.current, { opacity: 0, y: 12 });
      gsap.set(greenCurtainRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      // Master Timeline (~1.85s - 2.1s duration)
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.style.overflow = previousOverflow;
          setIsComplete(true);
        },
      });

      // 0.10s: Logo fades in and glides upward
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
        },
        0.1,
      );

      // 0.20s: Leaf micro-animation (rotates -8deg -> 0deg, scales 0.8 -> 1)
      if (leafRef.current) {
        tl.to(
          leafRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "back.out(1.6)",
          },
          0.2,
        );
      }

      // 0.35s: Subtle logo settling
      tl.to(
        logoRef.current,
        {
          scale: 1.015,
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        },
        0.35,
      );

      // 0.45s: Loading label and bottom tagline appear
      tl.to(
        labelRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
        },
        0.45,
      ).to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
        },
        0.48,
      );

      // 0.50s -> 1.45s: Progress line animates from 0 -> 100%
      tl.to(
        progressLineRef.current,
        {
          scaleX: 1,
          duration: 0.95,
          ease: "power2.inOut",
        },
        0.5,
      )
        // Numeric counter interpolates smoothly (01 -> 18 -> 42 -> 67 -> 84 -> 100)
        .to(
          progressObj,
          {
            value: 100,
            duration: 0.95,
            ease: "power2.inOut",
            onUpdate: () => {
              const currentNum = Math.round(progressObj.value);
              if (counterRef.current) {
                counterRef.current.textContent =
                  currentNum < 10
                    ? `0${currentNum}%`
                    : `${currentNum}%`;
              }
              if (labelRef.current) {
                if (currentNum < 35) {
                  labelRef.current.textContent = statusCopy[0];
                } else if (currentNum < 70) {
                  labelRef.current.textContent = statusCopy[1];
                } else if (currentNum < 96) {
                  labelRef.current.textContent = statusCopy[2];
                } else {
                  labelRef.current.textContent = statusCopy[3];
                }
              }
            },
          },
          0.5,
        )
        // Subtle moving highlight glow along progress line
        .fromTo(
          progressGlowRef.current,
          { xPercent: -100, opacity: 0 },
          {
            xPercent: 120,
            opacity: 0.65,
            duration: 0.95,
            ease: "power2.inOut",
          },
          0.5,
        );

      // 1.35s: Small brand micro-pulse
      if (leafRef.current) {
        tl.to(
          leafRef.current,
          {
            scale: 1.15,
            duration: 0.18,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          },
          1.35,
        );
      }

      // 1.50s: Loader content slightly moves upward
      tl.to(
        contentRef.current,
        {
          yPercent: -14,
          opacity: 0,
          duration: 0.28,
          ease: "power2.in",
        },
        1.5,
      );

      // 1.58s: Signature moment — green line expands across screen horizontally
      tl.to(
        greenCurtainRef.current,
        {
          scaleX: 1,
          duration: 0.32,
          ease: "power3.inOut",
        },
        1.58,
      );

      // 1.80s: Yellow loader background hides behind green curtain
      tl.set(containerRef.current, { visibility: "hidden" }, 1.8);

      // 1.80s -> 2.15s: Green curtain smoothly lifts vertically revealing homepage
      tl.to(
        greenCurtainRef.current,
        {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.42,
          ease: "power4.inOut",
        },
        1.8,
      );
    }, containerRef);

    // Escape key / skip shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.body.style.overflow = previousOverflow;
        setIsComplete(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Safety fallback timeout: guarantee unlock after 2.5s under all circumstances
    const safetyTimer = setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setIsComplete(true);
    }, 2500);

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (isComplete) {
    return null;
  }

  const handleSkip = () => {
    document.body.style.overflow = "";
    setIsComplete(true);
  };

  return (
    <>
      {/* =========================================================
          1. MASTER FULL-VIEWPORT YELLOW LOADER CANVAS (#F8CB46)
      ========================================================= */}
      <div
        ref={containerRef}
        aria-label="Loading ApniDukaan"
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[99999] flex h-[100dvh] w-screen flex-col justify-between overflow-hidden bg-[#F8CB46] p-6 select-none sm:p-10 lg:p-12"
      >
        {/* Top Header Row: Brand domain + Accessible Skip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1F1F1F]" />
            <span className="font-mono text-[11px] font-bold tracking-widest text-[#1F1F1F]/70 uppercase">
              APNIDUKAAN
            </span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            title="Press Escape or click to skip intro"
            className="rounded-full border border-[#1F1F1F]/15 bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-[#1F1F1F]/70 transition-all hover:border-[#1F1F1F]/40 hover:bg-white/20 hover:text-[#1F1F1F] active:scale-95"
          >
            SKIP ✕
          </button>
        </div>

        {/* Center Content: Logo, Leaf, Label, and Minimal Progress Line */}
        <div
          ref={contentRef}
          className="mx-auto flex w-full max-w-md flex-col items-center text-center"
        >
          {/* Logo Wordmark with Leaf Motif */}
          <div
            ref={logoRef}
            className="flex items-center justify-center gap-2.5 sm:gap-3"
          >
            {/* Elegant SVG Leaf (Animated independently) */}
            <svg
              ref={leafRef}
              className="h-8 w-8 text-[#2F7D32] sm:h-10 sm:w-10 drop-shadow-xs"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6" />
            </svg>

            <h1 className="text-4xl font-black tracking-[-2px] text-[#1F1F1F] sm:text-5xl md:text-6xl">
              <span>Apni</span>
              <span className="text-[#2F7D32]">Dukaan</span>
            </h1>
          </div>

          {/* Minimal Loading Label */}
          <p
            ref={labelRef}
            className="mt-3 text-[12px] font-bold tracking-widest text-[#1F1F1F]/75 uppercase sm:text-[13px]"
          >
            Preparing your store
          </p>

          {/* Progress Indicator Container */}
          <div className="mt-7 w-full max-w-[240px] sm:max-w-[280px]">
            {/* Thin Progress Track */}
            <div className="relative h-[2.5px] w-full overflow-hidden rounded-full bg-[#1F1F1F]/15">
              {/* Active Progress Line */}
              <div
                ref={progressLineRef}
                className="h-full w-full rounded-full bg-[#1F1F1F]"
              />
              {/* Subtle Highlight Glow */}
              <div
                ref={progressGlowRef}
                className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
              />
            </div>

            {/* Numeric Percentage & Micro Meta */}
            <div className="mt-2.5 flex items-center justify-between font-mono text-[11.5px] font-bold text-[#1F1F1F]">
              <span className="text-[10px] tracking-widest text-[#1F1F1F]/50 uppercase">
                EXPRESS KIRANA
              </span>
              <span ref={counterRef} className="tabular-nums tracking-wider">
                00%
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Area: Editorial Brand Tagline */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div
            ref={taglineRef}
            className="text-[11.5px] font-bold tracking-widest text-[#1F1F1F]/70 uppercase sm:text-[12.5px]"
          >
            YOUR DAILY STORE, DELIVERED.
          </div>
          <div className="hidden font-mono text-[11px] tracking-wider text-[#1F1F1F]/50 sm:block">
            REWA • 10-MIN INSTANT FULFILLMENT
          </div>
        </div>
      </div>

      {/* =========================================================
          2. SIGNATURE GREEN TRANSITION CURTAIN (#2F7D32)
      ========================================================= */}
      <div
        ref={greenCurtainRef}
        className="fixed inset-0 z-[100000] h-[100dvh] w-screen bg-[#2F7D32] pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
