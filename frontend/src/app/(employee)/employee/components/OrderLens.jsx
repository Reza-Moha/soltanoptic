"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { getOrderLensDaily } from "@/redux/slices/customersSlice";
import useLensSearchParams from "@/hooks/useLensSearchParams";
import OrderSendButton from "@/app/(employee)/employee/components/OrderLensButton";
import { sendLensOrderApi } from "@/services/customers/customers.service";

export default function OrderLens({ pageType, sendApi = sendLensOrderApi }) {
  const dispatch = useDispatch();

  const { isLoading, orderLensDaily } = useSelector(
    (state) => state.customerSlice,
  );
  const { isLoading: companyLoading, companyList } = useSelector(
    (state) => state.companiesSlice,
  );

  const { query, date, updateParams } = useLensSearchParams();

  const [search, setSearch] = useState(query);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const initialDate = useMemo(() => {
    if (date) {
      try {
        return new DateObject({ date, calendar: persian, locale: persian_fa });
      } catch {
        return new DateObject({ calendar: persian, locale: persian_fa });
      }
    }
    return new DateObject({ calendar: persian, locale: persian_fa });
  }, [date]);

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [orderStatus, setOrderStatus] = useState({});

  useEffect(() => {
    const gDate = selectedDate?.toDate?.()
      ? selectedDate.convert("gregorian").format("YYYY-MM-DD")
      : null;
    if (gDate) dispatch(getOrderLensDaily(gDate));
  }, [selectedDate]);

  useEffect(() => {
    const gDate = selectedDate?.toDate?.()
      ? selectedDate.convert("gregorian").format("YYYY-MM-DD")
      : undefined;

    updateParams({
      q: search.trim() || undefined,
      date: gDate,
    });
  }, [search, selectedDate]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();

    return orderLensDaily?.filter(({ invoiceNumber, customer, company }) => {
      const matchSearch =
        !q ||
        invoiceNumber?.toString().includes(q) ||
        customer?.fullName?.toLowerCase().includes(q) ||
        customer?.gender?.toLowerCase().includes(q) ||
        company?.companyName?.toLowerCase().includes(q);

      const matchCompany =
        !selectedCompanyId || company?.CompanyId === selectedCompanyId;

      return matchSearch && matchCompany;
    });
  }, [search, selectedCompanyId, orderLensDaily]);

  if (isLoading || companyLoading) {
    return <p className="text-center py-4">در حال دریافت اطلاعات ...</p>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        گزارش فاکتورهای امروز
      </h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو..."
          className="border px-4 py-2 rounded text-right"
        />

        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="border px-4 py-2 rounded text-right"
        >
          <option value="">همه‌ی شرکت‌ها</option>
          {companyList?.map(({ CompanyId, companyName }) => (
            <option key={CompanyId} value={CompanyId}>
              {companyName}
            </option>
          ))}
        </select>

        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          placeholder="انتخاب تاریخ"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <table className="min-w-full text-sm border bg-white">
        <thead className="bg-gray-100 text-right">
          <tr>
            <th className="px-4 py-2 border">شماره قبض</th>
            <th className="px-4 py-2 border">جنسیت</th>
            <th className="px-4 py-2 border">نام مشتری</th>
            <th className="px-4 py-2 border">شرکت سفارش عدسی</th>
            <th className="px-4 py-2 border">تاریخ صدور</th>
            <th className="px-4 py-2 border">نسخه</th>
            <th className="px-4 py-2 border">مشخصات لنز</th>
            <th className="px-4 py-2 border">ارسال سفارش</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {filteredData?.map(
              ({
                InvoiceId,
                invoiceNumber,
                customer,
                company,
                createdAt,
                prescriptions,
                lensOrderStatus,
                workShopSectionAt,
              }) => (
                <motion.tr
                  key={InvoiceId}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-right border-b align-top"
                >
                  <td className="px-4 py-2 border">{invoiceNumber}</td>
                  <td className="px-4 py-2 border">{customer?.gender}</td>
                  <td className="px-4 py-2 border">{customer?.fullName}</td>
                  <td className="px-4 py-2 border">{company?.companyName}</td>
                  <td className="px-4 py-2 border">
                    {new Date(createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-2 border">
                    {prescriptions?.map(
                      ({
                        InvoiceId,
                        odSph,
                        odCyl,
                        odAx,
                        osSph,
                        osCyl,
                        osAx,
                        pd,
                        label,
                      }) => (
                        <div
                          key={InvoiceId}
                          className="bg-blue-50 p-2 rounded mb-2 text-xs"
                        >
                          <p>
                            <strong>OD:</strong> {odSph} / {odCyl} / {odAx}
                          </p>
                          <p>
                            <strong>OS:</strong> {osSph} / {osCyl} / {osAx}
                          </p>
                          <p>
                            <strong>PD:</strong> {pd}
                          </p>
                          <p>
                            <strong>Label:</strong> {label}
                          </p>
                        </div>
                      ),
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {prescriptions?.map(({ InvoiceId, lens }) =>
                      lens ? (
                        <div
                          key={InvoiceId}
                          className="bg-green-50 p-2 rounded mb-2 text-xs"
                        >
                          <p>
                            <strong>نام عدسی:</strong> {lens.lensName}
                          </p>
                          <img
                            src={`/${lens.lensImage}`}
                            alt={lens.lensName}
                            className="w-12 h-12 object-contain border mt-1 rounded-full"
                          />
                        </div>
                      ) : (
                        "ندارد"
                      ),
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    <OrderSendButton
                      invoiceId={InvoiceId}
                      lensOrderStatus={lensOrderStatus}
                      pageType={pageType}
                      initialStatus={orderStatus[InvoiceId]}
                      onStatusChange={(newStatus) =>
                        setOrderStatus((prev) => ({
                          ...prev,
                          [InvoiceId]: newStatus,
                        }))
                      }
                      sendApi={sendApi}
                    />
                  </td>
                </motion.tr>
              ),
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
