"use client";

import { useState } from "react";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { CheckCircle2, Sparkles } from "lucide-react";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { toastMessage } = useAdmin();

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-[#1f1f1f]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-full bg-[#111] px-5 py-2.5 text-[13px] font-bold text-white shadow-2xl anim-modal border border-white/10">
          <Sparkles size={15} className="text-[#F8CB46]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
