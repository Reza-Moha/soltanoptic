"use client";
import { useDispatch } from "react-redux";
import BasicWrapper from "../BasicWrapper";
import { Field, Form, Formik } from "formik";
import { createNewLensSchema } from "@/validators/admin";
import { useSelector } from "react-redux";
import SelectInput from "@/components/Ui/SelectInput";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import Input from "@/components/Ui/Input";
import { ImageInput } from "@/components/Ui/ImageInput";
import { createNewLens, fetchAllLens } from "@/redux/slices/lensSlice";
import { useEffect, useState } from "react";

export default function CreateNewLens() {
  const dispatch = useDispatch();
  const [resetImage, setResetImage] = useState(false);

  const createNewLensHandler = (values, { resetForm }) => {
    dispatch(createNewLens(values));
    resetForm();
    setResetImage(!resetImage);
  };
  const { lensType, lensCategories, refractiveIndexList } = useSelector(
    (state) => state.lensSlice
  );
  const lensTypeOptions = lensType.map((LType) => ({
    value: LType.id,
    label: LType.title,
  }));
  const lensCategoriesOptions = lensCategories.map((Lcategory) => ({
    value: Lcategory.id,
    label: Lcategory.lensCategoryName,
  }));
  const refractiveIndexListOptions = refractiveIndexList.map(
    (LRefractiveIndex) => ({
      value: LRefractiveIndex.id,
      label: LRefractiveIndex.index,
    })
  );

  return (
    <>
      <BasicWrapper title="افزودن عدسی به انبار">
        <Formik
          initialValues={{
            lensName: "",
            description: "",
            lensImage: "",
            LensCategoryId: "",
            RefractiveIndexId: "",
            LensTypeId: "",
          }}
          onSubmit={createNewLensHandler}
          validationSchema={createNewLensSchema}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <Form onSubmit={handleSubmit} className="grid md:grid-cols-3">
              <Field
                name="LensCategoryId"
                component={SelectInput}
                options={lensCategoriesOptions}
                isMulti={false}
                placeholder="دسته بندی عدسی"
              />
              <Field
                name="LensTypeId"
                component={SelectInput}
                options={lensTypeOptions}
                isMulti={false}
                placeholder="نوع عدسی"
              />
              <Field
                name="RefractiveIndexId"
                component={SelectInput}
                options={refractiveIndexListOptions}
                isMulti={false}
                placeholder="ضریب شکست عدسی"
              />
              <Input
                label="نام عدسی"
                name="lensName"
                type="text"
                values={values.lensName}
              />

              <Input
                label="توضیحات عدسی"
                name="description"
                type="text"
                values={values.description}
              />

              <ImageInput
                setFieldValue={setFieldValue}
                name="lensImage"
                prevTitle="عکس عدسی"
                resetPreview={resetImage}
              />

              <div className="md:col-span-3 px-10">
                <SubmitBtn>ایجاد</SubmitBtn>
              </div>
            </Form>
          )}
        </Formik>
      </BasicWrapper>
    </>
  );
}
