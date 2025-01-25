"use client";
import { useDispatch } from "react-redux";
import BasicWrapper from "../BasicWrapper";
import { Form, Formik } from "formik";
import { createNewFrameGenderSchema } from "@/validators/admin";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { createNewFrameGender } from "@/redux/slices/frame.slice";
import ListOfFrameGender from "./ListOfFrameGender";

export default function CreateFrameGender() {
  const dispatch = useDispatch();

  const createNewFrameGenderHandler = (values, { resetForm }) => {
    dispatch(createNewFrameGender(values));
    resetForm();
  };
  return (
    <>
      <BasicWrapper title="تعریف جنسیت فریم">
        <Formik
          initialValues={{ gender: "", description: "" }}
          onSubmit={createNewFrameGenderHandler}
          validationSchema={createNewFrameGenderSchema}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2">
                <Input
                  label="عنوان جنسیت فریم"
                  name="gender"
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
        <ListOfFrameGender />
      </BasicWrapper>
    </>
  );
}
