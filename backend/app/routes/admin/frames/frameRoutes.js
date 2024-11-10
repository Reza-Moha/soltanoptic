const {
  FrameController,
} = require("../../../controller/admin/frame/Frame.controller");
const { uploadFile } = require("../../../utils/multer");
const router = require("express").Router();

router.post("/create-category", FrameController.createFrameCategory);

router.get("/all-categories", FrameController.getAllFrameCategory);

router.delete("/delete-category/:id", FrameController.deleteFrameCategory);

router.post("/create-type", FrameController.createFrameType);

router.get("/all-types", FrameController.getAllFrameType);

router.delete("/delete-type/:id", FrameController.deleteFrameType);

router.post("/create-gender", FrameController.createFrameGender);

router.get("/all-genders", FrameController.getAllFrameGender);

router.delete("/delete-gender/:id", FrameController.deleteFrameGender);

router.delete("/delete/:id", FrameController.deleteFrameById);

router.post(
  "/create-frame",
  uploadFile.array("images"),
  FrameController.createNewFrame
);

router.get("/all-frame", FrameController.getAllFrame);
module.exports = {
  frameRoutes: router,
};
