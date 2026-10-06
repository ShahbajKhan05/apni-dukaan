import { prisma } from "../prisma";
import { AppError } from "../apiResponse";
import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { validateAndApplyCoupon } from "./couponService";

// Explicit state machine transitions
export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["PACKED", "CANCELLED"],
  PACKED: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [], // Terminal state
  CANCELLED: [], // Terminal state
};

export function validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  if (currentStatus === newStatus) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus];
  return allowed.includes(newStatus);
}

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderInput {
  userId: string;
  items: CreateOrderItemInput[];
  deliveryAddress: {
    name: string;
    phone: string;
    addressLine: string;
    area?: string;
    city: string;
    state?: string;
    postalCode: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  };
  couponCode?: string;
  deliverySlotId?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export async function createOrder(input: CreateOrderInput) {
  const {
    userId,
    items: requestedItems,
    deliveryAddress,
    couponCode,
    deliverySlotId,
    paymentMethod = "COD",
    notes,
  } = input;

  if (!requestedItems || requestedItems.length === 0) {
    throw new AppError("VALIDATION_ERROR", "Order must contain at least one item.");
  }

  // Generate an authentic Kirana-style order number: e.g. AD-20261005-XXXX
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `AD-${timestamp}-${randomSuffix}`;

  // Execute entire order creation atomically in a database transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Verify User
    const user = await tx.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new AppError("UNAUTHORIZED", "Customer profile could not be found.");
    }

    // 2. Fetch Store Settings for Delivery Calculation
    let storeSettings = await tx.storeSettings.findUnique({
      where: { id: "default" },
    });
    if (!storeSettings) {
      storeSettings = await tx.storeSettings.create({
        data: { id: "default" },
      });
    }

    const defaultDeliveryFee = Number(storeSettings.deliveryFee);
    const freeDeliveryThreshold = Number(storeSettings.freeDeliveryThreshold);

    // 3. Verify products, active state, stock, and fetch current price from DB
    let computedSubtotal = 0;
    const validatedItems: Array<{
      productId: string;
      variantId?: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      itemSubtotal: number;
      inventoryId: string;
      currentStock: number;
    }> = [];

    for (const reqItem of requestedItems) {
      if (reqItem.quantity <= 0) {
        throw new AppError("VALIDATION_ERROR", "Item quantity must be greater than zero.");
      }

      const product = await tx.product.findUnique({
        where: { id: reqItem.productId },
        include: {
          inventory: true,
          variants: true,
        },
      });

      if (!product) {
        throw new AppError("PRODUCT_NOT_FOUND", `Product with ID ${reqItem.productId} was not found.`);
      }

      if (!product.isActive) {
        throw new AppError("PRODUCT_OUT_OF_STOCK", `Product "${product.name}" is currently unavailable.`);
      }

      let unitPrice = Number(product.sellingPrice);
      let productName = product.name;
      let inventory = product.inventory;

      if (reqItem.variantId) {
        const variant = product.variants.find((v) => v.id === reqItem.variantId);
        if (!variant || !variant.isActive) {
          throw new AppError("PRODUCT_NOT_FOUND", `Variant for "${product.name}" not found or inactive.`);
        }
        unitPrice = Number(variant.sellingPrice);
        productName = `${product.name} (${variant.name})`;

        // Variant-level inventory if exists
        const variantInv = await tx.inventory.findUnique({
          where: { variantId: variant.id },
        });
        if (variantInv) inventory = variantInv;
      }

      if (!inventory) {
        throw new AppError("PRODUCT_OUT_OF_STOCK", `Inventory not tracked for "${productName}".`);
      }

      if (inventory.quantity < reqItem.quantity) {
        throw new AppError(
          "INSUFFICIENT_STOCK",
          `Insufficient stock for "${productName}". Requested: ${reqItem.quantity}, Available: ${inventory.quantity}`
        );
      }

      const itemSubtotal = Math.round(unitPrice * reqItem.quantity * 100) / 100;
      computedSubtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        variantId: reqItem.variantId,
        productName,
        unitPrice,
        quantity: reqItem.quantity,
        itemSubtotal,
        inventoryId: inventory.id,
        currentStock: inventory.quantity,
      });
    }

    computedSubtotal = Math.round(computedSubtotal * 100) / 100;

    // 4. Calculate Delivery Fee
    let deliveryFee = computedSubtotal >= freeDeliveryThreshold ? 0 : defaultDeliveryFee;

    // 5. Apply and Validate Coupon (if provided)
    let discountAmount = 0;
    let couponRecord = null;

    if (couponCode) {
      const couponResult = await validateAndApplyCoupon(
        couponCode,
        computedSubtotal,
        deliveryFee,
        userId
      );
      discountAmount = couponResult.discountAmount;
      if (couponResult.freeDelivery) {
        deliveryFee = 0;
      }

      couponRecord = await tx.coupon.findUnique({
        where: { id: couponResult.couponId },
      });
    }

    // 6. Compute Final Total
    const finalTotal = Math.max(
      0,
      Math.round((computedSubtotal + deliveryFee - discountAmount) * 100) / 100
    );

    // 7. Create Order Header with immutable delivery address snapshot
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: "NEW",
        subtotal: new Prisma.Decimal(computedSubtotal),
        deliveryFee: new Prisma.Decimal(deliveryFee),
        discount: new Prisma.Decimal(discountAmount),
        total: new Prisma.Decimal(finalTotal),
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
        deliveryAddressSnapshot: deliveryAddress as unknown as Prisma.JsonObject,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        deliverySlotId,
        notes,
      },
    });

    // 8. Create Order Item Snapshots
    for (const item of validatedItems) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          productNameSnapshot: item.productName,
          unitPrice: new Prisma.Decimal(item.unitPrice),
          quantity: item.quantity,
          subtotal: new Prisma.Decimal(item.itemSubtotal),
        },
      });

      // 9. Atomically decrement stock
      const updatedStock = item.currentStock - item.quantity;
      await tx.inventory.update({
        where: { id: item.inventoryId },
        data: { quantity: updatedStock },
      });

      // 10. Record Inventory Transaction (SALE)
      await tx.inventoryTransaction.create({
        data: {
          inventoryId: item.inventoryId,
          type: "SALE",
          quantity: -item.quantity,
          previousQuantity: item.currentStock,
          newQuantity: updatedStock,
          reason: `Order sale #${order.orderNumber}`,
          referenceId: order.id,
          createdById: userId,
        },
      });
    }

    // 11. Record Coupon Usage (if coupon applied)
    if (couponRecord) {
      await tx.couponUsage.create({
        data: {
          couponId: couponRecord.id,
          userId,
          orderId: order.id,
          discountAmount: new Prisma.Decimal(discountAmount),
        },
      });

      await tx.coupon.update({
        where: { id: couponRecord.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    // 12. Create Customer Notification
    await tx.notification.create({
      data: {
        userId,
        type: "ORDER_CREATED",
        title: "Order Placed Successfully!",
        message: `Your order #${orderNumber} for ₹${finalTotal.toFixed(2)} has been placed and received by the store.`,
      },
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: computedSubtotal,
      deliveryFee,
      discount: discountAmount,
      total: finalTotal,
      itemCount: validatedItems.length,
      createdAt: order.createdAt,
    };
  });
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  adminUserId?: string
) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new AppError("ORDER_NOT_FOUND", `Order with ID ${orderId} does not exist.`);
    }

    const currentStatus = order.status;

    if (!validateStatusTransition(currentStatus, newStatus)) {
      throw new AppError(
        "INVALID_ORDER_STATUS",
        `Invalid status change from "${currentStatus}" to "${newStatus}". Allowed transitions: ${
          ALLOWED_STATUS_TRANSITIONS[currentStatus].join(", ") || "None (Terminal State)"
        }`
      );
    }

    // If order is cancelled, optionally restock inventory
    if (newStatus === "CANCELLED" && currentStatus !== "CANCELLED") {
      for (const item of order.items) {
        const inv = await tx.inventory.findFirst({
          where: item.variantId ? { variantId: item.variantId } : { productId: item.productId },
        });

        if (inv) {
          const prevQty = inv.quantity;
          const newQty = prevQty + item.quantity;

          await tx.inventory.update({
            where: { id: inv.id },
            data: { quantity: newQty },
          });

          await tx.inventoryTransaction.create({
            data: {
              inventoryId: inv.id,
              type: "RETURN",
              quantity: item.quantity,
              previousQuantity: prevQty,
              newQuantity: newQty,
              reason: `Order cancelled #${order.orderNumber}`,
              referenceId: order.id,
              createdById: adminUserId,
            },
          });
        }
      }
    }

    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        ...(newStatus === "DELIVERED" && order.paymentMethod === "COD"
          ? { paymentStatus: "PAID" }
          : {}),
      },
    });

    // Notify Customer of Status Update
    await tx.notification.create({
      data: {
        userId: order.userId,
        type: "ORDER_STATUS_CHANGED",
        title: `Order Status: ${newStatus}`,
        message: `Your order #${order.orderNumber} is now marked as ${newStatus.replace(/_/g, " ")}.`,
      },
    });

    return updated;
  });
}

export async function getOrders(params?: {
  status?: OrderStatus;
  userId?: string;
  limit?: number;
  offset?: number;
}) {
  const { status, userId, limit = 50, offset = 0 } = params || {};

  return await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(userId ? { userId } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
      items: true,
      deliverySlot: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}
