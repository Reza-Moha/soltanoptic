"use client";
import Input from "@/components/Ui/Input";
import { PriceInput } from "@/components/Ui/PriceInput";
import { useEffect } from "react";

const Inputs = [
  {
    id: 1,
    label: "حواله بیمه",
    name: "InsuranceAmount",
  },
  {
    id: 2,
    label: "دریافتی از مشتری",
    name: "deposit",
  },
  {
    id: 3,
    label: "تخفیف",
    name: "discount",
  },
  {
    id: 4,
    label: "مانده قبض",
    name: "billBalance",
  },
  {
    id: 5,
    label: "مبلغ کل قبض",
    name: "SumTotalInvoice",
    readOnly: true,
  },
];
export const PaymentInformation = ({ values, setFieldValue }) => {
  const parsePrice = (price) => {
    if (!price) return 0; // اگر قیمت undefined یا null باشد، به 0 تبدیل شود

    console.log("Original price:", price); // دیباگ: نمایش قیمت اصلی

    if (typeof price === "string") {
      // تبدیل اعداد فارسی/عربی به انگلیسی
      const normalizedPrice = price
        .replace(/[۰-۹]/g, (match) =>
          String.fromCharCode(match.charCodeAt(0) - 1584),
        ) // تبدیل اعداد فارسی/عربی به انگلیسی
        .replace(/[٬،]/g, "") // حذف ویرگول‌ها (فارسی و عربی)
        .replace(/[^\d.-]/g, ""); // حذف هر کاراکتر غیر عددی، به جز اعداد و نقطه (برای اعداد اعشاری)

      console.log("Normalized price:", normalizedPrice); // دیباگ: نمایش قیمت تبدیل‌شده به رشته

      // بررسی دقیق‌تر: نمایش هر کاراکتر موجود در normalizedPrice
      [...normalizedPrice].forEach((char, index) => {
        console.log(`Character at position ${index}: ${char}`);
      });

      const parsedPrice = parseFloat(normalizedPrice);
      console.log("Parsed price:", parsedPrice); // دیباگ: نمایش قیمت تبدیل‌شده به عدد
      return isNaN(parsedPrice) ? 0 : parsedPrice; // اگر NaN باشد، به 0 تبدیل شود
    }

    // اگر ورودی عددی است، به راحتی آن را به عدد تبدیل کنید
    return parseFloat(price || 0);
  };

  // محاسبه مجموع فاکتور
  const calculateTotalInvoice = () => {
    let total = 0;

    // مجموع قیمت فریم و لنز
    if (values.prescriptions && Array.isArray(values.prescriptions)) {
      values.prescriptions.forEach((prescription, index) => {
        const lensPrice = parsePrice(prescription.lensPrice);
        const framePrice = parsePrice(prescription.frame?.price);

        // دیباگ: بررسی مقادیر هر فریم و لنز
        console.log(`Prescription ${index + 1}:`);
        console.log("Lens Price:", lensPrice);
        console.log("Frame Price:", framePrice);

        total += lensPrice + framePrice;
      });
    }

    // اضافه کردن قیمت توضیحات
    const descriptionPrice = parsePrice(values.descriptionPrice);
    console.log("Description Price:", descriptionPrice); // دیباگ
    total += descriptionPrice;

    // کسر تخفیف، بیمه و مبلغ پیش‌پرداخت
    const discount = parsePrice(values.discount);
    const insuranceAmount = parsePrice(values.InsuranceAmount);
    const deposit = parsePrice(values.deposit);

    console.log("Discount:", discount);
    console.log("Insurance Amount:", insuranceAmount);
    console.log("Deposit:", deposit);

    total -= discount;
    total -= insuranceAmount;
    total -= deposit;

    // بروزرسانی مقدار فیلد جمع کل
    setFieldValue("SumTotalInvoice", total); // بروزرسانی
    console.log("Total Invoice:", total); // نمایش مجموع کل
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
          onBlur={() => calculateTotalInvoice()} // در هنگام از دست دادن focus
        />
      </div>
      <div className="col-span-1">
        <PriceInput
          label="قیمت"
          name="descriptionPrice"
          type="text"
          onChange={(e) => {
            setFieldValue("descriptionPrice", e.target.value);
          }}
          onBlur={() => calculateTotalInvoice()} // در هنگام از دست دادن focus
        />
      </div>

      {Inputs.map((item) => {
        return (
          <div key={item.id} className="col-span-1">
            <PriceInput
              label={item.label}
              name={item.name}
              type="text"
              onChange={(e) => {
                setFieldValue(item.name, e.target.value);
              }}
              onBlur={() => calculateTotalInvoice()} // در هنگام از دست دادن focus
            />
          </div>
        );
      })}

      <div className="col-span-5 h-px bg-secondary-300 inline-block mb-4 md:mx-10"></div>
    </div>
  );
};
