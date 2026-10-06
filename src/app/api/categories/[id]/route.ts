import { NextRequest } from "next/server";
import { getCategoryById, updateCategory, toggleCategoryStatus } from "@/lib/server/services/categoryService";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    return apiSuccess(category);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch category", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateCategory(id, {
      name: body.name,
      hindiName: body.hindiName,
      description: body.description,
      image: body.image,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
    });

    return apiSuccess(updated);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to update category", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Soft toggle / disable to preserve historical products & orders
    const updated = await toggleCategoryStatus(id);
    return apiSuccess({
      message: `Category "${updated.name}" is now ${updated.isActive ? "active" : "disabled"}.`,
      category: updated,
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to toggle category", 500);
  }
}
