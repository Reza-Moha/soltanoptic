import { FaUserDoctor } from "react-icons/fa6";
import { GiMicroscopeLens } from "react-icons/gi";
import { BsEyeglasses } from "react-icons/bs";
export const toPersianDigits = (number) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return number.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

export const BasicDefinitionsLinks = [
  {
    id: 1,
    title: "کارمندان",
    className: "text-sm",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
      >
        <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
      </svg>
    ),
    href: "create-new-employee",
  },
  {
    id: 2,
    title: "سطح دسترسی",
    className: "text-sm",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
      >
        <path
          fillRule="evenodd"
          d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    href: "create-permissions",
  },
  {
    id: 3,
    title: "تعریف دکتر",
    className: "text-sm",
    svg: <FaUserDoctor size="20" />,
    href: "create-doctors",
  },
  {
    id: 4,
    title: "تعریف عدسی",
    className: "text-sm",
    svg: <GiMicroscopeLens size="20" />,
    href: "create-lens",
  },
  {
    id: 5,
    title: "تعریف فریم",
    className: "text-sm",
    svg: <BsEyeglasses size="20" />,
    href: "create-frame",
  },
];

export const validateNationalId = (code) => {
  if (!/^\d{10}$/.test(code)) {
    return false;
  }
  const digits = code.split("").map(Number);
  if (digits.every((digit) => digit === digits[0])) {
    return false;
  }
  const checkSum = digits
    .slice(0, 9)
    .reduce((sum, digit, index) => sum + digit * (10 - index), 0);
  const remainder = checkSum % 11;
  const controlDigit = digits[9];
  return (
    (remainder < 2 && controlDigit === remainder) ||
    (remainder >= 2 && controlDigit === 11 - remainder)
  );
};
