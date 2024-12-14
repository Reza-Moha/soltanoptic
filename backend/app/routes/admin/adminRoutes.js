const router = require("express").Router();
const { AdminController } = require("../../controller/admin/Admin.controller");
const {
  EmployeeController,
} = require("../../controller/employee/Employee.controller");
const { uploadFile } = require("../../utils/multer");
const { doctorsRoutes } = require("./doctors/doctorsRoutes");
const { frameRoutes } = require("./frames/frameRoutes");
const { lensRoutes } = require("./lens/lensRoutes");
const { RBACRoutes } = require("./RBAC/RBACRoutes");
const {bankRoutes} = require("./bank/bankRoutes");

router.patch(
  "/admin-profile-update",
  uploadFile.single("profileImage"),
  AdminController.updateAdminProfile
);

router.post(
  "/create-new-employee",
  uploadFile.single("profileImage"),
  EmployeeController.createNewEmployee
);

router.get("/get-all-employee", EmployeeController.getAllEmployee);

router.delete("/delete-employee/:id", EmployeeController.deleteEmployeeById);

router.patch(
  "/update-employee/:id",
  uploadFile.single("profileImage"),
  EmployeeController.updateEmployee
);

router.use("/doctors", doctorsRoutes);
router.use("/RBAC", RBACRoutes);
router.use("/lens", lensRoutes);
router.use("/frame", frameRoutes);
router.use("/bank", bankRoutes);

module.exports = {
  AdminRoutes: router,
};
