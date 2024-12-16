"use client";
import { useSelector } from "react-redux";
import { toPersianDigits } from "@/utils";
import { TbKeyframeAlignHorizontal } from "react-icons/tb";
export const TotalColorCount = () => {
  const {
    totalColorCount,

    isLoading,
  } = useSelector((state) => state.frameSlice);
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="inline-flex items-center justify-center gap-x-1">
        <TbKeyframeAlignHorizontal size={20} />
        <p>تعداد کل فریم موجود انبار:</p>
      </div>
      {isLoading || totalColorCount < 0 ? (
        <div className="spinner-mini"></div>
      ) : (
        <span className={`${totalColorCount === 0 ? "text-rose-500" : ""}`}>
          {toPersianDigits(totalColorCount)}
          <span className="mr-0.5 text-xs"> عدد</span>
        </span>
      )}
    </div>
  );
};
