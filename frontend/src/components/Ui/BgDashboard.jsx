"use client";
import Image from "next/image";

export default function BgDashboard({ id = "bgDashboard" }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-0">
      <video
        id={id}
        src="/video/bgAdmin.mp4"
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 object-cover w-full h-full pointer-events-none"
      />
      <Image
        src="/image/logoWhite.svg"
        className="z-10"
        alt="سلطان اپتیک لوگو"
        width={350}
        height={350}
      />
    </div>
  );
}
