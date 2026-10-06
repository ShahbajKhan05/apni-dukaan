const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const models = [
    { name: 'Product', count: await prisma.product.count() },
    { name: 'Category', count: await prisma.category.count() },
    { name: 'ProductVariant', count: await prisma.productVariant.count() },
    { name: 'Inventory', count: await prisma.inventory.count() },
    { name: 'InventoryTransaction', count: await prisma.inventoryTransaction.count() },
    { name: 'Order', count: await prisma.order.count() },
    { name: 'OrderItem', count: await prisma.orderItem.count() },
    { name: 'User', count: await prisma.user.count() },
    { name: 'Address', count: await prisma.address.count() },
    { name: 'Coupon', count: await prisma.coupon.count() },
    { name: 'CouponUsage', count: await prisma.couponUsage.count() },
    { name: 'Offer', count: await prisma.offer.count() },
    { name: 'Cart', count: await prisma.cart.count() },
    { name: 'CartItem', count: await prisma.cartItem.count() },
    { name: 'Wishlist', count: await prisma.wishlist.count() },
    { name: 'WishlistItem', count: await prisma.wishlistItem.count() },
    { name: 'Notification', count: await prisma.notification.count() },
    { name: 'DeliverySlot', count: await prisma.deliverySlot.count() },
    { name: 'StoreSettings', count: await prisma.storeSettings.count() },
  ];

  console.log('Database tables successfully verified via Prisma:');
  for (const m of models) {
    console.log(` - ${m.name}: ${m.count} rows`);
  }
}

main()
  .catch((err) => {
    console.error('Verification error:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
