"use client";
import Lottie from "lottie-react";
import React from "react";

export const LottieAnimation = ({
  animationData,
  width = "100%",
  height = "100%",
  loop = true,
  autoplay = true,
  speed = 1,
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`lottie-container ${className}`}
      style={{ width, height, ...style }}
    >
      <Lottie
        autoplay={autoplay}
        loop={loop}
        src={animationData}
        speed={speed}
        style={{ width: "100%", height: "100%" }}
        animationData={animationData}
      />
    </div>
  );
};
