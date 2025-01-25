import Link from "next/link";
import { useSelector } from "react-redux";

const roles = process.env.NEXT_PUBLIC_ROLES;

const roleToPath = Object.freeze(
  roles
    ? roles.split(",").reduce((acc, rolePair) => {
        const [key, value] = rolePair.split(":");
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {})
    : {},
);

const ConditionalLink = () => {
  const { user } = useSelector((state) => state.auth);
  const href = roleToPath[user.role] || "/user/dashboard";

  return (
    <Link
      href={href}
      className="px-5 py-3 rounded-lg mt-2 bg-transparent text-secondary-800 font-iranSans font-thin text-md flex items-center justify-center gap-x-2 hover:text-primary-900 hover:bg-secondary-100 transition-all ease-linear duration-200"
    >
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
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>

      <span className="flex-1">داشبورد</span>
    </Link>
  );
};

export default ConditionalLink;
