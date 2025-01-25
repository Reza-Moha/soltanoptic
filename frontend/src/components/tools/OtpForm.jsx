"use client";
import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import OtpTimer from "./OtpTimer.jsx";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation.js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice.jsx";

export default function OtpForm({
  phoneNumber,
  setShowOtpInput,
  codeLength = 5,
}) {
  const [otp, setOtp] = useState(new Array(codeLength).fill(""));
  const { isLoading } = useSelector((state) => state.auth);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.codeLength === codeLength) setOtp(combinedOtp);

    if (value && index < codeLength - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const result = await dispatch(
        loginUser({
          phoneNumber,
          code: otp.join(""),
        })
      );

      if (loginUser.fulfilled.match(result)) {
        router.push("/");
        toast.success(result.payload.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <>
      <form
        onSubmit={submitHandler}
        data-aos="zoom-in"
        className="flex flex-col"
      >
        <div className="text-right font-kalamehBlack text-lg">
          لطفا کد احراز هویت خود را وارد کنید
        </div>
        <div className="otpContainer flex justify-evenly items-center p-2">
          {otp.map((value, index) => {
            return (
              <input
                key={index}
                type="text"
                ref={(input) => (inputRefs.current[index] = input)}
                name="otp"
                maxLength="1"
                inputMode="numeric"
                className="otpInput"
                value={value}
                onChange={(e) => handleChange(index, e)}
                onClick={() => handleClick(index)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            );
          })}
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className="mt-10 bg-[#22C55E] py-3 px-4 rounded-lg w-full shadow shadow-green-500/20 hover:shadow-green-500/30 cursor-pointer focus:scale-95 transition-all ease-linear text-md disabled:opacity-50"
        >
          {isLoading ? <div className="spinner-mini" /> : "ورود"}
        </button>
        <OtpTimer setShowOtpInput={setShowOtpInput} />
      </form>
    </>
  );
}
