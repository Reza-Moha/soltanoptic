"use client";
import { toPersianDigits } from "@/utils";
import { useSelector } from "react-redux";
export const GenderArray = () => {
  const { genderArray, isLoading } = useSelector((state) => state.frameSlice);
  return (
    <div className="">
      <div className="">
        <div className="text-center text-sm bg-slate-800 py-1 rounded-md border-slate-900 shadow shadow-slate-900">
          تعداد فریم بر اساس جنسیت
        </div>
      </div>
      {isLoading || genderArray < 0 ? (
        <div className="spinner-mini"></div>
      ) : (
        <div className="grid grid-cols-4 gap-3 p-1">
          {genderArray.length > 0
            ? genderArray.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg text-slate-900 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-600 to-indigo-200"
                  >
                    <span className="text-sm font-bold">{item.gender}</span>
                    <span className="text-base">
                      {toPersianDigits(item.count)}
                    </span>
                  </div>
                );
              })
              : <div className="col-span-4 w-full text-red-500 font-bold text-xs">فریمی در انبار موجود نیست</div>}
        </div>
      )}
    </div>
  );
};
