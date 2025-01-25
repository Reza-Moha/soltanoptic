import CreateNewLens from "../../_components/lens/CreateNewLens";
import LensCategories from "../../_components/lens/LensCategories";
import LensPricing from "../../_components/lens/LensPricing";
import LensType from "../../_components/lens/LensType";
import ListOfLens from "../../_components/lens/ListOfLens";
import RefractiveIndex from "../../_components/lens/RefractiveIndex";

export default function CreateLens() {
  return (
    <>
      <CreateNewLens />
      <ListOfLens />
      <LensPricing />
      <RefractiveIndex />
      <LensType />
      <LensCategories />
    </>
  );
}
