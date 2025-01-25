"use client";
import Header from "@/components/main/Header";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);
  return (
    <>
      <main className="h-screen">
        <Header />
        <h1>سلطان اپتیک</h1>
      </main>
    </>
  );
}
