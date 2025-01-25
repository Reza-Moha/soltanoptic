"use client";
import { fetchAllFrame } from "@/redux/slices/frame.slice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {fetchAllLens} from "@/redux/slices/lensSlice";
export const AdminDashboardWrapper = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllFrame());
    dispatch(fetchAllLens())
  }, [dispatch]);
  return (
    <section className="h-screen relative font-iranSans text-slate-100 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      {children}
    </section>
  );
};
