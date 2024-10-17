"use client";
import { useDispatch } from "react-redux";
import BasicWrapper from "../BasicWrapper";
import { useEffect, useState } from "react";
import {
  createNewFrame,
  fetchAllFrameCategories,
  fetchAllFrameGender,
  fetchAllFrameType,
} from "@/redux/slices/frame.slice";
import { FieldArray, Form, Formik } from "formik";
import { createNewFrameSchema } from "@/validators/admin";
import Input from "@/components/Ui/Input";
import { PriceInput } from "@/components/Ui/PriceInput";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import FileInput from "@/components/Ui/FileInput";
import { BsTrash3 } from "react-icons/bs";
import NewFrameOptions from "./NewFrameOptions";
import { BsSunglasses } from "react-icons/bs";

export default function CreateNewFrame() {
  const dispatch = useDispatch();
  const [imagePreviews, setImagePreviews] = useState({});

  useEffect(() => {
    dispatch(fetchAllFrameCategories());
    dispatch(fetchAllFrameType());
    dispatch(fetchAllFrameGender());
  }, [dispatch]);

  const handleImageChange = (event, index, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setFieldValue(`colors[${index}].images`, files);
      setImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        [index]: imageUrls,
      }));
      return () => {
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  };

  const handleRemoveColor = (index, arrayHelpers) => {
    arrayHelpers.remove(index);
    setImagePreviews((prevPreviews) => {
      const newPreviews = { ...prevPreviews };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  const handleSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("frameCategory", values.frameCategory);
    formData.append("frameType", values.frameType);
    formData.append("frameGender", values.frameGender);
    formData.append("serialNumber", values.serialNumber);
    formData.append("description", values.description);

    values.colors.forEach((color, index) => {
      formData.append(`colors[${index}][colorCode]`, color.colorCode);
      formData.append(`colors[${index}][count]`, color.count);

      color.images.forEach((image) => {
        const newFileName = `${color.colorCode}-${image.name}`;
        const renamedFile = new File([image], newFileName, {
          type: image.type,
        });
        formData.append(`images`, renamedFile);
      });
    });

    dispatch(createNewFrame(formData));
    resetForm();
    setImagePreviews({});
  };

  return (
    <BasicWrapper title="تعریف فریم جدید به انبار">
      <Formik
        validationSchema={createNewFrameSchema}
        initialValues={{
          name: "",
          price: "",
          frameCategory: "",
          frameType: "",
          frameGender: "",
          serialNumber: "",
          description: "",
          colors: [
            {
              colorCode: "#7fff00",
              count: 1,
              images: [],
            },
          ],
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="grid md:grid-cols-2">
            <NewFrameOptions />
            <Input label="نام فریم" name="name" type="text" bg="bg-white" />

            <PriceInput
              label="قیمت فروش"
              name="price"
              type="text"
              value={values.price || ""}
              onChange={(e) => setFieldValue("price", e.target.value)}
            />

            <Input
              label="سریال فریم"
              name="serialNumber"
              type="text"
              bg="bg-white"
            />

            <Input
              label="توضیحات"
              name="description"
              type="text"
              bg="bg-white"
            />

            <FieldArray
              name="colors"
              render={(arrayHelpers) => (
                <div className="md:col-span-2 mx-3 overflow-hidden rounded-lg ">
                  {values.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white mb-4 border border-secondary-200 text-secondary-900`}
                      style={{
                        borderRight: `3px solid ${color.colorCode}`,
                      }}
                    >
                      <div className="md:col-span-11">
                        <div className="flex items-center justify-between px-10 space-x-4 col-span-1">
                          <Input
                            label={`لطفا یک رنگ برای فریم انتخاب کنید`}
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
                          <BsSunglasses
                            size={50}
                            style={{
                              color: color.colorCode,
                            }}
                          />
                        </div>
                        <div>
                          <Input
                            label="تعداد"
                            name={`colors[${index}].count`}
                            type="number"
                            bg="bg-white"
                            value={color.count || 0}
                            onChange={(e) =>
                              setFieldValue(
                                `colors[${index}].count`,
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : 0
                              )
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <FileInput
                            name={`colors[${index}].images`}
                            label="انتخاب تصاویر"
                            accept="image/*"
                            id={`file-input-${index}`}
                            multiple
                            onChange={(event) =>
                              handleImageChange(event, index, setFieldValue)
                            }
                          />

                          {imagePreviews[index] && (
                            <div className="flex space-x-2 mt-2 gap-x-2 items-center justify-center">
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
                        </div>
                      </div>
                      <button
                        className="w-full h-5 md:w-5 md:h-full flex items-center justify-center bg-rose-100 text-rose-700 hover:bg-rose-200 rounded transition-all ease-linear"
                        type="button"
                        onClick={() => handleRemoveColor(index, arrayHelpers)}
                      >
                        <BsTrash3 />
                      </button>
                    </div>
                  ))}
                  <div className="md:col-span-2 my-4 flex items-center justify-center">
                    <button
                      className="rounded w-1/4 bg-slate-500 text-white py-2"
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({ colorCode: "#7fff00", images: [] })
                      }
                    >
                      اضافه کردن رنگ
                    </button>
                  </div>
                </div>
              )}
            />

            <div className="md:col-span-2 px-10">
              <SubmitBtn>ایجاد</SubmitBtn>
            </div>
          </Form>
        )}
      </Formik>
    </BasicWrapper>
  );
}
