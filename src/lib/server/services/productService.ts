import { prisma } from "../prisma";
import { AppError } from "../apiResponse";
import { Prisma } from "@prisma/client";

export interface CreateProductInput {
  name: string;
  hindiName?: string;
  slug?: string;
  description?: string;
  brand?: string;
  categoryId: string;
  image: string;
  unit: string;
  sellingPrice: number;
  mrp: number;
  discount?: number;
  sku?: string;
  isFeatured?: boolean;
  initialStock?: number;
  lowStockThreshold?: number;
}

export interface UpdateProductInput {
  name?: string;
  hindiName?: string;
  description?: string;
  brand?: string;
  categoryId?: string;
  image?: string;
  unit?: string;
  sellingPrice?: number;
  mrp?: number;
  discount?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getProducts(params?: {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}) {
  const { categoryId, categorySlug, search, isFeatured, isActive = true, limit = 50, offset = 0 } = params || {};

  const whereClause: Prisma.ProductWhereInput = {
    ...(isActive !== undefined ? { isActive } : {}),
    ...(isFeatured !== undefined ? { isFeatured } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { hindiName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        inventory: {
          select: { id: true, quantity: true, lowStockThreshold: true },
        },
        variants: {
          where: { isActive: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  return {
    products: products.map((p) => {
      const stock = p.inventory?.quantity ?? 0;
      const lowStockThreshold = p.inventory?.lowStockThreshold ?? 10;
      return {
        id: p.id,
        name: p.name,
        hindiName: p.hindiName,
        slug: p.slug,
        brand: p.brand,
        description: p.description,
        category: p.category.name,
        categoryId: p.categoryId,
        unit: p.unit,
        sellingPrice: Number(p.sellingPrice),
        mrp: Number(p.mrp),
        discount: p.discount ? Number(p.discount) : null,
        sku: p.sku,
        image: p.image,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        stock,
        isLowStock: stock > 0 && stock <= lowStockThreshold,
        isOutOfStock: stock <= 0,
        variants: p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          unit: v.unit,
          sellingPrice: Number(v.sellingPrice),
          mrp: Number(v.mrp),
          sku: v.sku,
        })),
      };
    }),
    totalCount,
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      inventory: true,
      variants: true,
    },
  });

  if (!product) {
    throw new AppError("PRODUCT_NOT_FOUND", `Product with ID ${id} not found.`);
  }

  return product;
}

export async function createProduct(input: CreateProductInput, createdById?: string) {
  let slug = input.slug || generateSlug(input.name);
  const sku = input.sku || `SKU-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

  const discountPercent =
    input.discount ??
    (input.mrp > input.sellingPrice
      ? Math.round(((input.mrp - input.sellingPrice) / input.mrp) * 100)
      : 0);

  return await prisma.$transaction(async (tx) => {
    // Check if slug is already taken, if so make it unique
    const existingWithSlug = await tx.product.findUnique({ where: { slug } });
    if (existingWithSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Resolve categoryId: find existing by id/name/slug, or create if it doesn't exist
    let categoryId = input.categoryId;
    const existingCategory = await tx.category.findFirst({
      where: {
        OR: [
          { id: categoryId },
          { name: categoryId },
          { slug: categoryId },
        ],
      },
    });

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const catName = categoryId || "General";
      const catSlug = generateSlug(catName) || `cat-${Date.now().toString(36)}`;
      const existingBySlug = await tx.category.findUnique({ where: { slug: catSlug } });
      if (existingBySlug) {
        categoryId = existingBySlug.id;
      } else {
        const newCat = await tx.category.create({
          data: {
            name: catName,
            slug: catSlug,
          },
        });
        categoryId = newCat.id;
      }
    }

    const product = await tx.product.create({
      data: {
        name: input.name,
        hindiName: input.hindiName,
        slug,
        description: input.description,
        brand: input.brand,
        categoryId,
        image: input.image || "/images/categories/home.svg",
        unit: input.unit,
        sellingPrice: new Prisma.Decimal(input.sellingPrice),
        mrp: new Prisma.Decimal(input.mrp),
        discount: new Prisma.Decimal(discountPercent),
        sku,
        isFeatured: input.isFeatured ?? false,
        isActive: true,
      },
    });

    const initialStock = input.initialStock ?? 20;
    const lowStockThreshold = input.lowStockThreshold ?? 10;

    const inventory = await tx.inventory.create({
      data: {
        productId: product.id,
        quantity: initialStock,
        lowStockThreshold,
      },
    });

    await tx.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        type: "PURCHASE",
        quantity: initialStock,
        previousQuantity: 0,
        newQuantity: initialStock,
        reason: "Initial stock upon product creation",
        createdById,
      },
    });

    return { product, inventory };
  }, { maxWait: 10000, timeout: 25000 });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("PRODUCT_NOT_FOUND", `Product with ID ${id} not found.`);
  }

  const data: Prisma.ProductUpdateInput = {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.hindiName !== undefined ? { hindiName: input.hindiName } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.brand !== undefined ? { brand: input.brand } : {}),
    ...(input.image !== undefined ? { image: input.image } : {}),
    ...(input.unit !== undefined ? { unit: input.unit } : {}),
    ...(input.sellingPrice !== undefined ? { sellingPrice: new Prisma.Decimal(input.sellingPrice) } : {}),
    ...(input.mrp !== undefined ? { mrp: new Prisma.Decimal(input.mrp) } : {}),
    ...(input.discount !== undefined ? { discount: new Prisma.Decimal(input.discount) } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
    ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    ...(input.categoryId !== undefined
      ? { category: { connect: { id: input.categoryId } } }
      : {}),
  };

  return await prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
      inventory: true,
    },
  });
}

export async function toggleProductStatus(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError("PRODUCT_NOT_FOUND", `Product with ID ${id} not found.`);
  }

  return await prisma.product.update({
    where: { id },
    data: {
      isActive: !product.isActive,
    },
  });
}
