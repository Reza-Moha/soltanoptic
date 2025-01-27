"use client";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { createNewCompanySchema } from "@/validators/admin";
import { createNewCompany } from "@/redux/slices/companiesSlice";
import CompaniesList from "@/app/(admin)/admin/(BasicDefinitions)/_components/companies/CompaniesList";

export default function CompaniesPage() {
  const dispatch = useDispatch();

  const createNewCompaniesHandler = (values, { resetForm }) => {
    dispatch(createNewCompany(values));
    resetForm();
  };

  return (
    <section>
      <Formik
        initialValues={{
          companyName: "",
          whatsappNumber: "",
        }}
        onSubmit={createNewCompaniesHandler}
        validationSchema={createNewCompanySchema}
      >
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-3">
            <Input
              label="نام شرکت"
              name="companyName"
              type="text"
              value={values.fullName}
              onChange={(e) => setFieldValue("companyName", e.target.value)}
            />
            <Input
              label="شماره تماس"
              name="whatsappNumber"
              type="text"
              value={values.whatsappNumber}
              onChange={(e) => setFieldValue("whatsappNumber", e.target.value)}
            />

            <div className="md:col-span-3 mx-auto w-full md:w-1/3 lg:w-1/2">
              <SubmitBtn>ایجاد</SubmitBtn>
            </div>
          </Form>
        )}
      </Formik>
      <CompaniesList />
    </section>
  );
}
