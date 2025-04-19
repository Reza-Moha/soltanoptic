"use client";
import React from "react";
import { motion } from "framer-motion";

const TextRevealCard = ({
  text,
  revealText,
  byText,
  icon,
  isPassed,
  isActive,
}) => {
  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    active: {
      scale: [1, 1.3, 1],
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
    passed: {
      scale: 1.2,
      color: "#10B981", // emerald-500
    },
  };

  return (
    <div className="flex flex-col items-center min-w-[120px] px-3">
      <motion.div
        className={`w-12 h-12 flex items-center justify-center text-xl rounded-full border-2 ${
          isActive
            ? "border-emerald-500 text-emerald-500"
            : isPassed
              ? "border-emerald-300 text-emerald-400"
              : "border-gray-300 text-gray-300"
        }`}
        variants={iconVariants}
        initial="initial"
        animate={isActive ? "active" : isPassed ? "passed" : "initial"}
      >
        {icon}
      </motion.div>
      <div className="text-xs mt-2 text-center text-gray-600 font-semibold">
        {text}
      </div>
      <div className="text-[10px] text-gray-500 mt-1">{revealText}</div>
      {byText && (
        <div className="text-[10px] text-gray-400">توسط: {byText}</div>
      )}
    </div>
  );
};

export default TextRevealCard;
