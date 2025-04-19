"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllInvoicesPaginated } from "@/redux/slices/customersSlice";
import Pagination from "@/components/Ui/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import TextRevealCard from "@/components/magicui/TextRevealCard";

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
      orderByField: "lensOrderBy",
      icon: "🛒",
    },
    {
      key: "workShopSection",
      label: "بخش فنی",
      timeField: "workShopSectionAt",
      orderByField: "workShopSectionBy",
      icon: "🛠",
    },
    {
      key: "readyToDeliver",
      label: "آماده تحویل",
      timeField: "readyToDeliverAt",
      orderByField: "readyToDeliverBy",
      icon: "📦",
    },
    {
      key: "sendOrderSms",
      label: "ارسال پیامک",
      timeField: "sendOrderSmsAt",
      orderByField: "sendOrderSmsBy",
      icon: "📲",
    },
    {
      key: "delivered",
      label: "تحویل شده",
      timeField: "deliveredAt",
      icon: "✅",
    },
  ];

  return (
    <div className="p-4">
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
                  <td colSpan="6" className="text-center py-6 text-sky-500">
                    در حال دریافت اطلاعات ...
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
                        <td
                          colSpan="6"
                          className="bg-gray-50 p-4 text-sm leading-6 space-y-10"
                        >
                          {/* مراحل خرید */}
                          <section className="bg-emerald-50 border border-emerald-200 rounded-md p-4 shadow-sm">
                            <h3 className="text-lg font-bold text-emerald-700 mb-4">
                              🧭 مراحل خرید
                            </h3>

                            <div>
                              <ol className="grid grid-cols-1 sm:grid-cols-6 text-sm text-gray-500 border border-gray-100 divide-y sm:divide-y-0 sm:divide-x overflow-hidden rounded-lg">
                                {steps.map((step, index) => {
                                  const isActive =
                                    invoice.lensOrderStatus === step.key;
                                  const isPassed =
                                    steps.findIndex(
                                      (s) => s.key === invoice.lensOrderStatus,
                                    ) > index;
                                  const stepTime = invoice[step.timeField];

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
                                      {/* زاویه بین مراحل */}
                                      {index !== 0 && (
                                        <span className="absolute top-1/2 -left-2 hidden size-4 -translate-y-1/2 rotate-45 border border-gray-300 sm:flex items-center justify-center ltr:border-s-0 ltr:border-b-0 ltr:bg-white rtl:border-e-0 rtl:border-t-0 rtl:bg-gray-50 shadow">
                                          {isPassed && (
                                            <span className="rotate-[-45deg] text-emerald-500 text-xs font-bold">
                                              ✓
                                            </span>
                                          )}
                                        </span>
                                      )}
                                      {index !== steps.length - 1 && (
                                        <span className="absolute top-1/2 -right-2 hidden size-4 -translate-y-1/2 rotate-45 border border-gray-100 sm:flex items-center justify-center ltr:border-s-0 ltr:border-b-0 ltr:bg-gray-50 rtl:border-e-0 rtl:border-t-0 rtl:bg-white">
                                          {isPassed && (
                                            <span className="rotate-[-45deg] text-emerald-500 text-xs font-bold">
                                              ✓
                                            </span>
                                          )}
                                        </span>
                                      )}

                                      {/* لوزی با تیک */}
                                      {/*<div className="relative w-5 h-5 rotate-45 flex items-center justify-center">*/}
                                      {/*  <div*/}
                                      {/*    className={`absolute w-full h-full rounded-sm border-2 ${*/}
                                      {/*      isActive || isPassed*/}
                                      {/*        ? "bg-emerald-500 border-emerald-500"*/}
                                      {/*        : "bg-gray-300 border-gray-300"*/}
                                      {/*    }`}*/}
                                      {/*  />*/}
                                      {/*  {(isActive || isPassed) && (*/}
                                      {/*    <span className="rotate-[-45deg] text-white text-[10px] z-10">*/}
                                      {/*      ✓*/}
                                      {/*    </span>*/}
                                      {/*  )}*/}
                                      {/*</div>*/}

                                      {/* آیکون با انیمیشن فقط برای مرحله فعال */}
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

                                      {/* عنوان و زمان */}
                                      <p className="leading-tight text-center">
                                        <strong className="block font-medium">
                                          {step.label}
                                        </strong>
                                        <small className="text-[10px] block mt-0.5">
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
                                        {/* ثبت‌کننده */}
                                        {step.orderByField &&
                                          invoice[step.orderByField] && (
                                            <small className="text-[10px] text-gray-400 block">
                                              توسط: {invoice[step.orderByField]}
                                            </small>
                                          )}
                                      </p>
                                    </li>
                                  );
                                })}
                              </ol>
                            </div>
                          </section>

                          {/* اطلاعات فردی */}
                          <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                            <h3 className="text-md font-semibold text-gray-700 mb-3">
                              👤 اطلاعات مشتری و ثبت
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
                              <div>
                                <strong>مشتری:</strong>{" "}
                                {invoice.customer?.fullName} (
                                {invoice.customer?.gender})
                              </div>
                              <div>
                                <strong>کارمند ثبت‌کننده:</strong>{" "}
                                {invoice.employee?.fullName}
                              </div>
                              <div>
                                <strong>شرکت:</strong>{" "}
                                {invoice.company?.companyName || "ندارد"}
                              </div>
                              <div>
                                <strong>بیمه:</strong>{" "}
                                {invoice.insurance?.insuranceName || "ندارد"}
                              </div>
                              <div>
                                <strong>بانک:</strong>{" "}
                                {invoice.bank?.bankName || "ندارد"}
                              </div>
                            </div>
                          </section>

                          {/* اطلاعات پرداخت */}
                          <section className="bg-emerald-100 border border-emerald-200 rounded-md p-4 shadow-sm">
                            <h3 className="text-md font-semibold text-emerald-900 mb-3">
                              💳 اطلاعات پرداخت
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
                              <div>
                                <strong>روش پرداخت:</strong>{" "}
                                {invoice.paymentInfo?.paymentMethod || "نامشخص"}
                              </div>
                              <div>
                                <strong>مبلغ کل:</strong>{" "}
                                {invoice.SumTotalInvoice?.toLocaleString()}{" "}
                                تومان
                              </div>
                              <div>
                                <strong>مبلغ بیمه:</strong>{" "}
                                {invoice.paymentInfo?.insuranceAmount?.toLocaleString() ||
                                  "۰"}{" "}
                                تومان
                              </div>
                              <div>
                                <strong>تخفیف:</strong>{" "}
                                {invoice.paymentInfo?.discount?.toLocaleString() ||
                                  "۰"}{" "}
                                تومان
                              </div>
                              <div>
                                <strong>واریز:</strong>{" "}
                                {invoice.paymentInfo?.deposit?.toLocaleString() ||
                                  "۰"}{" "}
                                تومان
                              </div>
                              <div>
                                <strong>مانده:</strong>{" "}
                                {invoice.paymentInfo?.billBalance?.toLocaleString() ||
                                  "۰"}{" "}
                                تومان
                              </div>
                            </div>
                          </section>

                          {/* نسخه‌ها */}
                          <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                            <h3 className="text-md font-semibold text-emerald-700 mb-4">
                              📑 نسخه‌ها
                            </h3>
                            <div className="space-y-6">
                              {invoice.prescriptions?.map(
                                (prescription, idx) => (
                                  <div
                                    key={prescription.PrescriptionId}
                                    className="p-4 border border-gray-300 rounded-md bg-gray-50 shadow-inner"
                                  >
                                    <p className="text-emerald-600 font-semibold mb-2">
                                      🔹 نسخه {idx + 1}
                                    </p>
                                    <p>
                                      OD: {prescription.odSph} /{" "}
                                      {prescription.odCyl} / {prescription.odAx}
                                    </p>
                                    <p>
                                      OS: {prescription.osSph} /{" "}
                                      {prescription.osCyl} / {prescription.osAx}
                                    </p>
                                    <p>PD: {prescription.pd}</p>
                                    <p>Label: {prescription.label}</p>
                                    <p>
                                      🎯 رنگ فریم:{" "}
                                      <span
                                        style={{
                                          color: prescription.frameColorCode,
                                        }}
                                      >
                                        {prescription.frameColorCode}
                                      </span>
                                    </p>

                                    {prescription.lens && (
                                      <div className="mt-2 text-sm text-gray-700">
                                        <p>
                                          <strong>👓 عدسی:</strong>{" "}
                                          {prescription.lens.lensName}
                                        </p>
                                        <p>
                                          نوع:{" "}
                                          {prescription.lens.LensType?.title}
                                        </p>
                                        <p>
                                          ضریب شکست:{" "}
                                          {
                                            prescription.lens.RefractiveIndex
                                              ?.index
                                          }
                                        </p>
                                        <p>
                                          دسته:{" "}
                                          {
                                            prescription.lens.LensCategory
                                              ?.lensCategoryName
                                          }
                                        </p>
                                      </div>
                                    )}

                                    {prescription.frame && (
                                      <div className="mt-2 text-sm text-gray-700">
                                        <p>
                                          <strong>🕶 فریم:</strong>{" "}
                                          {prescription.frame.name}
                                        </p>
                                        <p>
                                          سریال:{" "}
                                          {prescription.frame.serialNumber}
                                        </p>
                                        <p>
                                          نوع:{" "}
                                          {prescription.frame.FrameType?.title}
                                        </p>
                                        <p>
                                          جنسیت:{" "}
                                          {
                                            prescription.frame.FrameGender
                                              ?.gender
                                          }
                                        </p>
                                        <p>
                                          دسته‌بندی:{" "}
                                          {
                                            prescription.frame.FrameCategory
                                              ?.title
                                          }
                                        </p>
                                        <p>
                                          🎨 رنگ‌ها:{" "}
                                          {prescription.frame.FrameColors?.map(
                                            (c) => c.colorCode,
                                          ).join("، ")}
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                          {prescription.frame.FrameColors?.flatMap(
                                            (fc) => fc.FrameImages || [],
                                          ).map((img) => (
                                            <img
                                              key={img.id}
                                              src={`/${img.imageUrl}`}
                                              className="w-12 h-12 object-cover rounded border"
                                              alt="frame"
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
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
