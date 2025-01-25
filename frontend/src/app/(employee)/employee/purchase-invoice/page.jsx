"use client";
import { Formik, Form, FieldArray } from "formik";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { createNewPurchaseInvoiceSchema } from "@/validators/admin";
import { PersonalInformation } from "@/app/(employee)/employee/purchase-invoice/_components/PersonalInformation";
import { MedicalPrescription } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/MedicalPrescription";
import { useState, useCallback } from "react";
import { ChoseTypeOfFrameModal } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/ChoseTypeOfFrameModal";
import { ChoseFrame } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/FrameList";
import { ChoseLens } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseLens/LensList";

export default function CreatePurchaseInvoice() {
  const initialValues = {
    invoiceNumber: "",
    fullName: "",
    phoneNumber: "",
    nationalId: "",
    prescriptions: [
      {
        label: "فریم دور",
        OdAx: "",
        OdCyl: "",
        OdSph: "",
        OsAx: "",
        OsCyl: "",
        OsSph: "",
        pd: "",
        frame: {},
        lens: {},
        lensPrice: 0,
      },
    ],
    insuranceName: "",
  };

  const [showPopup, setShowPopup] = useState(false);
  const [showFrameModal, setShowFrameModal] = useState(false);
  const [showLensModal, setShowLensModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const createNewPurchaseInvoiceHandler = (values) => {
    console.log("ارسال به سرور:", values);
  };

  const handleFrameSelect = useCallback((frame, index, setFieldValue) => {
    setFieldValue(`prescriptions.${index}.frame`, frame);
  }, []);

  const handleLensSelect = useCallback((lens, index, setFieldValue) => {
    setFieldValue(`prescriptions.${index}.lens`, lens);
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={createNewPurchaseInvoiceHandler}
      validationSchema={createNewPurchaseInvoiceSchema}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className="h-screen">
            <PersonalInformation />
            <FieldArray
              name="prescriptions"
              render={(arrayHelpers) => (
                <div>
                  {values.prescriptions.map((prescription, index) => (
                    <div key={index} className="mb-5 h-full">
                      <MedicalPrescription
                        label={prescription.label || `فریم ${index + 1}`}
                        fieldPrefix={`prescriptions.${index}`}
                        selectedFrame={values.prescriptions[index].frame}
                        selectedLens={values.prescriptions[index].lens}
                        setShowFrameModal={setShowFrameModal}
                        setShowLensModal={setShowLensModal}
                        arrayHelpers={arrayHelpers}
                        index={index}
                        setFieldValue={setFieldValue}
                      />

                      {showFrameModal && (
                        <ChoseFrame
                          setShowFrameModal={setShowFrameModal}
                          onFrameSelect={(frame) =>
                            handleFrameSelect(frame, index, setFieldValue)
                          }
                        />
                      )}
                      {showLensModal && (
                        <ChoseLens
                          setShowLensModal={setShowLensModal}
                          onLensSelect={(lens) =>
                            handleLensSelect(lens, index, setFieldValue)
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
