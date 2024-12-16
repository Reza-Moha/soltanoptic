import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import Modal from "@/components/Ui/Modal";
import { useDispatch } from "react-redux";
import { createNewEmployeeSchema } from "@/validators/admin";
import FileInput from "@/components/Ui/FileInput";
import { updateEmployee } from "@/redux/slices/employee.slice";
import Image from "next/image";

export default function EditEmployeeModal({ employee, show, onClose }) {
  const [previewImage, setPreviewImage] = useState("");
  const dispatch = useDispatch();

  const handleUpdateEmployee = (values) => {
    console.log("Form values:", values);
    dispatch(updateEmployee({ id: employee.id, values }));
    onClose();
  };

  useEffect(() => {
    if (employee?.profileImage) {
      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${employee.profileImage}`;
      setPreviewImage(imageUrl);
    }
  }, [employee?.profileImage]);

  return (
    <Modal title="ویرایش همکار" onClose={onClose} show={show}>
      <Formik
        initialValues={{
          fullName: employee?.fullName || "",
          phoneNumber: employee?.phoneNumber || "",
          nationalId: employee?.nationalId || "",
          profileImage: employee?.profileImage || "",
          description: employee?.description || "",
          gender: employee?.gender || "",
          jobTitle: employee?.jobTitle || "",
        }}
        onSubmit={handleUpdateEmployee}
        validationSchema={createNewEmployeeSchema}
      >
        {({ handleSubmit, setFieldValue, errors, touched }) => (
          <Form onSubmit={handleSubmit} className="grid md:grid-cols-2">
            <Input label="جنسیت" name="gender" />
            <Input label="نام و نام خانوادگی" name="fullName" />
            <Input label="شماره تماس" name="phoneNumber" />
            <Input label="کدملی" name="nationalId" />
            <Input label="عنوان شغلی" name="jobTitle" />
            <Input label="توضیحات" name="description" />

            {/* Image Upload Section */}
            <div className="col-span-2 w-full flex items-center justify-center">
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
                    onChange={async (event) => {
                      const file = event.target.files[0];
                      setFieldValue("profileImage", file);
                      setPreviewImage(URL.createObjectURL(file));
                    }}
                  />
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        alt={employee?.fullName || "پیش‌نمایش تصویر"}
                        src={previewImage}
                        className="rounded-full object-cover"
                        width={112}
                        height={112}
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
            {errors.profileImage && (
              <span className="col-span-2 p-1 text-sm text-rose-500 bg-rose-100 rounded-md shadow-lg shadow-white/50">
                {errors.profileImage}
              </span>
            )}
            <div className="col-span-2">
              <SubmitBtn type="submit">ویرایش</SubmitBtn>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
