const CreateError = require("http-errors");
const { Permissions } = require("../models/Permissions.model");
const { Roles } = require("../models/Roles.model");
const { ROLES } = require("../constants");

function checkPermission(requiredPermissions = []) {
  return async function (req, res, next) {
    try {
      const allPermissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      const user = req.user;

      if (user.role === Number(ROLES.ADMIN)) {
        return next();
      }

      const role = await Roles.findOne({
        where: { title: user.role },
        attributes: {
          exclude: ["userId"],
        },
        include: [
          {
            model: Permissions,
            as: "permissions",
            through: {
              attributes: [],
            },
          },
        ],
      });

      if (!role) {
        throw CreateError.NotFound("Role not found");
      }

      const userPermissions = role.permissions.map((item) => item.title);

      const hasPermission = allPermissions.some((permission) =>
        userPermissions.includes(permission),
      );

      if (allPermissions.length > 0 && hasPermission) {
        return next();
      }

      throw CreateError.Forbidden("You do not have access to this section");
    } catch (error) {
      console.error("Error in checkPermission middleware:", error);
      next(error);
    }
  };
}

module.exports = {
  checkPermission,
};
