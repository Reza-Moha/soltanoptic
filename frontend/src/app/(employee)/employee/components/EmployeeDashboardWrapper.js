"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllInsurance } from "@/redux/slices/insuranceSlice";

export const EmployeeDashboardWrapper = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInsurance());
  }, []);
  return <div className="xl:max-w-screen-xl">{children}</div>;
};
