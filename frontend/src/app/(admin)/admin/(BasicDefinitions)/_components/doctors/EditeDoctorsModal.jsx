import { Formik, Form } from "formik";
import Input from "@/components/Ui/Input";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import Modal from "@/components/Ui/Modal";
import { useDispatch } from "react-redux";
import { createNewDoctorSchema } from "@/validators/admin";
import { updateDoctor } from "@/redux/slices/doctors.slice";

export default function EditeDoctorsModal({ doctor, show, onClose }) {
  const dispatch = useDispatch();

  const handleUpdateDoctor = (values) => {
    dispatch(updateDoctor({ id: doctor.doctorId, values }));
    onClose();
  };

  return (
    <Modal title="ویرایش اطلاعات دکتر" onClose={onClose} show={show}>
      <Formik
        initialValues={{
          fullName: doctor.fullName,
          visitPrice: doctor.visitPrice,
          medicalSystemNumber: doctor.medicalSystemNumber,
        }}
        onSubmit={handleUpdateDoctor}
        validationSchema={createNewDoctorSchema}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Input label="نام و نام خانوادگی" name="fullName" />
            <Input label="مبلغ ویزیت" name="visitPrice" />
            <Input label="شماره نظام پزشکی" name="medicalSystemNumber" />
            <SubmitBtn>ذخیره</SubmitBtn>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
