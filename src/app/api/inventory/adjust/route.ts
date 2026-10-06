import { NextRequest } from "next/server";
import { adjustInventory } from "@/lib/server/services/inventoryService";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";
import { InventoryTransactionType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.delta || typeof body.delta !== "number") {
      return apiError("VALIDATION_ERROR", "Delta adjustment quantity must be a non-zero number.");
    }

    if (!body.type || !["PURCHASE", "SALE", "DAMAGE", "EXPIRED", "MANUAL_ADJUSTMENT", "RETURN"].includes(body.type)) {
      return apiError("VALIDATION_ERROR", "Valid transaction type is required.");
    }

    if (!body.inventoryId && !body.productId && !body.variantId) {
      return apiError("VALIDATION_ERROR", "Target inventoryId, productId, or variantId must be provided.");
    }

    const result = await adjustInventory({
      inventoryId: body.inventoryId,
      productId: body.productId,
      variantId: body.variantId,
      delta: body.delta,
      type: body.type as InventoryTransactionType,
      reason: body.reason,
      referenceId: body.referenceId,
      createdById: body.createdById,
    });

    return apiSuccess(result, 200);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to adjust stock", 500);
  }
}
