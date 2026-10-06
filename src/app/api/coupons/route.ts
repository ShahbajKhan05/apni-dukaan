import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { apiSuccess, apiError, AppError } from "@/lib/server/apiResponse";
import { CouponType, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";

    const coupons = await prisma.coupon.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(
      coupons.map((c) => ({
        ...c,
        value: Number(c.value),
        minimumOrder: Number(c.minimumOrder),
        maximumDiscount: c.maximumDiscount ? Number(c.maximumDiscount) : null,
      }))
    );
  } catch (error: unknown) {
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch coupons", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.code || !body.type || body.value === undefined || !body.expiresAt) {
      return apiError(
        "VALIDATION_ERROR",
        "Missing required coupon fields: code, type, value, expiresAt."
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.trim().toUpperCase(),
        type: body.type as CouponType,
        value: new Prisma.Decimal(body.value),
        minimumOrder: new Prisma.Decimal(body.minimumOrder ?? 0),
        maximumDiscount: body.maximumDiscount ? new Prisma.Decimal(body.maximumDiscount) : null,
        usageLimit: body.usageLimit ? parseInt(body.usageLimit) : null,
        startsAt: body.startsAt ? new Date(body.startsAt) : new Date(),
        expiresAt: new Date(body.expiresAt),
        isActive: body.isActive ?? true,
      },
    });

    return apiSuccess(coupon, 201);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return apiError(error.code, error.message, error.statusCode, error.details);
    }
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to create coupon", 500);
  }
}
