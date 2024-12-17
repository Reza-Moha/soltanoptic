"use client";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { createNewPurchaseInvoiceSchema } from "@/validators/admin";
import { PersonalInformation } from "@/app/(employee)/employee/purchase-invoice/_components/PersonalInformation";
import PurchaseInvoiceInput from "@/app/(employee)/employee/purchase-invoice/_components/InputInvoice";

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
          <div className="h-screen md:w-[95%] grid grid-cols-1 md:grid-cols-5 gap-4 backdropBox p-5">
            <PurchaseInvoiceInput
              label="شماره قبض"
              name="invoiceNumber"
              type="text"
            />
            <PersonalInformation />

            <SubmitBtn>ایجاد</SubmitBtn>
          </div>
        </Form>
      )}
    </Formik>
  );
}
