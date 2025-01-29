import React, { useMemo } from "react";
import Select, { components } from "react-select";
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
  svgWidth = 20,
  svgHeight = 20,
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
    [field.value, isMulti, options],
  );

  const customDropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={svgWidth}
          height={svgHeight}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </components.DropdownIndicator>
    );
  };

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
        components={{ DropdownIndicator: customDropdownIndicator }}
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
