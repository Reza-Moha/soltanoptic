import React, { useMemo } from "react";
import Select from "react-select";
import { ErrorMessage } from "formik";

const SelectInput = ({
  field,
  form,
  options,
  isMulti = false,
  isDisabled = false,
  isLoading = false,
  placeholder = "Select...",
  className = "",
  ...props
}) => {
  const handleChange = (selectedOption) => {
    const selectedValues = isMulti
      ? selectedOption
        ? selectedOption.map((option) => option.value)
        : []
      : selectedOption
      ? selectedOption.value
      : "";
    form.setFieldValue(field.name, selectedValues);
  };

  const value = useMemo(
    () =>
      isMulti
        ? options.filter((option) => field.value.includes(option.value))
        : options.find((option) => option.value === field.value) || null,
    [field.value, isMulti, options]
  );

  return (
    <div className={`w-full flex flex-col mb-4 font-iranSans p-2 ${className}`}>
      <Select
        {...field}
        {...props}
        isMulti={isMulti}
        isDisabled={isDisabled}
        isLoading={isLoading}
        placeholder={placeholder}
        instanceId={placeholder}
        value={value}
        onChange={handleChange}
        options={options}
        classNamePrefix="react-select"
        className={`react-select-container${
          form.touched[field.name] && form.errors[field.name]
            ? "border-red-500"
            : ""
        }`}
      />
      <ErrorMessage
        name={field.name}
        component="p"
        className="text-red-500 text-xs font-bold mt-2"
      />
    </div>
  );
};

export default SelectInput;
