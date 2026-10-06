"use client";

import React from "react";
import Link from "next/link";
// Social icon inline SVGs to avoid dependency mismatches
function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88M7.86 18.5V10.13H5.07V18.5h2.79z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#edf0f2] bg-white text-[#1f1f1f]">
      <div className="mx-auto max-w-[1380px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* 4-COLUMN RESPONSIVE GRID */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-14">
          
          {/* =========================================================
              1. LEFT BRAND COLUMN (Slightly wider)
          ========================================================= */}
          <div className="space-y-6">
            {/* Logo */}
            <Link
              href="/"
              className="inline-block text-[28px] font-black tracking-[-1.5px] transition-transform hover:scale-[1.02]"
            >
              <span className="text-[#F8CB46]">Apni</span>
              <span className="text-[#48A92B]">Dukaan</span>
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#instagram"
                aria-label="ApniDukaan on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#666] transition-all duration-200 hover:border-[#48A92B] hover:bg-[#eaf5e9] hover:text-[#2f7d32] active:scale-95"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="#twitter"
                aria-label="ApniDukaan on X / Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#666] transition-all duration-200 hover:border-[#48A92B] hover:bg-[#eaf5e9] hover:text-[#2f7d32] active:scale-95"
              >
                <TwitterIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="#facebook"
                aria-label="ApniDukaan on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#666] transition-all duration-200 hover:border-[#48A92B] hover:bg-[#eaf5e9] hover:text-[#2f7d32] active:scale-95"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="#linkedin"
                aria-label="ApniDukaan on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#666] transition-all duration-200 hover:border-[#48A92B] hover:bg-[#eaf5e9] hover:text-[#2f7d32] active:scale-95"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-[12.5px] leading-relaxed text-[#777]">
              © {new Date().getFullYear()} ApniDukaan. All rights reserved.
            </p>
          </div>

          {/* =========================================================
              2. QUICK LINKS COLUMN
          ========================================================= */}
          <div>
            <h3 className="mb-4 text-[15px] font-bold tracking-tight text-[#111]">
              Quick Links
            </h3>
            <ul className="space-y-3 text-[13.5px]">
              <li>
                <Link
                  href="/"
                  className="text-[#666] transition-colors duration-150 hover:text-[#48A92B]"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#products"
                  className="text-[#666] transition-colors duration-150 hover:text-[#48A92B]"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="text-[#666] transition-colors duration-150 hover:text-[#48A92B]"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#promos"
                  className="text-[#666] transition-colors duration-150 hover:text-[#48A92B]"
                >
                  Offers
                </a>
              </li>
              <li>
                <a
                  href="/admin/orders"
                  className="text-[#666] transition-colors duration-150 hover:text-[#48A92B]"
                >
                  Orders
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[#666] transition-colors duration-150 hover:text-[#48A92B]"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* =========================================================
              3. INFORMATION / BUSINESS COLUMN
          ========================================================= */}
          <div>
            <h3 className="mb-4 text-[15px] font-bold tracking-tight text-[#111]">
              Information
            </h3>
            <ul className="space-y-3 text-[13.5px]">
              <li>
                <span className="cursor-default text-[#666] transition-colors duration-150 hover:text-[#48A92B]">
                  About Us
                </span>
              </li>
              <li>
                <span className="cursor-default text-[#666] transition-colors duration-150 hover:text-[#48A92B]">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-default text-[#666] transition-colors duration-150 hover:text-[#48A92B]">
                  Terms of Use
                </span>
              </li>
              <li>
                <span className="cursor-default text-[#666] transition-colors duration-150 hover:text-[#48A92B]">
                  Delivery Information
                </span>
              </li>
              <li>
                <span className="cursor-default text-[#666] transition-colors duration-150 hover:text-[#48A92B]">
                  Refund & Cancellation
                </span>
              </li>
              <li>
                <span className="cursor-default text-[#666] transition-colors duration-150 hover:text-[#48A92B]">
                  Contact Support
                </span>
              </li>
            </ul>
          </div>

          {/* =========================================================
              4. APP DOWNLOAD COLUMN
          ========================================================= */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-[15px] font-bold tracking-tight text-[#111]">
                Download App
              </h3>
              <p className="text-[13px] leading-relaxed text-[#666]">
                Get the ApniDukaan app for a faster shopping experience.
              </p>
            </div>

            {/* App Store / Play Store Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-1">
              {/* Google Play */}
              <button
                type="button"
                disabled
                aria-label="Download on Google Play (Coming soon)"
                className="group flex w-full max-w-[210px] items-center gap-3 rounded-[12px] border border-[#d1d5db] bg-white px-3.5 py-2.5 text-left transition-all duration-200 hover:border-[#48A92B] hover:shadow-xs disabled:cursor-default"
              >
                <svg
                  className="h-6 w-6 shrink-0 fill-current text-[#333] transition-colors group-hover:text-[#48A92B]"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.609 1.814L13.793 12 3.61 22.186A2.298 2.298 0 0 1 3 20.575V3.425c0-.624.232-1.196.609-1.611zm11.233 11.233l2.253 2.253-12.01 6.84 9.757-9.093zm0-2.094L5.085 1.86l12.01 6.84-2.253 2.253zm1.484 1.047l3.87 2.204c.804.458.804 1.206 0 1.664l-3.87 2.204-2.193-2.193 2.193-1.879z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#888]">
                    GET IT ON
                  </span>
                  <span className="text-[13.5px] font-extrabold text-[#111] leading-tight">
                    Google Play
                  </span>
                </div>
              </button>

              {/* App Store */}
              <button
                type="button"
                disabled
                aria-label="Download on App Store (Coming soon)"
                className="group flex w-full max-w-[210px] items-center gap-3 rounded-[12px] border border-[#d1d5db] bg-white px-3.5 py-2.5 text-left transition-all duration-200 hover:border-[#48A92B] hover:shadow-xs disabled:cursor-default"
              >
                <svg
                  className="h-6 w-6 shrink-0 fill-current text-[#333] transition-colors group-hover:text-[#48A92B]"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.87 1.48-.6.7-1.13 1.84-1 2.97 1.08.08 2.22-.53 2.88-1.35z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#888]">
                    Download on the
                  </span>
                  <span className="text-[13.5px] font-extrabold text-[#111] leading-tight">
                    App Store
                  </span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}