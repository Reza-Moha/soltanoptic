const {
  FrameController,
} = require("../../../controller/admin/frame/Frame.controller");
const { uploadFile } = require("../../../utils/multer");
const {checkPermission} = require("../../../middleware/permissions.guard");
const {PERMISSIONS} = require("../../../constants");
const router = require("express").Router();

router.post("/create-category",checkPermission(PERMISSIONS.ADMIN), FrameController.createFrameCategory);

router.get("/all-categories",checkPermission(PERMISSIONS.ADMIN), FrameController.getAllFrameCategory);

router.delete("/delete-category/:id",checkPermission(PERMISSIONS.ADMIN), FrameController.deleteFrameCategory);

router.post("/create-type",checkPermission(PERMISSIONS.ADMIN), FrameController.createFrameType);

router.get("/all-types",checkPermission(PERMISSIONS.ADMIN), FrameController.getAllFrameType);

router.delete("/delete-type/:id",checkPermission(PERMISSIONS.ADMIN), FrameController.deleteFrameType);

router.post("/create-gender",checkPermission(PERMISSIONS.ADMIN), FrameController.createFrameGender);

router.get("/all-genders",checkPermission(PERMISSIONS.ADMIN), FrameController.getAllFrameGender);

router.delete("/delete-gender/:id",checkPermission(PERMISSIONS.ADMIN), FrameController.deleteFrameGender);

router.delete("/delete/:id",checkPermission(PERMISSIONS.ADMIN), FrameController.deleteFrameById);

router.get("/get-frame/:id",checkPermission(PERMISSIONS.ADMIN), FrameController.getFrameById);

router.post(
  "/create-frame",
    checkPermission(PERMISSIONS.ADMIN),
  uploadFile.array("images"),

  FrameController.createNewFrame,
);
router.put(
  "/update-frame",
    checkPermission(PERMISSIONS.ADMIN),
  uploadFile.array("images"),

  FrameController.updateFrame,
);
router.get("/all-frame",checkPermission([PERMISSIONS.ADMIN ,PERMISSIONS.EMPLOYEE]), FrameController.getAllFrame);
module.exports = {
  frameRoutes: router,
};
