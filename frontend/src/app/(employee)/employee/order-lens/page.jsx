"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";

export default function OrderLens() {
  const { isLoading, orderLensDaily } = useSelector(
    (state) => state.customerSlice,
  );
  console.log(orderLensDaily);
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orderLensDaily;
    return orderLensDaily?.filter((invoice) => {
      const { invoiceNumber, customer, company } = invoice;
      return (
        invoiceNumber?.toString().includes(query) ||
        customer?.fullName?.toLowerCase().includes(query) ||
        customer?.gender?.toLowerCase().includes(query) ||
        company?.companyName?.toLowerCase().includes(query)
      );
    });
  }, [search, orderLensDaily]);

  if (isLoading) return <p className="text-center py-4">در حال بارگذاری...</p>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        گزارش فاکتورهای امروز
      </h2>

      <div className="mb-4 text-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو..."
          className="border border-gray-300 px-4 py-2 rounded w-1/2 text-right"
        />
      </div>

      <table className="min-w-full text-sm border border-gray-300 rounded bg-white">
        <thead className="bg-gray-100 text-right">
          <tr>
            <th className="px-4 py-2 border">شماره قبض</th>
            <th className="px-4 py-2 border">جنسیت</th>
            <th className="px-4 py-2 border">نام مشتری</th>
            <th className="px-4 py-2 border">شرکت سفارش عدسی</th>
            <th className="px-4 py-2 border">تاریخ صدور</th>
            <th className="px-4 py-2 border">نسخه</th>
            <th className="px-4 py-2 border">مشخصات لنز</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((invoice) => (
            <tr
              key={invoice.InvoiceId}
              className="text-right border-b align-top"
            >
              <td className="px-4 py-2 border">{invoice.invoiceNumber}</td>
              <td className="px-4 py-2 border">{invoice.customer?.gender}</td>
              <td className="px-4 py-2 border">{invoice.customer?.fullName}</td>
              <td className="px-4 py-2 border">
                {invoice.company?.companyName}
              </td>
              <td className="px-4 py-2 border">
                {new Date(invoice.createdAt).toLocaleDateString("fa-IR")}
              </td>
              <td className="px-4 py-2 border">
                {invoice.prescriptions?.map((pres) => (
                  <div
                    key={pres.PrescriptionId}
                    className="bg-blue-50 p-2 rounded-md shadow mb-2 text-xs"
                  >
                    <p>
                      <strong>OD:</strong> {pres.odSph} / {pres.odCyl} /{" "}
                      {pres.odAx}
                    </p>
                    <p>
                      <strong>OS:</strong> {pres.osSph} / {pres.osCyl} /{" "}
                      {pres.osAx}
                    </p>
                    <p>
                      <strong>PD:</strong> {pres.pd}
                    </p>
                    <p>
                      <strong>Label:</strong> {pres.label}
                    </p>
                  </div>
                ))}
              </td>
              <td className="px-4 py-2 border">
                {invoice.prescriptions?.map((pres) =>
                  pres.lens ? (
                    <div
                      key={pres.PrescriptionId}
                      className="bg-green-50 p-2 rounded-md shadow mb-2 text-xs"
                    >
                      <p>
                        <strong>نام عدسی:</strong> {pres.lens.lensName}
                      </p>
                      <img
                        src={`/${pres.lens.lensImage}`}
                        alt={pres.lens.lensName}
                        className="w-12 h-12 object-contain border mt-1 rounded-full"
                      />
                    </div>
                  ) : (
                    "ندارد"
                  ),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
