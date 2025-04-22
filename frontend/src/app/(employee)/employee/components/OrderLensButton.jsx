"use client";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import { deliveryToCustomerApi } from "@/services/customers/customers.service";
import { sendSmsDelivery } from "@/redux/slices/customersSlice";
import DeliveryToCustomerModal from "@/app/(employee)/employee/components/DeliveryToCustomerModal";

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
    case "deliverySent":
      return "bg-green-500";
    case "sending":
    case "deliverySending":
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
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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

  const { orderLensDaily } = useSelector((state) => state.customerSlice);
  const invoiceData = useMemo(() => {
    const invoice = Array.isArray(orderLensDaily)
      ? orderLensDaily.find((item) => item.InvoiceId === invoiceId)
      : null;

    return invoice
      ? {
          totalAmount: invoice.paymentInfo.SumTotalInvoice,
          discount: invoice.paymentInfo.discount,
          remaining: invoice.paymentInfo.billBalance,
          deposit: invoice.paymentInfo.deposit,
          insurance: invoice.paymentInfo.insuranceAmount,
          customerName:
            invoice?.customer?.fullName ||
            invoice?.customerFullName ||
            "نامشخص",
          customerPhone:
            invoice?.customer?.phoneNumber || invoice?.customerPhone || "",
        }
      : {};
  }, [orderLensDaily, invoiceId]);
  console.log(invoiceData);
  const handleSend = async () => {
    try {
      setStatus("sending");
      onStatusChange("sending");

      const resultAction = await dispatch(
        sendSmsDelivery({ invoiceId, userId: user.id }),
      );

      if (sendSmsDelivery.fulfilled.match(resultAction)) {
        toast.success("پیامک با موفقیت ارسال شد");
        setStatus("sent");
        onStatusChange("sent");
      } else {
        throw new Error("خطا در ارسال پیامک");
      }
    } catch (error) {
      console.error("🔴 ارسال ناموفق:", error);
      setStatus(undefined);
      onStatusChange(undefined);
    }
  };

  const handleDeliveryConfirm = async () => {
    try {
      setStatus("deliverySending");
      const response = await deliveryToCustomerApi({
        invoiceId,
        userId: user.id,
      });
      if (response.statusCode === 200) {
        toast.success(response.message);
        setStatus("deliverySent");
        onStatusChange("deliverySent");
      } else {
        throw new Error(response.message || "خطا در ارسال");
      }
    } catch (error) {
      console.error("🔴 ارسال ناموفق:", error);
      setStatus(undefined);
      onStatusChange(undefined);
    } finally {
      setModalOpen(false);
    }
  };

  if (pageType === "sendSmsDelivery") {
    const isDeliveryAllowed = lensOrderStatus === "sendOrderSms";
    const isDeliveryButtonDisabled =
      !isDeliveryAllowed ||
      status === "deliverySent" ||
      status === "deliverySending";

    return (
      <>
        <div className="flex flex-col gap-2 gap-y-10">
          <button
            onClick={handleSend}
            disabled={isDisabled}
            className={`text-white py-1 px-4 rounded ${
              isDisabled ? "bg-gray-400" : getButtonClass(status)
            }`}
          >
            {label}
          </button>
          <button
            onClick={() => {
              if (isDeliveryButtonDisabled) return;
              setModalOpen(true);
            }}
            disabled={isDeliveryButtonDisabled}
            className={`text-white py-1 px-4 rounded ${
              isDeliveryButtonDisabled ? "bg-gray-400" : getButtonClass(status)
            }`}
          >
            {status === "deliverySending"
              ? "در حال تحویل..."
              : status === "deliverySent"
                ? "تحویل ثبت شد"
                : "تحویل به مشتری"}
          </button>
        </div>
        <DeliveryToCustomerModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDeliveryConfirm}
          invoiceData={invoiceData}
        />
      </>
    );
  }

  return (
    <button
      onClick={handleSend}
      disabled={isDisabled}
      className={`text-white py-1 px-4 rounded ${
        isDisabled ? "bg-gray-400" : getButtonClass(status)
      }`}
    >
      {label}
    </button>
  );
}
