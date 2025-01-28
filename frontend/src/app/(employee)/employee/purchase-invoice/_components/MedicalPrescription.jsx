"use client";
import { FastField } from "formik";
import classNames from "classnames";
import { memo, useCallback, useEffect, useState } from "react";
import {
  calculateTotalLensPrice,
  ensureNegativeValue,
  toPersianDigits,
} from "@/utils";
import { FaRegTrashCan } from "react-icons/fa6";
import { SelectedFrameTable } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/SelectedFrameTable";
import { SelectedLensTable } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseLens/SelectedLensTable";

export const MedicalPrescription = memo(
  ({
    label,
    fieldPrefix,
    selectedFrame,
    setShowFrameModal,
    setShowLensModal,
    arrayHelpers,
    index,
    selectedLens,
    setFieldValue,
    tabIndices,
  }) => {
    const [lensValues, setLensValues] = useState({
      odSph: "",
      odCyl: "",
      osSph: "",
      osCyl: "",
    });

    const handleChange = useCallback(
      (field, value) => {
        setLensValues((prev) => ({ ...prev, [field]: value }));
        setFieldValue(`${fieldPrefix}.${field}`, value);
      },
      [setFieldValue, fieldPrefix],
    );

    const handleBlur = useCallback(
      (field, value) => {
        const updatedValue =
          value.trim() === "0" || value.trim() === "0.0"
            ? "PL"
            : ensureNegativeValue(value);
        setLensValues((prev) => ({ ...prev, [field]: updatedValue }));
        setFieldValue(`${fieldPrefix}.${field}`, updatedValue);
      },
      [setFieldValue, fieldPrefix],
    );

    useEffect(() => {
      if (!selectedLens?.LensGroup?.pricing) return;

      const pricing = selectedLens.LensGroup.pricing;

      const newLensPrice = calculateTotalLensPrice(
        pricing,
        parseFloat(lensValues.odSph || 0),
        parseFloat(lensValues.odCyl || 0),
        parseFloat(lensValues.osSph || 0),
        parseFloat(lensValues.osCyl || 0),
      );
      setFieldValue(`${fieldPrefix}.lensPrice`, newLensPrice);
    }, [lensValues, selectedLens, fieldPrefix, setFieldValue]);

    const renderInput = (field, tabIndex) => (
      <FastField
        name={`${fieldPrefix}.${field}`}
        value={lensValues[field]}
        className="medicalPrescriptionInput"
        tabIndex={tabIndex}
        onChange={(e) => handleChange(field, e.target.value)}
        onBlur={(e) => handleBlur(field, e.target.value)}
      />
    );
    return (
      <div className="w-full h-full flex items-center justify-center gap-2">
        <div className="flex-1">
          <div
            className="grid grid-cols-12 grid-rows-4 gap-3 mb-5"
            style={{ direction: "ltr" }}
          >
            <div className="row-span-4 verticalText">
              <div
                className={classNames({
                  "w-1/2 h-full flex items-center justify-center": true,
                  "bg-green-100 text-green-600 border border-green-200 rounded shadow-md shadow-green-500/50":
                    label === "فریم دور",
                  "bg-indigo-100 text-indigo-600 border border-indigo-200 rounded shadow-md shadow-indigo-500/50":
                    label === "فریم نزدیک",
                  "bg-yellow-100 text-yellow-600 border border-yellow-300 rounded shadow-md shadow-yellow-500/50":
                    label === "فریم آفتابی",
                })}
              >
                {label}
              </div>
            </div>
            <div className="row-span-4 col-start-12 row-start-1">
              <button
                type="button"
                className="w-1/2 h-full flex items-center justify-center bg-rose-200 text-rose-600 rounded  hover:bg-rose-300 hover:text-rose-700 transition-all ease-linear duration-300"
                onClick={() => arrayHelpers.remove(index)}
              >
                <FaRegTrashCan />
              </button>
            </div>
            <div className="col-span-2 col-start-10 row-start-1">
              {selectedLens.lensName ? (
                <FastField
                  name={`${fieldPrefix}.lensPrice`}
                  className="medicalPrescriptionInput"
                />
              ) : (
                <div className="medicalPrescriptionInput select-none text-secondary-400">
                  قیمت عدسی
                </div>
              )}
            </div>
            <div className="col-span-2 col-start-10 row-start-3">
              {selectedFrame.name ? (
                <div className="medicalPrescriptionInput">
                  {toPersianDigits(selectedFrame.price.toLocaleString("ar-EG"))}
                </div>
              ) : (
                <div className="medicalPrescriptionInput text-secondary-400">
                  قیمت فریم
                </div>
              )}
            </div>
            <div className="col-span-3 row-span-2 col-start-7 row-start-1">
              {selectedLens.lensName ? (
                <div
                  onClick={() => setShowLensModal(true)}
                  className="medicalPrescriptionInput max-h-20"
                >
                  <SelectedLensTable selectedLens={selectedLens} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLensModal(true)}
                  className="medicalPrescriptionInput"
                >
                  انتخاب عدسی
                </button>
              )}
            </div>
            <div className="col-span-3 row-span-2 col-start-7 row-start-3">
              {selectedFrame.name ? (
                <div
                  onClick={() => setShowFrameModal(true)}
                  className="medicalPrescriptionInput max-h-20"
                >
                  <SelectedFrameTable selectedFrame={selectedFrame} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowFrameModal(true)}
                  className="medicalPrescriptionInput"
                >
                  انتخاب فریم
                </button>
              )}
            </div>
            <div
              className={classNames({
                "col-start-2 row-start-2 text-center border-r": true,
                "bg-green-50 text-green-600 border-green-600":
                  label === "فریم دور",
                "bg-indigo-50 text-indigo-600 border-indigo-600":
                  label === "فریم نزدیک",
                "bg-yellow-50 text-yellow-600 border-yellow-600":
                  label === "فریم آفتابی",
              })}
            >
              OD
            </div>
            <div
              className={classNames({
                "col-start-2 row-start-3 text-center border-r": true,
                "bg-green-50 text-green-600 border-green-600":
                  label === "فریم دور",
                "bg-indigo-50 text-indigo-600 border-indigo-600":
                  label === "فریم نزدیک",
                "bg-yellow-50 text-yellow-600 border-yellow-600":
                  label === "فریم آفتابی",
              })}
            >
              OS
            </div>
            <div
              className={classNames({
                "col-start-3 row-start-1 text-center border-b": true,
                "bg-green-50 text-green-600 border-green-600":
                  label === "فریم دور",
                "bg-indigo-50 text-indigo-600 border-indigo-600":
                  label === "فریم نزدیک",
                "bg-yellow-50 text-orange-600 border-yellow-600":
                  label === "فریم آفتابی",
              })}
            >
              SPH
            </div>
            <div
              className={classNames({
                "col-start-4 row-start-1 text-center border-b": true,
                "bg-green-50 text-green-600 border-green-600":
                  label === "فریم دور",
                "bg-indigo-50 text-indigo-600 border-indigo-600":
                  label === "فریم نزدیک",
                "bg-yellow-50 text-yellow-600 border-yellow-600":
                  label === "فریم آفتابی",
              })}
            >
              CYL
            </div>
            <div
              className={classNames({
                "col-start-5 row-start-1 text-center border-b": true,
                "bg-green-50 text-green-600 border-green-600":
                  label === "فریم دور",
                "bg-indigo-50 text-indigo-600 border-indigo-600":
                  label === "فریم نزدیک",
                "bg-yellow-50 text-yellow-600 border-yellow-600":
                  label === "فریم آفتابی",
              })}
            >
              AX
            </div>
            <div className="col-start-3 row-start-2">
              {renderInput("odSph", tabIndices.odSph)}
            </div>
            <div className="col-start-4 row-start-2">
              {renderInput("odCyl", tabIndices.odCyl)}
            </div>
            <div className="col-start-5 row-start-2">
              <FastField
                tabIndex={tabIndices.odAx}
                name={`${fieldPrefix}.odAx`}
                className="medicalPrescriptionInput"
              />
            </div>
            <div className="col-start-5 row-start-3">
              <FastField
                name={`${fieldPrefix}.osAx`}
                tabIndex={tabIndices.osAx}
                className="medicalPrescriptionInput"
              />
            </div>
            <div className="col-start-4 row-start-3">
              {renderInput("osCyl", tabIndices.osCyl)}
            </div>
            <div className="col-start-3 row-start-3">
              {renderInput("osSph", tabIndices.osSph)}
            </div>
            <div className="row-span-2 col-start-6 row-start-2">
              <FastField
                name={`${fieldPrefix}.pd`}
                tabIndex={tabIndices.pd}
                className="medicalPrescriptionInput w-1/2 h-1/2"
                placeholder="PD"
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
