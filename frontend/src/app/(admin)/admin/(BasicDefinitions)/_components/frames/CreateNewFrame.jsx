"use client";
import { useDispatch } from "react-redux";
import BasicWrapper from "../BasicWrapper";
import { useEffect, useState } from "react";
import {
  fetchAllFrameCategories,
  fetchAllFrameGender,
  fetchAllFrameType,
} from "@/redux/slices/frame.slice";
import { FieldArray, Form, Formik } from "formik";
import { createNewFrameSchema } from "@/validators/admin";
import Input from "@/components/Ui/Input";
import { PriceInput } from "@/components/Ui/PriceInput";

export default function CreateNewFrame() {
  const dispatch = useDispatch();
  const [imagePreviews, setImagePreviews] = useState({}); // ذخیره پیش‌نمایش‌ها

  useEffect(() => {
    dispatch(fetchAllFrameCategories());
    dispatch(fetchAllFrameType());
    dispatch(fetchAllFrameGender());
  }, [dispatch]);

  const handleImageChange = (event, index, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // ایجاد URL پیش‌نمایش
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setFieldValue(`colors[${index}].images`, files);

      // ذخیره URL پیش‌نمایش برای نمایش به کاربر
      setImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        [index]: imageUrls,
      }));
    }
  };

  return (
    <BasicWrapper title="تعریف فریم جدید به انبار">
      <Formik
        initialValues={{
          name: "",
          price: "",
          serialNumber: "",
          description: "",
          colors: [
            {
              colorCode: "#ffffff",
              images: [],
            },
          ],
        }}
        validationSchema={createNewFrameSchema}
        onSubmit={(values, { setSubmitting }) => {
          const formData = new FormData();
          formData.append("name", values.name);
          formData.append("price", values.price);
          formData.append("serialNumber", values.serialNumber);
          formData.append("description", values.description);

          // اضافه کردن رنگ‌ها و تصاویر به FormData
          values.colors.forEach((color, index) => {
            formData.append(`colors[${index}][colorCode]`, color.colorCode);
            color.images.forEach((image) => {
              formData.append(`colors[${index}][images]`, image);
            });
          });

          console.log("Submitting form data:", formData); // لاگ برای بررسی داده‌ها

          // شبیه‌سازی درخواست به سرور (شما می‌توانید اینجا Axios یا Fetch را اضافه کنید)
          setTimeout(() => {
            console.log("Form submitted successfully!");
            setSubmitting(false);
          }, 1000);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form encType="multipart/form-data">
            <Input label="نام فریم" name="name" type="text" bg="bg-white" />

            <PriceInput
              label="قیمت فروش فریم"
              name="price"
              type="text"
              value={values.price}
              onChange={(e) => setFieldValue("price", e.target.value)}
            />

            <Input
              label="سریال فریم"
              name="serialNumber"
              type="text"
              bg="bg-white"
            />

            <Input
              label="توضیحات فریم"
              name="description"
              type="text"
              bg="bg-white"
            />

            <FieldArray
              name="colors"
              render={(arrayHelpers) => (
                <div>
                  {values.colors.map((color, index) => (
                    <div key={index}>
                      <div className="flex items-center space-x-4">
                        <Input
                          label={`Color ${index + 1}`}
                          name={`colors[${index}].colorCode`}
                          type="color"
                          value={color.colorCode}
                          onChange={(e) =>
                            setFieldValue(
                              `colors[${index}].colorCode`,
                              e.target.value
                            )
                          }
                        />

                        {/* دایره نمایش رنگ انتخاب شده */}
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{
                            backgroundColor: color.colorCode,
                            border: "1px solid #000",
                          }}
                        ></div>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        multiple // مجاز به انتخاب چند تصویر
                        onChange={(event) =>
                          handleImageChange(event, index, setFieldValue)
                        }
                      />

                      {/* نمایش پیش‌نمایش تصاویر */}
                      {imagePreviews[index] && (
                        <div className="flex space-x-2 mt-2">
                          {imagePreviews[index].map((url, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={url}
                              alt={`Preview ${index}-${imgIndex}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        Remove Color
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      arrayHelpers.push({ colorCode: "#ffffff", images: [] })
                    }
                  >
                    Add Color
                  </button>
                </div>
              )}
            />

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </BasicWrapper>
  );
}
