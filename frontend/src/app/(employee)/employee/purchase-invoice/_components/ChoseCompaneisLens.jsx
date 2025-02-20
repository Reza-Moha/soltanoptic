"use client";
import { useSelector } from "react-redux";
import { Field } from "formik";
import SelectInput from "@/components/Ui/SelectInput";

export const ChoseCompaniesLens = ({ values }) => {
  const { companyList } = useSelector((state) => state.companiesSlice);

  const companyOptions = companyList.map(({ CompanyId, companyName }) => ({
    value: CompanyId,
    label: companyName,
  }));

  const hasLens = Boolean(
    values.prescriptions?.[0]?.lens &&
      Object.keys(values.prescriptions[0].lens).length
  );

  if (!hasLens) return null;

  return (
    <Field
      name="orderLensFrom"
      component={SelectInput}
      options={companyOptions}
      isMulti={false}
      placeholder="سفارش عدسی به"
      className="!p-0 scale-90 col-span-1 md:col-span-2 !z-40"
      svgWidth="15"
      svgHeight="15"
    />
  );
};
