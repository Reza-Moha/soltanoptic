"use client";
import { useDispatch } from "react-redux";
import BasicWrapper from "../BasicWrapper";
import { useEffect } from "react";
import {
  fetchAllFrameCategories,
  fetchAllFrameGender,
  fetchAllFrameType,
} from "@/redux/slices/frame.slice";

export default function CreateNewFrame() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllFrameCategories());
    dispatch(fetchAllFrameType());
    dispatch(fetchAllFrameGender());
  }, [dispatch]);
  return <BasicWrapper title="تعریف فریم جدید به انبار"></BasicWrapper>;
}
