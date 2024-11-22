import { getFrameByIdApi } from "@/services/admin/frame/frame.service";
import setCookiesOnReq from "@/utils/setCookiesOnReq";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function editePage({ params: { frameId } }) {
  const cookie = cookies();
  const options = setCookiesOnReq(cookie);
  const data = await getFrameByIdApi(frameId, options);
  console.log(data);

  if (!data) {
    notFound();
  }

  return <div>editePage</div>;
}
export default editePage;
