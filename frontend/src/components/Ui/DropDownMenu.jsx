"use client";
import React, { useState } from "react";
import DropDownButton from "@/components/Ui/DropDownButton";
import ConditionalLink from "@/components/tools/Roles";
import { toPersianDigits } from "@/utils";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logOutUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Ui/Avatar";
import { RippleButton } from "@/components/magicui/ripple-button";

const Dropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };
  const logOutUserHandler = () => {
    dispatch(logOutUser());
    router.push("/");
    router.refresh();
  };
  return (
    <div className="inline-block">
      <DropDownButton toggleDropdown={toggleDropdown} />
      {isOpen && (
        <div className="origin-top-right absolute left-9 top-14 mt-2 pb-2 w-52 rounded-lg shadow-lg bg-slate-50 ring-1 ring-black ring-opacity-5 text-slate-800 px-5 !z-50">
          <ul
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="px-5 py-3 font-iranSans flex items-center border-b border-b-primary-100">
              <div className="">
                <Avatar user={user} />
              </div>
              <div className="flex-1">
                <div className="flex flex-col items-start gap-x-3 mr-2">
                  <h3>{user.name}</h3>
                  <span className="text-sm">
                    {toPersianDigits(user.phoneNumber) || 0}
                  </span>
                </div>
              </div>
            </div>
            <li>
              <ConditionalLink />
            </li>

            <li>
              <Link
                href="/"
                className="px-5 py-3 rounded-lg bg-transparent text-secondary-800 font-iranSans font-thin text-base flex items-center justify-center gap-x-2 hover:text-primary-900 hover:bg-secondary-100 transition-all ease-linear duration-200"
              >
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
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                  />
                </svg>

                <span className="flex-1">سفارشات</span>
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="px-5 py-3 rounded-lg bg-transparent text-secondary-800 font-iranSans font-thin text-sm flex items-center justify-center gap-x-2 hover:text-primary-900 hover:bg-secondary-100 transition-all ease-linear duration-200"
              >
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
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>

                <span className="flex-1">ویرایش اطلاعات</span>
              </Link>
            </li>
            <li>
              <div
                className="block px-5 py-3 text-sm hover:bg-rose-100 rounded-lg hover:text-rose-500 transition-all ease-linear duration-200"
                onClick={closeDropdown}
              >
                <button className="w-full h-full flex items-start justify-start font-iranSans font-thin text-md gap-x-2">
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
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  <span
                    onClick={logOutUserHandler}
                    className="flex-1 text-start"
                  >
                    خروج
                  </span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
