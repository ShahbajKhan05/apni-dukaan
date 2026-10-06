import { NextRequest } from "next/server";
import { updateOrderStatus } from "@/lib/server/services/orderService";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status) {
      return apiError("VALIDATION_ERROR", "New order status is required.");
    }

    const validStatuses: OrderStatus[] = [
      "NEW",
      "ACCEPTED",
      "PREPARING",
      "PACKED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(body.status)) {
      return apiError(
        "INVALID_ORDER_STATUS",
        `Invalid status value "${body.status}". Allowed values: ${validStatuses.join(", ")}`
      );
    }

    const updatedOrder = await updateOrderStatus(id, body.status as OrderStatus, body.adminUserId);

    return apiSuccess({
      message: `Order #${updatedOrder.orderNumber} status transitioned to ${updatedOrder.status}.`,
      order: updatedOrder,
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to update order status", 500);
  }
}
