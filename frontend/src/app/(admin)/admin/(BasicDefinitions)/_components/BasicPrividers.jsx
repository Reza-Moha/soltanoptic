"use client";
import { fetchAllDoctors } from "@/redux/slices/doctors.slice";
import {
  fetchAllFrame,
  fetchAllFrameCategories,
  fetchAllFrameGender,
  fetchAllFrameType,
} from "@/redux/slices/frame.slice";
import {
  fetchAllLens,
  fetchAllLensCategories,
  fetchAllLensType,
  fetchAllRefractiveIndex,
} from "@/redux/slices/lensSlice";
import { fetchPermissions } from "@/redux/slices/permissionSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function BasicPrividers({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllDoctors());
    dispatch(fetchAllLens({ page: 1 }));
    dispatch(fetchAllLensCategories());
    dispatch(fetchAllRefractiveIndex());
    dispatch(fetchAllLensType());
    dispatch(fetchPermissions());
    dispatch(fetchAllFrameCategories());
    dispatch(fetchAllFrameType());
    dispatch(fetchAllFrameGender());
    dispatch(fetchAllFrame());
  }, [dispatch]);
  return children;
}
