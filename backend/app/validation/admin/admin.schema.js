const Joi = require("joi");
const CreateError = require("http-errors");
const { validateNationalId, isValidBankCardNumber } = require("../../utils");

const updateAdminProfileSchema = Joi.object({
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .required()
    .messages({
      "string.length": "شماره موبایل باید ۱۱ رقم باشد",
      "string.pattern.base": "شماره موبایل وارد شده صحیح نمی‌باشد",
      "any.required": "لطفا شماره موبایل خود را وارد فرمائید",
    }),

  fullName: Joi.string().min(5).max(30).required().messages({
    "string.min": "نام و نام خانوادگی باید حداقل ۵ کاراکتر باشد",
    "string.max": "نام و نام خانوادگی نمی‌تواند بیش از ۳۰ کاراکتر باشد",
    "any.required": "لطفا نام و نام خانوادگی خود را وارد فرمائید",
  }),
  fileUploadPath: Joi.allow(),
  filename: Joi.string()
    .regex(/(\.png|\.jpg|\.webp|\.jpeg)$/)
    .error(CreateError.BadRequest("تصویر ارسال شده صحیح نمیباشد")),
});

const createNewPermissionSchema = Joi.object({
  title: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "عنوان نمی‌تواند خالی باشد",
    "string.min": "عنوان باید حداقل ۳ کاراکتر داشته باشد",
    "string.max": "عنوان نباید بیش از ۵۰ کاراکتر باشد",
    "any.required": "عنوان الزامی است",
  }),
  description: Joi.string().min(5).max(255).required().messages({
    "string.empty": "توضیحات نمی‌تواند خالی باشد",
    "string.min": "توضیحات باید حداقل 5 کاراکتر داشته باشد",
    "string.max": "توضیحات نباید بیش از ۲۵۵ کاراکتر باشد",
    "any.required": "توضیحات الزامی است",
  }),
});

const idSchema = Joi.object({
  id: Joi.string().trim().guid({ version: "uuidv4" }).required(),
});

const createNewRoleSchema = Joi.object({
  title: Joi.string().min(6).max(10).required().messages({
    "string.min": "عنوان نقش باید حداقل ۶ کاراکتر باشد",
    "string.max": "عنوان نقش نباید بیش از ۱۰ کاراکتر باشد",
    "any.required": "عنوان نقش الزامی است",
  }),
  description: Joi.string().min(3).max(100).allow("").messages({
    "string.min": "توضیحات نقش باید حداقل ۳ کاراکتر داشته باشد",
    "string.max": "توضیحات نقش نباید بیش از ۱۰۰ کاراکتر باشد",
  }),
  permissionsIds: Joi.array()
    .items(Joi.string().guid({ version: "uuidv4" }).required())
    .min(1)
    .messages({
      "array.includes": "دسترسی‌ها باید شامل UUIDهای معتبر باشند",
      "array.min": "باید حداقل یک سطح دسترسی انتخاب شده باشد",
      "any.required": "دسترسی‌ها الزامی هستند",
    }),
});

const createNewEmployeeSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().messages({
    "string.base": "نام و نام خانوادگی باید یک رشته باشد",
    "string.min": "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد",
    "string.max": "نام و نام خانوادگی نمی‌تواند بیش از ۵۰ کاراکتر باشد",
    "any.required": "لطفا نام و نام خانوادگی خود را وارد فرمائید",
  }),
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^[0][9][0-9]{9}$/)
    .required()
    .messages({
      "string.base": "شماره موبایل باید یک رشته باشد",
      "string.length": "شماره موبایل وارد شده معتبر نیست",
      "string.pattern.base": "شماره موبایل وارد شده معتبر نیست",
      "any.required": "لطفا شماره موبایل خود را وارد فرمائید",
    }),
  gender: Joi.string().required().messages({
    "string.base": "جنسیت باید یک رشته باشد",
    "any.required": "جنسیت را وارد کنید",
  }),
  jobTitle: Joi.string().required().messages({
    "string.base": "عنوان شغل باید یک رشته باشد",
    "any.required": "عنوان شغل را وارد کنید",
  }),
  description: Joi.string().allow("", null),
  fileUploadPath: Joi.allow(),
  filename: Joi.string()
    .regex(/(\.png|\.jpg|\.webp|\.jpeg)$/)
    .error(CreateError.BadRequest("تصویر ارسال شده صحیح نمیباشد")),
  nationalId: Joi.string()
    .length(10)
    .required()
    .custom((value, helpers) => {
      if (!validateNationalId(value)) {
        return helpers.message("کد ملی وارد شده معتبر نیست");
      }
      return value;
    })
    .messages({
      "string.base": "کد ملی باید یک رشته باشد",
      "string.length": "کد ملی باید شامل ۱۰ رقم باشد",
      "any.required": "لطفا کد ملی همکار را وارد فرمائید",
    }),
  profileImage: Joi.alternatives()
    .try(
      Joi.object({
        size: Joi.number().max(5000000).optional(),
        type: Joi.string()
          .valid("image/jpg", "image/jpeg", "image/png")
          .optional(),
      }),
      Joi.string(),
    )
    .optional()
    .messages({
      "object.max": "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      "string.valid": "فرمت فایل معتبر نیست. فرمت‌های مجاز: jpg, jpeg, png",
    }),
});

