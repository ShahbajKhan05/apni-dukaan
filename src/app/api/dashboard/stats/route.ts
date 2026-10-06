import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { apiSuccess, apiError } from "@/lib/server/apiResponse";

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch aggregate metrics concurrently from PostgreSQL
    const [
      totalOrders,
      orders,
      totalProducts,
      totalCategories,
      totalCustomers,
      inventoryItems,
      recentOrders,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),

      // Orders for revenue calculation
      prisma.order.findMany({
        where: { status: { not: "CANCELLED" } },
        select: { total: true, status: true, createdAt: true },
      }),

      // Active products
      prisma.product.count({ where: { isActive: true } }),

      // Active categories
      prisma.category.count({ where: { isActive: true } }),

      // Total registered customers
      prisma.user.count({ where: { role: "CUSTOMER" } }),

      // Inventory records for stock health
      prisma.inventory.findMany({
        select: { quantity: true, lowStockThreshold: true },
      }),

      // 5 most recent orders for live dashboard queue
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, phone: true } },
          items: true,
        },
      }),
    ]);

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

    // Active (pending/in-transit) orders
    const activeOrderStatuses = ["NEW", "ACCEPTED", "PREPARING", "PACKED", "OUT_FOR_DELIVERY"];
    const activeOrders = orders.filter((o) => activeOrderStatuses.includes(o.status)).length;

    // Stock analytics
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalStockUnits = 0;

    for (const item of inventoryItems) {
      totalStockUnits += item.quantity;
      if (item.quantity <= 0) {
        outOfStockCount++;
      } else if (item.quantity <= item.lowStockThreshold) {
        lowStockCount++;
      }
    }

    // Top selling items from OrderItem aggregates
    const topOrderItems = await prisma.orderItem.groupBy({
      by: ["productNameSnapshot"],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const topSellingProducts = topOrderItems.map((item) => ({
      name: item.productNameSnapshot,
      unitsSold: item._sum.quantity ?? 0,
      totalSales: Number(item._sum.subtotal ?? 0),
    }));

    return apiSuccess({
      metrics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        activeOrders,
        totalProducts,
        totalCategories,
        totalCustomers,
        totalStockUnits,
        lowStockCount,
        outOfStockCount,
      },
      recentOrders: recentOrders.map((o) => ({
        orderId: o.orderNumber,
        customerName: (o.deliveryAddressSnapshot as any)?.name || o.user.name,
        customerPhone: (o.deliveryAddressSnapshot as any)?.phone || o.user.phone,
        total: Number(o.total),
        status: o.status,
        itemCount: o.items.length,
        createdAt: o.createdAt,
      })),
      topSellingProducts,
    });
  } catch (error: unknown) {
    return apiError(
      "INTERNAL_SERVER_ERROR",
      (error as Error).message || "Failed to fetch live dashboard statistics",
      500
    );
  }
}
