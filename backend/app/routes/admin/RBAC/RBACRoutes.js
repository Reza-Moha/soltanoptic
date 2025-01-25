const router = require("express").Router();
const {
  PermissionsController,
} = require("../../../controller/admin/RBAC/Perimission.controller");
const {
  RoleController,
} = require("../../../controller/admin/RBAC/Role.controller");
const { stringToArray } = require("../../../middleware/stringToArray");
const {checkPermission} = require("../../../middleware/permissions.guard");
const {PERMISSIONS} = require("../../../constants");

router.post(
  "/create-new-permission",checkPermission(PERMISSIONS.ADMIN),
  PermissionsController.createNewPermission
);
router.get("/get-all-permission",checkPermission(PERMISSIONS.ADMIN), PermissionsController.getAllPermission);

router.delete(
  "/delete-permission/:id",checkPermission(PERMISSIONS.ADMIN),
  PermissionsController.deletePermissionById
);

router.patch("/update-permission/:id",checkPermission(PERMISSIONS.ADMIN), PermissionsController.updatePermission);

// Role Routes

router.post("/create-new-role",checkPermission(PERMISSIONS.ADMIN), RoleController.createNewRole);

router.get("/get-all-roles",checkPermission(PERMISSIONS.ADMIN), RoleController.getAllRoles);

router.delete("/delete-role/:id",checkPermission(PERMISSIONS.ADMIN), RoleController.deleteRoleById);

router.patch("/update-role/:id",checkPermission(PERMISSIONS.ADMIN), RoleController.updateRole);

module.exports = {
  RBACRoutes: router,
};
