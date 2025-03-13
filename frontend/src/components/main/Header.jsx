import Link from "next/link";
import Image from "next/image";
import { toPersianDigits } from "@/utils";
import DropDownMenu from "@/components/Ui/DropDownMenu";
import { useSelector } from "react-redux";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function Header() {
  const { user, isLoading } = useSelector((state) => state.auth);
  return (
    <>
      <header
        className={`!z-50 shadow-md bg-slate-50 sticky top-0 transition-all duration-200 border-b border-b-secondary-300 font-iranSans ${
          isLoading ? "blur-sm opacity-70" : "opacity-100 blur-0"
        }`}
      >
        <div className="container xl:max-w-screen-xl flex items-center justify-center relative">
          <div className="flex-1">
            <ul className="flex items-center text-center justify-start gap-x-6">
              <li>
                <Link href="/" className="flex items-center ml-10">
                  <Image
                    priority="false"
                    src="/image/logoWhite.svg"
                    alt="logo"
                    width={60}
                    height={60}
                  />
                  <div className="hidden md:flex  flex-col items-center justify-center">
                    <h1 className="font-extrabold text-lg font-iranSans">
                      سلطان اپتیک
                    </h1>
                    <p className="text-xs">
                      بزرگترین مجموعه اپتیکی شمال غرب کشور
                    </p>
                  </div>
                </Link>
              </li>
              <li className="hidden md:block">
                <Link href="/" className="inline-flex items-center gap-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                    />
                  </svg>
                  <h2 className="text-md">محصولات</h2>
                </Link>
              </li>
              <li className="hidden md:block">
                <Link href="/" className="inline-flex items-center gap-x-1">
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
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>

                  <h2 className="text-md">درباره ما</h2>
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex justify-between items-center py-2 gap-x-3">
            <div className="relative bg-secondary-100 rounded-full inline-flex items-center justify-center p-1.5 w-10 h-10">
              <div className="absolute top-0 -right-3 bg-primary-100 rounded-full w-5 h-5 inline-flex items-center justify-center text-primary-900 font-semibold font-iranSans">
                {toPersianDigits(1)}
              </div>
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
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            {user ? (
              <DropDownMenu user={user} />
            ) : (
              <Link href="/login">
                <ShimmerButton className="shadow-2xl">
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-md">
                    ورود | ثبت نام
                  </span>
                </ShimmerButton>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
