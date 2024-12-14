"use client";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import BasicWrapper from "../BasicWrapper";
import { createNewInsuranceSchema } from "@/validators/admin";
import { createNewInsurance } from "@/redux/slices/insuranceSlice";
import InsuranceList from "@/app/(admin)/admin/(BasicDefinitions)/_components/insurance/InsuranceList";
import { PriceInput } from "@/components/Ui/PriceInput";

export default function CreateInsurance() {
  const dispatch = useDispatch();

  const createNewInsuranceHandler = (values, { resetForm }) => {
    dispatch(createNewInsurance(values));
    resetForm();
  };

  return (
    <BasicWrapper title="تعریف بیمه های طرف قرارداد" open={true}>
      <Formik
        initialValues={{
          insuranceName: "",
          insurancePrice: "",
          panelUserName: "",
          websiteLink: "",
          panelPassword: "",
          description: "",
        }}
        onSubmit={createNewInsuranceHandler}
        validationSchema={createNewInsuranceSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="نام بیمه"
                name="bankName"
                type="text"
                bg="bg-white"
              />
              <PriceInput
                label="مبلغ حواله"
                name="insurancePrice"
                type="text"
              />
              <Input
                label="لینک وب سایت"
                name="websiteLink"
                type="text"
                bg="bg-white"
              />
              <Input
                label="نام کاربری پنل بیمه"
                name="panelUserName"
                type="text"
                bg="bg-white"
              />

              <Input
                label="رمز عبور پنل بیمه"
                name="panelPassword"
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
      {/*<InsuranceList />*/}
    </BasicWrapper>
  );
}
