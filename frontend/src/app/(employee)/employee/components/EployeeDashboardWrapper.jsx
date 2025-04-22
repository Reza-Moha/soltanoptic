"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { fetchAllInsurance } from "@/redux/slices/insuranceSlice";
import { fetchAllFrame } from "@/redux/slices/frame.slice";
import { fetchAllLens } from "@/redux/slices/lensSlice";
import { fetchAllBanks } from "@/redux/slices/bankSlice";
import { fetchAllCompanies } from "@/redux/slices/companiesSlice";
import {
  getAllInvoicesPaginated,
  getLastInvoiceNumber,
  getOrderLensDaily,
} from "@/redux/slices/customersSlice";
import {
  getAccountingReport,
  getEmployeePerformance,
} from "@/redux/slices/employee.slice";
export const EmployeeDashboardWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchAllInsurance());
    dispatch(fetchAllFrame());
    dispatch(fetchAllLens({ page: 1, size: 10 }));
    dispatch(fetchAllBanks());
    dispatch(fetchAllCompanies());
    dispatch(getLastInvoiceNumber());
    dispatch(getOrderLensDaily());
    dispatch(getAccountingReport());
    dispatch(getAllInvoicesPaginated({ page: 1, size: 30, search: "" }));
  }, [dispatch]);
  useEffect(() => {
    if (user?.id) {
      dispatch(getEmployeePerformance({ employeeId: user.id }));
    }
  }, [user?.id, dispatch]);
  return <div className="xl:max-w-screen-xl">{children}</div>;
};
