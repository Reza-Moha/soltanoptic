"use client";
import AccountingPaymentTable from "@/app/(employee)/employee/components/AccountingPaymentTable";

const ReportSection = ({ title, data }) => {
  const {
    from,
    count = 0,
    totalRevenue = 0,
    totalDiscount = 0,
    totalRemaining = 0,
    totalInsurance = 0,
    totalDeposit = 0,
    payments = [],
  } = data ?? {};

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        From: {new Date(from ?? "").toLocaleDateString()}
      </p>
      <div className="mb-4">
        <p>
          <strong>Invoices:</strong> {count}
        </p>
        <p>
          <strong>Total Revenue:</strong> {totalRevenue.toLocaleString()} ریال
        </p>
        <p>
          <strong>Total Discount:</strong> {totalDiscount.toLocaleString()} ریال
        </p>
        <p>
          <strong>Total Remaining:</strong> {totalRemaining.toLocaleString()}{" "}
          ریال
        </p>
        <p>
          <strong>Total Insurance:</strong> {totalInsurance.toLocaleString()}{" "}
          ریال
        </p>
        <p>
          <strong>Total Deposit:</strong> {totalDeposit.toLocaleString()} ریال
        </p>
      </div>
      <AccountingPaymentTable payments={payments} />
    </div>
  );
};

export default ReportSection;
