"use client";
import { useRef } from "react";
import { Image } from 'next/image';

export default function BgAdminDashboard() {
  const videoRef = useRef(null);



  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 flex items-center justify-center">
      <video
        ref={videoRef}
        controls={false}
        src="/video/BgAdminDashboard.mp4"
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 object-cover w-full h-full pointer-events-none transition-opacity duration-1000"
    
      ></video>
      <div className="rounded-full z-10 scale-70">
        <img src="/image/logoWhite.svg"  />
      </div>
    </div>
  );
}
