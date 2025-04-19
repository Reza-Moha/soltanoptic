"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllInvoicesPaginated } from "@/redux/slices/customersSlice";
import Pagination from "@/components/Ui/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import TextRevealCard from "@/components/magicui/TextRevealCard";

export default function OrderTracking() {
  const dispatch = useDispatch();
  const { allInvoices, currentPage, totalPages, invoicesLoading } = useSelector(
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
                  <>
                    <motion.tr
                      key={invoice.InvoiceId}
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
                          className="bg-gray-50 p-4 text-sm leading-6"
                        >
                          {/* مراحل خرید با انیمیشن */}
                          <div className="md:col-span-2 mb-6">
                            <strong className="block mb-4 text-emerald-700 text-lg">
                              🧭 مراحل خرید:
                            </strong>

                            <fieldset className="flex overflow-x-auto gap-4">
                              {steps.map((step, index) => {
                                const stepTime = invoice[step.timeField];
                                const isPassed =
                                  steps.findIndex(
                                    (s) => s.key === invoice.lensOrderStatus,
                                  ) >= index;
                                const isActive =
                                  invoice.lensOrderStatus === step.key;

                                return (
                                  <TextRevealCard
                                    key={step.key}
                                    text={step.label}
                                    revealText={
                                      stepTime
                                        ? new Date(stepTime).toLocaleString(
                                            "fa-IR",
                                            {
                                              year: "numeric",
                                              month: "2-digit",
                                              day: "2-digit",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              second: "2-digit",
                                            },
                                          )
                                        : "در انتظار..."
                                    }
                                    byText={
                                      step.orderByField &&
                                      invoice[step.orderByField]
                                    }
                                    icon={step.icon}
                                    isPassed={isPassed}
                                    isActive={isActive}
                                  />
                                );
                              })}
                            </fieldset>
                          </div>

                          {/* اطلاعات اضافی قبض */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <strong>👤 مشتری:</strong>{" "}
                              {invoice.customer?.fullName} (
                              {invoice.customer?.gender})
                            </div>
                            <div>
                              <strong>🧑‍💼 کارمند ثبت‌کننده:</strong>{" "}
                              {invoice.employee?.fullName}
                            </div>
                            <div>
                              <strong>🏢 شرکت:</strong>{" "}
                              {invoice.company?.companyName || "ندارد"}
                            </div>
                            <div>
                              <strong>🏦 بانک:</strong>{" "}
                              {invoice.bank?.bankName || "ندارد"}
                            </div>
                            <div>
                              <strong>🛡 بیمه:</strong>{" "}
                              {invoice.insurance?.insuranceName || "ندارد"}
                            </div>
                            <div>
                              <strong>💳 روش پرداخت:</strong>{" "}
                              {invoice.paymentInfo?.paymentMethod || "نامشخص"}
                            </div>
                            <div>
                              <strong>💰 مبلغ کل:</strong>{" "}
                              {invoice.SumTotalInvoice?.toLocaleString()} تومان
                            </div>
                            <div>
                              <strong>🎟 مبلغ بیمه:</strong>{" "}
                              {invoice.paymentInfo?.insuranceAmount?.toLocaleString() ||
                                "۰"}{" "}
                              تومان
                            </div>
                            <div>
                              <strong>💸 تخفیف:</strong>{" "}
                              {invoice.paymentInfo?.discount?.toLocaleString() ||
                                "۰"}{" "}
                              تومان
                            </div>
                            <div>
                              <strong>💰 واریز:</strong>{" "}
                              {invoice.paymentInfo?.deposit?.toLocaleString() ||
                                "۰"}{" "}
                              تومان
                            </div>
                            <div>
                              <strong>📄 مانده:</strong>{" "}
                              {invoice.paymentInfo?.billBalance?.toLocaleString() ||
                                "۰"}{" "}
                              تومان
                            </div>

                            {/* لیست نسخه‌ها */}
                            <div className="md:col-span-2 mt-2">
                              <strong className="text-emerald-700">
                                📑 نسخه‌ها:
                              </strong>
                              <div className="mt-2 space-y-4">
                                {invoice.prescriptions?.map(
                                  (prescription, idx) => (
                                    <div
                                      key={prescription.PrescriptionId}
                                      className="p-3 border rounded bg-white shadow-sm"
                                    >
                                      <p>
                                        <strong>🔹 نسخه {idx + 1}</strong>
                                      </p>
                                      <p>
                                        OD: {prescription.odSph} /{" "}
                                        {prescription.odCyl} /{" "}
                                        {prescription.odAx}
                                      </p>
                                      <p>
                                        OS: {prescription.osSph} /{" "}
                                        {prescription.osCyl} /{" "}
                                        {prescription.osAx}
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
                                        <>
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
                                        </>
                                      )}

                                      {prescription.frame && (
                                        <>
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
                                            {
                                              prescription.frame.FrameType
                                                ?.title
                                            }
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
                                            )?.map((img) => (
                                              <img
                                                key={img.id}
                                                src={`/${img.imageUrl}`}
                                                className="w-12 h-12 object-cover rounded border"
                                                alt="frame"
                                              />
                                            ))}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </>
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
