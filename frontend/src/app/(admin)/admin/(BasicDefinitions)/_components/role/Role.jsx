"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import BasicWrapper from "../BasicWrapper";
import { createNewRoleSchema } from "@/validators/admin";
import { createNewRole, fetchRoles } from "@/redux/slices/rolesSlice";
import { useSelector } from "react-redux";
import RolesLists from "./RoleLists";
import SelectInput from "@/components/Ui/SelectInput";

export default function Role() {
  const dispatch = useDispatch();

  const { permissionsList } = useSelector((state) => state.permissionSlice);

  const createNewRoleHandler = (values) => {
    dispatch(createNewRole(values));
  };

  const permissionOptions = permissionsList.map((permission) => ({
    value: permission.permissionId,
    label: permission.title,
  }));

  return (
    <BasicWrapper title="تعریف نقش">
      <Formik
        initialValues={{ title: 0, description: "", permissionsIds: [] }}
        onSubmit={createNewRoleHandler}
        validationSchema={createNewRoleSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <Input
                  label="عنوان نقش"
                  name="title"
                  type="text"
                  bg="bg-white"
                />
              </div>

              <div className="flex items-center mb-4 px-3">
                <Field
                  name="permissionsIds"
                  component={SelectInput}
                  options={permissionOptions}
                  isMulti={true}
                  placeholder="لطفا دسترسی را انتخاب کنید"
                />
              </div>
              <div className="mb-4">
                <Input
                  label="توضیحات"
                  name="description"
                  type="text"
                  bg="bg-white"
                />
              </div>
              <div className="row-span-1 md:col-span-4">
                <SubmitBtn>ایجاد</SubmitBtn>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <RolesLists />
    </BasicWrapper>
  );
}
