"use client";

import SelectInput from "@/components/Ui/SelectInput";
import { Field } from "formik";
import { useSelector } from "react-redux";

export default function NewFrameOptions() {
  const { frameCategory, frameType, frameGender } = useSelector(
    (state) => state.frameSlice
  );

  const frameCategoryOptions = frameCategory.map((FCategory) => ({
    value: FCategory.id,
    label: FCategory.title,
  }));
  const frameTypeOptions = frameType.map((FType) => ({
    value: FType.id,
    label: FType.title,
  }));
  const frameGenderOptions = frameGender.map((FGender) => ({
    value: FGender.id,
    label: FGender.gender,
  }));
  return (
    <>
      <div className="px-4 flex items-center">
        <Field
          name="frameCategory"
          component={SelectInput}
          options={frameCategoryOptions}
          isMulti={false}
          placeholder="دسته بندی"
        />
      </div>
      <div className="px-4 flex items-center">
        <Field
          name="frameType"
          component={SelectInput}
          options={frameTypeOptions}
          isMulti={false}
          placeholder="نوع"
        />
      </div>
      <div className="px-4 flex items-center">
        <Field
          name="frameGender"
          component={SelectInput}
          options={frameGenderOptions}
          isMulti={false}
          placeholder="جنسیت"
        />
      </div>
    </>
  );
}
