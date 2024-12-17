"use client";

import { toPersianDigits } from "@/utils";
import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";

const DateTime = ({ className, textColor }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const persianDate = new Intl.DateTimeFormat("fa-IR", options).format(now);

      const hours = toPersianDigits(now.getHours());
      const minutes = toPersianDigits(now.getMinutes());
      const seconds = toPersianDigits(now.getSeconds());
      const time = `${hours}:${minutes}:${seconds}`;

      setCurrentDate(persianDate);
      setCurrentTime(time);
    };

    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`select-none pointer-events-none font-iranSans flex items-center justify-between rounded-xl  backdrop-blur-sm shadow-lg backdrop-brightness-150  p-2 ml-2 ${textColor}`}
    >
      <p className="text-xs font-bold ml-2 flex-1">{currentDate}</p>
      <div className="flex items-center space-x-2">
        <FaClock className={`ml-4 ${textColor}`} />
        <p
          className="text-md w-[50px] text-center"
          style={{ direction: "ltr" }}
        >
          {currentTime}
        </p>
      </div>
    </div>
  );
};

export default DateTime;
