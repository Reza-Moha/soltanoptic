"use client";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const statusLabels = {
  order: {
    registered: { label: "آماده سفارش", isDisabled: false },
    orderLenses: { label: "سفارش داده شده", isDisabled: true },
    workShopSection: { label: "قسمت کارگاه", isDisabled: true },
    readyToDeliver: { label: "آماده تحویل", isDisabled: true },
    sendOrderSms: { label: "پیامک آماده تحویل ارسال شده", isDisabled: true },
    delivered: { label: "تحویل داده شده", isDisabled: true },
  },
  workshop: {
    registered: { label: "نیاز به سفارش عدسی", isDisabled: true },
    orderLenses: { label: "تحویل به کارگاه", isDisabled: false },
    workShopSection: { label: "قسمت کارگاه", isDisabled: true },
    readyToDeliver: { label: "آماده تحویل", isDisabled: true },
    sendOrderSms: { label: "پیامک آماده تحویل ارسال شده", isDisabled: true },
    delivered: { label: "تحویل داده شده", isDisabled: true },
  },
  readyToDeliver: {
    registered: { label: "نیاز به سفارش عدسی", isDisabled: true },
    orderLenses: { label: "تحویل به کارگاه", isDisabled: true },
    workShopSection: { label: "تحویل بسته بندی", isDisabled: false },
    readyToDeliver: { label: "آماده تحویل", isDisabled: true },
    sendOrderSms: { label: "پیامک آماده تحویل ارسال شده", isDisabled: true },
    delivered: { label: "تحویل داده شده", isDisabled: true },
  },
  sendSmsDelivery: {
    registered: { label: "نیاز به سفارش عدسی", isDisabled: true },
    orderLenses: { label: "تحویل به کارگاه", isDisabled: true },
    workShopSection: { label: "تحویل بسته بندی", isDisabled: true },
    readyToDeliver: { label: "ارسال پیامک آماده شد", isDisabled: false },
    sendOrderSms: { label: "پیامک آماده تحویل ارسال شده", isDisabled: true },
    delivered: { label: "تحویل داده شده", isDisabled: true },
  },
};

const getButtonClass = (status) => {
  switch (status) {
    case "sent":
      return "bg-green-500";
    case "sending":
      return "bg-yellow-500";
    default:
      return "bg-blue-500";
  }
};

export default function OrderSendButton({
  invoiceId,
  lensOrderStatus,
  pageType = "order",
  initialStatus,
  onStatusChange = () => {},
  sendApi,
}) {
  const [status, setStatus] = useState(initialStatus);
  const { user } = useSelector((state) => state.auth);

  const { label, isDisabled } = useMemo(() => {
    const base = statusLabels[pageType]?.[lensOrderStatus] || {
      label: "",
      isDisabled: true,
    };

    if (status === "sending")
      return { label: "در حال ارسال ...", isDisabled: true };
    if (status === "sent") return { label: "انجام شد", isDisabled: true };

    return base;
  }, [pageType, lensOrderStatus, status]);

  const handleSend = async () => {
    try {
      setStatus("sending");
      onStatusChange("sending");

      const response = await sendApi({ invoiceId, userId: user.id });

      if (response.statusCode === 200) {
        toast.success(response.message);
        setStatus("sent");
        onStatusChange("sent");
      } else {
        throw new Error(response.message || "خطا در ارسال");
      }
    } catch (error) {
      console.error("🔴 ارسال ناموفق:", error);
      setStatus(undefined);
      onStatusChange(undefined);
    }
  };

  return (
    <button
      onClick={handleSend}
      disabled={isDisabled}
      className={`text-white py-1 px-4 rounded ${isDisabled ? "bg-gray-400" : getButtonClass(status)}`}
    >
      {label}
    </button>
  );
}
