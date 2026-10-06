import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { apiSuccess, apiError } from "@/lib/server/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || undefined;
    const search = searchParams.get("search") || undefined;

    const users = await prisma.user.findMany({
      where: {
        ...(role ? { role: role as any } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
            status: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const customers = users.map((user) => {
      const totalSpent = user.orders
        .filter((o) => o.status !== "CANCELLED")
        .reduce((sum, o) => sum + Number(o.total), 0);

      const lastOrder = user.orders[0];

      return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email ?? "",
        role: user.role,
        isActive: user.isActive,
        address: user.addresses[0]
          ? `${user.addresses[0].addressLine}, ${user.addresses[0].city}`
          : "No address saved",
        totalOrders: user.orders.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        lastOrderDate: lastOrder ? lastOrder.createdAt.toISOString() : null,
        joinedDate: user.createdAt.toISOString(),
      };
    });

    return apiSuccess(customers);
  } catch (error: unknown) {
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch customers", 500);
  }
}
