"use client";

const PaymentTable = ({ payments = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-200 text-xs uppercase">
          <tr>
            <th className="px-4 py-2">شماره قبض</th>
            <th className="px-4 py-2">تاریخ</th>
            <th className="px-4 py-2">مشتری</th>
            <th className="px-4 py-2">شماره تماس</th>
            <th className="px-4 py-2">Issued By</th>
            <th className="px-4 py-2">تعداد</th>
            <th className="px-4 py-2">تخفیف</th>
            <th className="px-4 py-2">Remaining</th>
            <th className="px-4 py-2">بیمه</th>
            <th className="px-4 py-2">پرداختی</th>
            <th className="px-4 py-2">روش پرداخت</th>
            <th className="px-4 py-2">توضیحات</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.invoiceId} className="border-b">
              <td className="px-4 py-2">{payment.invoiceId}</td>
              <td className="px-4 py-2">
                {new Date(payment.date ?? "").toLocaleString()}
              </td>
              <td className="px-4 py-2">{payment.customerName}</td>
              <td className="px-4 py-2">{payment.customerPhone}</td>
              <td className="px-4 py-2">{payment.issuedBy}</td>
              <td className="px-4 py-2">
                {(payment.totalAmount ?? 0).toLocaleString()} ریال
              </td>
              <td className="px-4 py-2">
                {(payment.discount ?? 0).toLocaleString()} ریال
              </td>
              <td className="px-4 py-2">
                {(payment.remaining ?? 0).toLocaleString()} ریال
              </td>
              <td className="px-4 py-2">
                {(payment.insurance ?? 0).toLocaleString()} ریال
              </td>
              <td className="px-4 py-2">
                {(payment.deposit ?? 0).toLocaleString()} ریال
              </td>
              <td className="px-4 py-2">{payment.method}</td>
              <td className="px-4 py-2">{payment.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
