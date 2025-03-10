"use client";

import { BasicDefinitionsLinks } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AsideBasicDefinition() {
  const pathName = usePathname();

  return (
    <div className="flex flex-col items-center text-center justify-center p-1 gap-2">
      {BasicDefinitionsLinks.map((link) => {
        return (
          <div
            key={link.id}
            className={`inline-flex items-center gap-x-1 text-center w-full lg:w-10/12 justify-center rounded p-2 ${
              pathName === `/admin/basic-definitions/${link.href}`
                ? "bg-slate-300  text-slate-800"
                : "bg-transparent border border-slate-300"
            }`}
          >
            <div className="h-full border-l border-slate-500 pl-1">
              {link.svg}
            </div>
            <Link
              className={`${link.className} flex-1 font-iranSans transition-all ease-linear duration-300`}
              href={link.href}
            >
              {link.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
