"use client";
import { useDispatch } from "react-redux";
import { Formik, Form, FieldArray } from "formik";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { createNewPurchaseInvoiceSchema } from "@/validators/admin";
import { PersonalInformation } from "@/app/(employee)/employee/purchase-invoice/_components/PersonalInformation";
import { MedicalPrescription } from "@/app/(employee)/employee/purchase-invoice/_components/MedicalPrescription";
import { useCallback, useState } from "react";
import { ChoseTypeOfFrameModal } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseTypeOfFrameModal";
import { FaRegTrashCan } from "react-icons/fa6";
import { ChoseFrame } from "@/app/(employee)/employee/purchase-invoice/_components/FrameList";
export default function CreatePurchaseInvoice() {
  const createNewPurchaseInvoiceHandler = (values) => {
    console.log("values", values);
  };

  const initialValues = {
    invoiceNumber: "",
    fullName: "",
    phoneNumber: "",
    nationalId: "",
    prescriptions: [
      {
        label: "فریم دور",
        FarOdAx: "",
        FarOdCyl: "",
        FarOdSph: "",
        FarOsAx: "",
        FarOsCyl: "",
        FarOsSph: "",
        pd: "",
        typeOfGlasses: "",
        typeOfFrame: "",
        lensPrice: "",
        framePrice: "",
      },
    ],
    insuranceName: "",
  };

  const [showPopup, setShowPopup] = useState(false);
  const [showFrameModal, setShowFrameModal] = useState(false);
  const [selectedFrames, setSelectedFrames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleFrameSelect = useCallback((frame, index) => {
    setSelectedFrames((prev) => {
      const updatedFrames = [...prev];
      updatedFrames[index] = frame;
      return updatedFrames;
    });
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={createNewPurchaseInvoiceHandler}
      validationSchema={createNewPurchaseInvoiceSchema}
    >
      {({ handleSubmit, values }) => (
        <Form onSubmit={handleSubmit}>
          <div className="h-screen">
            <PersonalInformation />
            <FieldArray
              name="prescriptions"
              render={(arrayHelpers) => (
                <div>
                  {values.prescriptions.map((prescription, index) => (
                    <div key={index} className="mb-5">
                      <MedicalPrescription
                        selectedFrames={selectedFrames[index]}
                        setShowFrameModal={setShowFrameModal}
                        label={prescription.label || `فریم ${index + 1}`}
                        fieldPrefix={`prescriptions.${index}`}
                      />
                      <button
                        type="button"
                        className="bg-rose-200 text-rose-600 px-4 py-2 rounded mt-2 hover:bg-rose-300 hover:text-rose-700 transition-all ease-linear duration-300"
                        onClick={() => {
                          const updatedFrames = [...selectedFrames];
                          updatedFrames.splice(index, 1);
                          setSelectedFrames(updatedFrames);
                          arrayHelpers.remove(index);
                        }}
                      >
                        <FaRegTrashCan />
                      </button>
                      {showFrameModal && (
                        <ChoseFrame
                          values={values}
                          setShowFrameModal={setShowFrameModal}
                          onFrameSelect={(frame) =>
                            handleFrameSelect(frame, index)
                          }
                        />
                      )}
                    </div>
                  ))}
                  <div className="w-full flex items-center justify-center">
                    <button
                      type="button"
                      className="w-1/3 bg-green-100 text-green-600 border border-green-200 px-4 py-2 rounded mt-4 hover:border hover:border-green-300 transition-all ease-in-out duration-300 shadow-sm hover:shadow-lg shadow-green-600/30"
                      onClick={() => {
                        setCurrentIndex(values.prescriptions.length);
                        setShowPopup(true);
                      }}
                    >
                      افزودن فریم
                    </button>
                  </div>
                </div>
              )}
            />
            <SubmitBtn>ایجاد</SubmitBtn>
          </div>

          {showPopup && (
            <ChoseTypeOfFrameModal
              values={values}
              setShowPopup={setShowPopup}
            />
          )}
        </Form>
      )}
    </Formik>
  );
}
