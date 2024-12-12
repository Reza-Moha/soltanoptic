"use client";
import { useDispatch } from "react-redux";
import BasicWrapper from "../../BasicWrapper";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Table from "@/components/Ui/Table";
import { deleteFrame } from "@/redux/slices/frame.slice";
import { darkenColor, isColorLight, toPersianDigits } from "@/utils";
import classNames from "classnames";
import Link from "next/link";
import { CgEditExposure } from "react-icons/cg";
export default function ListOfFrame() {
  const { frameList, isLoading } = useSelector((state) => state.frameSlice);
  const dispatch = useDispatch();

  const handleDeleteFrame = (id) => {
    dispatch(deleteFrame(id));
  };

  return (
    <BasicWrapper title="لیست فریم موجودی انبار">
      {isLoading ? (
        <div className="spinner"></div>
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
                          const borderColor = darkenColor(frameColor.colorCode);
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
                                  className={classNames("font-bold text-base", {
                                    "text-slate-800": isLight,
                                    "text-slate-50": !isLight,
                                  })}
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
                  <td className="flex items-center gap-x-4">
                    <button
                      className="text-rose-500"
                      onClick={() => handleDeleteFrame(frame.id)}
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
                    <Link
                      href={`frames/${frame.id}/edite`}
                      className="text-slate-800"
                    >
                      <CgEditExposure size={20} />
                    </Link>
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
    </BasicWrapper>
  );
}
