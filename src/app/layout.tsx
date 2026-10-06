import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/layout/Preloader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#48A92B",
};

export const metadata: Metadata = {
  title: "ApniDukaan — Fresh Groceries Delivered Fast",
  description:
    "ApniDukaan delivers fresh fruits, vegetables, dairy, snacks, and daily groceries right to your doorstep in minutes. Easy shopping, instant delivery, and fair prices.",
  keywords: [
    "ApniDukaan",
    "online grocery",
    "instant delivery",
    "fresh vegetables",
    "daily essentials",
    "local kirana",
  ],
  authors: [{ name: "ApniDukaan" }],
  openGraph: {
    title: "ApniDukaan — Fresh Groceries Delivered Fast",
    description:
      "Order everyday groceries, fresh produce, and household essentials with instant delivery to your doorstep.",
    type: "website",
    locale: "en_IN",
    siteName: "ApniDukaan",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApniDukaan — Fresh Groceries Delivered Fast",
    description:
      "Fresh groceries and daily essentials delivered fast from your neighbourhood kirana store.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${inter.className} font-sans antialiased text-[#1f1f1f] bg-white`}
      >
        <Preloader />
        {children}
      </body>
    </html>
  );
}