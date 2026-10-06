import { NextRequest } from "next/server";
import { getProductById, updateProduct, toggleProductStatus } from "@/lib/server/services/productService";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    return apiSuccess(product);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch product", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateProduct(id, {
      name: body.name,
      hindiName: body.hindiName,
      description: body.description,
      brand: body.brand,
      categoryId: body.categoryId,
      image: body.image,
      unit: body.unit,
      sellingPrice: body.sellingPrice !== undefined ? Number(body.sellingPrice) : undefined,
      mrp: body.mrp !== undefined ? Number(body.mrp) : undefined,
      discount: body.discount !== undefined ? Number(body.discount) : undefined,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
    });

    return apiSuccess(updated);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to update product", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Soft toggle/disable so historical order items are preserved
    const updated = await toggleProductStatus(id);
    return apiSuccess({
      message: `Product "${updated.name}" is now ${updated.isActive ? "active" : "disabled"}.`,
      product: updated,
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to disable product", 500);
  }
}
