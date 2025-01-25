"use client";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export function AdminProvider({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return children;
}
