"use client";
import Header from "@/components/main/Header";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Ripple } from "@/components/magicui/ripple";
import { TextAnimate } from "@/components/magicui/text-animate";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);
  return (
    <>
      <div className="h-screen">
        <Header />
        <main>
          <div
            style={{ direction: "ltr" }}
            className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background"
          >
            <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-slate-900">
              <TextAnimate animation="blurInUp" by="character" duration={5}>
                Soltan Optic
              </TextAnimate>
            </p>
            <Ripple />
          </div>
        </main>
      </div>
    </>
  );
}
