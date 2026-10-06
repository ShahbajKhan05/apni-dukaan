import { NextRequest } from "next/server";
import { getOrders, createOrder } from "@/lib/server/services/orderService";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";
import { OrderStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as OrderStatus | undefined;
    const userId = searchParams.get("userId") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;

    const orders = await getOrders({ status, userId, limit, offset });
    return apiSuccess(orders);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch orders", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.userId || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return apiError("VALIDATION_ERROR", "Order must include userId and a non-empty items array.");
    }

    if (!body.deliveryAddress || !body.deliveryAddress.addressLine || !body.deliveryAddress.phone) {
      return apiError("VALIDATION_ERROR", "Complete delivery address with phone number is required.");
    }

    const orderResult = await createOrder({
      userId: body.userId,
      items: body.items,
      deliveryAddress: body.deliveryAddress,
      couponCode: body.couponCode,
      deliverySlotId: body.deliverySlotId,
      paymentMethod: body.paymentMethod,
      notes: body.notes,
    });

    return apiSuccess(orderResult, 201);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to place order", 500);
  }
}
