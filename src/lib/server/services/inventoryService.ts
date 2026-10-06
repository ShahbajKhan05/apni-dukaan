import { prisma } from "../prisma";
import { AppError } from "../apiResponse";
import { InventoryTransactionType } from "@prisma/client";

export interface StockAdjustmentInput {
  inventoryId?: string;
  productId?: string;
  variantId?: string;
  delta: number; // positive to add stock, negative to reduce
  type: InventoryTransactionType;
  reason?: string;
  referenceId?: string;
  createdById?: string;
}

export async function adjustInventory(input: StockAdjustmentInput) {
  const { inventoryId, productId, variantId, delta, type, reason, referenceId, createdById } = input;

  return await prisma.$transaction(async (tx) => {
    // 1. Locate the inventory record
    let inventory = null;
    if (inventoryId) {
      inventory = await tx.inventory.findUnique({
        where: { id: inventoryId },
        include: { product: true, variant: true },
      });
    } else if (productId) {
      inventory = await tx.inventory.findUnique({
        where: { productId },
        include: { product: true, variant: true },
      });
    } else if (variantId) {
      inventory = await tx.inventory.findUnique({
        where: { variantId },
        include: { product: true, variant: true },
      });
    }

    if (!inventory) {
      throw new AppError("PRODUCT_NOT_FOUND", "Inventory record could not be found.");
    }

    const previousQuantity = inventory.quantity;
    const newQuantity = previousQuantity + delta;

    if (newQuantity < 0) {
      throw new AppError(
        "INSUFFICIENT_STOCK",
        `Cannot reduce stock by ${Math.abs(delta)}. Current stock is ${previousQuantity}.`
      );
    }

    // 2. Update the inventory quantity
    const updatedInventory = await tx.inventory.update({
      where: { id: inventory.id },
      data: {
        quantity: newQuantity,
      },
    });

    // 3. Create the immutable audit trail transaction
    const transaction = await tx.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        type,
        quantity: delta,
        previousQuantity,
        newQuantity,
        reason: reason || `Inventory adjusted by ${delta > 0 ? "+" : ""}${delta} (${type})`,
        referenceId,
        createdById,
      },
    });

    return {
      inventory: updatedInventory,
      transaction,
      previousQuantity,
      newQuantity,
    };
  });
}

export async function getInventorySummary() {
  const items = await prisma.inventory.findMany({
    include: {
      product: {
        include: {
          category: true,
        },
      },
      variant: true,
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return items.map((inv) => {
    const isOutOfStock = inv.quantity <= 0;
    const isLowStock = !isOutOfStock && inv.quantity <= inv.lowStockThreshold;

    return {
      id: inv.id,
      productId: inv.productId,
      variantId: inv.variantId,
      name: inv.variant?.name ?? inv.product?.name ?? "Unknown Item",
      brand: inv.product?.brand,
      category: inv.product?.category.name ?? "General",
      unit: inv.variant?.unit ?? inv.product?.unit ?? "pc",
      quantity: inv.quantity,
      lowStockThreshold: inv.lowStockThreshold,
      status: isOutOfStock ? "out_of_stock" : isLowStock ? "low_stock" : "in_stock",
      updatedAt: inv.updatedAt,
      recentTransactions: inv.transactions,
    };
  });
}

export async function getInventoryTransactions(inventoryId: string, limit = 50) {
  return await prisma.inventoryTransaction.findMany({
    where: { inventoryId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      createdBy: {
        select: { id: true, name: true, role: true },
      },
    },
  });
}
