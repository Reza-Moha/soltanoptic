"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Ui/Button";
import FileInput from "@/components/Ui/FileInput";
import Input from "@/components/Ui/Input";
import { Formik } from "formik";
import { useSelector } from "react-redux";
import { updateAdminProfileSchema } from "@/validators/admin";
import { updateAdminProfileApi } from "@/services/admin/admin.service";
import Image from "next/image";
import toast from "react-hot-toast";
import SubmitBtn from "@/components/Ui/SubmitBtn";

export default function Me() {
  const { user } = useSelector((state) => state.auth);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (user?.profileImage) {
      setPreviewImage(
        `${process.env.NEXT_PUBLIC_API_URL}/${user.profileImage}`
      );
    }
  }, [user?.profileImage]);

  const initial = {
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    profileImage: user?.profileImage || "",
  };

  const editeAdminHandler = async (values) => {
    try {
      const data = await updateAdminProfileApi(values);
      if (data?.statusCode === 200) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="h-screen p-10 flex items-center justify-center bg-gray-100/60 font-iranSans">
      <div className="container max-w-screen-sm rounded-lg border border-secondary-50 bg-white px-2">
        <Formik
          initialValues={initial}
          onSubmit={editeAdminHandler}
          enableReinitialize={true}
          validationSchema={updateAdminProfileSchema}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <>
              <div className="overflow-hidden shadow-sm">
                <div className="h-28 w-full bg-gradient-to-tl from-secondary-200 to-secondary-100/30 flex items-start justify-center md:items-center">
                  <p className="mt-4 md:mt-0 md:text-base text-secondary-600 px-2 py-1 rounded-lg bg-white font-bold text-sm">
                    بزرگترین مجموعه اپتیکی شمال غرب کشور
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="bg-white">
                  <div className="-translate-y-14 flex relative items-center md:items-end flex-col md:flex-row">
                    <div className="relative h-28 w-28 border-[5px] border-white md:mr-7 rounded-full overflow-hidden">
                      <label
                        htmlFor="profileImage"
                        className="flex items-center justify-center w-full h-full rounded-full cursor-pointer bg-gradient-to-tl from-secondary-300 to-secondary-100 relative"
                      >
                        <FileInput
                          name="profileImage"
                          accept=".jpg,.jpeg,.png"
                          id="profileImage"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files[0];
                            setFieldValue("profileImage", file);
                            setPreviewImage(URL.createObjectURL(file));
                          }}
                        />
                        {previewImage ? (
                          <div className="relative w-full h-full">
                            <Image
                              alt={user?.fullName || "پیش‌نمایش تصویر"}
                              src={previewImage}
                              className="rounded-full object-cover"
                              width="112"
                              height="112"
                              priority
                            />
                          </div>
                        ) : (
                          <p className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                            عکس پروفایل
                          </p>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="نام و نام خانوادگی"
                      name="fullName"
                      type="text"
                      values={values.fullName}
                      bg="bg-secondary-100"
                    />
                    <Input
                      label="شماره موبایل"
                      name="phoneNumber"
                      type="text"
                      values={values.phoneNumber}
                      bg="bg-secondary-100"
                    />
                    <SubmitBtn>ویرایش اطلاعات</SubmitBtn>
                  </div>
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
    </section>
  );
}
