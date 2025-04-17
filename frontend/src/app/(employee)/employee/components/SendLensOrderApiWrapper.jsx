"use client";
import {
  sendLensOrderApi,
  sendToWorkshopApi,
} from "@/services/customers/customers.service";

export async function sendLensOrderApiWrapper({ invoiceId }) {
  return await sendLensOrderApi({ invoiceId });
}

export async function sendToWorkshopApiWrapper({ invoiceId }) {
  return await sendToWorkshopApi({ invoiceId });
}
