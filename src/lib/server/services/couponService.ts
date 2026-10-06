import { prisma } from "../prisma";
import { AppError } from "../apiResponse";
import { Prisma } from "@prisma/client";

export interface CouponValidationResult {
  valid: boolean;
  couponId: string;
  code: string;
  type: string;
  discountAmount: number;
  freeDelivery: boolean;
  message: string;
}

export async function validateAndApplyCoupon(
  code: string,
  subtotal: number,
  deliveryFee: number = 0,
  userId?: string
): Promise<CouponValidationResult> {
  const normalizedCode = code.trim().toUpperCase();

  const coupon = await prisma.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon) {
    throw new AppError("INVALID_COUPON", `Coupon code "${code}" is invalid.`);
  }

  if (!coupon.isActive) {
    throw new AppError("INVALID_COUPON", `Coupon code "${code}" is no longer active.`);
  }

  const now = new Date();
  if (coupon.startsAt && now < coupon.startsAt) {
    throw new AppError("INVALID_COUPON", `Coupon "${code}" is not yet active.`);
  }

  if (coupon.expiresAt && now > coupon.expiresAt) {
    throw new AppError("COUPON_EXPIRED", `Coupon "${code}" has expired.`);
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError(
      "COUPON_LIMIT_REACHED",
      `Coupon "${code}" has reached its maximum total usage limit.`
    );
  }

  const minOrder = Number(coupon.minimumOrder);
  if (subtotal < minOrder) {
    throw new AppError(
      "COUPON_MIN_ORDER_NOT_MET",
      `Minimum order of ₹${minOrder.toFixed(2)} required for coupon "${code}". Current subtotal is ₹${subtotal.toFixed(2)}.`
    );
  }

  // If user provided, check if user already redeemed this coupon if it's single-use
  if (userId) {
    const previousUsage = await prisma.couponUsage.findFirst({
      where: { couponId: coupon.id, userId },
    });
    if (previousUsage && coupon.usageLimit === 1) {
      throw new AppError(
        "COUPON_LIMIT_REACHED",
        `You have already used coupon "${code}".`
      );
    }
  }

  let discountAmount = 0;
  let freeDelivery = false;
  const couponVal = Number(coupon.value);
  const maxDiscount = coupon.maximumDiscount ? Number(coupon.maximumDiscount) : null;

  if (coupon.type === "PERCENTAGE") {
    const rawDiscount = (subtotal * couponVal) / 100;
    discountAmount = maxDiscount ? Math.min(rawDiscount, maxDiscount) : rawDiscount;
  } else if (coupon.type === "FIXED") {
    discountAmount = Math.min(couponVal, subtotal);
  } else if (coupon.type === "FREE_DELIVERY") {
    freeDelivery = true;
    discountAmount = deliveryFee;
  }

  // Ensure clean 2-decimal rounding
  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    valid: true,
    couponId: coupon.id,
    code: coupon.code,
    type: coupon.type,
    discountAmount,
    freeDelivery,
    message: `Coupon "${coupon.code}" applied successfully! You saved ₹${discountAmount.toFixed(2)}`,
  };
}
