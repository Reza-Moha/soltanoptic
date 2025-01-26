import { useSelector } from "react-redux";
import { Field } from "formik";
import SelectInput from "@/components/Ui/SelectInput";

export const PaymentMethods = ({ values, setFieldValue }) => {
  const { bankList } = useSelector((state) => state.bankSlice);
  const bankOptions = bankList.map((bank) => ({
    value: bank.BankId,
    label: `${bank.bankName} (${bank.bankAccountHolder})`,
  }));
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {values.deposit !== 0 &&
        values.deposit !== "0" &&
        values.deposit !== "" ? (
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
