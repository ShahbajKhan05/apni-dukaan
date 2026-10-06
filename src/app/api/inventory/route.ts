import { NextRequest } from "next/server";
import { getInventorySummary } from "@/lib/server/services/inventoryService";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const summary = await getInventorySummary();
    return apiSuccess(summary);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch inventory", 500);
  }
}
