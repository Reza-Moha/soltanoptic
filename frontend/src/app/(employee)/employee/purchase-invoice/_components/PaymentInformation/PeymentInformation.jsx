import { useEffect } from "react";
import { convertFarsiToEnglish, toPersianDigits } from "@/utils";
import Input from "@/components/Ui/Input";
import { PriceInput } from "@/components/Ui/PriceInput";

// آرایه اطلاعات ورودی
const Inputs = [
  {
    id: 1,
    label: "قیمت",
    name: "descriptionPrice",
  },
  {
    id: 2,
    label: "حواله بیمه",
    name: "InsuranceAmount",
  },
  {
    id: 3,
    label: "دریافتی از مشتری",
    name: "deposit",
  },
  {
    id: 4,
    label: "تخفیف",
    name: "discount",
  },
  {
    id: 5,
    label: "مانده قبض",
    name: "billBalance",
  },
  {
    id: 6,
    label: "مبلغ کل قبض",
    name: "SumTotalInvoice",
    readOnly: true,
  },
];

export const PaymentInformation = ({ values, setFieldValue }) => {
  const calculateTotalInvoice = () => {
    let total = 0;

    if (values.prescriptions && Array.isArray(values.prescriptions)) {
      values.prescriptions.forEach((prescription) => {
        const lensPrice = convertFarsiToEnglish(prescription.lensPrice) || 0;
        const framePrice =
          convertFarsiToEnglish(prescription.frame?.price) || 0;

        total += lensPrice + framePrice;
      });
    }

    const descriptionPrice =
      convertFarsiToEnglish(values.descriptionPrice) || 0;

    const discount = convertFarsiToEnglish(values.discount) || 0;
    const insuranceAmount = convertFarsiToEnglish(values.InsuranceAmount) || 0;
    const deposit = convertFarsiToEnglish(values.deposit) || 0;

    total += descriptionPrice;

    const formatedTotalPrice = toPersianDigits(total.toLocaleString("en-US"));

    setFieldValue("SumTotalInvoice", formatedTotalPrice);

    const billBalance = total - deposit - insuranceAmount - discount;
    const formatedBillBalancePrice = toPersianDigits(
      billBalance.toLocaleString("en-US"),
    );
    setFieldValue("billBalance", formatedBillBalancePrice);
  };

  useEffect(() => {
    calculateTotalInvoice();
  }, [
    values.descriptionPrice,
    values.discount,
    values.InsuranceAmount,
    values.deposit,
    values.prescriptions,
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5">
      {/* توضیحات */}
      <div className="col-span-4">
        <Input
          label="توضیحات"
          name="description"
          type="text"
          bg="bg-white"
          onBlur={() => calculateTotalInvoice()}
        />
      </div>
      {Inputs.map((item) => (
        <div key={item.id} className="col-span-1">
          <PriceInput
            label={item.label}
            name={item.name}
            type="text"
            readOnly={item.readOnly || false}
            onChange={(e) => {
              const value = toPersianDigits(
                e.target.value.toLocaleString("en-US"),
              );
              setFieldValue(item.name, value);
            }}
            onBlur={() => calculateTotalInvoice()}
          />
        </div>
      ))}

      <div className="col-span-5 h-px bg-secondary-300 inline-block mb-4 md:mx-10"></div>
    </div>
  );
};