const createNewDoctorsSchema = Joi.object({
  fullName: Joi.string().min(3).required().messages({
    "string.base": "لطفا نام دکتر را وارد فرمائید",
    "string.min": "نام و نام خانوادگی نباید کم‌تر از سه کارکتر باشد",
    "any.required": "لطفا نام دکتر را وارد فرمائید",
  }),
  visitPrice: Joi.string().required().messages({
    "string.base": "لطفا مبلغ ویزیت را وارد فرمائید",
    "any.required": "لطفا مبلغ ویزیت را وارد فرمائید",
  }),
  medicalSystemNumber: Joi.string(),
});

const createNewLensCategorySchema = Joi.object({
  lensName: Joi.string().trim().min(3).required().messages({
    "string.base": "لطفا نام دسته بندی عدسی را وارد فرمائید",
    "string.min": "دسته بندی عدسی نباید کم‌تر از سه کارکتر باشد",
    "any.required": "لطفا نام دسته بندی عدسی را وارد فرمائید",
  }),
  fileUploadPath: Joi.allow(),
  filename: Joi.string()
    .regex(/(\.png|\.jpg|\.webp|\.jpeg)$/)
    .error(CreateError.BadRequest("تصویر ارسال شده صحیح نمیباشد")),
  lensCategoryImage: Joi.alternatives()
    .try(
      Joi.object({
        size: Joi.number().max(5000000).optional(),
        type: Joi.string()
          .valid("image/jpg", "image/jpeg", "image/png")
          .optional(),
      }),
      Joi.string(),
    )
    .optional()
    .messages({
      "object.max": "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      "string.valid": "فرمت فایل معتبر نیست. فرمت‌های مجاز: jpg, jpeg, png",
    }),
});

const createNewRefractiveIndexSchema = Joi.object({
  index: Joi.number().precision(2).required().messages({
    "number.base": "مقدار وارد شده باید یک عدد باشد.",
    "number.precision": "عدد وارد شده باید حداکثر دارای دو رقم اعشار باشد.",
    "any.required": "این فیلد الزامی است.",
  }),
  characteristics: Joi.array()
    .items(
      Joi.string().min(3).required().messages({
        "string.empty": "لطفا ویژگی را وارد فرمائید",
        "string.min": "ویژگی نباید کم‌تر از سه کاراکتر باشد.",
      }),
    )
    .min(1)
    .messages({
      "array.min": "حداقل باید یک ویژگی وارد شود.",
    }),
});

const createNewLensTypeSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.base": "نوع لنز باید یک رشته باشد",
    "any.required": "عنوان نوع لنز را وارد کنید",
  }),
  description: Joi.string().allow("", null),
});

const createNewLensSchema = Joi.object({
  lensName: Joi.string().min(3).max(50).required().messages({
    "string.base": "نام عدسی باید یک رشته باشد",
    "string.min": "نام عدسی باید حداقل ۳ کاراکتر باشد",
    "string.max": "نام عدسی نمی‌تواند بیش از ۵۰ کاراکتر باشد",
    "any.required": "لطفا نام عدسی خود را وارد فرمائید",
  }),
  description: Joi.string().allow("", null),
  fileUploadPath: Joi.allow(),
  filename: Joi.string()
    .regex(/(\.png|\.jpg|\.webp|\.jpeg)$/)
    .error(CreateError.BadRequest("تصویر ارسال شده صحیح نمیباشد")),
  lensImage: Joi.alternatives()
    .try(
      Joi.object({
        size: Joi.number().max(5000000).optional(),
        type: Joi.string()
          .valid("image/jpg", "image/jpeg", "image/png")
          .optional(),
      }),
      Joi.string(),
    )
    .optional()
    .messages({
      "object.max": "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      "string.valid": "فرمت فایل معتبر نیست. فرمت‌های مجاز: jpg, jpeg, png",
    }),
  LensCategoryId: Joi.string().trim().guid({ version: "uuidv4" }).required(),
  RefractiveIndexId: Joi.string().trim().guid({ version: "uuidv4" }).required(),
  LensTypeId: Joi.string().trim().guid({ version: "uuidv4" }).required(),
});

