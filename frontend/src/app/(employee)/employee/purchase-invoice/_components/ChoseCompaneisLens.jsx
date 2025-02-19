"use client";
import { useSelector } from "react-redux";
import { Field } from "formik";
import SelectInput from "@/components/Ui/SelectInput";

export const ChoseCompaniesLens = ({ values }) => {
  const { companyList } = useSelector((state) => state.companiesSlice);
  const companyOptions = companyList.map((company) => ({
    value: company.CompanyId,
    label: company.companyName,
  }));

  return (
    <>
      {values.prescriptions[0]?.lens !== {} ? (
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
      ) : null}
    </>
  );
};
