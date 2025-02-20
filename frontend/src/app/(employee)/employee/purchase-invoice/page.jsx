"use client";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { FieldArray, Form, Formik } from "formik";
import { createNewPurchaseInvoiceSchema } from "@/validators/admin";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { createNewInvoiceApi } from "@/services/customers/customers.service";
import { BeatLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { PaymentInformation } from "./_components/PaymentInformation/PeymentInformation";
import { PersonalInformation } from "./_components/PersonalInformation";
import { MedicalPrescription } from "./_components/MedicalPrescription";
import { ChoseFrame } from "./_components/ChoseFrame/FrameList";
import { ChoseLens } from "./_components/ChoseLens/LensList";
import { PaymentMethods } from "./_components/PaymentMethods/PaymentMethods";
import { ChoseCompaniesLens } from "./_components/ChoseCompaneisLens";
import { ChoseTypeOfFrameModal } from "./_components/ChoseFrame/ChoseTypeOfFrameModal";
import { CustomerInfoPopup } from "./_components/CustomerInfoPopup";
export default function CreatePurchaseInvoice() {
  const { lastInvoiceNumber, isLoading } = useSelector(
    (state) => state.customerSlice,
  );
  const { user } = useSelector((state) => state.auth);
  const initialValues = {
    invoiceNumber: lastInvoiceNumber || 0,
    employeeId: user?.id || "",
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
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const createNewPurchaseInvoiceHandler = async (values) => {
    try {
      const formattedValues = {
        ...values,
        descriptionPrice:
          values.descriptionPrice === 0 ? "" : values.descriptionPrice,
      };
      const { message, statusCode, fullUserData } =
        await createNewInvoiceApi(formattedValues);
      if (statusCode === 201 && fullUserData) {
        toast.success(message);
        setModalData(fullUserData);
        setShowModal(true);
      }
    } catch (error) {
      const errors = error?.response?.data?.errors;
      console.error("Error while creating invoice:", errors);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-y-3">
            <Image
              src="/image/logoBlcak.svg"
              alt="logo"
              width={100}
              height={100}
              priority
              style={{ width: "60px", height: "60px" }}
              className="rounded-full"
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
          {({ handleSubmit, values, setFieldValue, isSubmitting }) => {
            const handleLensSelect = useCallback(
              (lens, index, setFieldValue) => {
                setFieldValue(`prescriptions.${index}.lens`, lens);
                setShowLensModal(false);
              },
              [values.prescriptions],
            );

            const handleFrameSelect = useCallback(
              (frame, index, setFieldValue) => {
                setFieldValue(`prescriptions.${index}.frame`, frame);
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
                                label={prescription.label || `فریم${index + 1}`}
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
                                setCurrentIndex={() => setFieldValue(index)}
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
                                      index,
                                      setFieldValue,
                                    )
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
                  <SubmitBtn disabled={isLoading || isSubmitting}>
                    ایجاد
                  </SubmitBtn>
                </div>
                {showPopup && (
                  <ChoseTypeOfFrameModal
                    values={values}
                    setShowPopup={setShowPopup}
                  />
                )}
              </Form>
            );
          }}
        </Formik>
      )}
      {showModal && modalData && (
        <CustomerInfoPopup
          customerInfo={modalData || {}}
          setShowModal={setShowModal}
          invoiceNumber={lastInvoiceNumber || 0}
        />
      )}
    </>
  );
}
