"use client";
import { Suspense } from "react";
import OrderLens from "@/app/(employee)/employee/components/OrderLens";
import { sendLensOrderApiWrapper } from "@/app/(employee)/employee/components/SendLensOrderApiWrapper";

export default function OrderLensPage() {
  return (
    <Suspense fallback={<p className="text-center py-4">در حال بارگذاری...</p>}>
      <OrderLens pageType="order" sendApi={sendLensOrderApiWrapper} />
    </Suspense>
  );
}
