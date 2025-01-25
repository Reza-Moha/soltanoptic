import { FaceFrownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function notFoundFrame() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 font-iranSans">
      <FaceFrownIcon className="w-10 text-secondary-400" />
      <h2 className="text-xl font-semibold">
        صفحع ای که دنبالش بودید - پیدا نشد
      </h2>
      <p>فریمی با این مشخصات پیدا نشد</p>
      <Link
        href="/admin/basic-definitions/frames"
        className="mt-4 rounded-md bg-primary-500 px-4 py-1 text-sm text-white transition-colors hover:bg-primary-400
      "
      >
        برگشت
      </Link>
    </main>
  );
}
