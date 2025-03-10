"use client";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import Image from "next/image";
import { RegisterSchema } from "@/validators/auth";
import classNames from "classnames";
import { useState } from "react";
import Button from "@/components/Ui/Button";
import { getOtpApi } from "@/services/auth/auth.service";
import { toast } from "react-hot-toast";
import OtpForm from "@/components/tools/OtpForm";
import SubmitBtn from "@/components/Ui/SubmitBtn";

export default function Login() {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="container w-full max-w-sm bg-transparent rounded-xl shadow-xl border-2 border-[#e0e0e2] p-5 md:p-8 flex flex-col items-center justify-center gap-8 bg-slate-100  z-50 font-iranSans">
        <div className="w-full">
          <Link href="/">
            <Image
              className="mx-auto rounded-xl mb-5"
              src="/image/logoBlcak.svg"
              alt="logo"
              priority={true}
              width={80}
              height={56}
            />
          </Link>
          <div className="text-3xl font-kalame mb-2">ورود | ثبت نام</div>
          {!showOtpInput ? (
            <div className="text-lg font-kalamehReqular mb-10">
              <div>سلام!</div>
              <div>لطفا شماره موبایل خود را وارد کنید.</div>
            </div>
          ) : null}
          <Formik
            initialValues={{ phoneNumber: "" }}
            validationSchema={RegisterSchema}
            onSubmit={async (values, actions) => {
              try {
                setLoading(true);
                const { data } = await getOtpApi(values);
                if (data.statusCode === 200 || data.statusCode === 403) {
                  setShowOtpInput(true);
                  setLoading(false);
                  toast.success(data.message);
                }
                setLoading(false);
              } catch (error) {
                if (error.response.data.errors.statusCode === 403) {
                  setShowOtpInput(true);
                }
                const message = error.response.data.errors.message;
                toast.error(message);
                setLoading(false);
              }
            }}
          >
            {({ errors, values, touched }) => (
              <>
                {!showOtpInput ? (
                  <Form>
                    <Field
                      name="phoneNumber"
                      value={values.phoneNumber}
                      id="phoneNumber"
                      autoFocus={true}
                      inputMode="numeric"
                      autoComplete="off"
                      className={classNames({
                        "text-lg rounded-lg  w-full h-12 py-3.5 px-2.5 mb-5 text-slate-800 font-bold font-iranSans text-center outline-none ring-0 focus:outline-none focus:ring-0 border border-[#7042f861] placeholder:text-slate-800": true,
                        "border-[0.170rem] border-red-600":
                          errors.phoneNumber && touched.phoneNumber,
                        "border-green-500 ": !errors.phoneNumber,
                      })}
                    />
                    {errors.phoneNumber || touched.phoneNumber ? (
                      <span className="text-sm text-red-500 font-iranSansLight">
                        {errors.phoneNumber}
                      </span>
                    ) : null}

                    <div className="w-full mt-2">
                      <SubmitBtn>ارسال رمز یکبار مصرف</SubmitBtn>
                    </div>
                  </Form>
                ) : loading ? (
                  <div className="spinner-mini" />
                ) : (
                  <div className="py-4">
                    {
                      <OtpForm
                        phoneNumber={values.phoneNumber}
                        setShowOtpInput={setShowOtpInput}
                      />
                    }
                  </div>
                )}
              </>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
