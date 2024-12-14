const {
  BankController,
} = require("../../../controller/admin/bank/BankController");
const {
  DoctorsController,
} = require("../../../controller/admin/doctors/Doctors.controller");
const router = require("express").Router();

router.post("/create", BankController.createNewBank);

router.get("/get-all", BankController.getAllBanks);

router.delete("/delete/:id", BankController.deleteBankById);
module.exports = {
  bankRoutes: router,
};
