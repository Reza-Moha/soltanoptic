const { StatusCodes: HttpStatus } = require("http-status-codes");
const Controller = require("../../Controller");
const CreateError = require("http-errors");
const {
  createNewDoctorsSchema,
  idSchema,
} = require("../../../validation/admin/admin.schema");
const { DoctorsModel } = require("../../../models/Doctors.model");
const { deleteInvalidPropertyInObject } = require("../../../utils");
class DoctorsController extends Controller {
  async createNewDoctors(req, res, next) {
    try {
      await createNewDoctorsSchema.validateAsync(req.bdy);
      const { fullName, visitPrice, medicalSystemNumber } = req.body;
      const createNewDoctor = await DoctorsModel.create({
        fullName,
        visitPrice,
        medicalSystemNumber,
      });
      if (!createNewDoctor)
        throw CreateError.InternalServerError(
          "ذخیره اطلاعات دکتر ناموفق بود لطفا دوباره امتحان کنید"
        );
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "اطلاعات دکتر وارد شده با موفقیت ثبت گردید",
        createdNewDoctor: createNewDoctor,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllDoctors(req, res, next) {
    try {
      const allDoctors = await DoctorsModel.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        doctors: allDoctors,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDoctorById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      const doctor = await DoctorsModel.findByPk(id, {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!doctor)
        throw CreateError.NotFound("دکتری با این مشخصات در سیستم ثبت نشده است");
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        doctor,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDoctorById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      const deletedDoctor = await DoctorsModel.destroy({
        where: { doctorId: id },
      });
      if (deletedDoctor <= 0)
        throw CreateError.InternalServerError(
          "حذف دکتر ناموفق بود لطفا دوباره  امتحان کنید"
        );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "عملیات حذف با موفقیت انجام شد",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDctors(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id: doctorId } = req.params;
      const exsitDoctor = await DoctorsModel.findByPk(doctorId);
      if (!exsitDoctor)
        throw CreateError.NotFound("دکتری با این مشخصات پیدا نشد");
      await createNewDoctorsSchema.validateAsync(req.body);
      const data = JSON.parse(JSON.stringify(req.body));
      deleteInvalidPropertyInObject(data, BlackListFields);
      const { fullName, visitPrice, medicalSystemNumber } = req.body;
      const [updatedRowsCount] = await DoctorsModel.update(
        { fullName, visitPrice, medicalSystemNumber },
        {
          where: { doctorId },
          returning: true,
        }
      );

      if (updatedRowsCount === 0)
        throw CreateError.InternalServerError(" عملیات ویرایش انجام نشد");
      const updatedDoctor = await DoctorsModel.findByPk(doctorId);
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "سطح مورد نظر با موفقیت ویرایش گردید",
        updatedDoctor,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  DoctorsController: new DoctorsController(),
};
