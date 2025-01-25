import { FieldArray } from "formik";
import Input from "@/components/Ui/Input";
import FileInput from "@/components/Ui/FileInput";
import { BsTrash3, BsSunglasses } from "react-icons/bs";
import useFrameImage from "@/hooks/useFrameImage";
import Image from "next/image";

const ColorFieldArray = ({ isEdite, values, setFieldValue }) => {
  const { handleImageChange, handleRemoveColor, handleRemoveImage } =
    useFrameImage(setFieldValue, isEdite);
  return (
    <FieldArray name="colors">
      {({ push, remove }) => (
        <div className="md:col-span-2 mx-3 overflow-hidden rounded-lg">
          {values.colors.map((color, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white mb-4 border border-secondary-200 text-secondary-900"
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
                  <BsSunglasses size={50} style={{ color: color.colorCode }} />
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
                    <div key={`img-${imgIndex}`} className="relative group">
                      <Image
                        width={80}
                        height={80}
                        src={
                          isEdite && img.url.startsWith("uploads")
                            ? `${process.env.NEXT_PUBLIC_API_URL}/${img.url}`
                            : img.url
                        }
                        alt={`Image ${imgIndex}`}
                        className="object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveImage(index, imgIndex, values)
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
  );
};

export default ColorFieldArray;
