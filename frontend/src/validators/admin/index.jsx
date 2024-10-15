import { validateNationalId } from "@/utils";
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
      (value) => !value || (value && value.size <= 5000000)
    )
    .test(
      "fileFormat",
      "فرمت فایل معتبر نیست. فرمت‌های مجاز: jpg, jpeg, png",
      (value) =>
        !value || ["image/jpg", "image/jpeg", "image/png"].includes(value?.type)
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
      validateNationalId
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
      }
    ),
});

export const createNewPermissionsSchema = Yup.object().shape({
  title: Yup.string()
    .required("لطفا عنوان دسترسی را وارد فرمائید")
    .min(3, "عنوان نباید کم تر از سه کارکتر باشد"),
  description: Yup.string().required("لطفا توضیحات سطح دسترسی را وارد فرمائید"),
});

export const createNewRoleSchema = Yup.object().shape({
  title: Yup.number()
    .required("لطفا عنوان دسترسی را وارد فرمائید")
    .min(100000, "عنوان نباید کم‌تر از ۶ رقم باشد")
    .max(999999, "عنوان نباید بیش از ۶ رقم باشد"),
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
      (value) => value !== undefined && /^\d+(\.\d{1,2})?$/.test(value)
    ),
  characteristics: Yup.array()
    .of(
      Yup.string()
        .required("لطفا ویژگی را وارد فرمائید")
        .min(3, "ویژگی نباید کم‌تر از سه کاراکتر باشد")
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
  lensImage: Yup.mixed()
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
      }
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
      }
    )
    .nullable(),
  LensCategoryId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست"
    )
    .required(),

  RefractiveIndexId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست"
    )
    .required(),
  LensTypeId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست"
    )
    .required(),
});

export const pricingLensSchema = Yup.object().shape({
  LensCategoryId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست"
    )
    .required(),
  LensId: Yup.string()
    .trim()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "فرمت UUID معتبر نیست"
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
    }
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
  name: Yup.string().required("Required"),
  price: Yup.string().required("لطفا قیمت فروش فریم را وارد فرمائید"),
  serialNumber: Yup.string().required("Required"),
  description: Yup.string(),
  colors: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Required"),
      images: Yup.mixed().required("Required"),
    })
  ),
});
