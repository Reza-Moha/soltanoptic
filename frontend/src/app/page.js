"use client";
import Header from "@/components/main/Header";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Ripple } from "@/components/magicui/ripple";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Meteors } from "@/components/magicui/meteors";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);
  return (
    <>
      <div className="h-screen">
        <Header />
        <main className="bg-slate-800">
          <div
            style={{ direction: "ltr" }}
            className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background bg-gradient-to-br from-gray-700 via-gray-900 to-black"
          >
            <div className="z-50 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-slate-900">
              <TextAnimate animation="blurInUp" by="character" duration={5}>
                Soltan Optic Accounting Web Application
              </TextAnimate>
            </div>
            <Ripple />

            <Meteors number={30} />
          </div>
        </main>
      </div>
    </>
  );
}
