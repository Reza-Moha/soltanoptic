const { BlackListFields } = require("../../constants");
const { UserModel } = require("../../models/User.model");
const {
  deleteInvalidPropertyInObject,
  deleteFileInPublic,
  farsiDigitToEnglish,
} = require("../../utils");
const path = require("path");
const {
  createNewEmployeeSchema,
  idSchema,
} = require("../../validation/admin/admin.schema");
const Controller = require("../Controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const CreateError = require("http-errors");
const { Op, Sequelize, fn, col, literal } = require("sequelize");
const { Roles } = require("../../models/Roles.model");
const {
  UserPrescriptionModel,
} = require("../../models/Invoice/UserPrescription.model");
const { InvoiceModel } = require("../../models/Invoice/Invoice.model");
const { PaymentInfoModel } = require("../../models/Invoice/PaymentInfo.model");
const {
  LensOrderStatusTracking,
} = require("../../models/Invoice/LensOrderStatusTracking.model");
const moment = require("jalali-moment");
const { FrameModel } = require("../../models/frame/Frame.model");
const { FrameCategory } = require("../../models/frame/FramCategory.model");
const { FrameGender } = require("../../models/frame/FrameGender.model");
const { FrameType } = require("../../models/frame/FrameType.model");
const { FrameImages } = require("../../models/frame/FrameImage.model");
const { FrameColor } = require("../../models/frame/FrameColor.model");
const { RefractiveIndex } = require("../../models/lens/RefractiveIndex.model");
const { LensGroup } = require("../../models/lens/LensGroup.model");
const { LensCategory } = require("../../models/lens/LensCategory.model");
const { LensType } = require("../../models/lens/LensType.model");
const LensModel = require("../../models/lens/Lens.model");
const { BankModel } = require("../../models/Bank.model");
const { InsuranceModel } = require("../../models/Insurance.model");
const { CompanyModel } = require("../../models/Company.model");
class EmployeeController extends Controller {
  async createNewEmployee(req, res, next) {
    try {
      await createNewEmployeeSchema.validateAsync(req.body);

      const {
        fileUploadPath,
        filename,
        phoneNumber,
        fullName,
        gender,
        nationalId,
        jobTitle,
        description,
      } = req.body;

      const image =
        fileUploadPath && filename
          ? path.join(fileUploadPath, filename).replace(/\\/g, "/")
          : null;

      deleteInvalidPropertyInObject(req.body, BlackListFields);
      const existingPhone = await UserModel.findOne({ where: { phoneNumber } });
      if (existingPhone) {
        throw CreateError.BadRequest("شماره تماس وارد شده قبلاً ثبت شده است");
      }

      const existingNationalId = await UserModel.findOne({
        where: { nationalId },
      });
      if (existingNationalId) {
        throw CreateError.BadRequest("کد ملی وارد شده قبلاً ثبت شده است");
      }
      const newEmployee = await UserModel.create({
        profileImage: image,
        phoneNumber,
        fullName,
        gender,
        nationalId,
        jobTitle,
        description,
        role: process.env.EMPLOYEE_ROLE,
      });

      if (!newEmployee) {
        throw CreateError.InternalServerError(
          "ایجاد همکار جدید با خطا مواجه شد لطفاً دوباره تلاش کنید",
        );
      }

      const [updatedRowsCount] = await Roles.update(
        { UserId: newEmployee.id },
        {
          where: { roleId: jobTitle },
          returning: true,
        },
      );

      if (updatedRowsCount === 0) {
        throw CreateError.InternalServerError("عملیات ویرایش نقش انجام نشد");
      }

      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: "همکار جدید با موفقیت ثبت گردید",
        newEmployee: await UserModel.findOne({
          where: { id: newEmployee.id },
          attributes: { exclude: ["otp", "createdAt", "updatedAt"] },
        }),
      });
    } catch (error) {
      if (req.body.fileUploadPath && req.body.filename) {
        const image = path
          .join(req.body.fileUploadPath, req.body.filename)
          .replace(/\\/g, "/");
        deleteFileInPublic(image);
      }

      next(error);
    }
  }

  async getAllEmployee(req, res, next) {
    try {
      const allEmployee = await UserModel.findAll({
        where: {
          role: {
            [Op.in]: [
              process.env.EMPLOYEE_ROLE,
              process.env.WORKSHOP_MANAGER_ROLE,
              process.env.ACCOUNTING_OFFICER_ROLE,
            ],
          },
        },
        attributes: { exclude: ["otp", "createdAt", "updatedAt", "role"] },
      });

      if (!allEmployee || allEmployee.length === 0) {
        throw CreateError.NotFound("همکاری یافت نشد");
      }

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        allEmployee,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployeeById(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id } = req.params;

      if (!id) throw CreateError.BadRequest("شناسه نامعتبر است");

      const user = await UserModel.findByPk(id);
      if (!user) throw CreateError.NotFound("همکار با این مشخصات وجود ندارد");

      if (user.profileImage) {
        deleteFileInPublic(user.profileImage);
      }

      const deletedRows = await UserModel.destroy({ where: { id } });

      if (deletedRows === 0) {
        throw CreateError.NotFound("هیچ رکوردی برای حذف یافت نشد");
      }

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "همکار با موفقیت حذف شد",
      });
    } catch (error) {
      console.error("Error occurred:", error);
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const image = req.body.fileUploadPath
        ? path
            .join(req.body?.fileUploadPath, req.body?.filename)
            .replace(/\\/g, "/")
        : undefined;

      await idSchema.validateAsync(req.params);
      const { id } = req.params;
      const existEmployee = await UserModel.findByPk(id, {
        attributes: { exclude: ["otp"] },
      });

      if (image) deleteFileInPublic(existEmployee.profileImage);
      if (!existEmployee && existEmployee.role !== process.env.USER_ROLE)
        throw CreateError.NotFound("همکار با این مشخصات پیدا نشد");

      await createNewEmployeeSchema.validateAsync(req.body);
      const data = JSON.parse(JSON.stringify(req.body));
      deleteInvalidPropertyInObject(data, []);
      const [updatedRowsCount] = await UserModel.update(
        {
          fullName: data?.fullName,
          phoneNumber: data?.phoneNumber,
          nationalId: data?.nationalId,
          profileImage: image ? image : existEmployee?.profileImage,
          description: data?.description,
          gender: data?.gender,
          jobTitle: data?.jobTitle,
        },
        {
          where: { id },
          returning: true,
        },
      );
      if (updatedRowsCount === 0)
        throw CreateError.InternalServerError(" عملیات ویرایش انجام نشد");
      const updatedEmployee = await UserModel.findByPk(id);
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: "همکار مورد نظر با موفقیت ویرایش گردید",
        updatedEmployee,
      });
    } catch (error) {
      const { fileUploadPath, filename } = req.body;
      const image =
        fileUploadPath && filename
          ? path.join(fileUploadPath, filename)?.replace(/\\/g, "/")
          : "";
      deleteFileInPublic(image);
      next(error);
    }
  }

  async getAllAccountingTransactions(req, res, next) {
    try {
      const { type = "daily", date } = req.query;
      const now = moment();
      let fromDate;
      let toDate = now.toDate();
      const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
      const englishDigits = "0123456789";
      switch (type) {
        case "daily":
          fromDate = moment().startOf("day").toDate();
          break;
        case "weekly":
          fromDate = moment().subtract(7, "days").startOf("day").toDate();
          break;
        case "monthly":
          fromDate = moment().subtract(1, "month").startOf("day").toDate();
          break;
        case "yearly":
          fromDate = moment().subtract(1, "year").startOf("day").toDate();
          break;
        case "custom":
          if (!req.query.from || !req.query.to) {
            return res
              .status(400)
              .json({ error: "Both from and to dates are required" });
          }

          const fromShamsi = req.query.from.replace(
            /[۰-۹]/g,
            (d) => englishDigits[persianDigits.indexOf(d)],
          );
          const toShamsi = req.query.to.replace(
            /[۰-۹]/g,
            (d) => englishDigits[persianDigits.indexOf(d)],
          );
          console.log("fromShamsi", fromShamsi);
          console.log("toShamsi", toShamsi);
          fromDate = moment(fromShamsi, "jYYYY-jMM-jDD")
            .startOf("day")
            .toDate();
          toDate = moment(toShamsi, "jYYYY-jMM-jDD").endOf("day").toDate();
          break;
      }
      const records = await PaymentInfoModel.findAll({
        where: {
          createdAt: {
            [Op.gte]: fromDate,
            [Op.lte]: toDate,
          },
        },
        include: [
          {
            model: InvoiceModel,
            as: "invoice",
            attributes: [
              "InvoiceId",
              "SumTotalInvoice",
              "createdAt",
              "lensOrderStatus",
            ],
            include: [
              {
                model: UserModel,
                as: "customer",
                attributes: ["fullName", "phoneNumber"],
              },
              {
                model: UserModel,
                as: "employee",
                attributes: ["fullName"],
              },
              {
                model: UserPrescriptionModel,
                as: "prescriptions",
                include: [
                  {
                    model: FrameModel,
                    as: "frame",
                    include: [
                      FrameCategory,
                      FrameGender,
                      FrameType,
                      {
                        model: FrameColor,
                        include: [FrameImages],
                      },
                    ],
                  },
                  {
                    model: LensModel,
                    as: "lens",
                    include: [
                      LensCategory,
                      LensGroup,
                      LensType,
                      RefractiveIndex,
                      {
                        model: LensOrderStatusTracking,
                        as: "lensOrderStatusTracking",
                      },
                    ],
                  },
                ],
              },
              { model: BankModel, as: "bank" },
              { model: InsuranceModel, as: "insurance" },
              { model: CompanyModel, as: "company" },
            ],
          },
        ],
        attributes: [
          "discount",
          "billBalance",
          "insuranceAmount",
          "deposit",
          "paymentMethod",
          "description",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
      });

      const rows = records.map((trx) => ({
        invoiceId: trx.invoice?.InvoiceId,
        invoiceNumber: trx.invoice?.invoiceNumber,
        date: trx.createdAt,
        totalAmount: trx.invoice?.SumTotalInvoice,
        customerName: trx.invoice?.customer?.fullName,
        customerPhone: trx.invoice?.customer?.phoneNumber,
        issuedBy: trx.invoice?.employee?.fullName,
        discount: trx.discount,
        remaining: trx.billBalance,
        insurance: trx.insuranceAmount,
        deposit: trx.deposit,
        method: trx.paymentMethod,
        description: trx.description,
        prescriptions: trx.invoice?.prescriptions || [],
        bank: trx.invoice?.bank || null,
        insuranceDetails: trx.invoice?.insurance || null,
        company: trx.invoice?.company || null,
      }));

      const sum = (key) => rows.reduce((s, r) => s + (r[key] || 0), 0);

      return res.status(200).json({
        reportDate: now.toISOString(),
        from: fromDate.toISOString(),
        count: rows.length,
        totalRevenue: sum("totalAmount"),
        totalDiscount: sum("discount"),
        totalRemaining: sum("remaining"),
        totalInsurance: sum("insurance"),
        totalDeposit: sum("deposit"),
        payments: rows,
      });
    } catch (error) {
      next(error);
    }
  }

  async receiveEmployeePerformance(req, res, next) {
    try {
      await idSchema.validateAsync(req.params);
      const { id: employeeId } = req.params;

      const [
        dailySales,
        overallStats,
        paymentStats,
        frameCount,
        lensTrackingStats,
      ] = await Promise.all([
        // Daily Sales
        InvoiceModel.findAll({
          where: { employeeId },
          attributes: [
            [
              Sequelize.fn("DATE", Sequelize.col("customerInvoice.createdAt")),
              "date",
            ],
            [Sequelize.fn("COUNT", Sequelize.col("InvoiceId")), "invoiceCount"],
            [
              Sequelize.fn("SUM", Sequelize.col("SumTotalInvoice")),
              "totalAmount",
            ],
          ],
          group: [
            Sequelize.fn("DATE", Sequelize.col("customerInvoice.createdAt")),
          ],
          order: [
            [
              Sequelize.fn("DATE", Sequelize.col("customerInvoice.createdAt")),
              "DESC",
            ],
          ],
          raw: true,
        }),

        // Overall Invoice Stats
        InvoiceModel.findOne({
          where: { employeeId },
          attributes: [
            [
              Sequelize.fn("COUNT", Sequelize.col("InvoiceId")),
              "totalInvoices",
            ],
            [
              Sequelize.fn("SUM", Sequelize.col("SumTotalInvoice")),
              "totalRevenue",
            ],
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.fn("DISTINCT", Sequelize.col("userId")),
              ),
              "uniqueCustomers",
            ],
          ],
          raw: true,
        }),

        // Payment Stats
        PaymentInfoModel.findOne({
          include: [
            {
              model: InvoiceModel,
              as: "invoice",
              where: { employeeId },
              attributes: [],
            },
          ],
          attributes: [
            [
              Sequelize.fn("COUNT", Sequelize.col("discount")),
              "totalDiscounts",
            ],
            [
              Sequelize.fn("SUM", Sequelize.col("discount")),
              "totalDiscountAmount",
            ],
            [
              Sequelize.fn("SUM", Sequelize.col("billBalance")),
              "totalRemainingAmount",
            ],
            [
              Sequelize.fn("COUNT", Sequelize.col("insuranceAmount")),
              "totalInsuranceTransfers",
            ],
            [
              Sequelize.fn("SUM", Sequelize.col("insuranceAmount")),
              "totalInsuranceTransferAmount",
            ],
          ],
          raw: true,
        }),

        // Frame Count
        UserPrescriptionModel.count({
          include: [
            {
              model: InvoiceModel,
              as: "invoice",
              where: { employeeId },
            },
          ],
          where: {
            frameId: { [Sequelize.Op.ne]: null },
          },
        }),

        // Lens Tracking Stats

        LensOrderStatusTracking.findAll({
          attributes: [
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.literal(
                  `CASE WHEN "lensOrderedBy" = '${employeeId}' THEN 1 END`,
                ),
              ),
              "lensOrderedCount",
            ],
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.literal(
                  `CASE WHEN "workShopSectionBy" = '${employeeId}' THEN 1 END`,
                ),
              ),
              "workshopSectionCount",
            ],
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.literal(
                  `CASE WHEN "readyToDeliverBy" = '${employeeId}' THEN 1 END`,
                ),
              ),
              "readyToDeliverCount",
            ],
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.literal(
                  `CASE WHEN "deliveredBy" = '${employeeId}' THEN 1 END`,
                ),
              ),
              "deliveredCount",
            ],
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.literal(
                  `CASE WHEN "sendOrderSmsBy" = '${employeeId}' THEN 1 END`,
                ),
              ),
              "sendOrderSmsCount",
            ],
          ],
          raw: true,
        }),
      ]);

      const tracking = lensTrackingStats[0];

      return res.status(200).json({
        dailySales,
        totalInvoices: Number(overallStats.totalInvoices || 0),
        totalRevenue: Number(overallStats.totalRevenue || 0),
        uniqueCustomers: Number(overallStats.uniqueCustomers || 0),
        totalDiscounts: Number(paymentStats.totalDiscounts || 0),
        totalDiscountAmount: Number(paymentStats.totalDiscountAmount || 0),
        totalRemainingAmount: Number(paymentStats.totalRemainingAmount || 0),
        totalInsuranceTransfers: Number(
          paymentStats.totalInsuranceTransfers || 0,
        ),
        totalInsuranceTransferAmount: Number(
          paymentStats.totalInsuranceTransferAmount || 0,
        ),
        frameCount,
        lensTrackingStats: {
          lensOrderedCount: Number(tracking.lensOrderedCount || 0),
          workshopSectionCount: Number(tracking.workshopSectionCount || 0),
          readyToDeliverCount: Number(tracking.readyToDeliverCount || 0),
          deliveredCount: Number(tracking.deliveredCount || 0),
          sendOrderSmsCount: Number(tracking.sendOrderSmsCount || 0),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  EmployeeController: new EmployeeController(),
};
