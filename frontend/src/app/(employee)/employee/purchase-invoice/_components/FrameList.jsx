"use client";

import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import Table from "@/components/Ui/Table";
import { motion } from "framer-motion";
import { darkenColor, isColorLight, toPersianDigits } from "@/utils";
import classNames from "classnames";
import { HiPlusSm } from "react-icons/hi";
import { useState } from "react";
import { ColorSelectionModal } from "@/app/(employee)/employee/purchase-invoice/_components/ColorSelectionModal";
import { useFormikContext } from "formik";

export const ChoseFrame = ({ setShowFrameModal, onFrameSelect }) => {
  const { frameList, isLoading } = useSelector((state) => state.frameSlice);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedFrameForColors, setSelectedFrameForColors] = useState(null);
  const { setFieldValue } = useFormikContext();
  console.log("frameList", frameList);

  const handleSelect = async (frame) => {
    await setFieldValue("prescriptions[0].typeOfFrame", frame.name);
    await setFieldValue("prescriptions[0].framePrice", frame.price);
    setShowColorModal(true);
    setSelectedFrameForColors(frame);
    // setShowFrameModal(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50 p-10">
      <div className="bg-white p-8 rounded shadow-lg w-11/12 h-full">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-bold mb-4">انتخاب فریم از انبار</h2>
          <button
            type="button"
            className="bg-rose-200 text-rose-600 px-4 py-2 rounded mt-2 hover:bg-rose-300 hover:text-rose-700 transition-all ease-linear duration-300"
            onClick={() => setShowFrameModal(false)}
          >
            <IoClose />
          </button>
        </div>
        {isLoading ? (
          <div className="spinner-mini" />
        ) : (
          <Table>
            <Table.Header>
              <th>عنوان</th>
              <th>ارزش فریم</th>
              <th>کد فریم</th>
              <th>دسته بندی</th>
              <th>جنسیت</th>
              <th>تعداد</th>
              <th>توضیحات</th>
              <th>عملیات</th>
            </Table.Header>
            <Table.Body>
              {frameList?.length > 0 ? (
                frameList.map((frame) => (
                  <motion.tr key={frame.id}>
                    <td>{frame.name}</td>
                    <td>{toPersianDigits(frame.price || 0)}</td>
                    <td>{frame.serialNumber}</td>
                    <td>{frame.FrameCategory?.title || ""}</td>
                    <td>{frame.FrameGender?.gender || ""}</td>
                    <td className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                      {frame?.FrameColors?.length > 0
                        ? frame.FrameColors.map((frameColor) => {
                            const isLight = isColorLight(frameColor.colorCode);
                            const borderColor = darkenColor(
                              frameColor.colorCode,
                            );
                            return (
                              <div key={frameColor.id}>
                                <span
                                  className={`rounded-lg w-6 h-6 flex items-center justify-center`}
                                  style={{
                                    backgroundColor: `${frameColor.colorCode}`,
                                    border: `1px solid ${borderColor}`,
                                  }}
                                >
                                  <span
                                    className={classNames(
                                      "font-bold text-base",
                                      {
                                        "text-slate-800": isLight,
                                        "text-slate-50": !isLight,
                                      },
                                    )}
                                  >
                                    {toPersianDigits(frameColor.count || 0)}
                                  </span>
                                </span>
                              </div>
                            );
                          })
                        : 0}
                    </td>
                    <td>{frame.description}</td>
                    <td className="">
                      <button
                        type="button"
                        className="flex items-center gap-x-4 bg-emerald-50 text-emerald-600 p-1 rounded border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all ease-linear duration-300 hover:text-emerald-700"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          await handleSelect(frame);
                        }}
                      >
                        انتخاب فریم
                        <HiPlusSm />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <Table.Row>
                  <td colSpan="3" className="text-center">
                    هیچ فریمی یافت نشد.
                  </td>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </div>
      {showColorModal && (
        <ColorSelectionModal
          frame={selectedFrameForColors}
          setShowColorModal={setShowColorModal}
          setShowFrameModal={setShowFrameModal}
          onColorSelect={(color) => {
            const updatedFrame = {
              ...selectedFrameForColors,
              FrameColors: [
                ...selectedFrameForColors.FrameColors.filter(
                  (c) => c.id === color.id,
                ),
              ],
              selectedColor: color,
            };
            onFrameSelect(updatedFrame);
          }}
        />
      )}
    </div>
  );
};
