import Table from "@/components/Ui/Table";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IoRemoveOutline } from "react-icons/io5";
export default function LensListTable({
  lensList,
  handleDeleteLens,
  handleShowPricing,
}) {
  return (
    <Suspense fallback={<div className="spinner"></div>}>
      <Table>
        <Table.Header>
          <th>نام عدسی</th>
          <th> عدسی</th>
          <th>ضریب شکست</th>
          <th>دسته بندی</th>
          <th>توضیحات</th>
          <th>عملیات</th>
        </Table.Header>
        <Table.Body>
          {lensList?.length > 0 ? (
            lensList.map((lens) => (
              <motion.tr key={lens.lensId}>
                <td className="text-lg font-bold flex flex-col md:flex-row items-center gap-x-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${lens?.lensImage}`}
                    alt={lens?.lensName}
                    width="40"
                    height="40"
                    className="object-fill rounded-full "
                  />
                  <h3 className="font-bold text-sm md:text-base">
                    {lens.lensName}
                  </h3>
                </td>
                <td>
                  {lens?.LensType?.title || <IoRemoveOutline size={16} />}
                </td>
                <td>
                  {lens?.RefractiveIndex?.index || (
                    <IoRemoveOutline size={16} />
                  )}
                </td>
                <td className="flex flex-col items-center md:flex-row gap-1">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${lens?.LensCategory?.lensImage}`}
                    alt={lens?.LensCategory?.lensName}
                    width="40"
                    height="40"
                    className="object-fill rounded-full "
                  />
                  <h3 className="font-bold text-base">
                    {lens?.LensCategory?.lensName}
                  </h3>
                </td>
                <td className="font-bold text-sm">
                  {lens.description.length > 15
                    ? `${lens.description.substring(0, 15)}...`
                    : lens.description}
                </td>
                <td
                  className={`${
                    lens.LensGroup && "flex items-center justify-center gap-2"
                  }`}
                >
                  <button
                    className="text-rose-500 hover:bg-rose-100 rounded-full p-1 transition-all ease-in-out duration-300"
                    onClick={() => handleDeleteLens(lens.lensId)}
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
                  {lens.LensGroup && (
                    <button
                      className="text-emerald-500 hover:bg-emerald-100 rounded-full p-1 transition-all ease-in-out duration-300"
                      onClick={() => handleShowPricing(lens)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.47 2.47a.75.75 0 0 1 1.06 0l9 9a.75.75 0 0 1-1.06 1.06L20 10.06v8.19a3.75 3.75 0 0 1-3.75 3.75h-8.5A3.75 3.75 0 0 1 4 18.25v-8.19l-.47.47a.75.75 0 0 1-1.06-1.06l9-9ZM6.5 9.06v9.19c0 1.24 1.01 2.25 2.25 2.25h8.5c1.24 0 2.25-1.01 2.25-2.25v-9.19l-6-6-6 6Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                هیچ لنزی پیدا نشد.
              </td>
            </tr>
          )}
        </Table.Body>
      </Table>
    </Suspense>
  );
}
