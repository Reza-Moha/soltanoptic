import Input from "@/components/Ui/Input";
import { Field } from "formik";
import SelectInput from "@/components/Ui/SelectInput";
import { InsuranceCategoryOptions } from "@/app/(employee)/employee/purchase-invoice/_components/InsuranceCategoryOptions";

export const PersonalInformation = () => {
  return (
    <>
      <Input
        label="نام و نام خانوادگی"
        name="fullName"
        type="text"
        bg="bg-white"
      />
      <Input
        label="شماره موبایل"
        name="phoneNumber"
        type="text"
        bg="bg-white"
      />
      <div className="col-span-1">
        <InsuranceCategoryOptions />
      </div>
    </>
  );
};
