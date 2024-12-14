const {
  InsuranceController,
} = require("../../../controller/admin/insurance/Insurance.controller");
const {
  BankController,
} = require("../../../controller/admin/bank/BankController");

const router = require("express").Router();

router.post("/create", InsuranceController.createInsurance);

router.get("/get-all", InsuranceController.getAllInsurance);

router.delete("/delete/:id", InsuranceController.deleteInsuranceById);
module.exports = {
  insuranceRoutes: router,
};
