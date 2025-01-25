const { AuthRoutes } = require("./auth/authRoutes");
const { VerifyAccessToken } = require("../middleware/verifyAccessToken");
const { UserRoutes } = require("./user/userRoutes");
const { AdminRoutes } = require("./admin/adminRoutes");

const router = require("express").Router();

router.use("/api/auth", AuthRoutes);
router.use("/api/user", UserRoutes);
router.use("/api/admin", VerifyAccessToken, AdminRoutes);

module.exports = {
  AllRoutes: router,
};
