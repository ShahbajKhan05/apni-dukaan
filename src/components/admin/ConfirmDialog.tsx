"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity anim-fade-in"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-2xl anim-modal text-left">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isDestructive ? "bg-[#fee2e2] text-[#dc2626]" : "bg-[#fff9e6] text-[#8d6e1f]"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#111]">{title}</h3>
            <p className="mt-1 text-[12.5px] text-[#666] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#edf0f2] pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#e5e7eb] px-4 py-2 text-[12.5px] font-semibold text-[#666] hover:bg-[#f4f5f6]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-[12.5px] font-bold text-white shadow-xs active:scale-95 transition-all ${
              isDestructive
                ? "bg-[#dc2626] hover:bg-[#b91c1c]"
                : "bg-[#48a92b] hover:bg-[#3d9124]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
