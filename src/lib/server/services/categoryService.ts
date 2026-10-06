import { prisma } from "../prisma";
import { AppError } from "../apiResponse";
import { Prisma } from "@prisma/client";

export interface CreateCategoryInput {
  name: string;
  hindiName?: string;
  slug?: string;
  description?: string;
  image?: string;
  displayOrder?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  hindiName?: string;
  description?: string;
  image?: string;
  displayOrder?: number;
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

export async function getCategories(includeInactive = false) {
  return await prisma.category.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        where: { isActive: true },
        include: { inventory: true },
      },
    },
  });

  if (!category) {
    throw new AppError("CATEGORY_NOT_FOUND", `Category with ID ${id} not found.`);
  }

  return category;
}

export async function createCategory(input: CreateCategoryInput) {
  const slug = input.slug || generateSlug(input.name);

  return await prisma.category.create({
    data: {
      name: input.name,
      hindiName: input.hindiName,
      slug,
      description: input.description,
      image: input.image || "/images/categories/home.svg",
      displayOrder: input.displayOrder ?? 0,
      isActive: true,
    },
  });
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError("CATEGORY_NOT_FOUND", `Category with ID ${id} not found.`);
  }

  return await prisma.category.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.hindiName !== undefined ? { hindiName: input.hindiName } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.image !== undefined ? { image: input.image } : {}),
      ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
  });
}

export async function toggleCategoryStatus(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError("CATEGORY_NOT_FOUND", `Category with ID ${id} not found.`);
  }

  return await prisma.category.update({
    where: { id },
    data: {
      isActive: !category.isActive,
    },
  });
}
