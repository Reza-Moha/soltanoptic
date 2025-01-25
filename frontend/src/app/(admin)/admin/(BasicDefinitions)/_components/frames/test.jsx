"use client";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import { createNewFrameSchema } from "@/validators/admin";
import BasicWrapper from "../BasicWrapper";
import NewFrameOptions from "./NewFrameOptions";
import Input from "@/components/Ui/Input";
import { PriceInput } from "@/components/Ui/PriceInput";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import FileInput from "@/components/Ui/FileInput";
import { BsTrash3, BsSunglasses } from "react-icons/bs";
import {
  createNewFrame,
  fetchAllFrame,
  fetchAllFrameCategories,
  fetchAllFrameGender,
  fetchAllFrameType,
} from "@/redux/slices/frame.slice";
import Image from "next/image";

// ImagePreview component
const ImagePreview = ({ imagePreviews, index }) =>
  imagePreviews[index] && (
    <div className="flex space-x-2 mt-2 items-center justify-center">
      {imagePreviews[index].map((url, imgIndex) => (
        <Image
          key={imgIndex}
          src={url}
          width={80}
          height={80}
          alt={`Preview ${index}-${imgIndex}`}
          className="object-cover rounded"
        />
      ))}
    </div>
  );

// ColorFormFields component
const ColorFormFields = ({
  color,
  index,
  setFieldValue,
  handleImageChange,
  imagePreviews,
}) => (
  <div
    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white mb-4 border border-secondary-200 text-secondary-900"
    style={{ borderRight: `3px solid ${color.colorCode}` }}
  >
    <div className="md:col-span-11">
      <div className="flex items-center justify-between md:px-10 space-x-4">
        <Input
          label="لطفا یک رنگ برای فریم انتخاب کنید"
          name={`colors[${index}].colorCode`}
          type="color"
          value={color.colorCode}
          onChange={(e) =>
            setFieldValue(`colors[${index}].colorCode`, e.target.value)
          }
        />
        <BsSunglasses size={50} style={{ color: color.colorCode }} />
      </div>
      <Input
        label="تعداد"
        name={`colors[${index}].count`}
        type="number"
        bg="bg-white"
        value={color.count || 0}
        onChange={(e) =>
          setFieldValue(`colors[${index}].count`, parseInt(e.target.value) || 0)
        }
      />
      <FileInput
        name={`colors[${index}].images`}
        label="انتخاب تصاویر"
        accept="image/*"
        multiple
        onChange={(event) => handleImageChange(event, index, setFieldValue)}
      />
      <ImagePreview imagePreviews={imagePreviews} index={index} />
    </div>
  </div>
);

// ColorSection component
const ColorSection = ({
  values,
  setFieldValue,
  handleImageChange,
  handleRemoveColor,
  imagePreviews,
}) => (
  <FieldArray name="colors">
    {({ push, remove }) => (
      <div className="md:col-span-2 mx-3 overflow-hidden rounded-lg">
        {values.colors.map((color, index) => (
          <div key={index}>
            <ColorFormFields
              color={color}
              index={index}
              setFieldValue={setFieldValue}
              handleImageChange={handleImageChange}
              imagePreviews={imagePreviews}
            />
            <button
              className="w-full h-8 md:h-full md:w-8 flex items-center justify-center bg-rose-100 text-rose-700 hover:bg-rose-200 rounded transition-all ease-linear"
              type="button"
              onClick={() => handleRemoveColor(index, remove)}
            >
              <BsTrash3 />
            </button>
          </div>
        ))}
        <div className="md:col-span-2 my-4 flex items-center justify-center">
          <button
            className="rounded w-1/2 md:w-1/4 bg-slate-500 text-white py-1 md:py-2"
            type="button"
            onClick={() => push({ colorCode: "#7fff00", images: [] })}
          >
            اضافه کردن رنگ
          </button>
        </div>
      </div>
    )}
  </FieldArray>
);

// Main CreateNewFrame component
const CreateNewFrame = () => {
  const dispatch = useDispatch();
  const [imagePreviews, setImagePreviews] = useState({});

  useEffect(() => {
    dispatch(fetchAllFrameCategories());
    dispatch(fetchAllFrameType());
    dispatch(fetchAllFrameGender());
    dispatch(fetchAllFrame());
  }, [dispatch]);

  const handleImageChange = (event, index, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setFieldValue(`colors[${index}].images`, files);
      setImagePreviews((prev) => ({ ...prev, [index]: imageUrls }));
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

  const handleSubmit = (values, { resetForm }) => {
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
          colors: [{ colorCode: "#7fff00", count: 1, images: [] }],
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
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
            <ColorSection
              values={values}
              setFieldValue={setFieldValue}
              handleImageChange={handleImageChange}
              handleRemoveColor={handleRemoveColor}
              imagePreviews={imagePreviews}
            />
            <div className="md:col-span-2 px-10">
              <SubmitBtn>ایجاد</SubmitBtn>
            </div>
          </Form>
        )}
      </Formik>
    </BasicWrapper>
  );
};

export default CreateNewFrame;
