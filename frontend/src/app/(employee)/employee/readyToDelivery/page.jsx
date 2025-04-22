"use client";
import { Suspense } from "react";
import OrderLens from "@/app/(employee)/employee/components/OrderLens";
import { sendSmsDeliveryApiWrapper } from "@/app/(employee)/employee/components/SendLensOrderApiWrapper";

export default function ReadyToDelivery() {
  return (
    <Suspense fallback={<p className="text-center py-4">در حال بارگذاری...</p>}>
      <OrderLens
        pageType="sendSmsDelivery"
        sendApi={sendSmsDeliveryApiWrapper}
      />
    </Suspense>
  );
}
