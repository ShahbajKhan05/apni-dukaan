import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

export interface UpdateStoreSettingsInput {
  storeName?: string;
  tagline?: string;
  storePhone?: string;
  storeEmail?: string;
  storeAddress?: string;
  city?: string;
  pincode?: string;
  openingTime?: string;
  closingTime?: string;
  isOpen?: boolean;
  deliveryRadius?: number;
  deliveryFee?: number;
  freeDeliveryThreshold?: number;
  estimatedDeliveryMin?: number;
  estimatedDeliveryMax?: number;
  upiId?: string;
  acceptOnlinePayment?: boolean;
  acceptCod?: boolean;
  gstNumber?: string;
  kiranaLicenseNo?: string;
}

export async function getStoreSettings() {
  let settings = await prisma.storeSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: {
        id: "default",
        storeName: "ApniDukaan Kirana",
        tagline: "Aapki Apni Kirana Dukaan",
        storePhone: "+91 98765 43210",
        storeEmail: "care@apnidukaan.in",
        storeAddress: "Shop No. 12, Main Market, Civil Lines",
        city: "Rewa",
        pincode: "486001",
        openingTime: "07:00 AM",
        closingTime: "10:00 PM",
        isOpen: true,
        deliveryRadius: new Prisma.Decimal(5.0),
        deliveryFee: new Prisma.Decimal(25.0),
        freeDeliveryThreshold: new Prisma.Decimal(199.0),
        estimatedDeliveryMin: 15,
        estimatedDeliveryMax: 30,
        upiId: "apnidukaan@okhdfcbank",
        acceptOnlinePayment: true,
        acceptCod: true,
      },
    });
  }

  return {
    ...settings,
    deliveryRadius: Number(settings.deliveryRadius),
    deliveryFee: Number(settings.deliveryFee),
    freeDeliveryThreshold: Number(settings.freeDeliveryThreshold),
  };
}

export async function updateStoreSettings(input: UpdateStoreSettingsInput) {
  // Ensure default record exists
  await getStoreSettings();

  const data: Prisma.StoreSettingsUpdateInput = {
    ...(input.storeName !== undefined ? { storeName: input.storeName } : {}),
    ...(input.tagline !== undefined ? { tagline: input.tagline } : {}),
    ...(input.storePhone !== undefined ? { storePhone: input.storePhone } : {}),
    ...(input.storeEmail !== undefined ? { storeEmail: input.storeEmail } : {}),
    ...(input.storeAddress !== undefined ? { storeAddress: input.storeAddress } : {}),
    ...(input.city !== undefined ? { city: input.city } : {}),
    ...(input.pincode !== undefined ? { pincode: input.pincode } : {}),
    ...(input.openingTime !== undefined ? { openingTime: input.openingTime } : {}),
    ...(input.closingTime !== undefined ? { closingTime: input.closingTime } : {}),
    ...(input.isOpen !== undefined ? { isOpen: input.isOpen } : {}),
    ...(input.deliveryRadius !== undefined
      ? { deliveryRadius: new Prisma.Decimal(input.deliveryRadius) }
      : {}),
    ...(input.deliveryFee !== undefined
      ? { deliveryFee: new Prisma.Decimal(input.deliveryFee) }
      : {}),
    ...(input.freeDeliveryThreshold !== undefined
      ? { freeDeliveryThreshold: new Prisma.Decimal(input.freeDeliveryThreshold) }
      : {}),
    ...(input.estimatedDeliveryMin !== undefined
      ? { estimatedDeliveryMin: input.estimatedDeliveryMin }
      : {}),
    ...(input.estimatedDeliveryMax !== undefined
      ? { estimatedDeliveryMax: input.estimatedDeliveryMax }
      : {}),
    ...(input.upiId !== undefined ? { upiId: input.upiId } : {}),
    ...(input.acceptOnlinePayment !== undefined
      ? { acceptOnlinePayment: input.acceptOnlinePayment }
      : {}),
    ...(input.acceptCod !== undefined ? { acceptCod: input.acceptCod } : {}),
    ...(input.gstNumber !== undefined ? { gstNumber: input.gstNumber } : {}),
    ...(input.kiranaLicenseNo !== undefined
      ? { kiranaLicenseNo: input.kiranaLicenseNo }
      : {}),
  };

  const updated = await prisma.storeSettings.update({
    where: { id: "default" },
    data,
  });

  return {
    ...updated,
    deliveryRadius: Number(updated.deliveryRadius),
    deliveryFee: Number(updated.deliveryFee),
    freeDeliveryThreshold: Number(updated.freeDeliveryThreshold),
  };
}

export async function getDeliverySlots() {
  return await prisma.deliverySlot.findMany({
    orderBy: { startTime: "asc" },
  });
}
