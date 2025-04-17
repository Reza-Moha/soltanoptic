"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OrderSendButton({
  invoiceId,
  lensOrderStatus,
  pageType = "order", // "order" | "workshop"
  initialStatus = undefined,
  onStatusChange = () => {},
  sendApi,
}) {
  const [status, setStatus] = useState(initialStatus);

  const handleSend = async () => {
    try {
      setStatus("sending");
      onStatusChange("sending");

      const response = await sendApi({ invoiceId });

      if (response.statusCode === 200) {
        toast.success(response.message);
        setStatus("sent");
        onStatusChange("sent");
      } else {
        throw new Error(response.message || "خطا در ارسال");
      }
    } catch (err) {
      console.error(err);
      setStatus(undefined);
      onStatusChange(undefined);
    }
  };

  // تنظیم متن و فعال بودن دکمه بر اساس صفحه و وضعیت
  let label = "";
  let isDisabled = true;

  if (pageType === "order") {
    if (lensOrderStatus === "registered") {
      label = "آماده سفارش";
      isDisabled = false;
    } else if (lensOrderStatus === "orderLenses") {
      label = "سفارش داده شده";
    } else if (lensOrderStatus === "workShopSection") {
      label = "قسمت کارگاه";
    } else if (lensOrderStatus === "readyToDeliver") {
      label = "آماده تحویل";
    } else if (lensOrderStatus === "delivered") {
      label = "تحویل داده شده";
    }
  } else if (pageType === "workshop") {
    if (lensOrderStatus === "registered") {
      label = "نیاز به سفارش عدسی";
    } else if (lensOrderStatus === "orderLenses") {
      label = "تحویل به کارگاه";
      isDisabled = false;
    } else if (lensOrderStatus === "workShopSection") {
      label = "قسمت کارگاه";
    } else if (lensOrderStatus === "readyToDeliver") {
      label = "آماده تحویل";
    } else if (lensOrderStatus === "delivered") {
      label = "تحویل داده شده";
    }
  }

  if (status === "sending") label = "در حال ارسال ...";
  if (status === "sent") label = "انجام شد";

  const buttonClass = isDisabled
    ? "bg-gray-400"
    : status === "sent"
      ? "bg-green-500"
      : status === "sending"
        ? "bg-yellow-500"
        : "bg-blue-500";

  return (
    <button
      onClick={handleSend}
      disabled={isDisabled}
      className={`${buttonClass} text-white py-1 px-4 rounded`}
    >
      {label}
    </button>
  );
}
