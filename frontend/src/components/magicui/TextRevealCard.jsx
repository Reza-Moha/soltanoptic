"use client";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export default function TextRevealCard({
  text,
  revealText,
  byText,
  icon = "🔘",
  isPassed = false,
  isActive = false,
  className,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={twMerge(
        "min-w-[160px] text-center rounded-xl px-4 py-3 border shadow-md transition-all duration-300",
        isPassed
          ? "bg-emerald-100 border-emerald-500 text-emerald-800"
          : "bg-gray-100 border-gray-300 text-gray-500",
        isActive && "ring-2 ring-emerald-400",
        className,
      )}
    >
      <div className="flex flex-col items-center space-y-1">
        <div className="text-2xl">{icon}</div>
        <div className="font-semibold text-sm">{text}</div>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-600"
        >
          {revealText}
        </motion.div>
        {byText && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-gray-500 mt-1"
          >
            {`توسط ${byText}`}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
