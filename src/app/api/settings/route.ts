import { NextRequest } from "next/server";
import { getStoreSettings, updateStoreSettings, getDeliverySlots } from "@/lib/server/services/settingsService";
import { apiSuccess, apiError } from "@/lib/server/apiResponse";

export async function GET() {
  try {
    const [settings, deliverySlots] = await Promise.all([
      getStoreSettings(),
      getDeliverySlots(),
    ]);

    return apiSuccess({
      settings,
      deliverySlots,
    });
  } catch (error: unknown) {
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch settings", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateStoreSettings(body);
    return apiSuccess(updated);
  } catch (error: unknown) {
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to update settings", 500);
  }
}
