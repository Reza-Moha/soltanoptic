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
const { bankRoutes } = require("./bank/bankRoutes");
const { insuranceRoutes } = require("./insurance/InsuranceRoutes");
const { checkPermission } = require("../../middleware/permissions.guard");
const { PERMISSIONS } = require("../../constants");
const { companyRoutes } = require("./company/companyRoutes");
const { customersRoutes } = require("./customers/customersRoutes");

router.patch(
  "/admin-profile-update",
  uploadFile.single("profileImage"),
  checkPermission(PERMISSIONS.ADMIN),
  AdminController.updateAdminProfile,
);

router.post(
  "/create-new-employee",
  uploadFile.single("profileImage"),
  checkPermission(PERMISSIONS.ADMIN),
  EmployeeController.createNewEmployee,
);

router.get(
  "/get-all-employee",
  checkPermission(PERMISSIONS.ADMIN),
  EmployeeController.getAllEmployee,
);

router.delete(
  "/delete-employee/:id",
  checkPermission(PERMISSIONS.ADMIN),
  EmployeeController.deleteEmployeeById,
);

router.patch(
  "/update-employee/:id",
  checkPermission(PERMISSIONS.ADMIN),
  uploadFile.single("profileImage"),
  EmployeeController.updateEmployee,
);

router.use("/doctors", doctorsRoutes);
router.use("/RBAC", RBACRoutes);
router.use("/lens", lensRoutes);
router.use("/frame", frameRoutes);
router.use("/bank", bankRoutes);
router.use("/insurance", insuranceRoutes);
router.use("/company", companyRoutes);
router.use("/customers", customersRoutes);

module.exports = {
  AdminRoutes: router,
};
