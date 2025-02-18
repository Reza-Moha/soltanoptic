"use client";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewInvoiceApi } from "@/services/customers/customers.service";
import { FieldArray, Form, Formik } from "formik";
import { createNewPurchaseInvoiceSchema } from "@/validators/admin";
import { PersonalInformation } from "@/app/(employee)/employee/purchase-invoice/_components/PersonalInformation";
import { MedicalPrescription } from "@/app/(employee)/employee/purchase-invoice/_components/MedicalPrescription";
import { ChoseFrame } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/FrameList";
import { ChoseLens } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseLens/LensList";
import { PaymentInformation } from "@/app/(employee)/employee/purchase-invoice/_components/PaymentInformation/PeymentInformation";
import { PaymentMethods } from "@/app/(employee)/employee/purchase-invoice/_components/PaymentMethods/PaymentMethods";
import { ChoseCompaniesLens } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseCompaneisLens";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { ChoseTypeOfFrameModal } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/ChoseTypeOfFrameModal";
import Image from "next/image";
import { BeatLoader } from "react-spinners";

export default function CreatePurchaseInvoice() {
  const { lastInvoiceNumber, isLoading: invoiceNumberLoading } = useSelector(
    (state) => state.customerSlice,
  );
  const initialValues = {
    invoiceNumber: lastInvoiceNumber || 0,
    fullName: "",
    phoneNumber: "",
    nationalId: "",
    prescriptions: [
      {
        label: "فریم دور",
        odAx: "",
        odCyl: "",
        odSph: "",
        osAx: "",
        osCyl: "",
        osSph: "",
        pd: "",
        frame: {},
        lens: {},
        lensPrice: 0,
        currentIndex: 0,
      },
    ],
    insuranceName: "",
    InsuranceAmount: 0,
    descriptionPrice: 0,
    deposit: 0,
    discount: 0,
    billBalance: 0,
    SumTotalInvoice: 0,
    description: "",
    paymentToAccount: "",
    paymentMethod: "",
    orderLensFrom: "",
  };

  const [showPopup, setShowPopup] = useState(false);
  const [showFrameModal, setShowFrameModal] = useState(false);
  const [showLensModal, setShowLensModal] = useState(false);
  const dispatch = useDispatch();

  const createNewPurchaseInvoiceHandler = async (values) => {
    await dispatch(createNewInvoiceApi(values));
  };

  return (
    <>
      {invoiceNumberLoading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-y-3">
            <Image
              src="/image/logoBlcak.svg"
              alt="logo"
              width={100}
              height={100}
              priority
              style={{ width: "60px", height: "60px" }}
              className="rounded-full "
            />
            <BeatLoader size={16} />
          </div>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={createNewPurchaseInvoiceHandler}
          validationSchema={createNewPurchaseInvoiceSchema}
        >
          {({ handleSubmit, values, setFieldValue, errors }) => {
            const handleLensSelect = useCallback(
              (lens, index, setFieldValue) => {
                const currentIdx = values.prescriptions[index].currentIndex;
                setFieldValue(`prescriptions.${currentIdx}.lens`, lens);
                setShowLensModal(false);
              },
              [values.prescriptions],
            );

            const handleFrameSelect = useCallback(
              (frame, index, setFieldValue) => {
                const currentIdx = values.prescriptions[index].currentIndex;
                setFieldValue(`prescriptions.${currentIdx}.frame`, frame);
                setShowFrameModal(false);
              },
              [values.prescriptions],
            );
            return (
              <Form onSubmit={handleSubmit}>
                <div className="h-screen">
                  <PersonalInformation />
                  <FieldArray
                    name="prescriptions"
                    render={(arrayHelpers) => (
                      <div>
                        {values.prescriptions.map((prescription, index) => {
                          const baseTabIndex = index * 10;
                          return (
                            <div
                              key={index}
                              className="mb-5 h-full border-b border-secondary-300"
                            >
                              <MedicalPrescription
                                label={
                                  prescription.label || `فریم ${index + 1}`
                                }
                                fieldPrefix={`prescriptions.${index}`}
                                selectedFrame={
                                  values.prescriptions[index].frame
                                }
                                selectedLens={values.prescriptions[index].lens}
                                setShowFrameModal={setShowFrameModal}
                                setShowLensModal={setShowLensModal}
                                arrayHelpers={arrayHelpers}
                                index={index}
                                setFieldValue={setFieldValue}
                                setCurrentIndex={() =>
                                  setFieldValue(
                                    `prescriptions.${index}.currentIndex`,
                                    index,
                                  )
                                }
                                tabIndices={{
                                  odSph: baseTabIndex + 1,
                                  odCyl: baseTabIndex + 2,
                                  odAx: baseTabIndex + 3,
                                  osSph: baseTabIndex + 4,
                                  osCyl: baseTabIndex + 5,
                                  osAx: baseTabIndex + 6,
                                  pd: baseTabIndex + 7,
                                }}
                              />

                              {showFrameModal && (
                                <ChoseFrame
                                  setShowFrameModal={setShowFrameModal}
                                  onFrameSelect={(frame) =>
                                    handleFrameSelect(
                                      frame,
                                      values.prescriptions[index].currentIndex,
                                      setFieldValue,
                                    )
                                  }
                                />
                              )}

                              {showLensModal && (
                                <ChoseLens
                                  setShowLensModal={setShowLensModal}
                                  onLensSelect={(lens) =>
                                    handleLensSelect(
                                      lens,
                                      values.prescriptions[index].currentIndex,
                                      setFieldValue,
                                    )
                                  }
                                />
                              )}
                            </div>
                          );
                        })}
                        <div className="w-full flex items-center justify-center">
                          <button
                            type="button"
                            className="w-1/3 bg-green-100 text-green-600 border border-green-200 px-4 py-2 rounded mt-4 hover:border hover:border-green-300 transition-all ease-in-out duration-300 shadow-sm hover:shadow-lg shadow-green-600/30"
                            onClick={() => {
                              setShowPopup(true);
                            }}
                          >
                            افزودن فریم
                          </button>
                        </div>
                      </div>
                    )}
                  />
                  <PaymentInformation
                    values={values}
                    setFieldValue={setFieldValue}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    <PaymentMethods values={values} />
                    <ChoseCompaniesLens values={values} />
                  </div>
                  <SubmitBtn>ایجاد</SubmitBtn>
                </div>
                {showPopup && (
                  <ChoseTypeOfFrameModal
                    values={values}
                    setShowPopup={setShowPopup}
                  />
                )}
                <pre style={{ textAlign: "left" }}>
                  {JSON.stringify(values, null, 2)}
                </pre>
              </Form>
            );
          }}
        </Formik>
      )}
    </>
  );
}
