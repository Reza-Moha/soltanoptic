"use client";
import { Suspense } from "react";
import OrderLens from "@/app/(employee)/employee/components/OrderLens";
import { sendToWorkshopApiWrapper } from "@/app/(employee)/employee/components/SendLensOrderApiWrapper";

export default function WorkShopDelivery() {
  return (
    <Suspense fallback={<p className="text-center py-4">در حال بارگذاری...</p>}>
      <OrderLens pageType="workshop" sendApi={sendToWorkshopApiWrapper} />
    </Suspense>
  );
}
