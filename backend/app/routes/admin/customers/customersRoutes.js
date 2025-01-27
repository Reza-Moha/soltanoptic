const { checkPermission } = require("../../../middleware/permissions.guard");
const { PERMISSIONS } = require("../../../constants");
const {
  CustomersController,
} = require("../../../controller/admin/customers/CustomersController");
const router = require("express").Router();

router.post(
  "/create-new-invoice",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  CustomersController.createNewInvoice,
);

// router.get(
//     "/get-all",
//     checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
//     CompanyController.getAllCompanies,
// );
//
// router.delete(
//     "/delete/:id",
//     checkPermission(PERMISSIONS.ADMIN),
//     CompanyController.deleteCompanyById,
// );
module.exports = {
  customersRoutes: router,
};
