"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Formik, Form } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import BasicWrapper from "../BasicWrapper";
import PermissionsList from "./PermissionsList";
import { createNewPermissionsSchema } from "@/validators/admin";
import {
  createPermission,
  fetchPermissions,
} from "@/redux/slices/permissionSlice";

export default function Permission() {
  const dispatch = useDispatch();

  const createNewPermissionHandler = (values, { resetForm }) => {
    dispatch(createPermission(values));
    resetForm();
  };

  return (
    <BasicWrapper title="تعریف سطح دسترسی">
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={createNewPermissionHandler}
        validationSchema={createNewPermissionsSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="عنوان سطح دسترسی"
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
      <PermissionsList />
    </BasicWrapper>
  );
}
