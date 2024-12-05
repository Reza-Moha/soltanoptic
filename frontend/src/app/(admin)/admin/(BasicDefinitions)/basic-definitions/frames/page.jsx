import CreateFrameCategories from "../../_components/frames/CreateFrameCategories";
import CreateFrameGender from "../../_components/frames/CreateFrameGender";
import CreateFrameType from "../../_components/frames/CreateFrameType";
import FrameForm from "../../_components/frames/createNewFrame/CreateNewFrame";
import ListOfFrame from "../../_components/frames/createNewFrame/ListOfFrame";

export default function page() {
  return (
    <>
      <FrameForm isEdit={false} />
      <ListOfFrame />
      <CreateFrameCategories />
      <CreateFrameType />
      <CreateFrameGender />
    </>
  );
}
