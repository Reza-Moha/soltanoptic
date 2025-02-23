import { getFrameByIdApi } from "@/services/admin/frame/frame.service";
import setCookiesOnReq from "@/utils/setCookiesOnReq";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import FrameForm from "../../../../_components/frames/createNewFrame/CreateNewFrame";
import { imageUrlToFile } from "@/utils";

async function editePage({ params: { frameId } }) {
  const cookie = cookies();
  const options = setCookiesOnReq(cookie);
  const data = await getFrameByIdApi(frameId, options);

  if (!data || Object.keys(data).length === 0) {
    notFound();
  }

  const { frame } = data || {};

  const initialData = {
    id: frame.frameId,
    name: frame.name,
    price: frame.price.replace(/,/g, ""),
    frameCategory: frame.FrameCategory.id,
    frameType: frame.FrameType.id,
    frameGender: frame.FrameGender.id,
    serialNumber: frame.serialNumber,
    description: frame.description,
    colors: frame.FrameColors.map((color) => ({
      colorCode: color.colorCode,
      count: color.count,
      images: color.FrameImages.map((image) => ({
        url: image.imageUrl,
      })),
    })),
  };

  return (
    <div className="h-screen">
      <FrameForm isEdit={true} initialData={initialData} />
    </div>
  );
}

export default editePage;
