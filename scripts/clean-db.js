const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Safely removing all demo/seed business data from Supabase PostgreSQL...');

  // Reverse relational dependency cleanup
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deliverySlot.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeSettings.deleteMany();

  // Create clean blank/unconfigured store settings without fake contact info
  await prisma.storeSettings.create({
    data: {
      id: 'default',
      storeName: '',
      tagline: '',
      storePhone: '',
      storeEmail: '',
      storeAddress: '',
      city: '',
      pincode: '',
      openingTime: '',
      closingTime: '',
      isOpen: false, // Not randomly assumed open
      deliveryRadius: new Prisma.Decimal(0),
      deliveryFee: new Prisma.Decimal(0),
      freeDeliveryThreshold: new Prisma.Decimal(0),
      estimatedDeliveryMin: 0,
      estimatedDeliveryMax: 0,
      upiId: '',
      acceptOnlinePayment: false,
      acceptCod: false,
      gstNumber: '',
      kiranaLicenseNo: '',
    },
  });

  console.log('✅ All demo business data successfully removed from database.');
  console.log('✨ Database is now in a 100% clean NEW STORE state.');
}

main()
  .catch((e) => {
    console.error('Cleanup error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
