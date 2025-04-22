"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllInvoicesPaginated } from "@/redux/slices/customersSlice";
import Pagination from "@/components/Ui/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";

export default function OrderTracking() {
  const dispatch = useDispatch();
  const { allInvoices, totalPages, invoicesLoading } = useSelector(
    (state) => state.customerSlice,
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchInvoices = (page, search) => {
    dispatch(getAllInvoicesPaginated({ page, search, size: 30 }));
  };

  const debouncedSearch = debounce((value) => {
    fetchInvoices(1, value);
    setPage(1);
  }, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchInvoices(newPage, search);
  };

  useEffect(() => {
    fetchInvoices(page, search);
  }, []);

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const steps = [
    { key: "registered", label: "ثبت شده", timeField: "createdAt", icon: "📝" },
    {
      key: "orderLenses",
      label: "سفارش عدسی",
      timeField: "lensOrderAt",
      icon: "🛒",
    },
    {
      key: "workShopSection",
      label: "بخش فنی",
      timeField: "workShopSectionAt",
      orderByUserField: "workShopSectionByUse",
      icon: "🛠",
    },
    {
      key: "readyToDeliver",
      label: "آماده تحویل",
      timeField: "readyToDeliverAt",
      orderByUserField: "readyToDeliverByUser",
      icon: "📦",
    },
    {
      key: "sendOrderSms",
      label: "ارسال پیامک",
      timeField: "sendOrderSmsAt",
      orderByUserField: "sendOrderSmsByUser",
      icon: "📲",
    },
    {
      key: "delivered",
      label: "تحویل شده",
      timeField: "deliveredAt",
      orderByUserField: "deliveredByUser",
      icon: "✅",
    },
  ];

  return (
    <div className="md:p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-emerald-700">
        لیست قبض‌ها
      </h2>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="جستجو در قبض‌ها..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-100 text-right text-emerald-800">
            <tr>
              <th className="px-4 py-3">شماره قبض</th>
              <th className="px-4 py-3">نام مشتری</th>
              <th className="px-4 py-3">عدسی</th>
              <th className="px-4 py-3">فریم</th>
              <th className="px-4 py-3">مبلغ</th>
              <th className="px-4 py-3">تاریخ ثبت</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {invoicesLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-sky-500">
                    در حال دریافت اطلاعات...
                  </td>
                </tr>
              ) : (
                allInvoices.map((invoice) => (
                  <React.Fragment key={invoice.InvoiceId}>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`text-right border-b hover:bg-emerald-50 cursor-pointer ${
                        expandedRow === invoice.InvoiceId ? "bg-emerald-50" : ""
                      }`}
                      onClick={() => toggleRow(invoice.InvoiceId)}
                    >
                      <td className="px-4 py-4">{invoice.invoiceNumber}</td>
                      <td className="px-4 py-4">
                        {invoice.customer?.fullName}
                      </td>
                      <td className="px-4 py-4">
                        {invoice.prescriptions?.[0]?.lens?.lensName || "ندارد"}
                      </td>
                      <td className="px-4 py-4">
                        {invoice.prescriptions?.[0]?.frame?.name || "ندارد"}
                      </td>
                      <td className="px-4 py-4">
                        {invoice.SumTotalInvoice.toLocaleString()} تومان
                      </td>
                      <td className="px-4 py-4">
                        {new Date(invoice.createdAt).toLocaleDateString(
                          "fa-IR",
                        )}
                      </td>
                    </motion.tr>

                    {expandedRow === invoice.InvoiceId && (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={6} className="bg-gray-50 p-4">
                          {/* مراحل خرید */}
                          <section className="bg-emerald-50 border border-emerald-200 rounded-md p-4 shadow-sm mb-6">
                            <h3 className="text-lg font-bold text-emerald-700 mb-4">
                              🧭 مراحل خرید
                            </h3>

                            <ol className="grid grid-cols-1 sm:grid-cols-6 text-sm text-gray-500 border border-gray-100 divide-y sm:divide-y-0 sm:divide-x overflow-hidden rounded-lg">
                              {steps.map((step, index) => {
                                const isActive =
                                  invoice.lensOrderStatus === step.key;
                                const isPassed =
                                  steps.findIndex(
                                    (s) => s.key === invoice.lensOrderStatus,
                                  ) > index;

                                const tracking =
                                  invoice.prescriptions?.[0]?.lens
                                    ?.lensOrderStatusTracking;
                                const stepTime = step.timeField
                                  ? tracking?.[step.timeField]
                                  : null;

                                const doneByUser =
                                  step.orderByUserField &&
                                  (typeof tracking?.[step.orderByUserField] ===
                                  "string"
                                    ? tracking?.[step.orderByUserField]
                                    : tracking?.[step.orderByUserField]
                                        ?.fullName);

                                return (
                                  <li
                                    key={step.key}
                                    className={`relative flex items-center justify-center gap-2 p-4 transition-all duration-300 ${
                                      isActive
                                        ? "bg-white text-emerald-600 font-semibold"
                                        : isPassed
                                          ? "bg-white text-emerald-400"
                                          : "bg-gray-50 text-gray-400"
                                    }`}
                                  >
                                    {index !== 0 && (
                                      <span className="absolute top-1/2 -left-2 hidden size-4 -translate-y-1/2 rotate-45 border border-gray-300 sm:flex items-center justify-center shadow bg-gray-200 !z-50">
                                        {isPassed && (
                                          <span className="rotate-[-45deg] text-emerald-500 text-xs font-bold">
                                            ✓
                                          </span>
                                        )}
                                      </span>
                                    )}

                                    {isActive ? (
                                      <span className="relative flex size-7 shrink-0">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"></span>
                                        <span className="relative inline-flex size-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm shadow-md ring ring-emerald-300">
                                          {step.icon}
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="text-lg">
                                        {step.icon}
                                      </span>
                                    )}

                                    <p className="leading-tight text-center">
                                      <strong className="block font-medium">
                                        {step.label}
                                      </strong>
                                      <small className="text-[12px] block mt-0.5 text-slate-700">
                                        {stepTime
                                          ? new Date(
                                              stepTime,
                                            ).toLocaleDateString("fa-IR", {
                                              year: "numeric",
                                              month: "2-digit",
                                              day: "2-digit",
                                            })
                                          : "در انتظار..."}
                                      </small>
                                      {doneByUser && (
                                        <small className="text-[12px] text-slate-800 block">
                                          توسط: {doneByUser}
                                        </small>
                                      )}
                                    </p>
                                  </li>
                                );
                              })}
                            </ol>
                          </section>

                          {/* اطلاعات کامل قبض */}
                          <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>شماره قبض:</strong>{" "}
                                {invoice.invoiceNumber}
                              </div>
                              <div>
                                <strong>مبلغ:</strong>{" "}
                                {invoice.SumTotalInvoice?.toLocaleString()}{" "}
                                تومان
                              </div>
                              <div>
                                <strong>نام مشتری:</strong>{" "}
                                {invoice.customer?.fullName || "----"}
                              </div>
                              <div>
                                <strong>موبایل مشتری:</strong>{" "}
                                {invoice.customer?.phoneNumber || "----"}
                              </div>
                              <div>
                                <strong>نام کارمند:</strong>{" "}
                                {invoice.employee?.fullName || "----"}
                              </div>
                              <div>
                                <strong>نام عدسی:</strong>{" "}
                                {invoice.prescriptions?.[0]?.lens?.lensName ||
                                  "ندارد"}
                              </div>
                              <div>
                                <strong>نام فریم:</strong>{" "}
                                {invoice.prescriptions?.[0]?.frame?.name ||
                                  "ندارد"}
                              </div>
                              <div>
                                <strong>وضعیت عدسی:</strong>{" "}
                                {invoice.lensOrderStatus
                                  ? invoice.lensOrderStatus
                                  : "----"}
                              </div>
                              <div>
                                <strong>شرکت بیمه:</strong>{" "}
                                {invoice.insurance?.insuranceName || "----"}
                              </div>
                              <div>
                                <strong>تاریخ ثبت:</strong>{" "}
                                {new Date(invoice.createdAt).toLocaleDateString(
                                  "fa-IR",
                                )}
                              </div>
                            </div>

                            {invoice.paymentInfo && (
                              <div className="border-t border-gray-100 pt-4">
                                <h4 className="font-bold text-emerald-700 mb-2">
                                  اطلاعات پرداخت
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <strong>روش پرداخت:</strong>{" "}
                                    {invoice.paymentInfo.paymentMethod ||
                                      "----"}
                                  </div>
                                  <div>
                                    <strong>تاریخ پرداخت:</strong>{" "}
                                    {new Date(
                                      invoice.paymentInfo.PaymentDate,
                                    ).toLocaleDateString("fa-IR")}
                                  </div>
                                  <div>
                                    <strong>بیعانه:</strong>{" "}
                                    {invoice.paymentInfo.deposit?.toLocaleString()}{" "}
                                    تومان
                                  </div>
                                  <div>
                                    <strong>باقی مانده:</strong>{" "}
                                    {invoice.paymentInfo.billBalance?.toLocaleString()}{" "}
                                    تومان
                                  </div>
                                </div>
                              </div>
                            )}
                          </section>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
