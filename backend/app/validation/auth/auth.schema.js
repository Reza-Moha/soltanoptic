const Joi = require("joi");
const createHttpError = require("http-errors");
const sendOtpSchema = Joi.object({
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .required()
    .error(new Error("شماره موبایل وارد شده صحیح نمی باشد")),
});
const checkOtpSchema = Joi.object({
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .required()
    .error(new Error("شماره موبایل وارد شده صحیح نمی باشد")),
  code: Joi.string()
    .required()
    .length(5)
    .error(createHttpError.BadRequest("کد ارسال شده صحیح نمیباشد")),
});

module.exports = {
  sendOtpSchema,
  checkOtpSchema,
};
