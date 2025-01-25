import { useState } from "react";

const useFrameImage = (setFieldValue, isEdite) => {
  const [imagePreviews, setImagePreviews] = useState({});

  const handleImageChange = (event, index) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setFieldValue(
        `colors[${index}].images`,
        files.map((file, i) => ({
          url: imageUrls[i],
          file,
        })),
      );
      setImagePreviews((prev) => ({
        ...prev,
        [index]: imageUrls,
      }));
      return () => imageUrls.forEach(URL.revokeObjectURL);
    }
  };

  const handleRemoveColor = (index, remove) => {
    remove(index);
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  const handleRemoveImage = (colorIndex, imageIndex, values) => {
    setFieldValue(
      `colors[${colorIndex}].images`,
      values.colors[colorIndex].images.filter((_, idx) => idx !== imageIndex),
    );
  };

  return {
    imagePreviews,
    handleImageChange,
    handleRemoveColor,
    handleRemoveImage,
  };
};

export default useFrameImage;
