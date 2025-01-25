import * as Yup from "yup";
export const RegisterSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .min(11, "شماره موبایل وارد شده معتبر نیست")
    .max(11, "شماره موبایل وارد شده معتبر نیست")
    .matches(/^[0][9][0-9][0-9]{8,8}$/, "شماره موبایل وارد شده معتبر نیست")
    .required("لطفا شماره موبایل خود را وارد فرمائید"),
});
