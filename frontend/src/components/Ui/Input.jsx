"use client";
import React from "react";
import { useField } from "formik";

export default function Input({ label, bg, ...props }) {
  const [field, meta] = useField(props);

  return (
    <div className="mb-4 font-iranSans p-2 relative">
      <label className="block text-secondary-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        className={`textField__input ${bg} ${
          meta.touched && meta.error ? "border-rose-500" : ""
        }`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <p className="text-rose-500 text-xs font-bold mt-2">{meta.error}</p>
      ) : null}
    </div>
  );
}
