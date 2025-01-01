import { FastField } from "formik";
import classNames from "classnames";
import { memo } from "react";

export const MedicalPrescription = memo(
  ({ label, fieldPrefix, selectedFrames, setShowFrameModal }) => {
    console.log("selectedFrames", selectedFrames);
    return (
      <div
        className="grid grid-cols-12 grid-rows-4 gap-4 mb-5"
        style={{ direction: "ltr" }}
      >
        <div className="row-span-4 verticalText">
          <div
            className={classNames({
              "w-1/2 h-full flex items-center justify-center": true,
              "bg-green-100 text-green-600": label === "فریم دور",
              "bg-indigo-100 text-indigo-600": label === "فریم نزدیک",
              "bg-yellow-100 text-yellow-600": label === "فریم آفتابی",
            })}
          >
            {label}
          </div>
        </div>
        <div className="col-start-2 row-start-2 border-r border-secondary-300">
          OD
        </div>
        <div className="col-start-2 row-start-3 border-r border-secondary-300">
          OS
        </div>
        <div className="col-start-3 row-start-1 border-b border-secondary-300 text-center">
          SPH
        </div>
        <div className="col-start-4 row-start-1 border-b border-secondary-300 text-center">
          CYL
        </div>
        <div className="col-start-5 row-start-1 border-b border-secondary-300 text-center">
          AX
        </div>
        <div className="col-start-5 row-start-2">
          <FastField
            name={`${fieldPrefix}.FarOdAx`}
            className="medicalPrescriptionInput"
          />
        </div>
        <div className="col-start-4 row-start-2">
          <FastField
            name={`${fieldPrefix}.FarOdCyl`}
            className="medicalPrescriptionInput"
          />
        </div>
        <div className="col-start-3 row-start-2">
          <FastField
            name={`${fieldPrefix}.FarOdSph`}
            className="medicalPrescriptionInput"
          />
        </div>
        <div className="col-start-3 row-start-3">
          <FastField
            name={`${fieldPrefix}.FarOsSph`}
            className="medicalPrescriptionInput"
          />
        </div>
        <div className="col-start-4 row-start-3">
          <FastField
            name={`${fieldPrefix}.FarOsCyl`}
            className="medicalPrescriptionInput"
          />
        </div>
        <div className="col-start-5 row-start-3">
          <FastField
            name={`${fieldPrefix}.FarOsAx`}
            className="medicalPrescriptionInput"
          />
        </div>
        <div className="row-span-2 col-start-6 row-start-2 flex items-center justify-center">
          <FastField
            name={`${fieldPrefix}.pd`}
            className="medicalPrescriptionInput w-1/2 h-1/2"
            placeholder="PD"
          />
        </div>
        <div className="col-span-4 row-span-2 col-start-7 row-start-1">
          <FastField
            name={`${fieldPrefix}.typeOfGlasses`}
            className="medicalPrescriptionInput"
            placeholder="نوع عدسی"
          />
        </div>
        <div className="col-span-4 row-span-2 col-start-7 row-start-3">
          {selectedFrames ? (
            <div
              onClick={() => setShowFrameModal(true)}
              className="medicalPrescriptionInput"
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between  gap-4 border-b border-secondary-200 px-4">
                  <div className="text-xs md:text-sm flex flex-col items-center justify-center  ">
                    <span className="border-b border-secondary-300 pb-1">
                      کد فریم
                    </span>
                    <span>{selectedFrames.serialNumber}</span>
                  </div>
                  <div className="text-xs md:text-sm flex flex-col items-center justify-center  ">
                    <span className="border-b border-secondary-300 pb-1">
                      نام فریم
                    </span>
                    <span>{selectedFrames.name}</span>
                  </div>
                  <div className="text-xs md:text-sm flex flex-col items-center justify-center  ">
                    <span className="border-b border-secondary-300 pb-1">
                      دسته بندی فریم
                    </span>
                    <span>{selectedFrames.FrameCategory.title}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs md:text-sm flex flex-col items-center justify-center">
                    <span className="border-b border-secondary-300 pb-1 mb-1">
                      رنگ فریم
                    </span>
                    <span
                      className={`w-5 h-5 rounded inline-block`}
                      style={{
                        backgroundColor: `${selectedFrames?.FrameColors[0].colorCode}`,
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowFrameModal(true)}
              className="medicalPrescriptionInput cursor-pointer"
            >
              انتخاب نوع فریم
            </button>
          )}
        </div>
        <div className="col-span-2 col-start-11 row-start-1">
          <FastField
            name={`${fieldPrefix}.lensPrice`}
            className="medicalPrescriptionInput"
            placeholder="قیمت عدسی"
          />
        </div>
        <div className="col-span-2 col-start-11 row-start-3">
          <FastField
            name={`${fieldPrefix}.framePrice`}
            className="medicalPrescriptionInput"
            placeholder="قیمت فریم"
            value={selectedFrames ? selectedFrames.price : ""}
            readOnly
          />
        </div>
      </div>
    );
  },
);
