import {
  FaHandHoldingUsd,
  FaFileInvoiceDollar,
  FaTags,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function DeliveryToCustomerModal({
  isOpen,
  onClose,
  onConfirm,
  invoiceData,
}) {
  if (!isOpen || !invoiceData) return null;
  console.log("  invoiceData", invoiceData);
  const remaining = invoiceData.remaining || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in relative">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-700 border-b pb-2">
          جزئیات قبض مشتری
        </h2>

        <ul className="space-y-4 text-sm text-gray-700">
          <InfoItem
            icon={<FaFileInvoiceDollar />}
            label="جمع کل قبض"
            value={invoiceData.totalAmount}
          />
          <InfoItem
            icon={<FaHandHoldingUsd />}
            label="پرداختی"
            value={invoiceData.deposit}
          />
          <InfoItem
            icon={<FaTags />}
            label="تخفیف"
            value={invoiceData.discount}
          />
          <InfoItem
            icon={<FaShieldAlt />}
            label="مبلغ بیمه"
            value={invoiceData.insurance}
          />
          <RemainingItem value={invoiceData.remaining || 0} />
        </ul>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
          >
            لغو
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            تحویل عینک به مشتری
          </button>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <li className="flex items-center justify-between border-b pb-2">
    <div className="flex items-center gap-2">
      <span className="text-blue-500">{icon}</span>
      <span>{label}</span>
    </div>
    <span className="font-bold text-gray-900">
      {value?.toLocaleString() || "۰"} تومان
    </span>
  </li>
);

const RemainingItem = ({ value }) => {
  const isPositive = value > 0;
  return (
    <li
      className={`p-3 rounded-md ${isPositive ? "bg-yellow-100 border border-yellow-500" : "bg-green-100 border border-green-500"} flex items-center justify-between`}
    >
      <div className="flex items-center gap-2">
        <span className={isPositive ? "text-yellow-600" : "text-green-600"}>
          <FaExclamationTriangle />
        </span>
        <span
          className={`font-semibold ${isPositive ? "text-yellow-700" : "text-green-700"}`}
        >
          مانده قبض
        </span>
      </div>
      <span
        className={`font-bold ${isPositive ? "text-yellow-800" : "text-green-800"}`}
      >
        {value.toLocaleString()} تومان
      </span>
    </li>
  );
};
