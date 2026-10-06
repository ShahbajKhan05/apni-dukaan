import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initializing clean ApniDukaan store configuration...");

  // Ensure default store settings exist in clean state
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "",
      tagline: "",
      storePhone: "",
      storeEmail: "",
      storeAddress: "",
      city: "",
      pincode: "",
      openingTime: "",
      closingTime: "",
      isOpen: false,
      deliveryRadius: new Prisma.Decimal(0),
      deliveryFee: new Prisma.Decimal(0),
      freeDeliveryThreshold: new Prisma.Decimal(0),
      estimatedDeliveryMin: 0,
      estimatedDeliveryMax: 0,
      upiId: "",
      acceptOnlinePayment: false,
      acceptCod: false,
      gstNumber: "",
      kiranaLicenseNo: "",
    },
  });

  console.log("✅ Clean store settings ready. No sample/fake business data created.");
}

main()
  .catch((e) => {
    console.error("❌ Seed initialization failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
