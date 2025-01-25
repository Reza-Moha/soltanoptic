const router = require("express").Router();
const {
  LensController,
} = require("../../../controller/admin/lens/Lens.controller");
const { uploadFile } = require("../../../utils/multer");
const { checkPermission } = require("../../../middleware/permissions.guard");
const { PERMISSIONS } = require("../../../constants");

router.post(
  "/create-refractive-index",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.createNewRefractiveIndex,
);

router.get(
  "/all-refractive-index",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.getAllRefractiveIndex,
);

router.delete(
  "/delete-refractive-index/:id",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.deleteRefractiveIndexById,
);

router.post(
  "/create-type",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.createNewLensType,
);

router.get(
  "/all-lens-type",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.getAllLensType,
);

router.delete(
  "/delete-lens-type/:id",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.deleteLensTypeById,
);

router.post(
  "/create-category",
  checkPermission(PERMISSIONS.ADMIN),
  uploadFile.single("lensCategoryImage"),
  LensController.createNewLensCategory,
);

router.get(
  "/all-lens-categories",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.getAllLensCategories,
);

router.delete(
  "/delete-lens-category/:id",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.deleteLensCategoryById,
);

router.post(
  "/create-new-lens",
  checkPermission(PERMISSIONS.ADMIN),
  uploadFile.single("lensImage"),
  LensController.createNewLens,
);

router.get(
  "/all-lens",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  LensController.getAllLens,
);

router.delete(
  "/delete-lens/:id",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.deleteLensById,
);

router.post(
  "/pricing",
  checkPermission(PERMISSIONS.ADMIN),
  LensController.pricingLens,
);
module.exports = {
  lensRoutes: router,
};
