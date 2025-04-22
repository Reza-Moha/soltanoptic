"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountingReport } from "@/redux/slices/employee.slice";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  FiCalendar,
  FiHash,
  FiDollarSign,
  FiPercent,
  FiCreditCard,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
// ... imports remain unchanged ...
const TransactionFilter = () => {
  const [type, setType] = useState("daily");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const dispatch = useDispatch();

  const { accountingReport, isLoading, error } = useSelector(
    (state) => state.employeeSlice,
  );

  const fetchTransactions = (selectedType = type) => {
    if (selectedType === "custom" && (!fromDate || !toDate)) {
      alert("لطفاً بازه تاریخ را کامل انتخاب کنید.");
      return;
    }

    const query =
      selectedType === "custom"
        ? `?type=custom&from=${fromDate}&to=${toDate}`
        : `?type=${selectedType}`;

    dispatch(getAccountingReport(query));
  };

  useEffect(() => {
    fetchTransactions("daily");
  }, []);

  const renderError = () => {
    if (!error) return null;
    if (typeof error === "string") return <p>{error}</p>;
    if (error.message) return <p>{error.message}</p>;
    if (Array.isArray(error.errors)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {error.errors.map((e, idx) => (
            <li key={idx}>{e}</li>
          ))}
        </ul>
      );
    }
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        سیستم حسابداری
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-3 border rounded-md shadow-sm w-full sm:w-1/3"
        >
          <option value="daily">گزارش روزانه</option>
          <option value="weekly">گزارش هفتگی</option>
          <option value="monthly">گزارش ماهانه</option>
          <option value="yearly">گزارش سالانه</option>
          <option value="custom">بازه تاریخی</option>
        </select>

        {type === "custom" && (
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-2/3">
            <div className="flex-1">
              <label className="block text-sm mb-1">از تاریخ:</label>
              <DatePicker
                value={fromDate}
                onChange={(date) => setFromDate(date?.format("YYYY-MM-DD"))}
                calendar={persian}
                locale={persian_fa}
                inputClass="p-3 border rounded-md w-full"
                calendarPosition="bottom-right"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">تا تاریخ:</label>
              <DatePicker
                value={toDate}
                onChange={(date) => setToDate(date?.format("YYYY-MM-DD"))}
                calendar={persian}
                locale={persian_fa}
                inputClass="p-3 border rounded-md w-full"
                calendarPosition="bottom-right"
              />
            </div>
          </div>
        )}

        <button
          onClick={() => fetchTransactions()}
          disabled={isLoading}
          className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition w-full sm:w-1/3"
        >
          {isLoading ? "در حال بارگذاری..." : "دریافت اطلاعات"}
        </button>
      </div>

      {error && (
        <div className="mb-6 text-red-600 bg-red-100 p-4 rounded border border-red-300">
          {renderError()}
        </div>
      )}

      {accountingReport && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-6 border-b pb-2">
            گزارشات مالی
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 text-gray-700">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded flex items-center gap-4">
              <FiCalendar className="text-blue-500 text-2xl" />
              <div>
                <p className="text-sm">تاریخ گزارش</p>
                <p className="font-bold">
                  {new Date(accountingReport.reportDate).toLocaleDateString(
                    "fa-IR",
                  )}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded flex items-center gap-4">
              <FiHash className="text-gray-500 text-2xl" />
              <div>
                <p className="text-sm">تعداد فیلد</p>
                <p className="font-bold">
                  {accountingReport.count?.toLocaleString("fa-IR")}
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded flex items-center gap-4">
              <FiDollarSign className="text-green-600 text-2xl" />
              <div>
                <p className="text-sm">درآمد کل</p>
                <p className="font-bold">
                  {accountingReport.totalRevenue?.toLocaleString("fa-IR")}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded flex items-center gap-4">
              <FiPercent className="text-yellow-500 text-2xl" />
              <div>
                <p className="text-sm">جمع کل تخفیف</p>
                <p className="font-bold">
                  {accountingReport.totalDiscount?.toLocaleString("fa-IR")}
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded flex items-center gap-4">
              <FiCreditCard className="text-indigo-600 text-2xl" />
              <div>
                <p className="text-sm">جمع کل واریزی‌ها</p>
                <p className="font-bold">
                  {accountingReport.totalDeposit?.toLocaleString("fa-IR")}
                </p>
              </div>
            </div>

            <div className="bg-pink-50 border border-pink-200 p-4 rounded flex items-center gap-4">
              <FiShield className="text-pink-600 text-2xl" />
              <div>
                <p className="text-sm">جمع کل بیمه‌ها</p>
                <p className="font-bold">
                  {accountingReport.totalInsurance?.toLocaleString("fa-IR")}
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded flex items-center gap-4">
              <FiAlertCircle className="text-red-500 text-2xl" />
              <div>
                <p className="text-sm">جمع کل باقی‌مانده</p>
                <p className="font-bold">
                  {accountingReport.totalRemaining?.toLocaleString("fa-IR")}
                </p>
              </div>
            </div>
          </div>

          {Array.isArray(accountingReport?.payments) &&
          accountingReport.payments.length > 0 ? (
            <div className="overflow-x-auto mt-8 rounded-lg border border-gray-300 shadow-sm">
              <table className="min-w-full text-right text-sm">
                <thead className="bg-blue-50 text-blue-800 font-semibold text-sm">
                  <tr>
                    <th className="py-3 px-4 border-b">#</th>
                    <th className="py-3 px-4 border-b">نام مشتری</th>
                    <th className="py-3 px-4 border-b">مبلغ کل</th>
                    <th className="py-3 px-4 border-b">تخفیف</th>
                    <th className="py-3 px-4 border-b">واریزی</th>
                    <th className="py-3 px-4 border-b">بیمه</th>
                    <th className="py-3 px-4 border-b">باقی‌مانده</th>
                    <th className="py-3 px-4 border-b">روش پرداخت</th>
                    <th className="py-3 px-4 border-b">بانک</th>
                    <th className="py-3 px-4 border-b">بیمه‌گر</th>
                    <th className="py-3 px-4 border-b">شرکت</th>
                    <th className="py-3 px-4 border-b">تحویل</th>
                    <th className="py-3 px-4 border-b">تاریخ</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {accountingReport.payments.map((trx, i) => (
                    <tr
                      key={i}
                      className={`${
                        i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition-all`}
                    >
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {i + 1}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.customerName}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.totalAmount?.toLocaleString("fa-IR")}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.discount?.toLocaleString("fa-IR")}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.deposit?.toLocaleString("fa-IR")}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.insurance?.toLocaleString("fa-IR")}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.remaining?.toLocaleString("fa-IR")}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.method}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.bank?.bankName}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.insuranceDetails?.insuranceName}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.company?.companyName}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {trx.lensOrderStatusTracking?.deliveredAt
                          ? "تحویل شده"
                          : "تحویل نشده"}
                      </td>
                      <td className="py-4 px-4 border-b leading-relaxed">
                        {new Date(trx.date)?.toLocaleDateString("fa-IR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">هیچ تراکنشی یافت نشد.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionFilter;
