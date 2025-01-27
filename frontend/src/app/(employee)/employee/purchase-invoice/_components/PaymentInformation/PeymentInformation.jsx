import { useEffect } from "react";
import { convertFarsiToEnglish, toPersianDigits } from "@/utils";
import Input from "@/components/Ui/Input";
import { PriceInput } from "@/components/Ui/PriceInput";

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
    readOnly: true,
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
        const lensPrice =
          Number(convertFarsiToEnglish(prescription.lensPrice)) || 0;
        const framePrice =
          Number(convertFarsiToEnglish(prescription.frame?.price)) || 0;

        total += lensPrice + framePrice;
      });
    }

    const descriptionPrice =
      Number(convertFarsiToEnglish(values.descriptionPrice)) || 0;
    const discount = Number(convertFarsiToEnglish(values.discount)) || 0;
    const insuranceAmount =
      Number(convertFarsiToEnglish(values.InsuranceAmount)) || 0;
    const deposit = Number(convertFarsiToEnglish(values.deposit)) || 0;

    total += descriptionPrice;

    setFieldValue(
      "SumTotalInvoice",
      toPersianDigits(total.toLocaleString("ar-EG")),
    );

    const billBalance = total - deposit - insuranceAmount - discount;
    setFieldValue(
      "billBalance",
      toPersianDigits(billBalance.toLocaleString("ar-EG")),
    );
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
            value={toPersianDigits(values[item.name])}
            onChange={(e) => {
              const value = convertFarsiToEnglish(e.target.value);
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
