import {
  ChatBubbleBottomCenterIcon,
  DocumentTextIcon,
  RectangleGroupIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { FaBorderTopLeft } from "react-icons/fa6";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    title: "پیگیری سفارش مشتری",
    icon: <Squares2X2Icon className="w-5 h-5" />,
    href: "/profile/categories",
  },
];

export default function SideBarNavs() {
  const pathname = usePathname();

  return (
    <ul className="space-y-2">
      {sidebarNavs.map((nav) => {
        return (
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
        );
      })}
    </ul>
  );
}
