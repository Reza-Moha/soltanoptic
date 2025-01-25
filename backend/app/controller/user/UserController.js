const Controller = require("../Controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
class UserController extends Controller {
  async userProfile(req, res, next) {
    try {
      const user = req.user;
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  UserController: new UserController(),
};
