const { checkPermission } = require("../../../middleware/permissions.guard");
const { PERMISSIONS } = require("../../../constants");
const {
  CompanyController,
} = require("../../../controller/admin/company/CompanyController");
const router = require("express").Router();

router.post(
  "/create",
  checkPermission(PERMISSIONS.ADMIN),
  CompanyController.createNewCompany,
);

router.get(
  "/get-all",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  CompanyController.getAllCompanies,
);

router.delete(
  "/delete/:id",
  checkPermission(PERMISSIONS.ADMIN),
  CompanyController.deleteCompanyById,
);
module.exports = {
  companyRoutes: router,
};
