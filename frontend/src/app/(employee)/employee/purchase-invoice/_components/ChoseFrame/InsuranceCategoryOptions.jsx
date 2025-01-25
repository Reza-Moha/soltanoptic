"use client";
import { Field } from "formik";
import SelectInput from "@/components/Ui/SelectInput";
import { useSelector } from "react-redux";

export const InsuranceCategoryOptions = () => {
  const { insuranceList } = useSelector((state) => state.insuranceSlice);
  const insuranceCategoryOptions = insuranceList.map((insurance) => ({
    value: insurance.id,
    label: insurance.insuranceName,
  }));
  return (
    <>
      <Field
        name="insuranceName"
        component={SelectInput}
        options={insuranceCategoryOptions}
        isMulti={false}
        placeholder="نوع بیمه"
        className="!mt-8 !pt-0"
      />
    </>
  );
};
