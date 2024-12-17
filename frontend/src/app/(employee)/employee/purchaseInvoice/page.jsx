import { Formik } from "formik";
import { createNewPurchaseInvoiceSchema } from "@/validators/admin";

export default function PurchaseInvoice() {
  const createInvoiceHandler = () => {};
  return (
    <>
      <Formik
        initialValues={createNewPurchaseInvoiceSchema}
        onSubmit={createInvoiceHandler}
      ></Formik>
    </>
  );
}
