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
router.get(
  "/get-last-invoice-number",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  CustomersController.getLastInvoiceNumber,
);

router.post(
  "/send-sms-purchase",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  CustomersController.sendSmsThanksForThePurchase,
);

router.get(
  "/get-order-lens-daily",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  CustomersController.lensOrdersDaily,
);

router.post(
  "/sendLensOrder",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  CustomersController.sendLensOrder,
);
router.post(
  "/sendToWorkshop",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  CustomersController.sendToWorkshop,
);
router.get(
  "/getAllInvoices",
  checkPermission([PERMISSIONS.ADMIN, PERMISSIONS.EMPLOYEE]),
  CustomersController.getAllInvoicesPaginated,
);
module.exports = {
  customersRoutes: router,
};
