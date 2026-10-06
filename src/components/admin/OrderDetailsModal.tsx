"use client";

import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CreditCard,
  Printer,
} from "lucide-react";
import { AdminOrder, OrderStatus } from "@/lib/admin/types";
import { ORDER_STATUS_COLORS } from "@/components/admin/RecentOrdersTable";
import { useAdmin } from "@/context/AdminContext";

interface OrderDetailsModalProps {
  order: AdminOrder | null;
  onClose: () => void;
}

const TIMELINE_STEPS: OrderStatus[] = [
  "New",
  "Accepted",
  "Preparing",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

export default function OrderDetailsModal({
  order,
  onClose,
}: OrderDetailsModalProps) {
  const { updateOrderStatus } = useAdmin();

  if (!order) return null;

  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);
  const statusColor = ORDER_STATUS_COLORS[order.status] || ORDER_STATUS_COLORS.New;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity anim-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-[620px] max-h-[90vh] flex flex-col rounded-2xl border border-[#edf0f2] bg-white shadow-2xl overflow-hidden anim-modal">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4 bg-[#fbfcfd]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#48A92B] text-white font-bold text-[14px]">
              <Package size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-extrabold text-[#111]">
                  Order #{order.orderId}
                </h3>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-[11.5px] text-[#777]">
                Placed {order.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => window.print()}
              title="Print KOT / Bill Receipt"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f2f4f6]"
            >
              <Printer size={16} />
            </button>
            <button
              type="button"
              aria-label="Close order details"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666] hover:bg-[#f2f4f6]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-5">
          {/* Status Quick Action Bar */}
          <div className="rounded-xl border border-[#edf0f2] bg-[#f8f9fa] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-2">
              Update Order Status
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TIMELINE_STEPS.map((step) => {
                const isSelected = order.status === step;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => updateOrderStatus(order.orderId, step)}
                    className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition-all ${
                      isSelected
                        ? "bg-[#48a92b] text-white shadow-xs"
                        : "bg-white border border-[#e2e5e8] text-[#444] hover:border-[#48a92b] hover:text-[#2f7d32]"
                    }`}
                  >
                    {step}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => updateOrderStatus(order.orderId, "Cancelled")}
                className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition-all ${
                  order.status === "Cancelled"
                    ? "bg-[#dc2626] text-white"
                    : "bg-white border border-[#fecaca] text-[#dc2626] hover:bg-[#fee2e2]"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Customer Details */}
            <div className="rounded-xl border border-[#edf0f2] p-3.5 bg-white">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#888] mb-2">
                <User size={13} />
                <span>Customer Information</span>
              </div>
              <p className="text-[13.5px] font-bold text-[#222]">
                {order.customerName}
              </p>
              <div className="mt-1 space-y-0.5 text-[12px] text-[#666]">
                <div className="flex items-center gap-1.5">
                  <Phone size={12} className="text-[#888]" />
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="hover:underline text-[#2f7d32] font-semibold"
                  >
                    {order.customerPhone}
                  </a>
                </div>
                {order.customerEmail && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="text-[#888]" />
                    <span>{order.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-xl border border-[#edf0f2] p-3.5 bg-white">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#888] mb-2">
                <MapPin size={13} />
                <span>Delivery Address</span>
              </div>
              <p className="text-[12.5px] text-[#333] leading-snug">
                {order.deliveryAddress}
              </p>
              {order.landmark && (
                <p className="mt-1 text-[11.5px] text-[#777]">
                  Landmark: {order.landmark}
                </p>
              )}
              {order.notes && (
                <p className="mt-1 text-[11.5px] font-medium text-[#d97706] bg-[#fef3c7] px-2 py-0.5 rounded">
                  Note: {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Order Items Table */}
          <div className="rounded-xl border border-[#edf0f2] overflow-hidden">
            <div className="bg-[#f8f9fa] px-4 py-2 border-b border-[#edf0f2] text-[11px] font-bold uppercase tracking-wider text-[#777]">
              Ordered Items ({order.items.length})
            </div>
            <div className="divide-y divide-[#edf0f2] px-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2.5 text-[13px]"
                >
                  <div>
                    <p className="font-semibold text-[#222]">{item.name}</p>
                    <p className="text-[11.5px] text-[#777]">
                      {item.unit} • ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-[#111]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="border-t border-[#edf0f2] bg-[#fafafa] p-4 space-y-1.5 text-[12.5px]">
              <div className="flex justify-between text-[#666]">
                <span>Item Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#666]">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#2f7d32] font-semibold">
                  <span>Discount Applied</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#e2e5e8] pt-2 text-[14px] font-black text-[#111]">
                <span>Total Amount</span>
                <span>₹{order.total}</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#777]">
                <span>Payment Mode:</span>
                <span className="font-bold text-[#333]">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
