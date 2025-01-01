"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { fetchAllInsurance } from "@/redux/slices/insuranceSlice";
import {fetchAllFrame} from "@/redux/slices/frame.slice";
export const EmployeeDashboardWrapper = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchAllInsurance());
    dispatch(fetchAllFrame())
  }, [dispatch]);
  return <div className="xl:max-w-screen-xl">{children}</div>;
};
