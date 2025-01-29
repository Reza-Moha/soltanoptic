import { isValidBankCardNumber, validateNationalId } from "@/utils";
import * as Yup from "yup";

export const updateAdminProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام و نام خانوادگی نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .required("لطفا نام و نام خانوادگی خود را وارد فرمائید"),
  phoneNumber: Yup.string()
    .min(11, "شماره موبایل وارد شده معتبر نیست")
    .max(11, "شماره موبایل وارد شده معتبر نیست")
    .matches(/^[0][9][0-9][0-9]{8,8}$/, "شماره موبایل وارد شده معتبر نیست")
    .required("لطفا شماره موبایل خود را وارد فرمائید"),
  profileImage: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      (value) => !value || (value && value.size <= 5000000),
    )
    .test(
      "fileFormat",
      "فرمت فایل معتبر نیست. فرمت‌های مجاز: jpg, jpeg, png",
      (value) =>
        !value ||
        ["image/jpg", "image/jpeg", "image/png"].includes(value?.type),
    ),
});

export const createNewEmployeeSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام و نام خانوادگی نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .required("لطفا نام و نام خانوادگی خود را وارد فرمائید"),
  phoneNumber: Yup.string()
    .min(11, "شماره موبایل وارد شده معتبر نیست")
    .max(11, "شماره موبایل وارد شده معتبر نیست")
    .matches(/^[0][9][0-9][0-9]{8,8}$/, "شماره موبایل وارد شده معتبر نیست")
    .required("لطفا شماره موبایل خود را وارد فرمائید"),
  gender: Yup.string().required("جنسیت را وارد کنید"),
  jobTitle: Yup.string().required("عنوان شغل را وارد کنید"),
  description: Yup.string(),
  nationalId: Yup.string()
    .required("لطفا کد ملی همکار را وارد فرمائید")
    .matches(/^\d{10}$/, "کد ملی باید شامل ۱۰ رقم باشد")
    .test(
      "validateNationalCode",
      "کد ملی وارد شده معتبر نیست",
      validateNationalId,
    ),
  profileImage: Yup.mixed()
    .nullable()
    .test(
      "fileFormat",
      "فرمت فایل یا لینک معتبر نیست. فرمت‌های مجاز: jpg, jpeg, png",
      (value) => {
        if (!value) return true;
        if (value instanceof File) {
          return ["image/jpg", "image/jpeg", "image/png"].includes(value.type);
        }
        if (typeof value === "string") {
          return /\.(jpg|jpeg|png)$/.test(value);
        }
        return false;
      },
    ),
});

export const createNewPermissionsSchema = Yup.object().shape({
  title: Yup.string()
    .required("لطفا عنوان دسترسی را وارد فرمائید")
    .min(3, "عنوان نباید کم تر از سه کارکتر باشد"),
  description: Yup.string().required("لطفا توضیحات سطح دسترسی را وارد فرمائید"),
});

export const createNewRoleSchema = Yup.object().shape({
  title: Yup.string()
    .required("لطفا عنوان دسترسی را وارد فرمائید")
    .min(6, "عنوان نباید کم‌تر از ۶ کاراکتر باشد")
    .max(10, "عنوان نباید بیش از 10 کاراکتر باشد"),
  description: Yup.string()
    .required("لطفا توضیحات دسترسی را وارد فرمائید")
    .min(3, "توضیحات نباید کم‌تر از سه کارکتر باشد"),
  permissionsIds: Yup.array()
    .of(Yup.string().uuid("شناسه سطح دسترسی باید یک UUID معتبر باشد"))
    .required("لطفا توضیحات سطح دسترسی را وارد فرمائید")
    .min(1, "حداقل یک سطح دسترسی باید انتخاب شود"),
});

export const createNewDoctorSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("لطفا نام دکتر را وارد فرمائید")
    .min(3, "نام و نام خانودگی نباید کم‌تر از سه کارکتر باشد"),
  visitPrice: Yup.string().required("لطفا مبلغ ویزیت را وارد فرمائید"),
  medicalSystemNumber: Yup.string(),
});

export const createNewRefractiveIndexSchema = Yup.object().shape({
  index: Yup.number()
    .required("این فیلد الزامی است.")
    .typeError("مقدار وارد شده باید یک عدد باشد.")
    .test(
      "is-decimal",
      "عدد وارد شده باید حداکثر دارای دو رقم اعشار باشد.",
      (value) => value !== undefined && /^\d+(\.\d{1,2})?$/.test(value),
    ),
  characteristics: Yup.array()
    .of(
      Yup.string()
        .required("لطفا ویژگی را وارد فرمائید")
        .min(3, "ویژگی نباید کم‌تر از سه کاراکتر باشد"),
    )
    .min(1, "حداقل باید یک ویژگی وارد شود"),
});

