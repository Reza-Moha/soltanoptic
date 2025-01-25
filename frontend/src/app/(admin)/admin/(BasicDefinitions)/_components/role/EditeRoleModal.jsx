import { Formik, Form, Field } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import Modal from "@/components/Ui/Modal";
import { useDispatch } from "react-redux";
import { fetchRoles, updateRole } from "@/redux/slices/rolesSlice";
import {
  createNewPermissionsSchema,
  createNewRoleSchema,
} from "@/validators/admin";
import SelectInput from "@/components/Ui/SelectInput";
import { useSelector } from "react-redux";
import { object } from "yup";

export default function EditRoleModal({ Role, show, onClose }) {
  const dispatch = useDispatch();
  const handleUpdateRole = (values) => {
    dispatch(updateRole({ id: Role.roleId, values }));
    onClose();
  };

  const { permissionsList } = useSelector((state) => state.permissionSlice);

  const permissionOptions = permissionsList.map((permission) => ({
    value: permission.permissionId,
    label: permission.title,
  }));
  const userPermissions = permissionOptions.filter((option) =>
    Role.permissions.filter((item) => item.id === option.value)
  );

  return (
    <Modal title="ویرایش نقش" onClose={onClose} show={show}>
      <Formik
        initialValues={{
          title: Role?.title,
          description: Role?.description,
          permissionsIds: userPermissions.map((option) => option.value) || [],
        }}
        onSubmit={handleUpdateRole}
        validationSchema={createNewRoleSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Input label="عنوان" name="title" />
            <div className="flex items-center mb-4 px-3">
              <Field
                name="permissionsIds"
                component={SelectInput}
                options={permissionOptions}
                isMulti
                defaultValue={userPermissions}
              />
            </div>
            <Input label="توضیحات" name="description" />
            <SubmitBtn>ذخیره</SubmitBtn>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
