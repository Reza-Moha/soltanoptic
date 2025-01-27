"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { fetchAllInsurance } from "@/redux/slices/insuranceSlice";
import { fetchAllFrame } from "@/redux/slices/frame.slice";
import { fetchAllLens } from "@/redux/slices/lensSlice";
import { fetchAllBanks } from "@/redux/slices/bankSlice";
import { fetchAllCompanies } from "@/redux/slices/companiesSlice";
export const EmployeeDashboardWrapper = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchAllInsurance());
    dispatch(fetchAllFrame());
    dispatch(fetchAllLens({ page: 1, size: 10 }));
    dispatch(fetchAllBanks());
    dispatch(fetchAllCompanies());
  }, [dispatch]);
  return <div className="xl:max-w-screen-xl">{children}</div>;
};
