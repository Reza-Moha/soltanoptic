import { getFrameByIdApi } from "@/services/admin/frame/frame.service";
import { notFound } from "next/navigation";

async function editePage({ params: { frameId } }) {
  const data = await getFrameByIdApi(frameId);
  console.log(data);

  if (!data) {
    notFound();
  }

  return <div>editePage</div>;
}
export default editePage;
