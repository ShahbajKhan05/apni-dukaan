import { NextRequest } from "next/server";
import { validateAndApplyCoupon } from "@/lib/server/services/couponService";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.code) {
      return apiError("VALIDATION_ERROR", "Coupon code is required.");
    }

    if (body.subtotal === undefined || typeof body.subtotal !== "number") {
      return apiError("VALIDATION_ERROR", "Order subtotal must be provided as a number.");
    }

    const result = await validateAndApplyCoupon(
      body.code,
      body.subtotal,
      body.deliveryFee ?? 0,
      body.userId
    );

    return apiSuccess(result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to validate coupon", 500);
  }
}
