import { Formik, Form } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import Modal from "@/components/Ui/Modal";
import { useDispatch } from "react-redux";
import { createNewPermissionsSchema } from "@/validators/admin";
import { updatePermission } from "@/redux/slices/permissionSlice";

export default function EditPermissionModal({ permission, show, onClose }) {
  const dispatch = useDispatch();

  const handleUpdatePermission = (values) => {
    dispatch(updatePermission({ id: permission.permissionId, values }));
    onClose();
  };

  return (
    <Modal title="ویرایش سطح دسترسی" onClose={onClose} show={show}>
      <Formik
        initialValues={{
          title: permission.title,
          description: permission.description,
        }}
        onSubmit={handleUpdatePermission}
        validationSchema={createNewPermissionsSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Input label="عنوان" name="title" />
            <Input label="توضیحات" name="description" />
            <SubmitBtn>ذخیره</SubmitBtn>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
