import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SKU_PREFIX = "DEMO_APNIDUKAAN_";
const DEMO_TAG = "[DEMO_APNIDUKAAN]";

async function main() {
  console.log("🧹 Starting Clean-Up of All ApniDukaan Demo Records...");

  // 1. Delete Demo Offers
  const delOffers = await prisma.offer.deleteMany({
    where: { description: { contains: DEMO_TAG } },
  });
  console.log(`- Deleted ${delOffers.count} demo offers`);

  // 2. Find Demo Products to remove inventory & products
  const demoProducts = await prisma.product.findMany({
    where: { sku: { startsWith: SKU_PREFIX } },
    select: { id: true },
  });
  const demoProdIds = demoProducts.map((p) => p.id);

  if (demoProdIds.length > 0) {
    // Inventory and transactions will cascade or can be deleted
    const delInvTrans = await prisma.inventoryTransaction.deleteMany({
      where: { inventory: { productId: { in: demoProdIds } } },
    });
    console.log(`- Deleted ${delInvTrans.count} demo inventory transactions`);

    const delInv = await prisma.inventory.deleteMany({
      where: { productId: { in: demoProdIds } },
    });
    console.log(`- Deleted ${delInv.count} demo inventory items`);

    const delProds = await prisma.product.deleteMany({
      where: { id: { in: demoProdIds } },
    });
    console.log(`- Deleted ${delProds.count} demo products`);
  }

  // 3. Delete Demo Categories (that have no remaining products)
  const demoCategories = await prisma.category.findMany({
    where: { description: { contains: DEMO_TAG }, products: { none: {} } },
    select: { id: true },
  });

  if (demoCategories.length > 0) {
    const delCats = await prisma.category.deleteMany({
      where: { id: { in: demoCategories.map((c) => c.id) } },
    });
    console.log(`- Deleted ${delCats.count} demo categories`);
  }

  console.log("✅ Demo clean-up complete! Database is back to clean state.");
}

main()
  .catch((e) => {
    console.error("Clean-up error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
