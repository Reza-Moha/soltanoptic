import Input from "@/components/Ui/Input";
import { InsuranceCategoryOptions } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/InsuranceCategoryOptions";
const Inputs = [
  {
    id: 1,
    label: "شماره قبض",
    name: "invoiceNumber",
  },
  {
    id: 2,
    label: "نام و نام خانوادگی",
    name: "fullName",
  },
  {
    id: 3,
    label: "شماره موبایل",
    name: "phoneNumber",
  },
  {
    id: 4,
    label: "کد ملی",
    name: "nationalId",
  },
];
export const PersonalInformation = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5">
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
        <div className="col-span-5 h-px bg-secondary-300 inline-block mb-4 md:mx-10"></div>
      </div>
    </>
  );
};
