"use client";
import { useDispatch } from "react-redux";
import BasicWrapper from "../BasicWrapper";
import { Form, Formik } from "formik";
import { createNewFrameCategorySchema } from "@/validators/admin";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import ListOfFrameType from "./ListOfFrameType";
import { createNewFrameType } from "@/redux/slices/frame.slice";

export default function LensCategories() {
  const dispatch = useDispatch();

  const createNewFrameTypeHandler = (values, { resetForm }) => {
    dispatch(createNewFrameType(values));
    resetForm();
  };
  return (
    <>
      <BasicWrapper title="تعریف نوع فریم">
        <Formik
          initialValues={{ title: "", description: "" }}
          onSubmit={createNewFrameTypeHandler}
          validationSchema={createNewFrameCategorySchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2">
                <Input
                  label="عنوان دسته بندی فریم"
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

                <div className="col-span-2 px-10">
                  <SubmitBtn>ایجاد</SubmitBtn>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <ListOfFrameType />
      </BasicWrapper>
    </>
  );
}
