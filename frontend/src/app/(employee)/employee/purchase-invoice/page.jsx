"use client";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { createNewPurchaseInvoiceSchema } from "@/validators/admin";
import { PersonalInformation } from "@/app/(employee)/employee/purchase-invoice/_components/PersonalInformation";

export default function CreateBank() {
  const dispatch = useDispatch();

  const createNewPurchaseInvoiceHandler = (values) => {
    // resetForm();
  };

  const initialsValues = {
    fullName: "",
    phoneNumber: "",
  };

  return (
    <Formik
      initialValues={initialsValues}
      onSubmit={createNewPurchaseInvoiceHandler}
      validationSchema={createNewPurchaseInvoiceSchema}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="h-screen grid grid-cols-1 md:grid-cols-5 gap-4 p-5">
            <PersonalInformation />

            <SubmitBtn>ایجاد</SubmitBtn>
          </div>
        </Form>
      )}
    </Formik>
  );
}
