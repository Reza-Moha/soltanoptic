"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserProfile } from "@/redux/slices/authSlice";
export const EmployeeDashboardWrapper = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  return (
    <section className="h-screen relative p-4 md:p-6 lg:p-10 font-iranSans text-slate-100">
      {children}
    </section>
  );
};
