"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import BasicWrapper from "../BasicWrapper";
import { Form, Formik } from "formik";
import { createNewLensCategoriesSchema } from "@/validators/admin";
import { ImageInput } from "@/components/Ui/ImageInput";
import {
  createNewLensCategoires,
  fetchAllLensCategories,
} from "@/redux/slices/lensSlice";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { LensCategoriesList } from "./ListOfLensCategories";

export default function LensCategories() {
  const dispatch = useDispatch();

  const createNewLensCategoriesHandler = (values, { resetForm }) => {
    dispatch(createNewLensCategoires(values));
    resetForm();
  };
  return (
    <>
      <BasicWrapper title="تعریف دسته بندی عدسی">
        <Formik
          initialValues={{ lensName: "", lensCategoryImage: "" }}
          onSubmit={createNewLensCategoriesHandler}
          validationSchema={createNewLensCategoriesSchema}
        >
          {({ handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2">
                <Input
                  label="عنوان دسته بندی عدسی"
                  name="lensName"
                  type="text"
                  bg="bg-white"
                />
                <ImageInput
                  setFieldValue={setFieldValue}
                  name="lensCategoryImage"
                  prevTitle="عکس دسته بندی"
                />
                <div className="col-span-2 px-10">
                  <SubmitBtn>ایجاد</SubmitBtn>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <LensCategoriesList />
      </BasicWrapper>
    </>
  );
}
