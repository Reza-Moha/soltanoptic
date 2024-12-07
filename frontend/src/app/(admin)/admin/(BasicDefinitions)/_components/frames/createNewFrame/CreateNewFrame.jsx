"use client";

import { useDispatch } from "react-redux";
import BasicWrapper from "../../BasicWrapper";
import { FieldArray, Form, Formik } from "formik";
import { createNewFrameSchema } from "@/validators/admin";
import Input from "@/components/Ui/Input";
import { PriceInput } from "@/components/Ui/PriceInput";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import FileInput from "@/components/Ui/FileInput";
import { BsTrash3, BsSunglasses } from "react-icons/bs";
import NewFrameOptions from "../NewFrameOptions";
import { createNewFrame, updateFrame } from "@/redux/slices/frame.slice";
import { useState } from "react";

const FrameForm = ({ isEdit = false, initialData = null }) => {
  const dispatch = useDispatch();
  const [imagePreviews, setImagePreviews] = useState({});

  const handleImageChange = (event, index, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setFieldValue(
        `colors[${index}].images`,
        files.map((file, i) => ({
          url: imageUrls[i],
          file: file,
        }))
      );
      setImagePreviews((prev) => ({
        ...prev,
        [index]: imageUrls,
      }));
      return () => imageUrls.forEach(URL.revokeObjectURL);
    }
  };

  const handleRemoveColor = (index, arrayHelpers) => {
    arrayHelpers.remove(index);
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "colors") formData.append(key, value);
    });

    values.colors.forEach((color, index) => {
      formData.append(`colors[${index}][colorCode]`, color.colorCode);
      formData.append(`colors[${index}][count]`, color.count);
      color.images.forEach((image) => {
        const renamedFile = new File(
          [image],
          `${color.colorCode}-${image.name}`,
          { type: image.type }
        );
        formData.append(`images`, renamedFile);
      });
    });

    if (isEdit) {
      await dispatch(updateFrame(formData));
    } else {
      await dispatch(createNewFrame(formData));
    }

    resetForm();
    setImagePreviews({});
  };

  const handleRemoveImage = (colorIndex, imageIndex, setFieldValue) => {
    setFieldValue(
      `colors[${colorIndex}].images`,
      values.colors[colorIndex].images.filter((_, idx) => idx !== imageIndex)
    );
  };

  return (
    <BasicWrapper
      open={isEdit}
      title={isEdit ? "ویرایش فریم" : "تعریف فریم جدید"}
    >
      <Formik
        validationSchema={createNewFrameSchema}
        initialValues={
          initialData || {
            name: "",
            price: "",
            frameCategory: "",
            frameType: "",
            frameGender: "",
            serialNumber: "",
            description: "",
            colors: [{ colorCode: "#7fff00", count: 1, images: [] }],
          }
        }
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors }) => (
          <Form className="grid md:grid-cols-2">
            <NewFrameOptions />
            <Input label="نام فریم" name="name" type="text" bg="bg-white" />
            <PriceInput label="قیمت فروش" name="price" type="text" />
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
            <FieldArray name="colors">
              {({ push, remove }) => (
                <div className="md:col-span-2 mx-3 overflow-hidden rounded-lg">
                  {values.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white mb-4 border border-secondary-200 text-secondary-900`}
                      style={{ borderRight: `3px solid ${color.colorCode}` }}
                    >
                      <div className="md:col-span-11">
                        <div className="flex items-center justify-between px-10 space-x-4">
                          <Input
                            label="لطفا یک رنگ برای فریم انتخاب کنید"
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
                            style={{ color: color.colorCode }}
                          />
                        </div>
                        <Input
                          label="تعداد"
                          name={`colors[${index}].count`}
                          type="number"
                          bg="bg-white"
                          value={color.count || 0}
                          onChange={(e) =>
                            setFieldValue(
                              `colors[${index}].count`,
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                        <FileInput
                          name={`colors[${index}].images`}
                          label="انتخاب تصاویر"
                          accept="image/*"
                          multiple
                          onChange={(event) =>
                            handleImageChange(event, index, setFieldValue)
                          }
                        />

                        <div className="flex flex-wrap space-x-2 mt-2 items-center justify-center">
                          {color.images.map((img, imgIndex) => (
                            <div
                              key={`img-${imgIndex}`}
                              className="relative group"
                            >
                              <img
                                src={img.url}
                                alt={`Image ${imgIndex}`}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveImage(
                                    index,
                                    imgIndex,
                                    setFieldValue
                                  )
                                }
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        className="w-full h-5 flex items-center justify-center bg-rose-100 text-rose-700 hover:bg-rose-200 rounded transition-all ease-linear"
                        type="button"
                        onClick={() => handleRemoveColor(index, remove)}
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
                        push({ colorCode: "#7fff00", count: 1, images: [] })
                      }
                    >
                      اضافه کردن رنگ
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>

            <div className="md:col-span-2 px-10">
              <SubmitBtn>{isEdit ? "ویرایش" : "ایجاد"}</SubmitBtn>
            </div>
          </Form>
        )}
      </Formik>
    </BasicWrapper>
  );
};

export default FrameForm;
