"use client";
import {
  DocumentTextIcon,
  RectangleGroupIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { GiMicroscopeLens } from "react-icons/gi";
import { FaBorderTopLeft, FaScrewdriverWrench } from "react-icons/fa6";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaFirstOrder } from "react-icons/fa";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import SidebarSkeleton from "@/app/(employee)/employee/components/SidbarSkeleton";

const sidebarNavs = [
  {
    id: 1,
    title: "داشبورد",
    icon: <RectangleGroupIcon className="w-5 h-5" />,
    href: "/employee/dashboard",
  },
  {
    id: 2,
    title: "ثبت قبض",
    icon: <DocumentTextIcon className="w-5 h-5" />,
    href: "/employee/purchase-invoice",
  },
  {
    id: 3,
    title: "سفارشات عدسی",
    icon: <FaBorderTopLeft className="w-5 h-5" />,
    href: "/employee/order-lens",
  },
  {
    id: 4,
    title: "پیگیری سفارشات",
    icon: <Squares2X2Icon className="w-5 h-5" />,
    href: "/employee/orderTracking",
  },
  {
    id: 5,
    title: "چک لیست عدسی",
    icon: <GiMicroscopeLens className="w-5 h-5" />,
    href: "/employee/workShopDelivery",
  },
  {
    id: 6,
    title: "عینک های آماده تحویل",
    icon: <FaFirstOrder className="w-5 h-5" />,
    href: "/employee/readyToDelivery",
  },
  {
    id: 7,
    title: "حسابداری",
    icon: <MdAccountBalanceWallet className="w-5 h-5" />,
    href: "/employee/accounting",
    permission: "ACCOUNTING",
  },
  {
    id: 8,
    title: "بخش کارگاه",
    icon: <FaScrewdriverWrench className="w-5 h-5" />,
    href: "/employee/workshopSection",
    permission: "WORKSHOP_MANAGER",
  },
];

export default function SideBarNavs() {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);

  if (!user) return <SidebarSkeleton />;

  const userPermissions = user?.Role?.permissions?.map((p) => p.title) ?? [];

  const filteredNavs = sidebarNavs.filter((nav) => {
    if (nav.permission) {
      return userPermissions.includes(nav.permission);
    }
    return true;
  });

  return (
    <ul className="space-y-2">
      {filteredNavs.map((nav) => (
        <li key={nav.id}>
          <Link
            href={nav.href}
            className={classNames(
              "flex items-center gap-x-2 rounded-2xl font-medium hover:text-slate-900 transition-all duration-200 text-slate-700 hover:bg-slate-100 py-3 px-4",
              {
                "bg-green-100/60 !font-bold text-slate-900":
                  pathname === nav.href,
              },
            )}
          >
            {nav.icon}
            {nav.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
