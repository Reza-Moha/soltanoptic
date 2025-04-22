"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  Package,
  Glasses,
  Calendar,
  BadgePercent,
  Receipt,
  PiggyBank,
  HandCoins,
  Banknote,
  Cog,
  Send,
  Truck,
  CheckCircle,
  ScanEye,
} from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import { useEffect } from "react";
import { getEmployeePerformance } from "@/redux/slices/employee.slice";

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg p-6 h-48" />
  );
}

export default function EmployeePage() {
  const { employeePerformance, isLoading } = useSelector(
    (state) => state.employeeSlice,
  );
  const { user, isLoading: userLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(getEmployeePerformance({ employeeId: user.id }));
    }
  }, [user?.id, dispatch]);

  if (isLoading || userLoading) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
        {Array.from({ length: 14 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const {
    dailySales = [],
    totalInvoices = 0,
    totalRevenue = 0,
    uniqueCustomers = 0,
    frameCount = 0,
    totalDiscounts = 0,
    totalDiscountAmount = 0,
    totalRemainingAmount = 0,
    totalInsuranceTransfers = 0,
    totalInsuranceTransferAmount = 0,
    lensTrackingStats = {},
  } = employeePerformance || {};

  const stats = [
    {
      icon: <Users className="text-teal-500" size={36} />,
      title: "تعداد مشتری",
      value: uniqueCustomers,
    },
    {
      icon: <Banknote className="text-green-500" size={36} />,
      title: "جمع کل فروش",
      value: `${totalRevenue.toLocaleString()} تومان`,
    },
    {
      icon: <Receipt className="text-orange-400" size={36} />,
      title: "تعداد قبض",
      value: totalInvoices,
    },
    {
      icon: <Glasses className="text-violet-500" size={36} />,
      title: "تعداد فریم",
      value: frameCount,
    },
    {
      icon: <BadgePercent className="text-yellow-400" size={36} />,
      title: "تعداد تخفیف‌ها",
      value: totalDiscounts,
    },
    {
      icon: <HandCoins className="text-pink-400" size={36} />,
      title: "مجموع مبلغ تخفیف",
      value: `${totalDiscountAmount.toLocaleString()} تومان`,
    },
    {
      icon: <PiggyBank className="text-blue-500" size={36} />,
      title: "مانده قبض‌ها",
      value: `${totalRemainingAmount.toLocaleString()} تومان`,
    },
    {
      icon: <Package className="text-sky-500" size={36} />,
      title: "تعداد حواله بیمه",
      value: totalInsuranceTransfers,
    },
    {
      icon: <Banknote className="text-lime-500" size={36} />,
      title: "مبلغ حواله بیمه",
      value: `${totalInsuranceTransferAmount.toLocaleString()} تومان`,
    },
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 overflow-auto text-slate-800 dark:text-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
        {stats.map(({ icon, title, value }, i) => (
          <MagicCard
            key={i}
            className="col-span-1 sm:col-span-1 lg:col-span-2 flex flex-col justify-center items-center text-center p-6"
            gradientFrom="#e0f7fa"
            gradientTo="#f1f8e9"
            gradientOpacity={0.2}
          >
            {icon}
            <h2 className="text-lg font-medium mt-2">{title}</h2>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </MagicCard>
        ))}

        {/* Daily Sales Table */}
        <MagicCard className="col-span-1 sm:col-span-2 lg:col-span-6 p-6 overflow-auto">
          <div className="flex items-center mb-4">
            <Calendar className="text-red-400 mr-2" size={24} />
            <h2 className="text-xl font-semibold">فروش روزانه</h2>
          </div>
          {dailySales.length === 0 ? (
            <p className="text-gray-400">اطلاعات فروشی ثبت نشده</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right border-b border-slate-200 dark:border-slate-700 font-semibold">
                  <th className="py-2">تاریخ</th>
                  <th className="py-2">قبض‌ها</th>
                  <th className="py-2">جمع کل</th>
                </tr>
              </thead>
              <tbody>
                {dailySales.map((sale, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-100/20 dark:hover:bg-slate-800/20 transition"
                  >
                    <td className="py-2">
                      {new Date(sale.date).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="py-2">{sale.invoiceCount}</td>
                    <td className="py-2">
                      {Number(sale.totalAmount).toLocaleString()} تومان
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </MagicCard>

        {/* Lens Tracking Table */}
        <MagicCard className="col-span-1 sm:col-span-2 lg:col-span-6 p-6 overflow-auto">
          <div className="flex items-center mb-4">
            <ScanEye className="text-indigo-400 mr-2" size={24} />
            <h2 className="text-xl font-semibold">عملکرد سفارش عدسی</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right border-b border-slate-200 dark:border-slate-700 font-semibold">
                <th className="py-2">مرحله</th>
                <th className="py-2">تعداد</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  title: "ثبت سفارش عدسی",
                  count: lensTrackingStats.lensOrderedCount,
                },
                {
                  title: "تحویل به بخش کارگاه",
                  count: lensTrackingStats.workshopSectionCount,
                },
                {
                  title: "آماده تحویل",
                  count: lensTrackingStats.readyToDeliverCount,
                },
                {
                  title: "تحویل نهایی",
                  count: lensTrackingStats.deliveredCount,
                },
                {
                  title: "ارسال پیامک",
                  count: lensTrackingStats.sendOrderSmsCount,
                },
              ].map(({ title, count }, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-100/20 dark:hover:bg-slate-800/20 transition"
                >
                  <td className="py-2">{title}</td>
                  <td className="py-2">{count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MagicCard>
      </div>
    </div>
  );
}
