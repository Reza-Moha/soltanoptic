"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import BasicWrapper from "../BasicWrapper";
import { createNewInsuranceSchema } from "@/validators/admin";
import { createNewInsurance } from "@/redux/slices/insuranceSlice";
import { PriceInput } from "@/components/Ui/PriceInput";
import { toPersianDigits } from "@/utils";
import { FaRegTrashCan } from "react-icons/fa6";
import { InsuranceList } from "./ListInsurance";

export default function CreateInsurance() {
  const dispatch = useDispatch();
  const [documentList, setDocumentList] = useState([]);
  const [newDocument, setNewDocument] = useState("");
  const addDocument = () => {
    if (newDocument.trim()) {
      setDocumentList([...documentList, newDocument]);
      setNewDocument("");
    }
  };
  const createNewInsuranceHandler = (values, { resetForm }) => {
    const dataToSend = {
      ...values,
      documents: documentList,
    };

    dispatch(createNewInsurance(dataToSend));
    resetForm();
    setDocumentList([]);
  };
  const removeDocument = (index) => {
    setDocumentList(documentList.filter((_, i) => i !== index));
  };
  return (
    <BasicWrapper title="تعریف بیمه های طرف قرارداد" open={true}>
      <Formik
        initialValues={{
          insuranceName: "",
          insuranceFranchise: "",
          panelUserName: "",
          websiteLink: "",
          panelPassword: "",
          description: "",
          documents: "",
        }}
        onSubmit={createNewInsuranceHandler}
        validationSchema={createNewInsuranceSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="نام بیمه"
                name="insuranceName"
                type="text"
                bg="bg-white"
              />
              <PriceInput
                label="درصد فرانشیز"
                name="insuranceFranchise"
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
              <Input
                label="مدارک بیمه"
                name="documents"
                type="text"
                bg="bg-white"
                value={newDocument}
                onChange={(e) => setNewDocument(e.target.value)}
              />
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={addDocument}
                  className="btn--secondary py-2 rounded px-1 h-10 w-1/2"
                >
                  افزودن مدارک لازم
                </button>
              </div>
              <div className="md:col-span-3 px-2">
                <ul className="mt-4">
                  {documentList.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-center items-center w-full md:w-1/2 px-5 py-1 border border-green-200  bg-green-50 text-green-700 rounded-md mb-2 text-xs font-semibold"
                    >
                      <span className="flex-1">
                        {toPersianDigits(item || 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-rose-400 hover:bg-red-300 p-1 rounded-full hover:text-slate-800"
                      >
                        <FaRegTrashCan />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <SubmitBtn>ایجاد</SubmitBtn>
            </div>
          </Form>
        )}
      </Formik>
      <InsuranceList />
    </BasicWrapper>
  );
}
