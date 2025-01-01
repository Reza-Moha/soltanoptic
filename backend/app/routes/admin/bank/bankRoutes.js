const {
  BankController,
} = require("../../../controller/admin/bank/BankController");
const {checkPermission} = require("../../../middleware/permissions.guard");
const {PERMISSIONS} = require("../../../constants");
const router = require("express").Router();

router.post("/create",checkPermission(PERMISSIONS.ADMIN), BankController.createNewBank);

router.get("/get-all",checkPermission(PERMISSIONS.ADMIN), BankController.getAllBanks);

router.delete("/delete/:id",checkPermission(PERMISSIONS.ADMIN), BankController.deleteBankById);
module.exports = {
  bankRoutes: router,
};
