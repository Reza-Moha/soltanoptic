"use client";
import Input from "@/components/Ui/Input";
import { PriceInput } from "@/components/Ui/PriceInput";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { createNewDoctorSchema } from "@/validators/admin";
import { Form, Formik } from "formik";
import { DoctorsList } from "../../_components/doctors/doctorsList";
import { useDispatch } from "react-redux";
import { createNewDoctor } from "@/redux/slices/doctors.slice";

export default function Doctors() {
  const dispatch = useDispatch();

  const createNewDoctorHandler = (values, { resetForm }) => {
    dispatch(createNewDoctor(values));
    resetForm();
  };

  return (
    <section>
      <Formik
        initialValues={{
          fullName: "",
          visitPrice: "",
          medicalSystemNumber: "",
        }}
        onSubmit={createNewDoctorHandler}
        validationSchema={createNewDoctorSchema}
      >
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-2">
            <Input
              label="نام و نام خانوادگی"
              name="fullName"
              type="text"
              value={values.fullName}
              onChange={(e) => setFieldValue("fullName", e.target.value)}
            />
            <Input
              label="شماره نظام پزشکی"
              name="medicalSystemNumber"
              type="text"
              value={values.medicalSystemNumber}
              onChange={(e) =>
                setFieldValue("medicalSystemNumber", e.target.value)
              }
            />

            <PriceInput
              label="مبلغ ویزیت"
              name="visitPrice"
              type="text"
              value={values.visitPrice}
              onChange={(e) => setFieldValue("visitPrice", e.target.value)}
            />

            <div className="md:col-span-3 mx-auto w-full md:w-1/3 lg:w-1/2">
              <SubmitBtn>ایجاد</SubmitBtn>
            </div>
          </Form>
        )}
      </Formik>
      <DoctorsList />
    </section>
  );
}
