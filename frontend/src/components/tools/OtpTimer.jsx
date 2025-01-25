import { useEffect, useState } from "react";

export default function OtpTimer({ setShowOtpInput }) {
  const [counter, setCounter] = useState(60);
  useEffect(() => {
    const timer =
      counter !== 0
        ? setInterval(() => setCounter(counter - 1), 1000)
        : setShowOtpInput(false);
    return () => clearInterval(timer);
  }, [counter, setShowOtpInput]);
  return (
    <>
      <div className="mt-5 text-sm text-center font-YekanBakh-Bold text-slate-900 flex items-center justify-center gap-x-2">
        <p className="Text-xs">ارسال مجدد پیامک</p>
        <span className="flex items-center justify-center">
          <span className="text-rose-500">{counter}</span>:00
        </span>
      </div>
    </>
  );
}
