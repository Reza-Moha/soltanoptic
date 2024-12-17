const { AuthController } = require("../../controller/auth/AuthController");
const router = require("express").Router();

router.post("/get-otp", AuthController.getOtp);

router.post("/check-otp", AuthController.checkOtp);

router.get("/refresh-token", AuthController.refreshToken);
router.get("/log-out", AuthController.logout);

module.exports = {
  AuthRoutes: router,
};
