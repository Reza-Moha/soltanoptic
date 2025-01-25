"use client";
import React from "react";
import { useField } from "formik";

export const PriceInput = ({ label, bg = "bg-white", ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;

  const formatWithCommas = (value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setValue(formatWithCommas(value));
  };

  return (
    <div className="mb-4 font-iranSans p-2 relative">
      <label className="block text-secondary-600 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        className={`textField__input ${bg} ${
          meta.touched && meta.error ? "border-rose-500" : ""
        }`}
        {...field}
        {...props}
        value={field.value || ""}
        onChange={handleChange}
        type="text"
        inputMode="numeric"
        pattern="[0-9,]*"
      />
      {meta.touched && meta.error ? (
        <p className="text-rose-500 text-xs font-bold mt-2">{meta.error}</p>
      ) : null}
    </div>
  );
};
