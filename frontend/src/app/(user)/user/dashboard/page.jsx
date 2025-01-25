"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllInsurance } from "@/redux/slices/insuranceSlice";

export default function UserDashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllInsurance());
  }, []);
  return (
    <>
      <h1>User DashBoard</h1>
    </>
  );
}
