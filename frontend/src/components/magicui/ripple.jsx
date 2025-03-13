import React, { memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Ripple = memo(function Ripple({
  mainCircleSize = 350,
  mainCircleOpacity = 0.9,
  numCircles = 8,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center select-none [mask-image:linear-gradient(to_bottom,white,transparent)]",
        className,
      )}
      {...props}
    >
      {/* لوگو در مرکز */}
      <div className="absolute w-16 h-16 flex items-center justify-center">
        <Image
          priority="false"
          src="/image/logoWhite.svg"
          alt="logo"
          width={60}
          height={60}
        />
      </div>

      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.1;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;

        return (
          <div
            key={i}
            className="absolute animate-ripple rounded-full border shadow-xl"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              animationDelay,
              borderStyle,
              borderWidth: "1px",
              borderColor: `rgba(0, 0, 0, ${borderOpacity / 100})`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1)",
              background: `radial-gradient(circle, 
                rgba(243, 244, 246, ${opacity}) 0%, 
                rgba(209, 213, 219, ${opacity * 0.5}) 50%, 
                rgba(209, 213, 219, 0) 100%)`,
            }}
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
