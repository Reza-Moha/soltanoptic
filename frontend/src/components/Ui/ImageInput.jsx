import FileInput from "@/components/Ui/FileInput";
import Image from "next/image";
import { useState } from "react";
export const ImageInput = ({ setFieldValue, name, prevTitle }) => {
  const [perviewImage, setPreviewImage] = useState("");
  return (
    <div className="relative h-28 w-28 border-[5px] border-white md:mr-7 rounded-full overflow-hidden">
      <label
        htmlFor={name}
        className="flex items-center justify-center w-full h-full rounded-full cursor-pointer bg-gradient-to-tl from-secondary-300 to-secondary-100 relative text-xs"
      >
        <FileInput
          name={name}
          accept=".jpg,.jpeg,.png"
          id={name}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files[0];
            setFieldValue(`${name}`, file);
            setPreviewImage(URL.createObjectURL(file));
          }}
        />
        {perviewImage === "" ? (
          `${prevTitle}`
        ) : (
          <div className="relative w-full h-full">
            <Image
              alt=""
              src={perviewImage}
              className="rounded-full object-cover"
              width="112"
              height="112"
              priority
            />
          </div>
        )}
      </label>
    </div>
  );
};