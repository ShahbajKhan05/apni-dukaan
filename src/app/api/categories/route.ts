import { NextRequest } from "next/server";
import { getCategories, createCategory } from "@/lib/server/services/categoryService";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";
    const categories = await getCategories(includeInactive);
    return apiSuccess(categories);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch categories", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name) {
      return apiError("VALIDATION_ERROR", "Category name is required.");
    }

    const category = await createCategory({
      name: body.name,
      hindiName: body.hindiName,
      slug: body.slug,
      description: body.description,
      image: body.image,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
    });

    return apiSuccess(category, 201);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to create category", 500);
  }
}
