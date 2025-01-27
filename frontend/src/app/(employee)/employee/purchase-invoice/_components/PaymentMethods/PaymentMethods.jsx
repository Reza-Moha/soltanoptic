import { useSelector } from "react-redux";
import { Field } from "formik";
import SelectInput from "@/components/Ui/SelectInput";
const paymentMethods = [
  {
    id: 1,
    value: "کارت خوان",
    label: "کارت خوان",
  },
  {
    id: 2,
    value: "کارت به کارت",
    label: "کارت به کارت",
  },
  {
    id: 3,
    value: "نقد",
    label: "نقد",
  },
  {
    id: 4,
    value: "چک صیادی",
    label: "چک صیادی",
  },
];

export const PaymentMethods = ({ values, setFieldValue }) => {
  const { bankList } = useSelector((state) => state.bankSlice);
  const bankOptions = bankList.map((bank) => ({
    value: bank.BankId,
    label: `${bank.bankName} (${bank.bankAccountHolder})`,
  }));
  const paymentMethodsOptions = paymentMethods.map((method) => ({
    value: method.value,
    label: method.value,
  }));
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {values.deposit !== 0 &&
        values.deposit !== "0" &&
        values.deposit !== "" ? (
          <Field
            name="paymentMethod"
            component={SelectInput}
            options={paymentMethodsOptions}
            isMulti={false}
            placeholder="نحوه پرداخت"
            className="!p-0 scale-90"
          />
        ) : null}
        {values.deposit !== 0 &&
        values.deposit !== "0" &&
        values.deposit !== "" &&
        values.paymentMethod !== "نقد" ? (
          <Field
            name="paymentToAccount"
            component={SelectInput}
            options={bankOptions}
            isMulti={false}
            placeholder="نوع پرداخت"
            className="!p-0 scale-90"
          />
        ) : null}
      </div>
    </>
  );
};
