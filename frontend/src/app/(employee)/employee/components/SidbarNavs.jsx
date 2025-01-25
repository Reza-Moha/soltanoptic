import {
  ChatBubbleBottomCenterIcon,
  DocumentTextIcon,
  RectangleGroupIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/24/outline";
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
    title: "ثبت ویزیت",
    icon: <ChatBubbleBottomCenterIcon className="w-5 h-5" />,
    href: "/profile/comments",
  },
  {
    id: 4,
    title: "پیگیری سفارش مشتری",
    icon: <Squares2X2Icon className="w-5 h-5" />,
    href: "/profile/categories",
  },
  {
    id: 5,
    title: "سفارشات عدسی",
    icon: <UsersIcon className="w-5 h-5" />,
    href: "/profile/users",
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
                "flex items-center gap-x-2 rounded-2xl font-medium hover:text-primary-900 transition-all duration-200 text-secondary-700 py-3 px-4",
                {
                  "bg-green-100/60 !font-bold text-primary-900":
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
