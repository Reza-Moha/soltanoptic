"use client";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import BasicWrapper from "../BasicWrapper";
import { createNewBankSchema } from "@/validators/admin";
import BankList from "@/app/(admin)/admin/(BasicDefinitions)/_components/bank/BankList";
import {createNewBank} from "@/redux/slices/bankSlice";


export default function CreateBank() {
    const dispatch = useDispatch();

    const createNewBankHandler = (values, { resetForm }) => {
        dispatch(createNewBank(values));
        resetForm();
    };

    return (
        <BasicWrapper title="تعریف بانک" open={true}>
            <Formik
                initialValues={{ bankName: "", bankAccountHolder: "",shabaNumber:"",cartNumber:"" }}
                onSubmit={createNewBankHandler}
                validationSchema={createNewBankSchema}
            >
                {({ handleSubmit, errors }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="نام بانک"
                                name="bankName"
                                type="text"
                                bg="bg-white"
                            />
                            <Input
                                label="نام صاحب حساب"
                                name="bankAccountHolder"
                                type="text"
                                bg="bg-white"
                            /><Input
                            label="شماره شباء"
                            name="shabaNumber"
                            type="text"
                            bg="bg-white"
                        /><Input
                            label="شماره کارت"
                            name="cartNumber"
                            type="text"
                            bg="bg-white"
                        />
                            <SubmitBtn>ایجاد</SubmitBtn>

                        </div>

                    </Form>
                )}
            </Formik>
            <BankList />
        </BasicWrapper>
    );
}
