import CreateFrameCategories from "../../_components/frames/CreateFrameCategories";
import CreateFrameGender from "../../_components/frames/CreateFrameGender";
import CreateFrameType from "../../_components/frames/CreateFrameType";
import CreateNewFrame from "../../_components/frames/createNewFrame/CreateNewFrame";
import ListOfFrame from "../../_components/frames/createNewFrame/ListOfFrame";

export default function page() {
  return (
    <>
      <CreateNewFrame />
      <ListOfFrame />
      <CreateFrameCategories />
      <CreateFrameType />
      <CreateFrameGender />
    </>
  );
}
