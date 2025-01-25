import Table from "@/components/Ui/Table";
import { toPersianDigits } from "@/utils";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { deleteDoctor } from "@/redux/slices/doctors.slice";
import EditeDoctorsModal from "./EditeDoctorsModal";
import { useState } from "react";
export const DoctorsList = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { doctorsList, isLoading } = useSelector((state) => state.doctorsSlice);
  const dispatch = useDispatch();
  const handleDeleteDoctor = (id) => {
    dispatch(deleteDoctor(id));
  };
  const handleEditeDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowEditModal(true);
  };
  return (
    <>
      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <Table>
          <Table.Header>
            <th>نام و نام خانوادگی</th>
            <th>مبلغ ویزیت</th>
            <th>شماره نظام پزشکی</th>
            <th>عملیات</th>
          </Table.Header>
          <Table.Body>
            {doctorsList?.length > 0 ? (
              doctorsList.map((doctor) => (
                <motion.tr key={doctor.doctorId}>
                  <td>{doctor.fullName}</td>
                  <td>{toPersianDigits(doctor.visitPrice || 0)}</td>
                  <td>{toPersianDigits(doctor.medicalSystemNumber || 0)}</td>
                  <td className="flex items-center gap-x-4">
                    <button
                      className="text-rose-500"
                      onClick={() => handleDeleteDoctor(doctor.doctorId)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-primary-800"
                      onClick={() => handleEditeDoctor(doctor)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <Table.Row>
                <td colSpan="3" className="text-center">
                  هیچ دکتری یافت نشد.
                </td>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
      {selectedDoctor && showEditModal && (
        <EditeDoctorsModal
          doctor={selectedDoctor}
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};
