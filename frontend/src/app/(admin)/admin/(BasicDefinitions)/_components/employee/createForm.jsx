import SelectInput from "@/components/Ui/SelectInput";
import { Field, Form } from "formik";
import { ImageInput } from "@/components/Ui/ImageInput";
import { useSelector } from "react-redux";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";

export const CreateNewEmployeeForm = ({
  fullName,
  phoneNumber,
  nationalId,
  description,
  setFieldValue,
  handleSubmit,
}) => {
  const { rolesList, isLoading } = useSelector((state) => state.rolesSlice);

  const genderOptions = [
    {
      value: "آقای",
      label: "آقای",
    },
    {
      value: "خانم",
      label: "خانم",
    },
  ];
  const rolesOptions = rolesList.map((role) => ({
    value: role.roleId,
    label: role.title,
  }));
  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="px-4 flex items-center">
          <Field
            name="gender"
            component={SelectInput}
            options={genderOptions}
            isMulti={false}
            placeholder="جنسیت"
          />
        </div>
        <div className="px-4 flex items-center">
          <Field
            name="jobTitle"
            component={SelectInput}
            options={rolesOptions}
            isMulti={false}
            placeholder="عنوان شغلی"
          />
        </div>
        <Input
          label="نام و نام خانوادگی"
          name="fullName"
          type="text"
          values={fullName}
        />
        <Input
          label="کد ملی"
          name="nationalId"
          type="text"
          values={nationalId}
        />

        <Input
          label="شماره موبایل"
          name="phoneNumber"
          type="text"
          values={phoneNumber}
        />
        <div>
          <Input
            label="توضیحات"
            name="description"
            type="text"
            values={description}
          />
        </div>
        <ImageInput
          setFieldValue={setFieldValue}
          name="profileImage"
          prevTitle="عکس پروفایل"
        />
        <SubmitBtn>ایجاد</SubmitBtn>
      </div>
    </Form>
  );
};
