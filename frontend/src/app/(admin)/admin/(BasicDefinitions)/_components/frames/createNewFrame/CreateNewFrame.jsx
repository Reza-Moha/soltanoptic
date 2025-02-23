"use client";
import { useDispatch } from "react-redux";
import BasicWrapper from "../../BasicWrapper";
import { Form, Formik } from "formik";
import { createNewFrameSchema } from "@/validators/admin";
import Input from "@/components/Ui/Input";
import { PriceInput } from "@/components/Ui/PriceInput";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import NewFrameOptions from "../NewFrameOptions";
import { createNewFrame, updateFrame } from "@/redux/slices/frame.slice";
import ColorFieldArray from "@/app/(admin)/admin/(BasicDefinitions)/_components/frames/createNewFrame/ColorFieldArray";
import { imageUrlToFile } from "@/utils";
import { useRouter } from "next/navigation";
const FrameForm = ({ isEdit = false, initialData = null }) => {
  const dispatch = useDispatch();
  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key !== "colors") formData.append(key, value);
    });

    for (let i = 0; i < values.colors.length; i++) {
      const color = values.colors[i];
      formData.append(`colors[${i}][colorCode]`, color.colorCode);
      formData.append(`colors[${i}][count]`, color.count);

      for (let j = 0; j < color.images.length; j++) {
        const image = color.images[j];

        let file;
        if (isEdit && image.url && !image.file) {
          file = await imageUrlToFile(image.url);
        } else {
          file = image.file;
        }

        const renamedFile = new File(
          [file],
          `${color.colorCode.replace("#", "")}-${j + 1}.${file.type.split("/")[1]}`,
          { type: file.type },
        );

        formData.append(`images`, renamedFile);
      }
    }

    if (isEdit) {
      await dispatch(updateFrame(formData));
    } else {
      await dispatch(createNewFrame(formData));
    }

    // resetForm();
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
            <ColorFieldArray
              isEdite={isEdit}
              values={values}
              setFieldValue={setFieldValue}
            />
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
