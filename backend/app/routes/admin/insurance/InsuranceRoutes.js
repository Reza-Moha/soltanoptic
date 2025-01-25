const {
  InsuranceController,
} = require("../../../controller/admin/insurance/Insurance.controller");
const {
  BankController,
} = require("../../../controller/admin/bank/BankController");
const { checkPermission } = require("../../../middleware/permissions.guard");
const { PERMISSIONS } = require("../../../constants");

const router = require("express").Router();

router.post(
  "/create",
  checkPermission([PERMISSIONS.ADMIN]),
  InsuranceController.createInsurance,
);

router.get(
  "/get-all",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  InsuranceController.getAllInsurance,
);

router.delete(
  "/delete/:id",
  checkPermission([PERMISSIONS.ADMIN]),
  InsuranceController.deleteInsuranceById,
);
module.exports = {
  insuranceRoutes: router,
};
