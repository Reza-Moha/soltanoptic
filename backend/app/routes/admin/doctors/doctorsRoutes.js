const router = require("express").Router();
const {
  DoctorsController,
} = require("../../../controller/admin/doctors/Doctors.controller");
const {checkPermission} = require("../../../middleware/permissions.guard");
const {PERMISSIONS} = require("../../../constants");

router.post("/create-new",checkPermission(PERMISSIONS.ADMIN), DoctorsController.createNewDoctors);

router.get("/get-all-doctors",checkPermission(PERMISSIONS.ADMIN), DoctorsController.getAllDoctors);

router.get("/get-byId/:id",checkPermission(PERMISSIONS.ADMIN), DoctorsController.getDoctorById);

router.delete("/delete/:id",checkPermission(PERMISSIONS.ADMIN), DoctorsController.deleteDoctorById);

router.patch("/update/:id",checkPermission(PERMISSIONS.ADMIN), DoctorsController.updateDctors);

module.exports = {
  doctorsRoutes: router,
};
