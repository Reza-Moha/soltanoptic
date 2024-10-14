const {
  FrameController,
} = require("../../../controller/admin/frame/Frame.controller");

const router = require("express").Router();

router.post("/create-category", FrameController.createFrameCategory);

module.exports = {
  frameRoutes: router,
};
