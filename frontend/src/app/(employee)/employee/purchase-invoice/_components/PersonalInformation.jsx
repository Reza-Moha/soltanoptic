import PurchaseInvoiceInput from "@/app/(employee)/employee/purchase-invoice/_components/InputInvoice";

export const PersonalInformation = () => {
  return (
    <>
      <PurchaseInvoiceInput
        label="نام و نام خانوادگی"
        name="customerName"
        type="text"
      />
      <PurchaseInvoiceInput
        label="شماره موبایل"
        name="phoneNumber"
        type="text"
      />
      <PurchaseInvoiceInput label="کد ملی" name="nationalId" type="text" />
    </>
  );
};
