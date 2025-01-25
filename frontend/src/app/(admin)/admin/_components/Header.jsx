"use client";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { EditeUserSection } from "@/app/(admin)/admin/_components/Loadings";
import { useSelector, useDispatch } from "react-redux";
import { toPersianDigits } from "@/utils";
import DateTime from "@/components/Ui/DataTime";
import { LuLayoutDashboard } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { TbLogout2 } from "react-icons/tb";
import { logOutUser } from "@/redux/slices/authSlice";

export default function AdminHeader() {
  const { user } = useSelector((state) => state.auth);
  const currentPath = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const isActiveLink = (href) =>
    currentPath === href || currentPath.startsWith(href);

  const logOutUserHandler = () => {
    dispatch(logOutUser());
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky h-16 bg-slate-900 text-secondary-50 font-iranSans">
        <div className="h-full flex items-center justify-between px-5">
          <div className="hidden md:block">
            <div className="flex items-center justify-start">
              <div
                className={`flex items-center gap-1 justify-center p-1 rounded transition-all ease-in-out duration-300 ${
                  isActiveLink("/admin/dashboard")
                    ? "bg-secondary-700 text-secondary-50 border border-secondary-800"
                    : "hover:bg-secondary-800 hover:text-secondary-50"
                }`}
              >
                <LuLayoutDashboard />
                <Link href="/admin/dashboard" className="adminHeaderBTN">
                  داشبورد
                </Link>
              </div>
              <div
                className={`flex items-center gap-1 justify-center p-1 rounded transition-all ease-in-out ${
                  isActiveLink("/admin/basic-definitions/create-new-employee")
                    ? "bg-secondary-700 text-secondary-50"
                    : "hover:bg-secondary-800 hover:text-secondary-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z"
                    clipRule="evenodd"
                  />
                  <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
                  <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
                </svg>
                <Link
                  href="/admin/basic-definitions/create-new-employee"
                  className="adminHeaderBTN"
                >
                  تعاریف اولیه
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <Image
              className="mx-auto"
              src="/image/logoWhite.svg"
              width={70}
              height={70}
              alt="لوگو سلطان اپتیک "
            />
          </div>
          <div>
            <DateTime textColor="text-slate-100 border border-white/20 bg-white/30" />
          </div>
          <Link
            href="/admin/me"
            className="hidden md:flex items-center gap-3 rounded-lg"
          >
            <div className="inline-flex items-center">
              {user?.profileImage ? (
                <div className="rounded-full border-2 border-secondary-500 overflow-hidden select-none">
                  <Image
                    width={48}
                    height={48}
                    className="object-cover rounded-full"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${user.profileImage}`}
                    alt={`${user?.fullName}`}
                    priority
                  />
                </div>
              ) : (
                <div className="bg-secondary-800 rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
              )}
              <Suspense fallback={<EditeUserSection />}>
                <div className="flex flex-col items-center px-2 text-xs">
                  <span>{user?.fullName}</span>
                  <span>{toPersianDigits(user?.phoneNumber || 0)}</span>
                </div>
              </Suspense>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </Link>
          <TbLogout2
            className="mr-2 hover:scale-105 hover:bg-red-200 hover:text-red-500 rounded-full cursor-pointer"
            size={19}
            onClick={logOutUserHandler}
          />
        </div>
      </header>
    </>
  );
}
