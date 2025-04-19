"use client";
import {
  sendLensOrderApi,
  sendSmsDeliveryApi,
  sendToDeliverApi,
  sendToWorkshopApi,
} from "@/services/customers/customers.service";

export async function sendLensOrderApiWrapper({ invoiceId, userId }) {
  return await sendLensOrderApi({ invoiceId, userId });
}

export async function sendToWorkshopApiWrapper({ invoiceId, userId }) {
  return await sendToWorkshopApi({ invoiceId, userId });
}
export async function sendToDeliverApiWrapper({ invoiceId, userId }) {
  return await sendToDeliverApi({ invoiceId, userId });
}
export async function sendSmsDeliveryApiWrapper({ invoiceId, userId }) {
  return await sendSmsDeliveryApi({ invoiceId, userId });
}
