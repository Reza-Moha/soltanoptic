"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { motion, AnimatePresence } from "framer-motion";
import { getOrderLensDaily } from "@/redux/slices/customersSlice";
import { sendLensOrderApi } from "@/services/customers/customers.service";
import toast from "react-hot-toast";

export default function OrderLens() {
  const { isLoading, orderLensDaily } = useSelector(
    (state) => state.customerSlice,
  );
  const { isLoading: companyLoading, companyList } = useSelector(
    (state) => state.companiesSlice,
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    searchParams.get("company") || "",
  );

  const today = new DateObject({ calendar: persian, locale: persian_fa });
  const [selectedDate, setSelectedDate] = useState(today);

  const [orderStatus, setOrderStatus] = useState({});

  useEffect(() => {
    const date = selectedDate?.isValid
      ? selectedDate.convert("gregorian").format("YYYY-MM-DD")
      : null;

    dispatch(getOrderLensDaily(date));
  }, [selectedDate]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return orderLensDaily?.filter(
      ({ invoiceNumber, customer, company, createdAt }) => {
        const matchSearch =
          !q ||
          invoiceNumber?.toString().includes(q) ||
          customer?.fullName?.toLowerCase().includes(q) ||
          customer?.gender?.toLowerCase().includes(q) ||
          company?.companyName?.toLowerCase().includes(q);
        const matchCompany =
          !selectedCompanyId || company?.CompanyId === selectedCompanyId;

        const createdDate = new DateObject({
          date: createdAt,
          calendar: persian,
          locale: persian_fa,
        });

        const matchDate =
          !selectedDate ||
          (selectedDate?.isValid &&
            createdDate.convert("gregorian").format("YYYY-MM-DD") ===
              selectedDate.convert("gregorian").format("YYYY-MM-DD"));

        return matchSearch && matchCompany && matchDate;
      },
    );
  }, [search, selectedCompanyId, selectedDate, orderLensDaily]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search);
    if (selectedCompanyId) params.set("company", selectedCompanyId);
    if (selectedDate?.isValid) {
      const gDate = selectedDate.convert("gregorian").format("YYYY-MM-DD");
      params.set("date", gDate);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [search, selectedCompanyId, selectedDate]);

  if (isLoading || companyLoading)
    return <p className="text-center py-4">در حال دریافت اطلاعات ...</p>;

  const handleSendOrder = async (invoiceId) => {
    try {
      setOrderStatus((prevState) => ({
        ...prevState,
        [invoiceId]: "sending",
      }));

      const sendLensOrder = await sendLensOrderApi({ invoiceId });
      if (sendLensOrder.statusCode === 200) {
        toast.success(sendLensOrder.message);

        setOrderStatus((prevState) => ({
          ...prevState,
          [invoiceId]: "sent",
        }));
      }
    } catch (e) {
      console.log(e);
      setOrderStatus((prevState) => ({
        ...prevState,
        [invoiceId]: undefined,
      }));
    }
  };

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
                    <button
                      onClick={() => handleSendOrder(InvoiceId)}
                      disabled={
                        orderStatus[InvoiceId] === "sent" ||
                        orderStatus[InvoiceId] === "sending"
                      }
                      className={`${
                        orderStatus[InvoiceId] === "sent"
                          ? "bg-green-500"
                          : orderStatus[InvoiceId] === "sending"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      } text-white py-1 px-4 rounded`}
                    >
                      {orderStatus[InvoiceId] === "sending"
                        ? "در حال ارسال ..."
                        : orderStatus[InvoiceId] === "sent"
                          ? "سفارش داده شد"
                          : "ارسال سفارش"}
                    </button>
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
