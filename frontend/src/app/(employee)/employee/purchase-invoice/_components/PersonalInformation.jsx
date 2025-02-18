import Input from "@/components/Ui/Input";
import { InsuranceCategoryOptions } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/InsuranceCategoryOptions";
import { Field } from "formik";
import SelectInput from "@/components/Ui/SelectInput";
const Inputs = [
  {
    id: 1,
    label: "نام و نام خانوادگی",
    name: "fullName",
  },
  {
    id: 2,
    label: "شماره موبایل",
    name: "phoneNumber",
  },
  {
    id: 3,
    label: "کد ملی",
    name: "nationalId",
  },
];

const genderInfo = [
  {
    id: 1,
    label: "آقای",
    name: "male",
  },
  {
    id: 2,
    label: "خانم",
    name: "female",
  },
];

export const PersonalInformation = () => {
  const genderOptions = genderInfo.map((gender) => ({
    value: gender.label,
    label: gender.label,
  }));
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6">
        <div>
          <Input
            label="شماره قبض"
            name="invoiceNumber"
            type="text"
            bg="bg-white"
            readOnly={true}
          />
        </div>
        <div>
          <Field
            name="gender"
            component={SelectInput}
            options={genderOptions}
            isMulti={false}
            placeholder="جنسیت"
            className="!mt-8 !pt-0 !text-xs"
            svgWidth={10}
            svgHeight={10}
          />
        </div>
        {Inputs.map((item) => {
          return (
            <div key={item.id}>
              <Input
                label={item.label}
                name={item.name}
                type="text"
                bg="bg-white"
              />
            </div>
          );
        })}
        <div className="col-span-1">
          <InsuranceCategoryOptions />
        </div>
        <div className="col-span-1 md:col-span-6 h-px bg-secondary-300 inline-block mb-4 md:mx-10"></div>
      </div>
    </>
  );
};
