import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { apiSuccess, apiError } from "@/lib/server/apiResponse";
import { OfferType, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";

    const offers = await prisma.offer.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        product: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { startsAt: "desc" },
    });

    return apiSuccess(
      offers.map((o) => ({
        ...o,
        value: o.value ? Number(o.value) : null,
      }))
    );
  } catch (error: unknown) {
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to fetch offers", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.type || !body.expiresAt) {
      return apiError("VALIDATION_ERROR", "Missing required offer fields: title, type, expiresAt.");
    }

    const offer = await prisma.offer.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type as OfferType,
        value: body.value !== undefined ? new Prisma.Decimal(body.value) : null,
        badge: body.badge,
        productId: body.productId || null,
        categoryId: body.categoryId || null,
        startsAt: body.startsAt ? new Date(body.startsAt) : new Date(),
        expiresAt: new Date(body.expiresAt),
        isActive: body.isActive ?? true,
      },
    });

    return apiSuccess(offer, 201);
  } catch (error: unknown) {
    return apiError("INTERNAL_SERVER_ERROR", (error as Error).message || "Failed to create offer", 500);
  }
}