const pricingSchema = Joi.object({
  group: Joi.string().required().messages({
    "string.empty": "وارد کردن گروه الزامی است",
  }),
  price: Joi.number().greater(0).required().messages({
    "number.base": "قیمت باید یک عدد باشد",
    "number.greater": "قیمت باید بیشتر از صفر باشد",
    "any.required": "وارد کردن قیمت الزامی است",
  }),
});

const pricingLensSchema = Joi.object({
  LensCategoryId: Joi.string().trim().guid({ version: "uuidv4" }).required(),
  LensId: Joi.string().trim().guid({ version: "uuidv4" }).required(),
  pricing: Joi.array().items(pricingSchema).min(1).required().messages({
    "array.min": "حداقل یک آیتم قیمت باید وارد شود",
    "array.base": "قیمت‌ها باید به صورت یک آرایه ارسال شوند",
  }),
});

const createFrameCategorySchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "عنوان فریم باید یک رشته باشد",
    "any.required": "عنوان فریم را وارد کنید",
  }),
  description: Joi.string().allow("", null),
});

const createFrameGenderSchema = Joi.object({
  gender: Joi.string().required().messages({
    "string.base": "جنسیت فریم باید یک رشته باشد",
    "any.required": "جنسیت فریم را وارد کنید",
  }),
  description: Joi.string().allow("", null),
});

const createNewFrameSchema = Joi.object({
  id: Joi.string().trim().guid({ version: "uuidv4" }).allow(),
  name: Joi.string().required().messages({
    "any.required": "لطفا نام فریم را وارد فرمائید",
  }),
  price: Joi.string().required().messages({
    "any.required": "لطفا قیمت فروش فریم را وارد فرمائید",
  }),
  frameCategory: idSchema.extract("id").messages({
    "any.required": "لطفا یکی از دسته بندی های فریم را انتخاب کنید",
    "string.guid": "فرمت UUID معتبر نیست",
  }),
  frameType: idSchema.extract("id").messages({
    "any.required": "لطفا یکی از نوع فریم را انتخاب کنید",
    "string.guid": "فرمت UUID معتبر نیست",
  }),
  frameGender: idSchema.extract("id").messages({
    "any.required": "لطفا جنسیت فریم را مشخصی کنید",
    "string.guid": "فرمت UUID معتبر نیست",
  }),
  serialNumber: Joi.string().required().messages({
    "any.required": "لطفا سریال فریم را وارد فرمائید",
  }),
  description: Joi.string().allow(""),
  fileUploadPath: Joi.allow(),
  filename: Joi.string()
    .regex(/(\.png|\.jpg|\.webp|\.jpeg)$/)
    .error(CreateError.BadRequest("تصویر ارسال شده صحیح نمیباشد")),
  colors: Joi.array()
    .items(
      Joi.object({
        colorCode: Joi.string().required().messages({
          "any.required": "رنگ الزامی است",
        }),
        count: Joi.number().greater(0).required().messages({
          "number.base": "تعداد باید یک عدد باشد",
          "number.greater": "تعداد فریم باید بیشتر از صفر باشد",
          "any.required": "وارد کردن تعداد فریم الزامی است",
        }),
        images: Joi.array().items(Joi.string().required()).min(1).messages({
          "array.min": "لطفا حداقل یک عکس انتخاب کنید",
          "any.required": "انتخاب عکس الزامی است",
        }),
      }),
    )
    .required(),
});

