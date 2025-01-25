const { UserController } = require("../../controller/user/UserController");
const { VerifyAccessToken } = require("../../middleware/verifyAccessToken");
const router = require("express").Router();

router.get("/user-profile", VerifyAccessToken, UserController.userProfile);

module.exports = {
  UserRoutes: router,
};
