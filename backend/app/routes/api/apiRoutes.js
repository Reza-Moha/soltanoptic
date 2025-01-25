const {
  InsuranceController,
} = require("../../controller/admin/insurance/Insurance.controller");
const router = require("express").Router();

router.get("/get-all-insurance", InsuranceController.getAllInsurance);

module.exports = {
  teamRoutes: router,
};