export const createNewLensTypeSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("لطفا نوع عدسی را وارد فرمائید")
    .min(3, "عنوان نباید کم تر از سه کارکتر باشد"),
  description: Yup.string()
    .required("لطفا توضیحات دسترسی را وارد فرمائید")
    .min(3, "توضیحات نباید کم‌تر از سه کارکتر باشد"),
});

export const createNewLensCategoriesSchema = Yup.object().shape({
  lensName: Yup.string()
    .trim()
    .required("لطفا نوع عدسی را وارد فرمائید")
    .min(3, "عنوان نباید کم تر از سه کارکتر باشد"),
  lensCategoryImage: Yup.mixed()
    .nullable()
    .test(
      "fileFormat",
      "فرمت فایل یا لینک معتبر نیست. فرمت‌های مجاز: jpg, jpeg, png",
      (value) => {
        if (!value) return true;
        if (value instanceof File) {
          return ["image/jpg", "image/jpeg", "image/png"].includes(value.type);
        }
        if (typeof value === "string") {
          return /\.(jpg|jpeg|png)$/.test(value);
        }
        return false;
      },
    ),
});

export const createNewLensSchema = Yup.object().shape({
  lensName: Yup.string()
    .min(3, "نام عدسی باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام عدسی نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .required("لطفا نام عدسی خود را وارد فرمائید"),

  description: Yup.string().nullable(),
  lensImage: Yup.mixed()
    .test("lensImage", "حجم فایل نباید بیشتر از ۵ مگابایت باشد", (value) => {
      if (typeof value === "object" && value?.size) {
        return value.size <= 5000000;
      }
      return true;
    })
    .test(
      "lensImage",
      "فرمت فایل معتبر نیست. فرمت‌های مجاز: jpg, jpeg, png",
      (value) => {
        if (typeof value === "object" && value?.type) {
          return ["image/jpg", "image/jpeg", "image/png"].includes(value.type); // بررسی فرمت فایل
        }
        return true;
      },
    )
    .nullable(),
  LensCategoryId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    )
    .required(),

  RefractiveIndexId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    )
    .required(),
  LensTypeId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    )
    .required(),
});

export const pricingLensSchema = Yup.object().shape({
  LensCategoryId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    )
    .required(),
  LensId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    )
    .required(),
  group: Yup.string().matches(/^\d+\/\d+$/, "گروه باید به فرمت 2/2 باشد."),

  price: Yup.string().test(
    "is-valid-number",
    "قیمت باید یک عدد مثبت باشد.",
    (value) => {
      if (!value) return true; // Allow empty values
      const numberValue = parseFloat(value.replace(/,/g, ""));
      return !isNaN(numberValue) && numberValue > 0;
    },
  ),
});

export const createNewFrameCategorySchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("لطفا عنوان دسته بندی را وارد فرمائید")
    .min(3, "عنوان نباید کم تر از سه کارکتر باشد"),
  description: Yup.string(),
});

export const createNewFrameGenderSchema = Yup.object().shape({
  gender: Yup.string()
    .trim()
    .required("لطفا عنوان دسته بندی را وارد فرمائید")
    .min(3, "عنوان نباید کم تر از سه کارکتر باشد"),
  description: Yup.string(),
});

export const createNewFrameSchema = Yup.object().shape({
  frameCategory: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    )
    .required("لطفا یکی از دسته بندی های فریم را انتخاب کنید"),
  frameType: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    )
    .required("لطفا یکی از نوع فریم را انتخاب کنید"),
  frameGender: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    )
    .required("لطفا جنسیت فریم را مشخصی کنید"),
  name: Yup.string().required("لطفا نام فریم را وارد فرمائید"),
  price: Yup.string()
    .required("لطفا قیمت فروش فریم را وارد فرمائید")
    .test("is-valid-number", "قیمت باید یک عدد معتبر و مثبت باشد.", (value) => {
      if (!value) return false;
      const numberValue = parseFloat(value.replace(/,/g, ""));
      return !isNaN(numberValue) && numberValue > 0;
    }),
  serialNumber: Yup.string().required("لطفا سریال فریم را وارد فرمائید"),
  description: Yup.string(),

  colors: Yup.array().of(
    Yup.object({
      colorCode: Yup.string().required("لطفا یک رنگ را برای فریم انتخاب کنید"),
      count: Yup.number().required("لطفا تعداد فریم را وارد فرمائید"),
      images: Yup.mixed().required("حداقل یک عکس از فریم را باید آپلود کنید"),
    }),
  ),
});

