"use client";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import BasicWrapper from "../BasicWrapper";
import { createNewLensTypeSchema } from "@/validators/admin";
import { createNewLensType, fetchAllLensType } from "@/redux/slices/lensSlice";
import { useEffect } from "react";
import { LensTypelist } from "./listOfLensType";

export default function LensType() {
  const dispatch = useDispatch();

  const createNewLensTypeHandler = (values, { resetForm }) => {
    dispatch(createNewLensType(values));
    resetForm();
  };

  return (
    <BasicWrapper title="تعریف نوع عدسی">
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={createNewLensTypeHandler}
        validationSchema={createNewLensTypeSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="عنوان نوع عدسی"
                name="title"
                type="text"
                bg="bg-white"
              />
              <Input
                label="توضیحات"
                name="description"
                type="text"
                bg="bg-white"
              />
              <SubmitBtn>ایجاد</SubmitBtn>
            </div>
          </Form>
        )}
      </Formik>
      <LensTypelist />
    </BasicWrapper>
  );
}
