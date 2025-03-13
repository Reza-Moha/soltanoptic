"use client";
import { toPersianDigits } from "@/utils";
import { useSelector } from "react-redux";
import { TbKeyframeAlignHorizontalFilled } from "react-icons/tb";
export const TotalInventoryValue = () => {
  const { totalInventoryValue, isLoading } = useSelector(
    (state) => state.frameSlice,
  );
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="inline-flex items-center justify-center gap-x-1">
        <TbKeyframeAlignHorizontalFilled size={20} />
        <p className="text-sm">ارزش کل فریم های انبار:</p>
      </div>
      {isLoading || totalInventoryValue < 0 ? (
        <div className="spinner-mini"></div>
      ) : (
        <span>
          {toPersianDigits(
            totalInventoryValue
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0,
          )}
          <span className="mr-0.5 text-xs"> تومان</span>
        </span>
      )}
    </div>
  );
};