const createNewBankSchema = Joi.object({
  bankName: Joi.string().min(3).max(50).required().messages({
    "string.min": "نام بانک باید حداقل ۳ کاراکتر باشد",
    "string.max": "نام بانک نمی‌تواند بیش از ۵۰ کاراکتر باشد",
    "any.required": "لطفا نام بانک خود را وارد فرمائید",
  }),

  cartNumber: Joi.string()
    .length(16)
    .regex(/^\d+$/)
    .custom((value, helpers) => {
      if (!isValidBankCardNumber(value)) {
        return helpers.error("any.invalid", {
          message: "شماره کارت معتبر نیست",
        });
      }
      return value;
    })
    .required()
    .messages({
      "string.length": "شماره کارت باید دقیقاً 16 رقم باشد",
      "string.pattern.base": "شماره کارت باید فقط شامل اعداد باشد",
      "any.invalid": "{{#message}}",
      "any.required": "شماره کارت اجباری است",
    }),

  bankAccountHolder: Joi.string().min(3).max(50).required().messages({
    "string.min": "نام صاحب حساب باید حداقل ۳ کاراکتر باشد",
    "string.max": "نام صاحب حساب نمی‌تواند بیش از ۵۰ کاراکتر باشد",
    "any.required": "لطفا نام صاحب حساب خود را وارد فرمائید",
  }),

  shabaNumber: Joi.string()
    .length(24)
    .regex(/^IR[0-9]{22}$/)
    .required()
    .messages({
      "string.length": "شماره شبا باید دقیقاً 24 کاراکتر باشد",
      "string.pattern.base":
        "شماره شبا معتبر نیست. لطفاً یک شماره شبا صحیح وارد کنید.",
      "any.required": "شماره شبا اجباری است",
    }),
});

const createNewInsuranceSchema = Joi.object({
  insuranceName: Joi.string().min(2).max(50).required().messages({
    "string.min": "نام بیمه باید حداقل 2 کاراکتر باشد",
    "string.max": "نام بیمه نمی‌تواند بیش از ۵۰ کاراکتر باشد",
    "any.required": "لطفا نام بیمه خود را وارد فرمائید",
  }),
  insuranceFranchise: Joi.number()
    .integer()
    .min(10)
    .max(99)
    .required()
    .messages({
      "number.base": "فرانشیز باید یک عدد معتبر باشد.",
      "number.integer": "فرانشیز باید یک عدد صحیح باشد.",
      "number.min": "فرانشیز نمی‌تواند کمتر از 10 باشد.",
      "number.max": "فرانشیز نمی‌تواند بیشتر از 99 باشد.",
      "any.required": "لطفا درصد فرانشیز بیمه را وارد فرمائید",
    }),
  documents: Joi.array()
    .items(
      Joi.string().min(3).required().messages({
        "string.min": "عنوان مدارک نباید کم‌تر از سه کاراکتر باشد",
        "any.required": "لطفا مدارک مورد نیاز برای بیمه را وارد فرمائید",
      }),
    )
    .min(1)
    .messages({
      "array.min": "حداقل باید یک ویژگی وارد شود",
    }),
  panelUserName: Joi.string().min(1).max(50).required().messages({
    "string.min": "نام کاربری باید حداقل 1 کاراکتر باشد",
    "string.max": "نام کاربری نمی‌تواند بیش از ۵۰ کاراکتر باشد",
    "any.required": "لطفا نام کاربری پنل را وارد فرمائید",
  }),
  websiteLink: Joi.string().uri().required().messages({
    "string.uri": "لطفاً یک لینک معتبر وارد کنید.",
    "any.required": "لطفاً یک لینک وارد کنید.",
  }),
  panelPassword: Joi.string().min(2).max(50).required().messages({
    "string.min": "رمز عبور پنل باید حداقل 2 کاراکتر باشد",
    "string.max": "رمز عبور پنل نمی‌تواند بیش از ۵۰ کاراکتر باشد",
    "any.required": "لطفا رمز عبور پنل خود را وارد فرمائید",
  }),
  description: Joi.string().min(2).max(200).messages({
    "string.min": "توضیحات بیمه باید حداقل 2 کاراکتر باشد",
    "string.max": "توضیحات بیمه نمی‌تواند بیش از 200 کاراکتر باشد",
  }),
});
module.exports = {
  updateAdminProfileSchema,
  createNewPermissionSchema,
  idSchema,
  createNewRoleSchema,
  createNewEmployeeSchema,
  createNewDoctorsSchema,
  createNewRefractiveIndexSchema,
  createNewLensTypeSchema,
  createNewLensCategorySchema,
  createNewLensSchema,
  pricingLensSchema,
  createFrameCategorySchema,
  createFrameGenderSchema,
  createNewFrameSchema,
  createNewBankSchema,
  createNewInsuranceSchema,
};
