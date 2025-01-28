"use client";
import { Formik, Form, FieldArray } from "formik";
import SubmitBtn from "@/components/Ui/SubmitBtn";
import { createNewPurchaseInvoiceSchema } from "@/validators/admin";
import { PersonalInformation } from "@/app/(employee)/employee/purchase-invoice/_components/PersonalInformation";
import { MedicalPrescription } from "@/app/(employee)/employee/purchase-invoice/_components/MedicalPrescription";
import { useState, useEffect, useCallback } from "react";
import { ChoseTypeOfFrameModal } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/ChoseTypeOfFrameModal";
import { ChoseFrame } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/FrameList";
import { ChoseLens } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseLens/LensList";
import { PaymentInformation } from "@/app/(employee)/employee/purchase-invoice/_components/PaymentInformation/PeymentInformation";
import { PaymentMethods } from "@/app/(employee)/employee/purchase-invoice/_components/PaymentMethods/PaymentMethods";
import { ChoseCompaniesLens } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseCompaneisLens";
import { useDispatch, useSelector } from "react-redux";
import customerSlice, {
  createNewInvoice,
  getLastInvoiceNumber,
} from "@/redux/slices/customersSlice";
import Image from "next/image";
import { BeatLoader } from "react-spinners";
import { CustomerInfoPopup } from "@/app/(employee)/employee/purchase-invoice/_components/CustomerInfoPopup";
import toast from "react-hot-toast";

export default function CreatePurchaseInvoice() {
  const dispatch = useDispatch();
  const { lastInvoiceNumber, isLoading } = useSelector(
    (state) => state.customerSlice,
  );

  const [showPopup, setShowPopup] = useState(false);
  const [showFrameModal, setShowFrameModal] = useState(false);
  const [showLensModal, setShowLensModal] = useState(false);
  const [showCustomerInfoPopup, setShowCustomerInfoPopup] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    dispatch(getLastInvoiceNumber());
  }, [dispatch]);

  const initialValues = {
    invoiceNumber: lastInvoiceNumber || 1000,
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
        lensPrice: "",
      },
    ],
    insuranceName: "",
    InsuranceAmount: "",
    descriptionPrice: "",
    deposit: "",
    discount: "",
    billBalance: "",
    SumTotalInvoice: "",
    description: "",
    paymentToAccount: "",
    paymentMethod: "",
    orderLensFrom: "",
  };

  const createNewPurchaseInvoiceHandler = async (values) => {
    try {
      await dispatch(createNewInvoice(values));
      setCustomerInfo(values);
      setShowCustomerInfoPopup(true);
      dispatch(getLastInvoiceNumber());
    } catch (error) {
      console.error("خطا در ایجاد فاکتور جدید:", error);
    }
  };

  const handleFrameSelect = useCallback((frame, index, setFieldValue) => {
    setFieldValue(`prescriptions.${index}.frame`, frame);
  }, []);

  const handleLensSelect = useCallback((lens, index, setFieldValue) => {
    setFieldValue(`prescriptions.${index}.lens`, lens);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2">
        <span className="relative flex size-14">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <Image
            src="/image/logoBlcak.svg"
            alt="logo"
            width="120"
            height="120"
            className="relative inline-flex size-14 rounded-full"
          />
        </span>
        <div>
          <BeatLoader size={5} />
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={createNewPurchaseInvoiceHandler}
      validationSchema={createNewPurchaseInvoiceSchema}
      enableReinitialize
    >
      {({ handleSubmit, values, setFieldValue }) => (
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
                          label={prescription.label || `فریم ${index + 1}`}
                          fieldPrefix={`prescriptions.${index}`}
                          selectedFrame={values.prescriptions[index].frame}
                          selectedLens={values.prescriptions[index].lens}
                          setShowFrameModal={setShowFrameModal}
                          setShowLensModal={setShowLensModal}
                          arrayHelpers={arrayHelpers}
                          index={index}
                          setFieldValue={setFieldValue}
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
                    );
                  })}
                  <div className="w-full flex items-center justify-center">
                    <button
                      type="button"
                      className="w-1/3 bg-green-100 text-green-600 border border-green-200 px-4 py-2 rounded mt-4 hover:border hover:border-green-300 transition-all ease-in-out duration-300 shadow-sm hover:shadow-lg shadow-green-600/30"
                      onClick={() => {
                        arrayHelpers.push({
                          label: `فریم ${values.prescriptions.length + 1}`,
                          odAx: "",
                          odCyl: "",
                          odSph: "",
                          osAx: "",
                          osCyl: "",
                          osSph: "",
                          pd: "",
                          frame: {},
                          lens: {},
                          lensPrice: "",
                        });
                      }}
                    >
                      افزودن فریم
                    </button>
                  </div>
                </div>
              )}
            />
            <PaymentInformation values={values} setFieldValue={setFieldValue} />
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
          {showCustomerInfoPopup && customerInfo && (
            <CustomerInfoPopup
              customerInfo={customerInfo}
              onClose={() => setShowCustomerInfoPopup(false)}
            />
          )}
        </Form>
      )}
    </Formik>
  );
}