export const createNewBankSchema = Yup.object().shape({
  bankName: Yup.string()
    .min(3, "نام بانک باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام بانک نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .required("لطفا نام بانک خود را وارد فرمائید"),
  cartNumber: Yup.string()
    .required("شماره کارت اجباری است")
    .length(16, "شماره کارت باید دقیقاً 16 رقم باشد")
    .matches(/^\d+$/, "شماره کارت باید فقط شامل اعداد باشد")
    .test("isValidCard", "شماره کارت معتبر نیست", (value) => {
      if (!value) return false;
      return isValidBankCardNumber(value);
    }),
  bankAccountHolder: Yup.string()
    .min(3, "نام صاحب حساب باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام صاحب حساب نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .required("لطفا نام صاحب حساب خود را وارد فرمائید"),
  shabaNumber: Yup.string()
    .required("شماره شبا اجباری است")
    .length(24, "شماره شبا باید دقیقاً 24 کاراکتر باشد")
    .matches(
      /^IR[0-9]{22}$/,
      "شماره شبا معتبر نیست. لطفاً یک شماره شبا صحیح وارد کنید.",
    ),
});

export const createNewInsuranceSchema = Yup.object().shape({
  insuranceName: Yup.string()
    .min(2, "نام بیمه باید حداقل 2 کاراکتر باشد")
    .max(50, "نام بیمه نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .required("لطفا نام بیمه خود را وارد فرمائید"),
  insuranceFranchise: Yup.number()
    .typeError("فرانشیز باید یک عدد معتبر باشد.")
    .integer("فرانشیز باید یک عدد صحیح باشد.")
    .min(10, "فرانشیز نمی‌تواند کمتر از 10 باشد.")
    .max(99, "فرانشیز نمی‌تواند بیشتر از 99 باشد.")
    .required("لطفا درصد فرانشیز بیمه را وارد فرمائید"),
  documents: Yup.array()
    .of(
      Yup.string()
        .min(3, "عنوان مدارک نباید کم‌تر از سه کاراکتر باشد")
        .required("لطفا مدارک مورد نیاز برای بیمه را وارد فرمائید"),
    )
    .min(1, "حداقل باید یک ویژگی وارد شود"),
  panelUserName: Yup.string()
    .min(1, "نام کاربری باید حداقل 1 کاراکتر باشد")
    .max(50, "نام کاربری نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .required("لطفا نام کاربری پنل را وارد فرمائید"),
  websiteLink: Yup.string()
    .url("لطفاً یک لینک معتبر وارد کنید.")
    .required("لطفاً یک لینک وارد کنید."),
  panelPassword: Yup.string()
    .min(2, "رمز عبور پنل باید حداقل 2 کاراکتر باشد")
    .max(50, "رمز عبور پنل نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .required("لطفا رمز عبور پنل خود را وارد فرمائید"),
  description: Yup.string()
    .min(2, "توضیحات بیمه باید حداقل 2 کاراکتر باشد")
    .max(200, "توضیحات بیمه نمی‌تواند بیش از 200 کاراکتر باشد"),
});

export const createNewPurchaseInvoiceSchema = Yup.object().shape({
  invoiceNumber: Yup.number().required("شماره فاکتور الزامی است"),
  fullName: Yup.string().required("نام کامل الزامی است"),
  gender: Yup.string().required("لطفا یک جنسیت برای مشتری انتخاب کنید"),
  phoneNumber: Yup.string()
    .min(11, "شماره موبایل وارد شده معتبر نیست")
    .max(11, "شماره موبایل وارد شده معتبر نیست")
    .matches(/^[0][9][0-9][0-9]{8,8}$/, "شماره موبایل وارد شده معتبر نیست")
    .required("لطفا شماره موبایل خود را وارد فرمائید"),
  description: Yup.string(),
  nationalId: Yup.string()
    .nullable()
    .matches(/^\d{10}$/, "کد ملی باید شامل ۱۰ رقم باشد")
    .test(
      "validateNationalCode",
      "کد ملی وارد شده معتبر نیست",
      (value) => !value || validateNationalId(value),
    ),
  prescriptions: Yup.array().of(
    Yup.object().shape({
      odAx: Yup.string(),
      odCyl: Yup.string(),
      odSph: Yup.string(),
      osAx: Yup.string(),
      osCyl: Yup.string(),
      osSph: Yup.string(),
      pd: Yup.string(),
      lensPrice: Yup.string(),
      frame: Yup.object(),
    }),
  ),
  insuranceName: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    )
    .required("لطفا یکی از دسته بندی های بیمه را انتخاب کنید"),
  InsuranceAmount: Yup.string(),
  descriptionPrice: Yup.string(),
  deposit: Yup.string(),
  discount: Yup.string(),
  billBalance: Yup.string(),
  SumTotalInvoice: Yup.string(),
  paymentToAccount: Yup.string()
    .nullable()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value,
    )
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    ),
  paymentMethod: Yup.string().nullable(),
  orderLensFrom: Yup.string()
    .nullable()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value,
    )
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست",
    ),
});

export const createNewCompanySchema = Yup.object().shape({
  companyName: Yup.string()
    .min(3, "نام شرکت باید حداقل 2 کاراکتر باشد")
    .max(50, "نام شرکت نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .required("لطفا نام شرکت خود را وارد فرمائید"),
  whatsappNumber: Yup.string()
    .required("شماره تماس الزامی است")
    .matches(/^[0-9]+$/, "شماره تماس باید فقط شامل اعداد باشد"),
});
