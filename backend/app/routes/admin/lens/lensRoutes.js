const router = require("express").Router();
const {
  LensController,
} = require("../../../controller/admin/lens/Lens.controller");
const { uploadFile } = require("../../../utils/multer");

router.post(
  "/create-refractive-index",
  LensController.createNewRefractiveIndex
);

router.get("/all-refractive-index", LensController.getAllRefractiveIndex);

router.delete(
  "/delete-refractive-index/:id",
  LensController.deleteRefractiveIndexById
);

router.post("/create-type", LensController.createNewLensType);

router.get("/all-lens-type", LensController.getAllLensType);

router.delete("/delete-lens-type/:id", LensController.deleteLensTypeById);

router.post(
  "/create-category",
  uploadFile.single("lensImage"),
  LensController.createNewLensCategory
);

router.get("/all-lens-categories", LensController.getAllLensCategories);

router.delete(
  "/delete-lens-category/:id",
  LensController.deleteLensCategoryById
);

router.post(
  "/create-new-lens",
  uploadFile.single("lensImage"),
  LensController.createNewLens
);

router.get("/all-lens", LensController.getAllLens);

router.delete("/delete-lens/:id", LensController.deleteLensById);

router.post("/pricing", LensController.pricingLens);
module.exports = {
  lensRoutes: router,
};
