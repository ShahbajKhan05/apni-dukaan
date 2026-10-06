import { NextRequest } from "next/server";
import { getProducts, createProduct } from "@/lib/server/services/productService";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const categorySlug = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const isFeatured = searchParams.get("featured") === "true" ? true : undefined;
    const isActive = searchParams.get("all") === "true" ? undefined : true;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;

    const result = await getProducts({
      categoryId,
      categorySlug,
      search,
      isFeatured,
      isActive,
      limit,
      offset,
    });

    return apiSuccess(result.products, 200, {
      totalCount: result.totalCount,
      limit,
      offset,
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch products", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const categoryIdentifier = body.categoryId || body.category;

    if (!body.name || !categoryIdentifier || body.sellingPrice === undefined || body.mrp === undefined || !body.unit) {
      return apiError(
        "VALIDATION_ERROR",
        "Missing required product fields: name, categoryId, sellingPrice, mrp, unit."
      );
    }

    const newProduct = await createProduct({
      name: body.name,
      hindiName: body.hindiName,
      slug: body.slug,
      description: body.description,
      brand: body.brand,
      categoryId: categoryIdentifier,
      image: body.image || "/images/categories/home.svg",
      unit: body.unit,
      sellingPrice: Number(body.sellingPrice),
      mrp: Number(body.mrp),
      discount: body.discount !== undefined ? Number(body.discount) : undefined,
      sku: body.sku,
      isFeatured: Boolean(body.isFeatured),
      initialStock: body.stock !== undefined ? Number(body.stock) : 20,
      lowStockThreshold: body.lowStockThreshold !== undefined ? Number(body.lowStockThreshold) : 10,
    });

    return apiSuccess(newProduct, 201);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to create product", 500);
  }
}
