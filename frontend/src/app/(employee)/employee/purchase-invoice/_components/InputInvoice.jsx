"use client";
import React from "react";
import { useField } from "formik";

export default function PurchaseInvoiceInput({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <div className="mb-4 font-iranSans p-2 relative">
      <label className="block text-slate-100 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        className={`w-full py-3 px-4 rounded-xl text-slate-100 bg-slate-700 border border-slate-800  hover:border-slate-600 focus:border-slate-900 focus:bg-slate-800 transition-all duration-300 ease-out focus:shadow-lg focus:shadow-slate-600 dark:focus:shadow-secondary-200${
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
