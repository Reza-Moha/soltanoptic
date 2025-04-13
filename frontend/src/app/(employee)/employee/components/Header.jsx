"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import Avatar from "@/components/Ui/Avatar";
import ButtonIcon from "@/components/Ui/ButtonIcon";
import { toPersianDigits } from "@/utils";
import Image from "next/image";

function EmployeeHeader() {
  const { user, isLoading } = useSelector((state) => state.auth);
  return (
    <header
      className={`bg-white ${isLoading ? "bg-opacity-30 blur-md" : ""}`}
    >
      <div className="flex items-center justify-between py-5 px-4 lg:px-8">
        <div className="flex items-center gap-x-3">
          <div className="flex flex-col lg:flex-row justify-start lg:items-center gap-x-2">
            <span className="text-sm lg:text-lg font-bold text-secondary-700">
              سلام؛ {user?.fullName}
            </span>
          </div>
        </div>
        <Image
          src="/image/logoWhite.svg"
          alt="logo"
          width={80}
          height={80}
          priority
          style={{ width: "45px", height: "45px" }}
        />
        <div className="flex items-center gap-x-3">
          <Link href="/employee/dashboard">
            <ButtonIcon
              color="outline"
              className={`border-secondary-200 rounded-2xl flex cursor-pointer items-center`}
            >
              <Avatar user={user} />
            </ButtonIcon>
          </Link>
          {user ? toPersianDigits(user.phoneNumber) : ""}
        </div>
      </div>
    </header>
  );
}
export default EmployeeHeader;
