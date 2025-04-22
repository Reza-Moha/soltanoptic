const {
  EmployeeController,
} = require("../../controller/employee/Employee.controller");
const { checkPermission } = require("../../middleware/permissions.guard");
const { PERMISSIONS } = require("../../constants");
const router = require("express").Router();

router.get(
  "/receivePerformance/:id",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  EmployeeController.receiveEmployeePerformance,
);
router.get(
  "/accountingReport",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  EmployeeController.getAllAccountingTransactions,
);

module.exports = {
  EmployeeRoutes: router,
};
